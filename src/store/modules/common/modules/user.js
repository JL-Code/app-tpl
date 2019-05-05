
import _ from './node_modules/lodash'

const DATABASE = "database";

export default {
  namespaced: true,
  state: {
    info: {}
  },
  actions: {
    /**
     * @description 设置用户数据
     * @param {Object} state vuex state
     * @param {*} info info
     */
    set({ state, dispatch, commit }, info) {
      return new Promise(async resolve => {
        // store 赋值
        // commit("set", info);
        // console.debug("ppm/user/set", info);
        state.info = info;
        // db 持久化
        await dispatch(
          "ppm/db/set",
          {
            dbName: DATABASE,
            path: "user.info",
            value: info,
            user: true
          },
          { root: true }
        );
        // end
        resolve();
      });
    },
    async  unBindWeixin({ state, dispatch }) {
      // 移除db中的微信信息===>重新load更新info
      var info = _.cloneDeep(state.info);
      var info = Object.assign({}, info, { WeixinNickName: "", IsBindingWeixin: false, Avatar: "", userId: "" });
      await dispatch("set", info);
      await dispatch("load");
    },
    /**
     * @description 从数据库取用户数据
     * @param {Object} state vuex state
     */
    load({ state, dispatch }) {
      // console.debug("ppm/user/load", state);
      return new Promise(async resolve => {
        // store 赋值
        state.info = await dispatch(
          "ppm/db/get",
          {
            dbName: DATABASE,
            path: "user.info",
            defaultValue: {},
            user: true // 存储数据根据用户获取
          },
          { root: true }
        );
        // console.debug("ppm/db/get ==> state:", state);
        // end
        resolve();
      });
    }
  },
  mutations: {
    unBindWeixin(state) {
      state.WeixinNickName = "";
      state.IsBindingWeixin = false;
      state.Avatar = "";
      state.userId = "";
    }
  }
};
