import { createConnection } from 'mariadb';

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

export async function appendToTable(shop: string, item: TableItem) {
    await db.query(
        'REPLACE INTO goods (shop, id, name, price, oldPrice, maxItems, rating, comments, delivery) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [shop, item.id, item.name, item.price, item.oldPrice, item.maxItems, item.rating, item.comments, item.delivery]
    );
    await Promise.all(item.images.map(
        async image => db.query(
            'REPLACE INTO goodsImages (shop, id, image) VALUES (?, ?, ?)',
            [shop, item.id, image]
        )
    ));
}
export async function appendAllToTable(shop: string, items: TableItem[]) {
    await Promise.all(items.map(item => appendToTable(shop, item)));
}