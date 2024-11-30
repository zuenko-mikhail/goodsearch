import { Product, } from '../../product.ts';
import { search } from '../search.ts';

/** Возвращает ссылку на картинку товара */
function getImgPath(id: number) {
    const b = ~~(id / 1e5);
    const ranges = [143, 287, 431, 719, 1007, 1061, 1115, 1169, 1313, 1601, 1655, 1919, 2045, 2189, 2405, 2621, 2837, 3053, 3269, 3485];
    const a = (ranges.findIndex(limit => b <= limit) + 1).toString().padStart(2, '0') || '21';
    return `https://basket-${a}.wbbasket.ru/vol${b}/part${~~(id / 1e3)}/${id}/images/c516x688`;
}

/** Список названий сортировок API */
const sorting = {
    rating: 'rate',
    comments: 'popular',
    priceDown: 'priceup',
    priceUp: 'pricedown',
    discount: 'benefit'
};

export default search(
    'search.wb.ru',
    function(query, filters, page) {
        const price = filters.minPrice || filters.maxPrice ? `&priceU=${filters.minPrice * 100 || 0};${filters.maxPrice * 100 || Number.MAX_SAFE_INTEGER}` : '';
        const delivery = filters.delivery ? `&fdlvr=${filters.delivery * 24}` : '';
        return `/exactmatch/ru/common/v7/search?ab_testing=false&appType=1&curr=rub&dest=-366541&page=${page}${delivery}${price}&query=${query}&resultset=catalog&sort=${sorting[filters.sorting]}&spp=30&suppressSpellcheck=false`;
    },
    function({ data }): Product[] {
        if (!data?.products?.length) return [];
        return data.products.map((product: { id: number; name: string; supplier: string; sizes: { price: { total: number; basic: number; }; }[]; totalQuantity: number; reviewRating: number; pics: number; }) => ({
            shop: 'wildberries',
            id: product.id,
            name: product.name,
            supplier: product.supplier,
            price: product.sizes[0].price.total / 100,
            oldPrice: product.sizes[0].price.basic / 100,
            maxItems: product.totalQuantity,
            rating: product.reviewRating,
            comments: null,
            delivery: null,
            images: Array(product.pics).fill(null).map((_, img) => `${getImgPath(product.id)}/${img + 1}.webp`)
        }));
    }
);