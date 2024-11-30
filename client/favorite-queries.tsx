import { Product } from '../product.js';
import styles from './favorite-queries.scss';
import { postApi } from './lib/api.ts';
import { $append, $clear, $remove } from './lib/dom.ts';
import { renderProducts } from './product.tsx';
import { getParam, getParams, onChangeParams, setParams } from './url-params.ts';

/** Элемент заголовка списка избранных запросов */
const $header = <h2 class={styles.title}>Избранные запросы:</h2>;

/** Элемент списка избранных запросов */
const $favQueries: HTMLDivElement = <div class={styles.queries} />;

interface FavoriteQuery {
    query: string;
    sorting?: string;
    minPrice?: number;
    maxPrice?: number;
    delivery?: number;
}
const favParams = ['query', 'sorting', 'minPrice', 'maxPrice', 'delivery'];

/** Получает список избранных запросов из localStorage */
function getFavoriteQueries(): FavoriteQuery[] {
    return JSON.parse(localStorage.getItem('favorite-queries') || '[]');
}

/** Проверяет наличие текущего запроса в избранном */
export function hasFavoriteQuery() {
    const params = getParams();
    const queries = getFavoriteQueries();
    return queries.some(query => favParams.every(name => !params[name] && !query[name] || params[name] === query[name]));
}

/** Добавляет текущий запрос в избранное */
export function addFavoriteQuery() {
    if (hasFavoriteQuery()) return;

    const params = getParams();
    const query: FavoriteQuery = { query: params.query };
    if (params.sorting) query.sorting = params.sorting;
    if (params.minPrice) query.minPrice = +params.minPrice;
    if (params.maxPrice) query.maxPrice = +params.maxPrice;
    if (params.delivery) query.delivery = +params.delivery;

    const queries = getFavoriteQueries();
    queries.push(query);
    localStorage.setItem('favorite-queries', JSON.stringify(queries));
}

/** Удаляет текущий запрос из избранного */
export function removeFavoriteQuery() {
    const queries = getFavoriteQueries();
    const index = queries.findIndex(query => favParams.every(name => !getParams()[name] && !query[name] || getParams()[name] === query[name]));
    queries.splice(index, 1);
    localStorage.setItem('favorite-queries', JSON.stringify(queries));
}

/** Обрабатывает горизонтальную прокрутку списка избранных запросов */
function onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    (event.currentTarget as HTMLElement).scrollLeft += event.deltaY;
}

onChangeParams(async function() {
    $clear($favQueries);
    const query = getParam('query');
    if (query) $remove($favQueries);
    else {
        const queries = getFavoriteQueries();
        if (!queries.length) return;

        $append(document.body, $favQueries);
        $append($favQueries, $header);
        for (const favQuery of queries) {
            const { products }: { products: Product[]; } = await postApi('search', favQuery);
            const $favQuery = <div class={styles.query}><h3 class={styles.header} onClick={
                () => setParams(Object.fromEntries(Object.entries(favQuery).map(([key, value]) => [key, String(value)])))
            }>{favQuery.query}<button class={styles.delete} onClick={function(event) {
                event.stopPropagation();
                queries.splice(queries.indexOf(favQuery), 1);
                localStorage.setItem('favorite-queries', JSON.stringify(queries));
                $remove($favQuery);
                if (queries.length === 0) $remove($favQueries);
            }}>X</button></h3><div class={styles.products} onMouseWheel={onMouseWheel}>{renderProducts(products)}</div></div>;
            $append($favQueries, $favQuery);
        }
    }
});