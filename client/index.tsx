import styles from './index.scss';
import { $append } from './lib/dom.js';

$append(document.body, <h1 class={styles.header}>Это будет Маркетплейс</h1>);