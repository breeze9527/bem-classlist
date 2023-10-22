module.exports = api => {
  api.cache(true);
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: process.env.NODE_ENV === 'test'
            ? { node: 'current' }
            : undefined,
        }
      ],
      '@babel/preset-typescript',
    ],
  }
};
