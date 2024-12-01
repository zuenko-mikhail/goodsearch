import styles from './filters.scss';
import { getParam, onChangeParams, setParam } from './url-params.ts';

/** ID таймера для задержки обновления URL при вводе */
let timerId: ReturnType<typeof setTimeout>;
/** Задержка обновления URL */
function setUpdateTimer(param: string, value: string) {
    clearTimeout(timerId);
    timerId = setTimeout(() => setParam(param, value), 1500);
}

/**
 * Поле ввода числа
 * @param param - назавание параметра URL
 * @param name - название фильтра
 */
export function inputNumber(param: string, name: string): HTMLInputElement {
    const $input = <input class={styles.control} type="number" min="0" onInput={function(event) {
        setUpdateTimer(param, (event.target as HTMLInputElement).value);
    }} />;
    onChangeParams(() => $input.value = getParam(param) || '');
    return <div class={styles.filter}>{name}:{$input}</div>;
}

/**
 * Чекбокс
 * @param param - назавание параметра URL
 * @param name - название фильтра
 */
export function checkbox(param: string, name: string): HTMLInputElement {
    const $input = <input class={styles.control} type="checkbox" onInput={function(event) {
        setUpdateTimer(param, (event.target as HTMLInputElement).checked ? 'true' : '');
    }} />;
    onChangeParams(() => $input.checked = getParam(param) === 'true');
    return <div class={styles.filter}>{name}:{$input}</div>;
}

/**
 * Слайдер
 * @param param назавание параметра URL
 * @param name название фильтра
 */
export function range(param: string, name: string): HTMLInputElement {
    const $input = <input class={styles.control} type="range" onInput={function(event) {
        setUpdateTimer(param, String((event.target as HTMLInputElement).value));
    }} />;
    onChangeParams(() => $input.value = +getParam(param) || 0);
    return <div class={styles.filter}>{name}:{$input}</div>;
}

/** Выбор из списка
 * @param param - назавание параметра URL
 * @param name - название фильтра
 * @param options - список пунктов для выбора
 */
export function select(param: string, name: string, options: [string, string][]): HTMLSelectElement {
    const $select = <select class={styles.control} onInput={function(event) {
        setUpdateTimer(param, (event.target as HTMLSelectElement).value);
    }}>{options.map(option => <option value={option[0]}>{option[1]}</option>)}</select>;
    onChangeParams(() => $select.value = getParam(param) || '');
    return <div class={styles.filter}>{name}:{$select}</div>;
}