module.exports = {
    root: true,
    env: { browser: true, es2020: true, node: true },
    extends: ['eslint:recommended', '@typescript-eslint/recommended'],
    ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules'],
    parser: '@typescript-eslint/parser',
    plugins: [],
    rules: {
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
};
