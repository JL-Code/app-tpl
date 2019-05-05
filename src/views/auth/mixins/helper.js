export default {
  methods: {
    loading_(options) {
      var defaults = {
        message: "加载中",
        mask: true,
        duration: 0
      };
      if (typeof options === "string") {
        defaults.message = options;
      } else if (typeof options === "object") {
        options = Object.assign({}, defaults, options);
      } else {
        options = defaults;
      }
      this.$toast.loading(options);
    }
  }
};
