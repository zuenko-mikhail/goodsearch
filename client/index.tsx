import Good from './good.tsx';
import styles from './index.scss';
import { postApi } from './lib/api.ts';
import { $addClasses, $append, $clear, $remove, $removeClasses } from './lib/dom.ts';

const $search: HTMLInputElement = <input class={styles.search} placeholder="Что вы хотите найти?" autofocus spellcheck={false} onInput={function() {
    history.pushState(null, null, $search.value === '' ? '/' : `?query=${encodeURIComponent($search.value)}`);
    historyUpdated();
}} />;
const $main: HTMLDivElement = <div class={styles.main}><h1 class={styles.logo}>Goodsearch</h1>{$search}<div class={styles.info}><p class={styles.description}>Goodsearch - это сервис по поиску и сравнению товаров по интернет-магазинам рунета, предоставляющий возможность сэкономить время по серфингу одинаковых товаров на разных площадках!</p><p class={styles.description}>Преимущества: быстро, удобно, не придется рассчитывать выгоду и скорость доставки.</p><div class={styles.shops}><a class={styles.joom} href="https://www.joom.ru/" target="_blank" /><a class={styles.ozon} href="https://www.ozon.ru/" target="_blank" /><a class={styles.wildberries} href="https://www.wildberries.ru/" target="_blank" /></div></div></div>;
$append(document.body, $main);

const $goods: HTMLDivElement = <div class={styles.goods} />;
async function historyUpdated() {
    const query = Object.fromEntries(location.search.slice(1).split('&').map(a => a.split('=').map(b => decodeURIComponent(b)))).query || '';
    $search.value = query;
    $clear($goods);
    if (query === '') {
        $removeClasses($main, styles.searching);
        $remove($goods);
    }
    else {
        $addClasses($main, styles.searching);
        const { results } = await postApi('search', { query });
        if ($search.value !== query) return;
        for (const result of results) {
            $append($goods, Good(result.link, result.images[0], result.name, result.price));
        }
        $append(document.body, $goods);
    }
}
addEventListener('popstate', historyUpdated);
historyUpdated();