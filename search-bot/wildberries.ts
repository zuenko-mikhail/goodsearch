import { appendToTable } from './db.ts';
import Session from './http.ts';

function getImgPath(id: number) {
    const b = ~~(id / 1e5);
    const ranges = [143, 287, 431, 719, 1007, 1061, 1115, 1169, 1313, 1601, 1655, 1919, 2045, 2189, 2405, 2621, 2837, 3053, 3269, 3485];
    const a = (ranges.findIndex(limit => b <= limit) + 1).toString().padStart(2, '0') || '21';
    return `https://basket-${a}.wbbasket.ru/vol${b}/part${~~(id / 1e3)}/${id}/images/c516x688`;
}

export default async function scanWildberries() {
    const session = new Session('recom.wb.ru');
    for (let page = 1; ; page++) {
        const { data } = JSON.parse(await session.get(`/personal/ru/common/v5/search?ab_testing=false&appType=1&curr=rub&dest=-366541&page=${page}&query=0&resultset=catalog&spp=30&suppressSpellcheck=false`));
        if (!data?.products?.length) break;
        await Promise.all(data.products.map(function(good: { id: number; name: string; sizes: { price: { total: number; basic: number; }; }[]; totalQuantity: number; reviewRating: number; pics: number; }) {
            const imgPath = getImgPath(good.id);
            return appendToTable('wildberries', {
                id: good.id,
                name: good.name,
                price: good.sizes[0].price.total / 100,
                oldPrice: good.sizes[0].price.basic / 100,
                maxItems: good.totalQuantity,
                rating: good.reviewRating,
                comments: null,
                delivery: null,
                images: Array(good.pics).fill(null).map((_, i) => `${imgPath}/${i + 1}.webp`)
            });
        }
        ));
    }
    session.close();
}