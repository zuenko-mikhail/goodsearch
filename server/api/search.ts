import { Connection } from 'mariadb';

export async function post(db: Connection, { body }: { search: { [key: string]: string; }, body: { [key: string]: string; }; }) {
    if (!('query' in body) || body.query === '') return [200, []];
    const words = body.query.match(/[А-яЁёA-z0-9%]+/g)?.map(i => `+${i.replace(/%/g, '\\%')}`);
    if (!words || !words.length) return [200, []];
    const results = await db.query('SELECT * FROM goods WHERE MATCH (name) AGAINST (? IN BOOLEAN MODE) ORDER BY rating DESC, delivery, comments DESC LIMIT 20', words.join(''));
    await Promise.all(results.map(async function(item) {
        const images = await db.query('SELECT image FROM goodsImages WHERE shop = ? AND id = ?', [item.shop, item.id]);
        item.images = images.map((i: { image: string; }) => i.image);
    }));
    return [200, { results }];
}