import Session from '../http.ts';
import { Good } from '../search.ts';

const tokenSession = new Session('www.joom.ru');
await tokenSession.get('/ru/search', { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });
tokenSession.close();

export default async function(query: string, pages = 1) {
    const session = new Session('www.joom.ru');
    const results: Good[] = [];
    let pageToken: string;
    for (let page = 0; page < pages; page++) {
        const { payload } = JSON.parse(await session.post('/api/1.1/search/content', { authorization: `Bearer ${tokenSession.cookies.accesstoken}` }, { query, pageToken }));
        pageToken = payload.nextPageToken;
        for (const { content } of payload.items) {
            if (!content.product || content.product.advertisement?.idAd) continue;
            const rating = content.product.iconBadges?.badges?.find((badge: { id: string; }) => badge.id === 'rating');
            results.push({
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
    return results;
}