import { Product } from '../../product.ts';
import { search } from '../search.ts';

/** Парсит дату */
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

/** Список названий сортировок API */
const sorting = {
    rating: 'rating',
    comments: 'score',
    priceDown: 'price',
    priceUp: 'price_desc',
    discount: 'discount'
};

export default search(
    'www.ozon.ru',
    function(query, filters, page) {
        const price = filters.minPrice || filters.maxPrice ? `&currency_price=${encodeURIComponent(`${(filters.minPrice || 0).toFixed(3)};${(filters.maxPrice || Number.MAX_SAFE_INTEGER).toFixed(3)}`)}` : '';
        const delivery = filters.delivery ? `&delivery=${filters.delivery}` : '';
        return '/api/entrypoint-api.bx/page/json/v2?url=' + encodeURIComponent(`/search/?deny_category_prediction=true${price}${delivery}&from_global=true&layout_container=categorySearchMegapagination&layout_page_index=${page}&page=${page}&sorting=${sorting[filters.sorting]}&text=${query}`);
    },
    function(response): Product[] {
        if (!response.widgetStates) return [];
        const products = JSON.parse(Object.entries(response.widgetStates as { [key: string]: string; }).find(([key]) => key.startsWith('searchResultsV2'))?.[1])?.items || [];
        return products.map(function({ mainState, multiButton, tileImage }) {
            if (!multiButton?.ozonButton?.addToCartButtonWithQuantity?.action?.id) return null;
            const product: Product = {
                shop: 'ozon',
                id: multiButton.ozonButton.addToCartButtonWithQuantity.action.id,
                name: null,
                supplier: null,
                price: null,
                oldPrice: null,
                maxItems: multiButton.ozonButton.addToCartButtonWithQuantity.maxItems,
                rating: null,
                comments: 0,
                delivery: parseDate(multiButton.ozonButton.addToCartButtonWithQuantity.text),
                images: tileImage.items.filter(i => i.type === 'image').map(i => i.image.link)
            };
            if (product.delivery !== null) product.delivery /= 1000 * 3600;
            for (const { atom } of mainState) {
                switch (atom.type) {
                    case 'textAtom':
                        product.name = atom.textAtom.text.replace(/&#x([0-9A-F]{2});/g, (_: string, n: string) => String.fromCharCode(parseInt(n, 16))).replace(/&#([0-9A-F]{2});/g, (_: string, n: string) => String.fromCharCode(+n));
                        break;
                    case 'priceV2':
                        for (const price of atom.priceV2.price) {
                            if (price.textStyle === 'PRICE') product.price = +price.text.replace(/ |₽/g, '') || null;
                            if (price.textStyle === 'ORIGINAL_PRICE') product.oldPrice = +price.text.replace(/ |₽/g, '') || null; // fix (null)
                        }
                        break;
                    case 'labelList':
                        for (const { title, testInfo } of atom.labelList.items) {
                            switch (testInfo.automatizationId) {
                                case 'tile-list-rating':
                                    product.rating = +title;
                                    break;
                                case 'tile-list-comments':
                                    product.comments = parseInt(title.replace(/ /g, ''));
                                    break;
                            }
                        }
                        break;
                }
            }
            return product;
        });
    }
);