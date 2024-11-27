import Good from './good.tsx';
import styles from './index.scss';
import { getApi, postApi } from './lib/api.ts';
import { $append, $clear, $prepend, $remove } from './lib/dom.ts';

const $logo: HTMLHeadingElement = <h1 class={styles.logo}>Маркетплейс</h1>;
const $search: HTMLInputElement = <input class={styles.search} placeholder="Поиск" autofocus onInput={function(event: KeyboardEvent) {
    history.pushState(null, null, $search.value === '' ? '/' : `?query=${encodeURIComponent($search.value)}`);
    historyUpdated();
}} />;
const $numGoods: Text = <></>;
const $description: HTMLElement[] = <><p class={styles.numGoods}>{$numGoods}</p><div class={styles.shops}><a class={styles.ozon} href="https://www.ozon.ru/" target="_blank" /><a class={styles.wildberries} href="https://www.wildberries.ru/" target="_blank" /><a class={styles.other} href="https://bombers.ext.io/" target="_blank" /></div><p class={styles.description}>Маркетплейс - это сервис по поиску и сравнению товаров по интернет-магазинам рунета, предоставляющий возможность сэкономить время по серфингу одинаковых товаров на разных площадках!</p><p class={styles.description}>Преимущества: быстро, удобно, не придется рассчитывать выгоду и скорость доставки.</p></>;
const $goods: HTMLDivElement = <div />;
const $main: HTMLDivElement = <div class={styles.main}>{$logo}{$search}{$description}</div>;
$append(document.body, $main);

getApi('getNumGoods').then(({ num }) => $numGoods.textContent = `В базе хранится ${num} товаров`);

function getLink(shop: string, id: number) {
    switch (shop) {
        case 'ozon': return `https://www.ozon.ru/product/${id}/`;
        case 'wildberries': return `https://www.wildberries.ru/catalog/${id}/detail.aspx`;
    }
}

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
        for (const result of results) {
            $append($goods, Good(getLink(result.shop, result.id), result.images[0], result.name, result.price));
        }
        $append($main, $goods);
    }
}
addEventListener('popstate', historyUpdated);
historyUpdated();