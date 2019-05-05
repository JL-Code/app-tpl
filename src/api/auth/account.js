import request from "@/plugins/axios";

/**
 * 用户名/手机号 + 密码登录
 * @param {Object} model
 */
export function AccountOrPhoneLogin(account, password) {
  const api = "/api/account/login";
  return request.post(api, {
    account,
    password
  });
}

/**
 * 手机短信验证码登录
 * @param {Number} phoneNumber
 * @param {String} captcha
 */
export function SMSCaptchaLogin(phoneNumber, captcha) {
  const api = "/api/account/captcha/login";
  return request.post(api, {
    phoneNumber,
    captcha
  });
}

/**
 * @description 解除微信账号绑定
 */
export function UnBindWeixin() {
  const api = "/api/work/unbind/account";
  return request.delete(api);
}
