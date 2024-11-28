import { Good, search } from '../search.ts';

function getImgPath(id: number) {
    const b = ~~(id / 1e5);
    const ranges = [143, 287, 431, 719, 1007, 1061, 1115, 1169, 1313, 1601, 1655, 1919, 2045, 2189, 2405, 2621, 2837, 3053, 3269, 3485];
    const a = (ranges.findIndex(limit => b <= limit) + 1).toString().padStart(2, '0') || '21';
    return `https://basket-${a}.wbbasket.ru/vol${b}/part${~~(id / 1e3)}/${id}/images/c516x688`;
}

export default search(
    'search.wb.ru',
    (query, page) => `/exactmatch/ru/common/v7/search?ab_testing=false&appType=1&curr=rub&dest=-366541&page=${page}&query=${query}&resultset=catalog&sort=popular&spp=30&suppressSpellcheck=false`,
    function({ data }): Good[] {
        if (!data?.products?.length) return [];
        return data.products.map((good: { id: number; name: string; sizes: { price: { total: number; basic: number; }; }[]; totalQuantity: number; reviewRating: number; pics: number; }) => ({
            link: `https://www.wildberries.ru/catalog/${good.id}/detail.aspx`,
            name: good.name,
            price: good.sizes[0].price.total / 100,
            oldPrice: good.sizes[0].price.basic / 100,
            maxItems: good.totalQuantity,
            rating: good.reviewRating,
            comments: null,
            delivery: null,
            images: Array(good.pics).fill(null).map((_, img) => `${getImgPath(good.id)}/${img + 1}.webp`)
        }));
    }
);