type NodeArray = any[] | NodeArray[];

export function $insertBefore(refNode: Node, ...nodes: NodeArray) {
    if (!refNode.parentNode) return;
    for (const node of nodes) {
        if (Array.isArray(nodes)) $insertBefore(refNode, ...node);
        else refNode.parentNode.insertBefore(node instanceof Node ? node : $T(node), refNode);
    }
}
export function $append(elem: HTMLElement, ...children: NodeArray) {
    for (const child of children) {
        if (Array.isArray(child)) $append(elem, ...child);
        else elem.appendChild(child instanceof Node ? child : $T(child));
    }
}
export function $prepend(elem: HTMLElement, ...children: NodeArray) {
    for (let i = children.length - 1; i >= 0; i--) {
        let child = children[i];
        if (Array.isArray(child)) $prepend(elem, ...child);
        else {
            if (!(child instanceof Node)) child = $T(child);
            if (elem.firstChild) elem.insertBefore(child, elem.firstChild);
            else elem.appendChild(child);
        }
    }
}

export function $remove(node: Node) {
    if (!node?.parentNode) return;
    return node.parentNode.removeChild(node);
}
export function $replace(oldNode: Node, ...newNodes: NodeArray) {
    $insertBefore(oldNode, ...newNodes);
    $remove(oldNode);
}
export function $clear(elem: Node) {
    elem.textContent = '';
}

export function $E(tag: string, props: { [key: string]: any; }, children: NodeArray) {
    const elem = document.createElement(tag);
    for (const prop in props) {
        if (prop.startsWith('on')) $on(elem, prop.slice(2).toLowerCase(), props[prop]);
        else if (prop === 'classes') elem.className = props[prop].join(' ');
        else {
            const snakeProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
            if (props[prop] === true) elem.setAttribute(snakeProp, '');
            else elem.setAttribute(snakeProp, props[prop]);
        }
    }
    $append(elem, ...children);
    return elem;
}
export function $T(text: any) {
    return document.createTextNode(text || '');
}

export function $on(elem: HTMLElement, event: string, callback: (event: Event) => void) {
    elem.addEventListener(event, callback);
}
export function $off(elem: HTMLElement, event: string, callback: (event: Event) => void) {
    elem.removeEventListener(event, callback);
}

export function $style(elem: HTMLElement, key: string, value: string) {
    elem.style[key] = value;
}
export function $setAttr(elem: HTMLElement, key: string, value: string) {
    elem.setAttribute(key, value);
}
export function $removeAttrs(elem: HTMLElement, ...keys: string[]) {
    for (const key of keys) elem.removeAttribute(key);
}

export function $setClases(elem: HTMLElement, ...classes: string[]) {
    elem.className = classes.join(' ');
}
export function $addClasses(elem: HTMLElement, ...classes: string[]) {
    const oldClasses = elem.className.split(' ');
    elem.className = [...oldClasses, ...classes].join(' ');
}
export function $removeClasses(elem: HTMLElement, ...classes: string[]) {
    const oldClasses = elem.className.split(' ');
    elem.className = oldClasses.filter(c => !classes.includes(c)).join(' ');
}
export function $toggleClasses(elem: HTMLElement, ...classes: string[]) {
    const oldClasses = elem.className.split(' ');
    elem.className = [
        ...oldClasses.filter(c => !classes.includes(c)),
        ...classes.filter(c => !oldClasses.includes(c))
    ].join(' ');
}
export function $hasClasses(elem: HTMLElement, ...classes: string[]) {
    const oldClasses = elem.className.split(' ');
    return classes.every(c => oldClasses.includes(c));
}