import Session from '../http.ts';
import { Product } from '../../product.ts';
import { Filters } from '../search.ts';

const tokenSession = new Session('www.joom.ru');
await tokenSession.get('/ru/search', { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });
tokenSession.close();

export default async function(query: string, filters: Filters, pages = 1) {
    const session = new Session('www.joom.ru');
    const products: Product[] = [];

    const sorting: { fieldName: string; order: 'asc' | 'desc'; }[] = [];
    switch (filters.sorting) {
        case 'rating':
            sorting.push({ fieldName: 'rating', order: 'desc' });
            break;
        case 'priceUp':
            sorting.push({ fieldName: 'origPrice', order: 'asc' });
            break;
        case 'priceDown':
            sorting.push({ fieldName: 'origPrice', order: 'desc' });
            break;
    }

    const filtersObj: { [key: string]: any; }[] = [];
    if (filters.minPrice || filters.maxPrice) {
        const price: {
            type: 'moneyRange';
            currency: 'RUB';
            min?: number;
            max?: number;
        } = { type: 'moneyRange', currency: 'RUB' };
        if (filters.minPrice) price.min = filters.minPrice;
        if (filters.maxPrice) price.max = filters.maxPrice;
        filtersObj.push({ id: 'origPrice', value: price });
    }

    let pageToken: string;
    for (let page = 0; page < pages; page++) {
        const { payload } = JSON.parse(await session.post('/api/1.1/search/content', { authorization: `Bearer ${tokenSession.cookies.accesstoken}` }, { query, pageToken, sorting, filters: filtersObj }));
        pageToken = payload.nextPageToken;
        for (const { content } of payload.items) {
            if (!content.product || content.product.advertisement?.idAd) continue;
            const rating = content.product.iconBadges?.badges?.find((badge: { id: string; }) => badge.id === 'rating');
            products.push({
                shop: 'joom',
                id: content.product.id,
                name: content.product.name,
                supplier: content.product.iconBadges?.badges?.find((badge: { id: string; }) => badge.id === 'brand')?.title?.text || null,
                price: content.product.patch?.data?.prices?.price?.amount || content.product.price.amount,
                oldPrice: content.product.patch?.data?.prices?.msrPrice?.amount || null,
                maxItems: null,
                rating: +rating?.title?.text || null,
                comments: +rating?.subtitle?.text?.replace(/[^0-9]/g, '') || null,
                delivery: null,
                images: content.product.mainImage.images.map((img: { url: string; }) => img.url)
            });
        }
    }
    return products;
}