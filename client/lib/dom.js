export function $insertBefore(refNode, ...nodes) {
    if (!refNode.parentNode) return;
    for (const node of nodes) {
        if (Array.isArray(child)) $insertBefore(refNode, ...node);
        else refNode.parentNode.insertBefore(node instanceof Node ? node : $T(node), refNode);
    }
}
export function $append(elem, ...children) {
    for (const child of children) {
        if (Array.isArray(child)) $append(elem, ...child);
        else elem.appendChild(child instanceof Node ? child : $T(child));
    }
}
export function $prepend(elem, ...children) {
    for (let i = children.length - 1; i >= 0; i--) {
        let child = children[i];
        if (Array.isArray(child)) $prepend(elem, ...child);
        else {
            if (!child instanceof Node) child = $T(child);
            if (elem.firstChild) elem.insertBefore(child, elem.firstChild);
            else elem.appendChild(child);
        }
    }
}

export function $remove(node) {
    if (!node?.parentNode) return;
    return node.parentNode.removeChild(node);
}
export function $replace(oldNode, ...newNode) {
    $insertBefore(oldNode, ...newNode);
    $remove(oldNode);
}
export function $clear(elem) {
    elem.textContent = '';
}

export function $E(tag, props, children) {
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
export function $T(text) {
    return document.createTextNode(text || '');
}

export function $on(elem, event, callback) {
    elem.addEventListener(event, callback);
}
export function $off(elem, event, callback) {
    elem.removeEventListener(event, callback);
}

export function $style(elem, key, value) {
    elem.style[key] = value;
}
export function $setAttr(elem, key, value) {
    elem.setAttribute(key, value);
}
export function $removeAttrs(elem, ...keys) {
    for (const key of keys) elem.removeAttribute(key);
}

export function $setClases(elem, ...classes) {
    elem.className = classes.join(' ');
}
export function $addClasses(elem, ...classes) {
    const oldClasses = elem.className.split(' ');
    elem.className = [...oldClasses, ...classes].join(' ');
}
export function $removeClasses(elem, ...classes) {
    const oldClasses = elem.className.split(' ');
    elem.className = oldClasses.filter(c => !classes.includes(c)).join(' ');
}
export function $toggleClasses(elem, ...classes) {
    const oldClasses = elem.className.split(' ');
    elem.className = [
        ...oldClasses.filter(c => !classes.includes(c)),
        ...classes.filter(c => !oldClasses.includes(c))
    ].join(' ');
}
export function $hasClasses(elem, ...classes) {
    const oldClasses = elem.className.split(' ');
    return classes.every(c => oldClasses.includes(c));
}