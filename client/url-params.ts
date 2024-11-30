/** ID таймера для задержки обновления URL при вводе */
let timerId: ReturnType<typeof setTimeout>;

/** Список прослушивателей изменения параметров URL */
const listeners: Set<() => void> = new Set();

/** Прослушиватель изменения параметров URL */
export function onChangeParams(callback: () => void) {
    listeners.add(callback);
    callback();
}

/** Вызывает прослушиватели изменения параметров URL */
function historyUpdated() {
    clearTimeout(timerId);
    timerId = setTimeout(function() {
        for (const listener of listeners) listener();
    }, 250);
}
addEventListener('popstate', historyUpdated);

/**
 * Устанавливает (перезаписывает) параметры URL
 * @param params параметры URL
 */
export function setParams(params: { [key: string]: string; }) {
    history.pushState(null, null, '?' + Object.entries(params).filter(p => p[1]).map(p => p.map(encodeURIComponent).join('=')).join('&'));
    historyUpdated();
}

/** Возвращает все параметры URL */
export function getParams(): { [key: string]: string; } {
    return Object.fromEntries(location.search.slice(1).split('&').map(p => p.split('=').map(decodeURIComponent)));
}

/**
 * Устанавливает параметр URL
 * @param name имя параметра
 * @param value значение параметра
 */
export function setParam(name: string, value: string) {
    const params = getParams();
    params[name] = value;
    setParams(params);
}

/**
 * Получает параметр URL
 * @param name имя параметра
 */
export function getParam(name: string) {
    return getParams()[name];
}

/**
 * Удаляет параметр URL
 * @param name имя параметра
 */
export function deleteParam(name: string) {
    const params = getParams();
    delete params[name];
    setParams(params);
}