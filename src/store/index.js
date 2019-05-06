import Vue from "vue";
import Vuex from "vuex";

import framework from "./modules/framework";

console.log("framework", framework);

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    framework
  }
});
