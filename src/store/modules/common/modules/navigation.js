/**
 * @description 记录导航状态
 */

export default {
  namespaced: true,
  state: {
    topNavActive: 0
  },
  mutations: {
    setTopNavActive(state, payload) {
      state.topNavActive = payload;
    }
  }
};
