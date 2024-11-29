import { Good } from '../search.ts';
import * as searchShops from '../shops/index.ts';

export async function post({ body }: { search: { [key: string]: string; }, body: { [key: string]: string; }; }) {
    if (!('query' in body) || body.query === '' || 'minPrice' in body && isNaN(+body.minPrice) || 'maxPrice' in body && isNaN(+body.maxPrice)) return [200, []];
    const results: Good[][] = await Promise.all(Object.values(searchShops as { [key: string]: Function; }).map(searchShop => searchShop(body.query)));
    return [200, {
        results: results.flat().filter(function(good) {
            if ('minPrice' in body && good.price < +body.minPrice) return false;
            if ('maxPrice' in body && good.price > +body.maxPrice) return false;
            return true;
        }).sort((a, b) => b.rating - a.rating)
    }];
}