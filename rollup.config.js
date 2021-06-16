import babel from 'rollup-plugin-babel'
import typescript from 'rollup-plugin-typescript2'

export default {
    input: './src/index.js',
    output: {
        file: 'es/index.js',
        format: 'esm'
    },
    plugins: [
        babel(),
        typescript()
    ],
    external: ['react']
}