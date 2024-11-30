declare function jsxFactory(tag: any, props: any, ...children: any[]): any;
declare namespace JSX {
    type Excluded = 'className' | 'onclick' | 'ondblclick' | 'oncontextmenu' | 'onchange' | 'oninput' | 'onkeypress' | 'onkeyup' | 'onkeydown' | 'onfocus' | 'onblur' | 'onload';
    type HTMLIntrinsicElements = {
        [H in keyof HTMLElementTagNameMap]: Partial<Omit<HTMLElementTagNameMap[H], Excluded>> & {
            class?: string;
            classes?: string[];
            onClick?: (event: MouseEvent) => void;
            onDblClick?: (event: MouseEvent) => void;
            onContextMenu?: (event: MouseEvent) => void;
            onChange?: (event: Event) => void;
            onInput?: (event: Event) => void;
            onKeyPress?: (event: KeyboardEvent) => void;
            onKeyUp?: (event: KeyboardEvent) => void;
            onKeyDown?: (event: KeyboardEvent) => void;
            onMouseWheel?: (event: WheelEvent) => void;
            onFocus?: (event: FocusEvent) => void;
            onBlur?: (event: FocusEvent) => void;
            onLoad?: (event: Event) => void;
        };
    };
    interface IntrinsicElements extends HTMLIntrinsicElements { }
}

declare module '*.scss' {
    const classes: { [key: string]: string; };
    export default classes;
}