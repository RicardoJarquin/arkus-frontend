module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'airbnb',
        'airbnb/hooks',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
    ],
    overrides: [
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
        'prettier',
    ],
    rules: {
        'react/react-in-jsx-scope': 0,
        'indent': ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'no-shadow': 'off',
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
    ignorePatterns: ['.eslintrc.cjs'],
}
