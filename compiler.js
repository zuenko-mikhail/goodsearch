import syntaxJsx from '@babel/plugin-syntax-jsx';
import { dirname, relative, resolve } from 'path';

export default function({ types }) {
    function checkNode(node) {
        return (
            types.isAssignmentExpression(node) ||
            types.isAwaitExpression(node) ||
            types.isCallExpression(node) ||
            types.isConditionalExpression(node) ||
            types.isJSXElement(node) ||
            types.isIdentifier(node) ||
            types.isLogicalExpression(node) ||
            types.isMemberExpression(node) ||
            types.isNewExpression(node) ||
            types.isOptionalCallExpression(node) ||
            types.isSequenceExpression(node) ||
            types.isTaggedTemplateExpression(node) ||
            types.isYieldExpression(node)
        );
    }
    function parseChildren(list) {
        const children = [];
        let lastString = null;
        function addChild() {
            if (lastString) {
                children.push(lastString);
                lastString = null;
            }
        }
        (function parse(list) {
            for (let child of list) {
                if (types.isJSXExpressionContainer(child)) child = child.expression;
                if (checkNode(child)) {
                    addChild();
                    children.push(child);
                }
                else if (types.isJSXSpreadChild(child)) {
                    addChild();
                    children.push(types.spreadElement(child.expression));
                }
                else if (types.isJSXFragment(child)) {
                    parse(child.children);
                }
                else {
                    if (types.isJSXText(child)) child = types.stringLiteral(child.value);
                    if (!lastString && types.isStringLiteral(child)) lastString = child;
                    else lastString = types.binaryExpression('+', lastString ? lastString : types.stringLiteral(''), child);
                }
            }
        })(list);
        addChild();
        return children;
    }
    function parseName(node) {
        if (types.isJSXIdentifier(node)) {
            return types.identifier(node.name);
        }
        if (types.isJSXMemberExpression(node)) {
            return types.memberExpression(parseName(node.object), parseName(node.property));
        }
    }
    let importE, importT;
    return {
        inherits: syntaxJsx.default,
        visitor: {
            Program(path, state) {
                const pathStr = types.stringLiteral('./' + relative(dirname(state.file.opts.filename), resolve(state.file.opts.root, './client/lib/dom.js')));
                const $E = path.scope.generateUidIdentifier('$E');
                const $T = path.scope.generateUidIdentifier('$T');
                let importedE = false, importedT = false;
                importE = function() {
                    if (!importedE) {
                        path.unshiftContainer('body', types.importDeclaration([types.importSpecifier($E, types.identifier('$E'))], pathStr));
                        importedE = true;
                    }
                    return $E;
                };
                importT = function() {
                    if (!importedT) {
                        path.unshiftContainer('body', types.importDeclaration([types.importSpecifier($T, types.identifier('$T'))], pathStr));
                        importedT = true;
                    }
                    return $T;
                };
            },
            JSXElement(path) {
                const props = types.objectExpression(path.node.openingElement.attributes.map(function(attr) {
                    if (types.isJSXSpreadAttribute(attr)) return types.spreadElement(attr.argument);
                    return types.objectProperty(types.identifier(attr.name.name), attr.value ? types.isJSXExpressionContainer(attr.value) ? attr.value.expression : attr.value : types.booleanLiteral(true));
                }));
                const children = types.arrayExpression(parseChildren(path.node.children));

                const name = path.node.openingElement.name;
                if (types.isJSXIdentifier(name) && /^[a-z]/.test(name.name)) {
                    path.replaceWith(types.callExpression(importE(), [types.stringLiteral(name.name), props, children]));
                }
                else {
                    path.replaceWith(types.callExpression(parseName(name), [props, children]));
                }
            },
            JSXFragment(path) {
                if (path.node.children.length) {
                    const children = parseChildren(path.node.children);
                    if (children.length === 1) {
                        if (!checkNode(children[0])) path.replaceWith(types.callExpression(importT(), [children[0]]));
                        else path.replaceWith(children[0]);
                    }
                    else path.replaceWith(types.arrayExpression(children));
                }
                else path.replaceWith(types.callExpression(importT(), []));
            }
        }
    };
}