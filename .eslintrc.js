module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    // Reglas personalizadas
    'no-console': 'off',
    'no-unused-vars': 'warn',
    // Otras reglas...
  },
  overrides: [
    {
      files: ['**/*.test.js'], // Aplica las reglas solo a los archivos de prueba
      env: {
        jest: true,
      },
    },
  ],
};
