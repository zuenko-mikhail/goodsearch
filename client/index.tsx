import { loadProducts } from './list-products.tsx';
import styles from './index.scss';
import { $addClasses, $append, $removeClasses } from './lib/dom.ts';
import { deleteParam, getParam, setParam } from './urlParams.ts';

/** Элемент поиска */
const $search: HTMLInputElement = <input class={styles.search} type="search" placeholder="Что вы хотите найти?" autofocus spellcheck={false} onInput={function() {
    if ($search.value === '') deleteParam('query');
    else setParam('query', $search.value);
    updateSearch();
    loadProducts();
}} />;

/** Обновляет состояние поиска и запускает анимацию */
function updateSearch() {
    $search.value = getParam('query') || '';
    if ($search.value === '') $removeClasses($main, styles.searching);
    else $addClasses($main, styles.searching);
}

/** Звёздочка для добавления запроса в избранное */
const $favoriteStar: HTMLButtonElement = <button class={styles.favoriteStar} title="Добавить запрос в избранное" />;
$favoriteStar.addEventListener('click', function() {
    alert('Нажато!');
});

/** Основной элемент */
const $main: HTMLDivElement = <div class={styles.main}><h1 class={styles.logo}>Goodsearch</h1>{$search}{$favoriteStar}<div class={styles.info}><p class={styles.description}>Goodsearch - это сервис по поиску и сравнению товаров по интернет-магазинам рунета, предоставляющий возможность сэкономить время по серфингу одинаковых товаров на разных площадках!</p><p class={styles.description}>Преимущества: быстро, удобно, не придется рассчитывать выгоду и скорость доставки.</p><div class={styles.shops}><a class={styles.joom} href="https://www.joom.ru/" target="_blank" /><a class={styles.ozon} href="https://www.ozon.ru/" target="_blank" /><a class={styles.wildberries} href="https://www.wildberries.ru/" target="_blank" /></div></div></div>;
$append(document.body, $main);

addEventListener('popstate', updateSearch);
updateSearch();