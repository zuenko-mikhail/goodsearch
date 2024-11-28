import { createConnection } from 'mariadb';
import process from 'process';

export interface TableItem {
    id: number;
    name: string;
    price: number;
    oldPrice: number;
    maxItems: number;
    rating: number;
    comments: number;
    delivery: number;
    images: string[];
}

const db = await createConnection({
    host: 'zuenko.my.to',
    port: 3306,
    user: 'marketplace',
    password: 'PasssWorrrd-404',
    database: 'marketplace'
});

const addGood = await db.prepare('REPLACE INTO goods (shop, id, name, price, oldPrice, maxItems, rating, comments, delivery) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
const addImage = await db.prepare('REPLACE INTO goodsImages (shop, id, image) VALUES (?, ?, ?)');

export async function appendToTable(shop: string, item: TableItem) {
    await db.beginTransaction();
    await addGood.execute([shop, item.id, item.name, item.price, item.oldPrice, item.maxItems, item.rating, item.comments, item.delivery]);
    await Promise.all(item.images.map(image => addImage.execute([shop, item.id, image])));
    await db.commit();
}
export async function getLastId(shop: string) {
    const [{ id }] = await db.query('SELECT MAX(id) AS id FROM goods WHERE shop = ?', [shop]);
    return id;
}

process.on('exit', function() {
    addGood.close();
    addImage.close();
    db.end();
});