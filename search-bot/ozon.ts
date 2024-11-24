import Session from './request.ts';
import { TableItem } from './table-item.ts';

const session = new Session('www.ozon.ru');

async function getApi(path: string, layout: string) {
    const data = JSON.parse(await session.get('/api/entrypoint-api.bx/page/json/v2?url=' + encodeURIComponent(path)));
    try {
        return JSON.parse(Object.entries(data.widgetStates).find(([key]) => key.startsWith(layout))[1] as string);
    }
    catch (e) {
        return null;
    }
}

function parseDate(input: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    function adjustYear(date: Date) {
        return +(date < today ? date.setFullYear(date.getFullYear() + 1) : date);
    }
    switch (input.toLowerCase()) {
        case 'сегодня':
            return +today;
        case 'завтра':
            return adjustYear(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
        case 'послезавтра':
            return adjustYear(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2));
        default:
            const parts = input.toLowerCase().match(/(\d{1,2}) ([а-я]+)/i);
            if (parts) {
                const month = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'].indexOf(parts[2]);
                if (month !== -1) {
                    return adjustYear(new Date(today.getFullYear(), month, parseInt(parts[1], 10)));
                }
            }
            return null;
    }
}

export async function getCategories() {
    const { categories } = await getApi('/', 'catalogMenu');
    return Object.fromEntries(categories.map((c: { url: string; title: string; }) => [c.url.slice(10, -1), c.title]));
}
export async function getCategoryPage(category: string, page: number) {
    const data = await getApi(`/category/${category}/?layout_container=${page > 1 ? 'categorySearchMegapagination' : ''}&layout_page_index=${page}&page=${page}&sorting=new`, 'searchResultsV2');
    if (!data || !data.items || data.items.some(i => !i?.multiButton?.ozonButton?.addToCartButtonWithQuantity?.action?.id)) return [];
    console.log(data.items);
    return data.items.map(function({ mainState, multiButton, tileImage }) {
        const item: TableItem = {
            id: +multiButton.ozonButton.addToCartButtonWithQuantity.action.id,
            name: null,
            price: null,
            oldPrice: null,
            maxItems: multiButton.ozonButton.addToCartButtonWithQuantity.maxItems,
            rating: null,
            comments: 0,
            delivery: parseDate(multiButton.ozonButton.addToCartButtonWithQuantity.text),
            images: tileImage.items.filter(i => i.type === 'image').map(i => i.image.link)
        };
        if (item.delivery !== null) item.delivery /= 1000 * 3600;
        for (const { atom } of mainState) {
            switch (atom.type) {
                case 'textAtom':
                    item.name = atom.textAtom.text;
                    break;
                case 'priceV2':
                    for (const price of atom.priceV2.price) {
                        if (price.textStyle === 'PRICE') item.price = +price.text.replace(/ |₽/g, '') || null;
                        if (price.textStyle === 'ORIGINAL_PRICE') item.oldPrice = +price.text.replace(/ |₽/g, '') || null; // fix (null)
                    }
                    break;
                case 'labelList':
                    for (const { title, testInfo } of atom.labelList.items) {
                        switch (testInfo.automatizationId) {
                            case 'tile-list-rating':
                                item.rating = +title;
                                break;
                            case 'tile-list-comments':
                                item.comments = parseInt(title.replace(/ /g, ''));
                                break;
                        }
                    }
                    break;
            }
        }
        return item;
    });
}