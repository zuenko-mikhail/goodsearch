import { appendToTable, getLastId } from './db.ts';
import Session from './http.ts';

function getGoodPath(id: number) {
    const b = ~~(id / 1e5);
    const ranges = [143, 287, 431, 719, 1007, 1061, 1115, 1169, 1313, 1601, 1655, 1919, 2045, 2189, 2405, 2621, 2837, 3053, 3269, 3485];
    const a = (ranges.findIndex(limit => b <= limit) + 1).toString().padStart(2, '0') || '21';
    return `https://basket-${a}.wbbasket.ru/vol${b}/part${~~(id / 1e3)}/${id}`;
}

export default async function scanWildberries(threads: number, lastId?: number) {
    if (lastId === undefined) lastId = await getLastId('wildberries');
    const session = new Session('card.wb.ru');
    let empty = 0, stopped = false;

    function getIds(): [string, number] {
        let ids = '', i = 0;
        while (ids.length + String(lastId + i).length + 1 <= 5000) {
            if (i > 0) ids += ';';
            ids += lastId + i;
            i++;
        }
        lastId += i;
        return [ids, i];
    }

    await Promise.all(Array.from({ length: threads }, async function() {
        while (true) {
            const [ids, lastLen] = getIds();
            const { data } = JSON.parse(await session.get('/cards/v2/detail?appType=1&curr=rub&dest=-366541&spp=30&ab_testing=false&nm=' + ids));
            if (!data.products.length) {
                empty += lastLen;
                continue;
            }


            let firstAdded: number, added = 0;
            await Promise.all(data.products.map(async function(good: { id: number; name: string; sizes: { price: { total: number; basic: number; }; }[]; totalQuantity: number; reviewRating: number; pics: number; }) {
                if (!good.sizes.length || !good.sizes[0].price) {
                    empty++;
                    return;
                }
                await appendToTable('wildberries', {
                    id: good.id,
                    name: good.name,
                    price: good.sizes[0].price.total / 100,
                    oldPrice: good.sizes[0].price.basic / 100,
                    maxItems: good.totalQuantity,
                    rating: good.reviewRating,
                    comments: null,
                    delivery: null,
                    images: Array(good.pics).fill(null).map((_, i) => `${getGoodPath(good.id)}/images/c516x688/${i + 1}.webp`)
                });
                empty = 0;
                if (added === 0) firstAdded = good.id;
                added++;
            }));
            if (added) console.log(firstAdded, added);

            if (empty >= 100000 || stopped) {
                stopped = true;
                break;
            }
        }
    }));
    session.close();
}