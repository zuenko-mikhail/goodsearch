function setParams(params: { [key: string]: string; }) {
    history.pushState(null, null, '?' + Object.entries(params).map(p => p.map(encodeURIComponent).join('=')).join('&'));
}
export function getParams(): { [key: string]: string; } {
    return Object.fromEntries(location.search.slice(1).split('&').map(p => p.split('=').map(decodeURIComponent)));
}
export function setParam(name: string, value: string) {
    const params = getParams();
    params[name] = value;
    setParams(params);
}
export function getParam(name: string) {
    return getParams()[name];
}
export function deleteParam(name: string) {
    const params = getParams();
    delete params[name];
    setParams(params);
}