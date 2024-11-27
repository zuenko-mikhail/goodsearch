export function getApi(name: string, data: { [key: string]: any; } = {}) {
    return fetch(`/api/${name}?` + Object.entries(data).map(([k, v]) => `${k}=${v}`).join('&')).then(res => res.json()).catch(() => ({ error: 'Не удалось получить данные.' }));
}
export function postApi(name: string, data: { [key: string]: any; } = {}) {
    return fetch(`/api/${name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()).catch(() => ({ error: 'Не удалось получить данные.' }));
}