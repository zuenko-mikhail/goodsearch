import styles from './filters.scss';
import { getParam, setParam } from './urlParams.ts';

function input(param: string, name: string) {
    const $input = <input onInput={event => setParam(param, (event.target as HTMLInputElement).value)} />;
    addEventListener('popstate', () => ($input.value = getParam(param) || ''));
    return <div class={styles.filter}>{name}{$input}</div>;
}
function checkbox(param: string, name: string) {
    const $input = <input type="checkbox" onInput={event => setParam(param, String((event.target as HTMLInputElement).checked))} />;
    addEventListener('popstate', () => ($input.checked = getParam(param) === 'true'));
    return <div class={styles.filter}>{name}{$input}</div>;
}
function range(param: string, name: string) {
    const $input = <input type="range" onInput={event => setParam(param, String((event.target as HTMLInputElement).value))} />;
    addEventListener('popstate', () => ($input.value = +getParam(param) || 0));
    return <div class={styles.filter}>{name}{$input}</div>;
}
function select(param: string, name: string, options: [string, string][]) {
    const $select = <select onInput={event => setParam(param, (event.target as HTMLSelectElement).value)}>{options.map(option => <option value={option[0]}>{option[1]}</option>)}</select>;
    addEventListener('popstate', () => ($select.value = getParam(param) || ''));
    return <div class={styles.filter}>{name}{$select}</div>;
}

export default function filters() {
    return (
        <div class={styles.filters}><h2 class={styles.title}>Фильтры</h2>{input('minPrice', 'Мин. цена')}{input('maxPrice', 'Макс. цена')}{select('delivery', 'Доставка', [
            ['', 'В любое время'],
            ['0', 'Сегодня'],
            ['1', 'Завтра'],
            ['2', 'Послезавтра']
        ])}</div>
    );
}