import { Connection } from 'mariadb';

export async function get(db: Connection) {
    const [{ num }] = await db.query('SELECT COUNT(*) AS num FROM goods');
    return [200, { num: Number(num) }];
}