import UaParser from "ua-parser-js";

export default {
  namespaced: true,
  state: {
    // 用户 UA
    data: {}
  },
  getters: {
    isAndroid(state) {
      return state.data.os.name.toLocaleLowerCase() === "android";
    },
    isIOS(state) {
      return state.data.os.name.toLocaleLowerCase() === "ios";
    },
    isWeChat(state) {
      return state.data.wechat;
    }
  },
  mutations: {
    /**
     * @description 记录 UA
     * @param {Object} state vuex state
     */
    get(state) {
      var result = new UaParser().getResult();
      // TODO: 👇临时将微信平台检测 写在这里，后续考虑移除
      const isWeChat = !!result.ua.toLocaleLowerCase().match(/micromessenger/);
      result.wechat = isWeChat;
      state.data = result;
    }
  }
};
