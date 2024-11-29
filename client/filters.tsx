import styles from './filters.scss';
import { getParam, setParam } from './urlParams.ts';

function inputNumber(param: string, name: string) {
    const $input = <input class={styles.control} type="number" onInput={event => setParam(param, (event.target as HTMLInputElement).value)} />;
    function update() {
        $input.value = getParam(param) || '';
    }
    addEventListener('popstate', update);
    update();
    return <div class={styles.filter}>{name}:{$input}</div>;
}
function checkbox(param: string, name: string) {
    const $input = <input class={styles.control} type="checkbox" onInput={event => setParam(param, String((event.target as HTMLInputElement).checked))} />;
    function update() {
        $input.checked = getParam(param) === 'true';
    }
    addEventListener('popstate', update);
    update();
    return <div class={styles.filter}>{name}:{$input}</div>;
}
function range(param: string, name: string) {
    const $input = <input class={styles.control} type="range" onInput={event => setParam(param, String((event.target as HTMLInputElement).value))} />;
    function update() {
        $input.value = +getParam(param) || 0;
    }
    addEventListener('popstate', update);
    update();
    return <div class={styles.filter}>{name}:{$input}</div>;
}
function select(param: string, name: string, options: [string, string][]) {
    const $select = <select class={styles.control} onInput={event => setParam(param, (event.target as HTMLSelectElement).value)}>{options.map(option => <option value={option[0]}>{option[1]}</option>)}</select>;
    function update() {
        $select.value = getParam(param) || '';
    }
    addEventListener('popstate', update);
    update();
    return <div class={styles.filter}>{name}:{$select}</div>;
}

export default function filters() {
    return (
        <div class={styles.filters}><h2 class={styles.title}>Фильтры</h2>{inputNumber('minPrice', 'Мин. цена')}{inputNumber('maxPrice', 'Макс. цена')}{select('delivery', 'Доставка', [
            ['', 'В любое время'],
            ['0', 'Сегодня'],
            ['1', 'Завтра'],
            ['2', 'Послезавтра']
        ])}</div>
    );
}