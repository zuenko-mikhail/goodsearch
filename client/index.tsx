import Good from './good.tsx';
import styles from './index.scss';
import { postApi } from './lib/api.ts';
import { $append, $clear, $prepend, $remove } from './lib/dom.ts';

const $logo: HTMLHeadingElement = <h1 class={styles.logo}>Маркетплейс</h1>;
const $search: HTMLInputElement = <input class={styles.search} placeholder="Поиск" autofocus onInput={function() {
    history.pushState(null, null, $search.value === '' ? '/' : `?query=${encodeURIComponent($search.value)}`);
    historyUpdated();
}} />;
const $description: HTMLElement[] = <><p class={styles.description}>Маркетплейс - это сервис по поиску и сравнению товаров по интернет-магазинам рунета, предоставляющий возможность сэкономить время по серфингу одинаковых товаров на разных площадках!</p><p class={styles.description}>Преимущества: быстро, удобно, не придется рассчитывать выгоду и скорость доставки.</p><div class={styles.shops}><a class={styles.ozon} href="https://www.ozon.ru/" target="_blank" /><a class={styles.wildberries} href="https://www.wildberries.ru/" target="_blank" /><a class={styles.other} href="https://bombers.ext.io/" target="_blank" /></div></>;
const $goods: HTMLDivElement = <div />;
const $main: HTMLDivElement = <div class={styles.main}>{$logo}{$search}{$description}</div>;
$append(document.body, $main);

async function historyUpdated() {
    const query = Object.fromEntries(location.search.slice(1).split('&').map(a => a.split('=').map(b => decodeURIComponent(b)))).query || '';
    $search.value = query;
    $clear($goods);
    if (query === '') {
        $prepend($main, $logo);
        $append($main, $description);
        $remove($goods);
    }
    else {
        $remove($logo, $description);
        const { results } = await postApi('search', { query });
        if ($search.value !== query) return;
        for (const result of results) {
            $append($goods, Good(result.link, result.images[0], result.name, result.price));
        }
        $append($main, $goods);
    }
}
addEventListener('popstate', historyUpdated);
historyUpdated();