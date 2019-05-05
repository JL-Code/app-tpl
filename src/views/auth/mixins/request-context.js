export default {
  data() {
    return {
      query_: {},
      params_: {}
    };
  },
  mounted() {
    this.query_ = this.$route.query;
    this.params_ = this.$route.params;
  }
};

/**
 * 绑定参数
 * @param {Object} $route vue router 对象实例
 */
function BindParams($route) {}
