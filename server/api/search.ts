import { Product } from '../../product.ts';
import * as searchShops from '../shops/index.ts';

/** Свойства для сортировки */
const sortingProps = {
    comments: 'comments',
    priceDown: 'price',
    priceUp: 'price'
};

export async function post({ body }: { search: { [key: string]: string; }, body: { [key: string]: string; }; }) {
    if (!('query' in body) || body.query === '' || 'minPrice' in body && isNaN(+body.minPrice) || 'maxPrice' in body && isNaN(+body.maxPrice)) return [200, []];
    const products: Product[][] = await Promise.all(Object.values(searchShops as { [key: string]: Function; }).map(searchShop => searchShop(body.query).catch(() => [])));
    const sorting = ['comments', 'priceDown', 'priceUp'].includes(body.sorting) ? sortingProps[body.sorting] : 'rating';
    const sortingOrder = body.sorting === 'priceDown' ? 1 : -1;
    return [200, {
        products: products.flat().filter(function(product) {
            if ('minPrice' in body && product.price < +body.minPrice) return false;
            if ('maxPrice' in body && product.price > +body.maxPrice) return false;
            return true;
        }).sort((product1, product2) => (product1[sorting] - product2[sorting]) * sortingOrder)
    }];
}