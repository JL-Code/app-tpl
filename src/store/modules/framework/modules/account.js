import util from "@/lib/util";

import {
  AccountOrPhoneLogin,
  SMSCaptchaLogin,
  UnBindWeixin
} from "@/api/auth/account";
import { FetchUser } from "@/api/user";

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} param context
     * @param {Object} param vm {Object} vue 实例
     * @param {Object} param username {String} 用户账号
     * @param {Object} param password {String} 密码
     * @param {Object} param route {Object} 登录成功后定向的路由对象
     */
    async login(
      context,
      {
        vm,
        type = "password",
        account,
        password,
        phoneNumber,
        captcha,
        route = {
          name: "Index"
        }
      }
    ) {
      // 开始请求登录接口
      try {
        var token = {};
        showLoadingTips(vm);
        if (type === "password") {
          token = await AccountOrPhoneLogin(account, password);
        } else if (type === "sms") {
          token = await SMSCaptchaLogin(phoneNumber, captcha);
        } else {
          return vm.$notify("未支持的登录方式");
        }
        await sigin(context, { token, vm, route });
      } catch (error) {
        showErrorTips(vm, "登录失败");
      }
    },
    /**
     * // TODO: 后期需要将 token 请求封装到 oauth2 方法内部
     * @description 处理微信之类使用OAuth授权码登录
     * @param {Object} context param context
     * @param {Object} param vm {Object} vue 实例
     * @param {Object} param token {Object}  AccessToken信息
     */
    async oauth2(context, { vm, token, route = { name: "Index" } }) {
      try {
        vm.loading = true;
        await sigin(context, { vm, token, route });
      } catch (error) {
        console.log(error);
        vm.loading = false;
        vm.$toast({
          message: error.ErrMsg || "登录失败",
          duration: 1500
        });
      }
    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} param context
     * @param {Object} param vm {Object} vue 实例
     * @param {Object} param confirm {Boolean} 是否需要确认
     */
    logout({ commit, dispatch }, { vm, confirm = false }) {
      /**
       * @description 注销
       */
      function logout() {
        // 删除cookie
        util.cookies.remove("token");
        util.cookies.remove("uuid");

        dispatch("framework/db/databaseClear", {}, { root: true });

        // 跳转路由
        vm.$router.push({
          name: "Login"
        });
      }
      // 判断是否需要确认
      if (confirm) {
        // commit("framework/gray/set", true, { root: true });
        vm.$dialog
          .confirm({
            title: "确认操作",
            message: "退出当前登录吗？"
          })
          .then(() => {
            // commit("framework/gray/set", false, { root: true });
            logout();
          })
          .catch(() => {
            // commit("framework/gray/set", false, { root: true });
            // vm.$toast("放弃退出登录");
          });
      } else {
        logout();
      }
    },
    unbindWeixin({ commit, dispatch }, { vm }) {
      vm.$dialog
        .confirm({
          title: "确认解除绑定？",
          message: "解绑后，将无法使用微信登录"
        })
        .then(async () => {
          await unbind();
        })
        .catch(() => {
          // vm.$toast("放弃退出登录");
        });
      async function unbind() {
        try {
          var res = await UnBindWeixin();
          if (res.ErrCode !== 0) {
            throw new Error(res.ErrMsg);
          }
          dispatch("framework/user/unBindWeixin", null, { root: true });
          vm.$toast({
            message: "解除绑定成功",
            duration: 1500
          });
        } catch (error) {
          vm.$toast({
            message: error.message || "解除绑定失败",
            duration: 1500
          });
        }
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} state vuex state
     */
    load({ commit, dispatch }) {
      // console.debug("framework/account/load");
      return new Promise(async resolve => {
        // DB -> store 加载用户信息
        await dispatch("framework/user/load", null, { root: true });
        // end
        resolve();
      });
    }
  }
};

/**
 * // TODO: 临时用于操作获取令牌后spa的Identity机制的初始
 */
async function sigin({ dispatch }, { token, vm, route }) {
  // 设置 cookie 一定要存 uuid 和 token 两个 cookie
  // 整个系统依赖这两个数据进行校验和存储
  // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
  // token 代表用户当前登录状态 建议在网络请求中携带 token
  // 如有必要 token 需要定时更新，默认保存一天
  if (token.ErrCode !== 0) {
    vm.loading = false;
    vm.$toast.clear();
    return vm.$notify(token.ErrMsg);
  }

  var result = token.Result;

  util.cookies.set("uuid", result.guid);
  util.cookies.set("token", result);

  var user = await FetchUser();

  // 设置 vuex 用户信息
  await dispatch(
    "framework/user/set",
    {
      userId: result.userid,
      ...user
    },
    { root: true }
  );

  // TODO: 临时放在账号登录后加载系统关于信息
  // dispatch("framework/sys/set", {}, { root: true });

  // 用户登录后从持久化数据加载一系列的设置
  await dispatch("load");

  vm.$toast({
    message: "登录成功",
    duration: 1500
  });

  // 更新路由 尝试去获取 cookie 里保存的需要重定向的页面完整地址
  const path = util.cookies.get("redirect");
  // 根据是否存有重定向页面判断如何重定向
  vm.$router.replace(path ? { path } : route);
  // 删除 cookie 中保存的重定向页面
  util.cookies.remove("redirect");
}

/**
 * @description 通用的错误提示
 * @param {*} vm
 * @param {*} errmsg
 */
function showErrorTips(vm, errmsg) {
  vm.$toast.clear();
  vm.loading = false;
  vm.$toast({
    message: errmsg,
    duration: 1500
  });
}

/**
 * @description 通用的加载提示
 * @param {Object|String} options
 */
function showLoadingTips(vm, options) {
  var defaults = {
    message: "正在登录",
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
  vm.$toast.loading(options);
}
