import { Product } from '../product.ts';
import { inputNumber, select } from './filters.tsx';
import { postApi } from './lib/api.ts';
import { $append, $clear, $insertBefore, $remove } from './lib/dom.ts';
import styles from './list-products.scss';
import { $loading } from './loading.tsx';
import { renderProducts } from './product.tsx';
import { getParam, getParams, onChangeParams } from './url-params.ts';

/** Элемент фильтров */
const $filters = (
    <div class={styles.filters}><h2 class={styles.title}>Фильтры</h2>{select('sorting', 'Сортировка', [
        ['', 'По рейтингу'],
        ['comments', 'По отзывам'],
        ['discount', 'По скидке'],
        ['priceUp', 'По цене ↑'],
        ['priceDown', 'По цене ↓']
    ])}{inputNumber('minPrice', 'Мин. цена')}{inputNumber('maxPrice', 'Макс. цена')}{select('delivery', 'Доставка', [
        ['', 'В любое время'],
        ['1', 'Сегодня'],
        ['2', 'Завтра'],
        ['3', 'Послезавтра']
    ])}</div>
);

/** Элемент списка товаров */
const $products: HTMLDivElement = <div class={styles.products} />;

onChangeParams(async function() {
    $clear($products);
    const params1 = getParams();
    if (params1.query) {
        $append(document.body, $products);
        $append($products, $loading);

        const { products }: { products: Product[]; } = await postApi('search', params1);
        $remove($loading);

        const params2 = getParams();
        if ([
            'query',
            'sorting',
            'minPrice',
            'maxPrice',
            'delivery'
        ].some(name => params1[name] && params2[name] && params1[name] !== params2[name])) return;

        $append($products, renderProducts(products));
        $insertBefore($products, $filters);
    }
    else $remove($filters, $products);
});