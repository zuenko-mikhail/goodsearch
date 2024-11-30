import { Product } from '../product.ts';
import { inputNumber, select } from './filters.tsx';
import { postApi } from './lib/api.ts';
import { $append, $clear, $remove } from './lib/dom.ts';
import styles from './list-products.scss';
import { renderProducts } from './product.tsx';
import { getParam, getParams, onChangeParams } from './url-params.ts';

/** Элемент фильтров */
const $filters = (
    <div class={styles.filters}><h2 class={styles.title}>Фильтры</h2>{select('sorting', 'Сортировка', [
        ['', 'По рейтингу'],
        ['comments', 'По отзывам'],
        ['priceUp', 'По цене ↑'],
        ['priceDown', 'По цене ↓']
    ])}{inputNumber('minPrice', 'Мин. цена')}{inputNumber('maxPrice', 'Макс. цена')}{select('delivery', 'Доставка', [
        ['', 'В любое время'],
        ['0', 'Сегодня'],
        ['1', 'Завтра'],
        ['2', 'Послезавтра']
    ])}</div>
);

/** Элемент списка товаров */
const $products: HTMLDivElement = <div class={styles.products} />;

onChangeParams(async function() {
    $clear($products);
    const query = getParam('query') || '';
    if (query) {
        const { products }: { products: Product[]; } = await postApi('search', getParams());
        if (query !== (getParam('query') || '')) return;
        $append($products, renderProducts(products));
        $append(document.body, $filters, $products);
    }
    else $remove($filters, $products);
});