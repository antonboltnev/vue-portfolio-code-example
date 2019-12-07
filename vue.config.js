module.exports = {
    css: {
      loaderOptions: {
        less: {
          prependData: `@import "~@/themre/colors.less";`
        },
      }
    }
  }