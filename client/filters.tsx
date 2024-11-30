import styles from './filters.scss';
import { getParam, setParam } from './urlParams.ts';

/**
 * Поле ввода числа
 * @param param - назавание параметра URL
 * @param name - название фильтра
 * @param onChange - функция обратного вызова при изменении
 */
export function inputNumber(param: string, name: string, onChange: () => void): HTMLInputElement {
    const $input = <input class={styles.control} type="number" min="0" onInput={function(event) {
        setParam(param, (event.target as HTMLInputElement).value);
        onChange();
    }} />;
    function update() {
        $input.value = getParam(param) || '';
    }
    addEventListener('popstate', update);
    update();
    return <div class={styles.filter}><span class={styles.filtername}>{name}</span>:{$input}</div>;
}

/**
 * Чекбокс
 * @param param - назавание параметра URL
 * @param name - название фильтра
 * @param onChange - функция обратного вызова при изменении
 */
export function checkbox(param: string, name: string, onChange: () => void): HTMLInputElement {
    const $input = <input class={styles.control} type="checkbox" onInput={function(event) {
        setParam(param, (event.target as HTMLInputElement).checked ? 'true' : '');
        onChange();
    }} />;
    function update() {
        $input.checked = getParam(param) === 'true';
    }
    addEventListener('popstate', update);
    update();
    return <div class={styles.filter}><span class={styles.filtername}>{name}</span>:{$input}</div>;
}

/**
 * Слайдер
 * @param param назавание параметра URL
 * @param name название фильтра
 * @param onChange функция обратного вызова при изменении
 */
export function range(param: string, name: string, onChange: () => void): HTMLInputElement {
    const $input = <input class={styles.control} type="range" onInput={function(event) {
        setParam(param, String((event.target as HTMLInputElement).value));
        onChange();
    }} />;
    function update() {
        $input.value = +getParam(param) || 0;
    }
    addEventListener('popstate', update);
    update();
    return <div class={styles.filter}><span class={styles.filtername}>{name}</span>:{$input}</div>;
}

/** Выбор из списка
 * @param param - назавание параметра URL
 * @param name - название фильтра
 * @param options - список пунктов для выбора
 * @param onChange - функция обратного вызова при изменении
 */
export function select(param: string, name: string, options: [string, string][], onChange: () => void): HTMLSelectElement {
    const $select = <select class={styles.control} onInput={function(event) {
        setParam(param, (event.target as HTMLSelectElement).value);
        onChange();
    }}>{options.map(option => <option value={option[0]}>{option[1]}</option>)}</select>;
    function update() {
        $select.value = getParam(param) || '';
    }
    addEventListener('popstate', update);
    update();
    return <div class={styles.filter}><span class={styles.filtername}>{name}</span>:{$select}</div>;
}