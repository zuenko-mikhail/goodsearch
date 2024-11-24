import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'client/index.tsx',
    output: {
        file: 'public/bundle.js',
        format: 'iife'
    },
    plugins: [
        resolve(),
        commonjs({ sourceMap: false }),
        typescript({ noForceEmit: true }),
        babel({
            babelHelpers: 'runtime',
            presets: [
                ['@babel/preset-typescript', { optimizeConstEnums: true }],
                ['@babel/preset-env', { loose: true }]
            ],
            plugins: [
                './compiler.js',
                ['@babel/plugin-transform-runtime', {
                    corejs: 3,
                    useESModules: true
                }]
            ],
            assumptions: {
                // arrayLikeIsIterable: true,
                constantSuper: true,
                ignoreFunctionLength: true,
                ignoreToPrimitiveHint: true,
                iterableIsArray: true,
                mutableTemplateObject: true,
                noClassCalls: true,
                noDocumentAll: true,
                noNewArrows: true,
                noUninitializedPrivateFieldAccess: true,
                objectRestNoSymbols: true,
                privateFieldsAsProperties: true,
                pureGetters: true,
                setClassMethods: true,
                setComputedProperties: true,
                setPublicClassFields: true,
                setSpreadProperties: true,
                skipForOfIteratorClosing: true,
                superIsCallableConstructor: true
            },
            exclude: 'node_modules/**',
            extensions: ['.js', '.ts', '.tsx']
        }),
        terser({
            ecma: 5,
            compress: {
                arguments: true,
                drop_console: ['warn', 'error'],
                drop_debugger: true,
                passes: 5,
                unsafe: true,
                unsafe_math: true,
                unsafe_undefined: true
            },
            module: true,
            format: { comments: false },
            toplevel: true,
            ie8: true,
            safari10: true
        }),
        postcss({
            modules: {
                localsConvention: 'camelCaseOnly',
                generateScopedName: '[hash:base64:3]'
            },
            autoModules: false,
            minimize: {
                preset: ['cssnano-preset-advanced']
            },
            extract: 'styles.css',
            use: {
                sass: { silenceDeprecations: ['legacy-js-api'] } // Отключает предупреждение об устаревшем API
            }
        })
    ]
};