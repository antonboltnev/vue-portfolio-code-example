module.exports = {
    css: {
      loaderOptions: {
        less: {
          prependData: `@import "~@/themre/colors.less";`
        },
        sass: {
          prependData: `@import "@/assets/scss/variables.scss";`
        }
      }
    }
  };