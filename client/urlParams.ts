/**
 * Устанавливает (перезаписывает) параметры URL
 * @param params параметры URL
 */
function setParams(params: { [key: string]: string; }) {
    history.pushState(null, null, '?' + Object.entries(params).filter(p => p[1]).map(p => p.map(encodeURIComponent).join('=')).join('&'));
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