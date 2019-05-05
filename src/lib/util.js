import log from "./util.log.js";
import cookies from "./util.cookies.js";

let util = {
  cookies,
  log
};

/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function(titleText) {
  // const processTitle = process.env.VUE_APP_TITLE || "计划系统";
  window.document.title = titleText || "";
};

/**
 * 验证手机号格式
 * @param {string} phoneNumber
 */
util.validatePhone = function(phoneNumber) {
  return /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(
    phoneNumber
  );
};

export default util;
