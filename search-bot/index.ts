import { createConnection } from 'mariadb';
import { getCategories, getCategoryPage } from './ozon.ts';
import { TableItem } from './table-item.ts';

const db = await createConnection({
    host: 'localhost',
    user: 'marketplace',
    password: 'PasssWorrrd-404',
    database: 'marketplace'
});

function appendToTable(items: TableItem[]) {
    return Promise.all(items.map(
        async item => db.query(
            'REPLACE INTO goods (shop, id, name, price, oldPrice, maxItems, rating, comments, delivery) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            ['ozon', item.id, item.name, item.price, item.oldPrice, item.maxItems, item.rating, item.comments, item.delivery]
        ).then(() => Promise.all(item.images.map(
            async image => db.query(
                'REPLACE INTO goodsImages (shop, id, image) VALUES (?, ?, ?)',
                ['ozon', item.id, image]
            )
        )))
    ));
}

let added = 0;
const ozonCategories = Object.fromEntries(Object.entries(await getCategories()).map(([key]) => [key, 0]));
while (true) {
    let stopped = true;
    for (const category in ozonCategories) {
        if (ozonCategories[category] === null) continue;
        stopped = false;
        const items = await getCategoryPage(category, ozonCategories[category]++);
        if (items.length === 0) ozonCategories[category] = null;
        appendToTable(items);
        console.log('Added', added += items.length);
    }
    if (stopped) break;
}
console.log('Done');