import { inputNumber, select } from './filters.tsx';
import styles from './goods.scss';
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
    ], loadGoods)}{inputNumber('minPrice', 'Мин. цена', loadGoods)}{inputNumber('maxPrice', 'Макс. цена', loadGoods)}{select('delivery', 'Доставка', [
        ['', 'В любое время'],
        ['0', 'Сегодня'],
        ['1', 'Завтра'],
        ['2', 'Послезавтра']
    ], loadGoods)}</div>
);

/** Элемент списка товаров */
const $goods: HTMLDivElement = <div class={styles.goods} />;

/**
 * Генерирует ссылку на товар
 * @param shop Название магазина
 * @param id ID товара
*/
function getLink(shop: string, id: number) {
    switch (shop) {
        case 'joom': return `https://www.joom.ru/ru/products/${id}`;
        case 'ozon': return `https://www.ozon.ru/product/${id}/`;
        case 'wildberries': return `https://www.wildberries.ru/catalog/${id}/detail.aspx`;
        default: return '';
    }
}

/** ID таймера. Таймер нужен, чтобы список товаров не обновлялся при вводе */
let timerId: ReturnType<typeof setTimeout>;

/** Функция обновления списка товаров */
export function loadGoods() {
    const query = getParam('query') || '';
    $clear($goods);
    clearTimeout(timerId);
    if (query === '') $remove($filters, $goods);
    else {
        timerId = setTimeout(async function() {
            const { results } = await postApi('search', getParams());
            if (query !== getParam('query')) return;
            for (const result of results) {
                $append($goods, <a class={styles.good} href={getLink(result.shop, result.id)} target="_blank"><div class={styles.imgContainer}><img class={styles.img} src={result.images.length ? result.images[0] : ''} /></div><div class={styles.info}><h3 class={styles.name}>{result.name}</h3><div class={styles.price}>{result.price}₽</div></div></a>);
            }
            $append(document.body, $filters, $goods);
        }, 500);
    }
}
addEventListener('popstate', loadGoods);
loadGoods();