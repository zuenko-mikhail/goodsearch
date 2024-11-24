import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
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
            babelHelpers: 'bundled', // Потому что без @babel/plugin-transform-runtime
            presets: [
                ['@babel/preset-typescript', { optimizeConstEnums: true }]
            ],
            plugins: ['./compiler.js'],
            exclude: 'node_modules/**',
            extensions: ['.js', '.ts', '.tsx']
        }),
        postcss({
            modules: {
                localsConvention: 'camelCaseOnly',
                generateScopedName: '[local]_[name]_[hash:base64:3]'
            },
            autoModules: false,
            extract: 'styles.css',
            use: {
                sass: { silenceDeprecations: ['legacy-js-api'] } // Отключает предупреждение об устаревшем API
            }
        })
    ]
};