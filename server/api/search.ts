import { Product } from '../../product.ts';
import { Filters } from '../search.ts';
import * as searchShops from '../shops/index.ts';

/** Рассчитывает скидку */
function getDiscount(price: number, oldPrice: number) {
    return Math.round((oldPrice - price) / oldPrice * 100);
}

/** Функции сортировки */
const sortingFuncs = {
    rating: (p1: Product, p2: Product) => p2.rating - p1.rating,
    comments: (p1: Product, p2: Product) => p2.comments - p1.comments,
    discount: (p1: Product, p2: Product) => getDiscount(p2.price, p2.oldPrice) - getDiscount(p1.price, p1.oldPrice),
    priceDown: (p1: Product, p2: Product) => p1.price - p2.price,
    priceUp: (p1: Product, p2: Product) => p2.price - p1.price
};

export async function post({ body }: { search: { [key: string]: string; }, body: { [key: string]: string; }; }) {
    if (!('query' in body) || body.query === '' || 'minPrice' in body && isNaN(+body.minPrice) || 'maxPrice' in body && isNaN(+body.maxPrice)) return [200, []];

    const sorting = body.sorting in sortingFuncs ? body.sorting : 'rating';
    const filters: Filters = { sorting };
    if ('minPrice' in body) filters.minPrice = +body.minPrice;
    if ('maxPrice' in body) filters.maxPrice = +body.maxPrice;
    if ('delivery' in body) filters.delivery = +body.delivery;

    const products: Product[][] = await Promise.all(Object.values(searchShops as { [key: string]: Function; }).map(searchShop => searchShop(body.query, filters).catch((e) => (console.log(e), []))));
    return [200, {
        products: products.flat().filter(function(product) {
            if ('minPrice' in body && product.price < +body.minPrice) return false;
            if ('maxPrice' in body && product.price > +body.maxPrice) return false;
            return true;
        }).sort(sortingFuncs[sorting])
    }];
}