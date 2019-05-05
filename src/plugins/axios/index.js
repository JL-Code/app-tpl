/**
 * required npm install axios
 * @description 用于封装oAuth2授权请求
 * @author jiangy 2018年12月12日13:24:55
 */

import axios from "axios";
import settings from "@/settings";
import util from "../../lib/util";

const isProduction = process.env.NODE_ENV === "production";
const server = document.body.dataset.server || "";

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    // 附加令牌信息
    try {
      let info = util.cookies.get(settings.constants.TOKEN, true);
      if (info && info.access_token) {
        config.headers.Authorization = "Bearer " + info.access_token;
      }
    } catch (error) {
      util.log.danger("accessToken 附加失败", error.message);
    }
    //设置网络请求15秒超时
    config.timeout = settings.http.timeout;
    if (config.url && isProduction) {
      if (!server) {
        throw new Error("server is undefined");
      }
      config.url = config.url.replace("/api", server + "/api");
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//添加响应拦截器
axios.interceptors.response.use(
  response => {
    // console.debug("axios.interceptors.response", response);
    return response && response.data;
  },
  error => {
    // 1.请求已完成 得到服务器响应 但是http状态码不是2xx范围内
    if (error.response) {
      switch (error.response.status) {
        case 401:
          util.cookies.remove("token");
          util.cookies.remove("uuid");
          return Promise.reject(error.response.data);
        default:
          return Promise.reject(error.response.data);
      }
    } else if (error.request) {
      var data = {
        ErrCode: error.code,
        ErrMsg: error.message
      };
      if (error.code === "ECONNABORTED") {
        data.ErrMsg = "服务不可用,网络超时";
      }
      // 2.发起请求时出错未收到任何响应
      return Promise.reject(data);
    } else {
      // Something happened in setting up the request that triggered an Error
      // 3.一些错误是在设置请求时触发的
      // console.log("Error", error.message, error.code);
      return Promise.reject({
        ErrCode: error.code,
        ErrMsg: error.message
      });
    }
  }
);

export default axios;
