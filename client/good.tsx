import styles from './good.scss';

export default function Good(link: string, img: string, name: string, price: number) {
    return <a class={styles.good} href={link} target="_blank"><div class={styles.imgContainer}><img class={styles.img} src={img}/></div><div class={styles.info}><h3 class={styles.name}>{name}</h3><div class={styles.price}>{price}₽</div></div></a>;
}