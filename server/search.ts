import Session from './http.ts';

export interface Good {
    link: string;
    name: string;
    price: number;
    oldPrice: number;
    maxItems: number;
    rating: number;
    comments: number;
    delivery: number;
    images: string[];
}

export function search(
    host: string,
    getPath: (query: string, page: number) => string,
    parse: (response: any) => Good[]
) {
    return async function(query: string, pages = 1) {
        const session = new Session(host);
        const results = await Promise.all(Array.from({ length: pages }, async (_, i) => await parse(JSON.parse(await session.get(getPath(encodeURIComponent(query), i + 1))))));
        session.close();
        return results.flat().filter(Boolean);
    };
}