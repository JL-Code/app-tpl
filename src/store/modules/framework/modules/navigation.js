export default {
  namespaced: true,
  state: {
    // global tabbar active
    globalTabbarActive: 0
  },
  mutations: {
    setGlobalTabbarActive(state, payload) {
      state.globalTabbarActive = payload;
    }
  }
};
