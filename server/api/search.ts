import * as searchShops from '../shops/index.ts';

export async function post({ body }: { search: { [key: string]: string; }, body: { [key: string]: string; }; }) {
    if (!('query' in body) || body.query === '') return [200, []];
    const results = await Promise.all(Object.values(searchShops as { [key: string]: Function; }).map(searchShop => searchShop(body.query)));
    return [200, {
        results: results.flat().sort((a, b) => b.rating - a.rating)
    }];
}