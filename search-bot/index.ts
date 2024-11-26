import { createConnection } from 'mariadb';
import ozonGoods from './ozon.ts';
import { TableItem } from './table-item.ts';

const db = await createConnection({
    host: 'zuenko.my.to',
    port: 3306,
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
const ozon = ozonGoods();
for await (const items of ozon) {
    appendToTable(items);
    console.log('Added', added += items.length);
}
console.log('Done');