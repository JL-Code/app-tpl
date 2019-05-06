import Vue from "vue";
import App from "./App.vue";
import router from "./routes";
import store from "./store";
import Vant from "vant";
import Validator from "./plugins/validator";
import VueAxios from "vue-axios";
import Axios from "./plugins/axios";
import "vant/lib/index.css";

import "./layouts/_globals";
import "./packages/_globals";

Vue.use(Vant);
Vue.use(VueAxios, Axios);
Vue.use(Validator);

new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    // 获取系统信息
    // this.$store.dispatch("framework/sys/fetchAbout");
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch("framework/account/load");
    // 获取并记录用户 UA
    this.$store.commit("framework/ua/get");
  }
}).$mount("#app");
