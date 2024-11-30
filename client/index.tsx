import { addFavoriteQuery, hasFavoriteQuery, removeFavoriteQuery } from './favorite-queries.tsx';
import styles from './index.scss';
import { $addClasses, $append, $removeClasses, $setAttr } from './lib/dom.ts';
import './list-products.tsx';
import { deleteParam, getParam, onChangeParams, setParam } from './url-params.ts';

/** Элемент поиска */
const $search: HTMLInputElement = <input class={styles.search} type="search" placeholder="Что вы хотите найти?" autofocus spellcheck={false} onInput={function() {
    if ($search.value) setParam('query', $search.value);
    else deleteParam('query');
}} />;

/** Звёздочка для добавления запроса в избранное */
const $favoriteStar: HTMLButtonElement = <button class={styles.favoriteStar} onClick={function() {
    const hasFavQuery = hasFavoriteQuery();
    if (hasFavQuery) {
        removeFavoriteQuery();
        $removeClasses($favoriteStar, styles.favorited);
    }
    else {
        addFavoriteQuery();
        $addClasses($favoriteStar, styles.favorited);
    }
    $setAttr($favoriteStar, 'title', hasFavQuery ? 'Добавить запрос в избранное' : 'Удалить запрос из избранного');
}} />;

/** Основной элемент */
const $main: HTMLDivElement = <div class={styles.main}><h1 class={styles.logo}><span class={styles.logoTitle}>Goodsearch</span></h1>{$search}{$favoriteStar}<div class={styles.shopsContainer}>Поиск по маркетплейсам:<div class={styles.shops}><a class={styles.joom} href="https://www.joom.ru/" target="_blank" /><a class={styles.ozon} href="https://www.ozon.ru/" target="_blank" /><a class={styles.wildberries} href="https://www.wildberries.ru/" target="_blank" /></div></div></div>;
$append(document.body, $main);

onChangeParams(function() {
    $search.value = getParam('query') || '';
    if ($search.value) {
        $addClasses($main, styles.searching);

        const hasFavQuery = hasFavoriteQuery();
        if (hasFavQuery) $addClasses($favoriteStar, styles.favorited);
        else $removeClasses($favoriteStar, styles.favorited);
        $setAttr($favoriteStar, 'title', hasFavQuery ? 'Удалить запрос из избранного' : 'Добавить запрос в избранное');
    }
    else $removeClasses($main, styles.searching);
});