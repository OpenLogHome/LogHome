module.exports = {
	'env': {
		'browser': true,
		'commonjs': true,
		'es2021': true,
		'node': true,
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 'latest',
	},
	'rules': {
		'indent': ['error', 'tab'],
		'linebreak-style': ['error', 'windows'],
		'quotes': ['error', 'single'],
		'semi': ['error', 'always'],
		'no-var': 'error',
		'no-mixed-spaces-and-tabs': 'error',
		'comma-style': ['error', 'last'],
		'comma-dangle': ['error', 'always-multiline'],
		'no-unused-vars': 'warn',
		'no-case-declarations': 0,
	},
};
