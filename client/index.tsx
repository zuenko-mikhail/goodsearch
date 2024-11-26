import styles from './index.scss';
import { $append } from './lib/dom.ts';

const search = <input class={styles.search} placeholder="Поиск" />;
$append(document.body, <div class={styles.main}><h1 class={styles.logo}>Маркетплейс</h1>{search}</div>);