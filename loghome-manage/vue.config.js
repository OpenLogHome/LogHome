const sass = require('sass');

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        implementation: sass,
      },
      scss: {
        implementation: sass,
      },
    },
  },
};
