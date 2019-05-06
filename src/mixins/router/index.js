/**
 * 路由拦截混入
 */

// 顶级导航
const TopNavs = [
  "Index", // 首页
  "UCenter" // 我的信息
];

export default {
  beforeRouteEnter(to, from, next) {
    var _index = TopNavs.findIndex(
      item => item.toLocaleLowerCase() === to.name.toLocaleLowerCase()
    );

    next(vm => {
      try {
        if (_index > -1) {
          vm.$store.commit(
            "framework/navigation/setGlobalTabbarActive",
            _index
          );
        }
      } catch (error) {
        console.warn(error.message);
      }
    });
  },
  methods: {
    back_() {
      try {
        if (this.$route.query.ref == "wechat_message") {
          this.$router.push("/home/index");
        } else {
          this.$router.back();
        }
      } catch (error) {
        console.log(error);
      }
    },
    forward_() {
      this.$router.forward();
    }
  }
};
