import { inputNumber, select } from './filters.tsx';
import { renderProducts } from './product.tsx';
import styles from './list-products.scss';
import { postApi } from './lib/api.ts';
import { $append, $clear, $remove } from './lib/dom.ts';
import { getParam, getParams } from './urlParams.ts';

/** Элемент фильтров */
const $filters = (
    <div class={styles.filters}><h2 class={styles.title}>Фильтры</h2>{select('sorting', 'Сортировка', [
        ['', 'По рейтингу'],
        ['comments', 'По отзывам'],
        ['priceUp', 'По цене ↑'],
        ['priceDown', 'По цене ↓']
    ], loadProducts)}{inputNumber('minPrice', 'Мин. цена', loadProducts)}{inputNumber('maxPrice', 'Макс. цена', loadProducts)}{select('delivery', 'Доставка', [
        ['', 'В любое время'],
        ['0', 'Сегодня'],
        ['1', 'Завтра'],
        ['2', 'Послезавтра']
    ], loadProducts)}</div>
);

const $loading: HTMLDivElement = <div class={styles.loading}></div>;

/** Элемент списка товаров */
const $products: HTMLDivElement = <div class={styles.products} />;


/** ID таймера. Таймер нужен, чтобы список товаров не обновлялся при вводе */
let timerId: ReturnType<typeof setTimeout>;

/** Функция обновления списка товаров */
export function loadProducts() {
    const query = getParam('query') || '';
    var loading = false;
    $clear($products);
    clearTimeout(timerId);
    if (query === '') $remove($filters, $products);
    else {
        timerId = setTimeout(async function() {
            $append(document.body,$loading);
            const { results } = await postApi('search', getParams());
            $remove($loading);
            if (query !== getParam('query')) return;
            $append($products, renderProducts(results));
            $append(document.body, $filters, $products);
        }, 500);
    }
}
addEventListener('popstate', loadProducts);
loadProducts();