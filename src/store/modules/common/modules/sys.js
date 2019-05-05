import { FetchAbout } from "@/api/sys";

const DATABASE = "database";

export default {
  namespaced: true,
  state: {
    about: {
      SystemName: "",
      Contact: "",
      Description: ""
    }
  },
  actions: {
    fetchAbout({ commit, dispatch }) {
      FetchAbout()
        .then(async res => {
          if (res.ErrCode !== 0) {
            throw new Error(res);
          }
          var data = {
            Contact: res.Contact,
            SystemName: res.SystemName,
            Description: res.Description
          };
          // 利用lowdb 持久化
          await dispatch(
            "ppm/db/set",
            {
              dbName: DATABASE,
              path: "sys.about",
              value: data,
              user: false //存储数据根据用户存储
            },
            { root: true }
          );
          commit("setAbout", data);
        })
        .catch(err => {
          console.error(err);
        });
    },
    /**
     * @description 从数据库取用户数据
     * @param {Object} state vuex state
     */
    load({ state, dispatch }) {
      // console.debug("ppm/user/load", state);
      return new Promise(async resolve => {
        // store 赋值
        state.about = await dispatch(
          "ppm/db/get",
          {
            dbName: DATABASE,
            path: "sys.about",
            defaultValue: {},
            user: false // 存储数据根据用户获取
          },
          { root: true }
        );
        // end
        resolve();
      });
    }
  },
  mutations: {
    setAbout(state, payload) {
      state.about = payload;
    }
  }
};
