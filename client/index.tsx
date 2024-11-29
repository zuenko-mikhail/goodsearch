import filters from './filters.tsx';
import Good from './good.tsx';
import styles from './index.scss';
import { postApi } from './lib/api.ts';
import { $addClasses, $append, $clear, $remove, $removeClasses } from './lib/dom.ts';
import { deleteParam, getParam, setParam } from './urlParams.ts';

const $search: HTMLInputElement = <input class={styles.search} type="search" placeholder="Что вы хотите найти?" autofocus spellcheck={false} onInput={function() {
    if ($search.value === '') deleteParam('query');
    else setParam('query', $search.value);
    historyUpdated();
}} />;
const $main: HTMLDivElement = <div class={styles.main}><h1 class={styles.logo}>Goodsearch</h1>{$search}<div class={styles.info}><p class={styles.description}>Goodsearch - это сервис по поиску и сравнению товаров по интернет-магазинам рунета, предоставляющий возможность сэкономить время по серфингу одинаковых товаров на разных площадках!</p><p class={styles.description}>Преимущества: быстро, удобно, не придется рассчитывать выгоду и скорость доставки.</p><div class={styles.shops}><a class={styles.joom} href="https://www.joom.ru/" target="_blank" /><a class={styles.ozon} href="https://www.ozon.ru/" target="_blank" /><a class={styles.wildberries} href="https://www.wildberries.ru/" target="_blank" /></div></div></div>;
$append(document.body, $main);

const $goods: HTMLDivElement = <div class={styles.goods} />;
const $filters = filters();

function getLink(shop: string, id: number) {
    switch (shop) {
        case 'joom': return `https://www.joom.ru/ru/products/${id}`;
        case 'ozon': return `https://www.ozon.ru/product/${id}/`;
        case 'wildberries': return `https://www.wildberries.ru/catalog/${id}/detail.aspx`;
        default: return '';
    }
}

let timerId: ReturnType<typeof setTimeout>;
function historyUpdated() {
    const query = getParam('query') || '';
    $search.value = query;
    $clear($goods);
    clearTimeout(timerId);
    if (query === '') {
        $removeClasses($main, styles.searching);
        $remove($filters, $goods);
    }
    else {
        $addClasses($main, styles.searching);
        timerId = setTimeout(async function() {
            const { results } = await postApi('search', { query });
            if (query !== $search.value) return;
            for (const result of results) {
                $append($goods, Good(getLink(result.shop, result.id), result.images[0], result.name, result.price));
            }
            $append(document.body, $filters, $goods);
        }, 500);
    }
}
addEventListener('popstate', historyUpdated);
historyUpdated();