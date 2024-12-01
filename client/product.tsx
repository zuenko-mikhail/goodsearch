import { Product } from '../product.ts';
import styles from './product.scss';
import { declension, sepThous } from './utils.tsx';

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

/** Рассчитывает скидку */
function getDiscount(price: number, oldPrice: number) {
    return Math.round((oldPrice - price) / oldPrice * 100);
}

/** Создаёт элементы товаров */
export function renderProducts(products: Product[]): HTMLAnchorElement[] {
    return products.map(product => <a class={styles.product} href={getLink(product.shop, product.id)} target="_blank"><div class={styles[product.shop]} /><div class={styles.imgContainer}><img class={styles.img} src={product.images.length ? product.images[0] : ''} /></div><div><h3 class={styles.name}>{product.name}</h3><div class={styles.info}><b class={styles.rating}>{(product.rating || 0).toFixed(1)}</b> • {product.comments || '0'} отзыв{declension(product.comments || 0, ['', 'а', 'ов'])}</div><div class={styles.price}><b>{sepThous(product.price)}₽</b>{product.oldPrice ? <s class={styles.oldPrice}>{sepThous(product.oldPrice)}₽</s> : ''}</div><div class={styles.badges}>{product.oldPrice ? <span class={styles.discount}>{String(getDiscount(product.price, product.oldPrice))}%</span> : ''}{product.supplier ? <span class={styles.supplier}>{product.supplier}</span> : ''}</div></div></a>);
}