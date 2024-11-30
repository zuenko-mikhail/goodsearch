import Session from './http.ts';

export interface Product {
    shop: string;
    id: number;
    name: string;
    supplier: string;
    price: number;
    oldPrice: number;
    maxItems: number;
    rating: number;
    comments: number;
    delivery: number;
    images: string[];
}

/**
 * Функция для упрощения запросов к магазинам для поиска товаров
 * @param host домен магазина
 * @param getPath функция для получения пути API
 * @param parse функция для парсинга ответа
 */
export function search(
    host: string,
    getPath: (query: string, page: number) => string,
    parse: (response: any) => Product[]
) {
    return async function(query: string, pages = 1) {
        const session = new Session(host);
        const results = await Promise.all(Array.from({ length: pages }, async (_, i) => await parse(JSON.parse(await session.get(getPath(encodeURIComponent(query), i + 1))))));
        session.close();
        return results.flat().filter(Boolean);
    };
}