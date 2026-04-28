import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    {
        ignores: ['build/', 'dist/', 'node_modules/', 'release/']
    },
    {
        files: ['source/**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname
            },
            globals: globals.browser,
            sourceType: 'module'
        },
        plugins: {
            import: importPlugin
        },
        settings: {
            'import/resolver': {
                typescript: {
                    project: './tsconfig.json'
                }
            }
        },
        rules: {
            'import/no-cycle': 'error'
        }
    }
];
