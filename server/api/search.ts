import { Product } from '../../product.ts';
import { Filters } from '../search.ts';
import * as searchShops from '../shops/index.ts';

/** Рассчитывает скидку */
function getDiscount(price: number, oldPrice: number) {
    return Math.round((oldPrice - price) / oldPrice * 100);
}

/** Сравнивает две строки с помощью алгоритма Левенштейна */
function compareTwoStrings(first: string, second: string) {
    if (first === second) return 1;
    if (first.length < 2 || second.length < 2) return 0;
    const firstBigrams = new Map();
    let intersectionSize = 0;
    for (let i = 0; i < first.length - 1; i++) {
        const bigram = first.substring(i, i + 2);
        firstBigrams.set(bigram, (firstBigrams.get(bigram) || 0) + 1);
    }
    for (let i = 0; i < second.length - 1; i++) {
        const bigram = second.substring(i, i + 2);
        if (firstBigrams.has(bigram) && firstBigrams.get(bigram) > 0) {
            firstBigrams.set(bigram, firstBigrams.get(bigram) - 1);
            intersectionSize++;
        }
    }
    return (2 * intersectionSize) / (first.length + second.length - 2);
}

/** Функции сортировки */
const sortingFuncs = {
    rating: (p1: Product, p2: Product) => p2.rating - p1.rating,
    comments: (p1: Product, p2: Product) => p2.comments - p1.comments,
    discount: (p1: Product, p2: Product) => getDiscount(p2.price, p2.oldPrice) - getDiscount(p1.price, p1.oldPrice),
    priceDown: (p1: Product, p2: Product) => p2.price - p1.price,
    priceUp: (p1: Product, p2: Product) => p1.price - p2.price
};

export async function post({ body }: { search: { [key: string]: string; }, body: { [key: string]: string; }; }) {
    if (!('query' in body) || body.query === '' || 'minPrice' in body && isNaN(+body.minPrice) || 'maxPrice' in body && isNaN(+body.maxPrice)) return [200, []];

    const sorting = body.sorting in sortingFuncs ? body.sorting : 'rating';
    const filters: Filters = { sorting };
    if ('minPrice' in body) filters.minPrice = +body.minPrice;
    if ('maxPrice' in body) filters.maxPrice = +body.maxPrice;
    if ('delivery' in body) filters.delivery = +body.delivery;

    const products: Product[][] = await Promise.all(Object.values(searchShops as { [key: string]: Function; }).map(searchShop => searchShop(body.query, filters, 3).catch(() => [])));
    return [200, {
        products: products.flat().filter(function(product) {
            const queryWords = body.query.match(/[a-zA-Zа-яА-ЯёЁ0-9%]+/g) || [];
            const productWords = (product.name || '').match(/[a-zA-Zа-яА-ЯёЁ0-9%]+/g) || [];
            if (productWords.every(pw => queryWords.every(qw => compareTwoStrings(pw, qw) < 0.5))) return false;

            if ('minPrice' in body && product.price < +body.minPrice) return false;
            if ('maxPrice' in body && product.price > +body.maxPrice) return false;
            if ('delivery' in body && (!product.delivery || product.delivery > Date.now() + +body.delivery * 24 * 60 * 60 * 1000)) return false;

            return true;
        }).sort(sortingFuncs[sorting])
    }];
}