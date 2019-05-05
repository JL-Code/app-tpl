import httpClient from "../../plugins/axios";
import WeChatJSSDK from "wechat-jssdk/lib/client";
import wxsdk from "weixin-js-sdk";

function configure(jssdkconfig, apiList, ready, error) {
  let defaults = { beta: true, debug: false, jsApiList: apiList }; // 必须这么写，否则在微信插件有些jsapi会有问题 // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。 // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  let options = Object.assign(defaults, jssdkconfig);
  wxsdk.config(options);
  wxsdk.ready(function() {
    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    ready instanceof Function && ready(options);
  });
  wxsdk.error(function(res) {
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    error instanceof Function && error(res);
  });
  return wxsdk;
}

async function configureAysnc(options, success, error) {
  // refs: https://work.weixin.qq.com/api/doc#90000/90136/90514
  // wechat-jssdk for v3+ https://github.com/JasonBoy/wechat-jssdk/wiki/%E4%B8%AD%E6%96%87%E4%BD%BF%E7%94%A8%E6%96%87%E6%A1%A3
  const defaults = { beta: true, debug: false, jsApiList: [] };
  var opts = await fetchSignature(options.url);
  console.debug("options", opts);
  var _options = Object.assign({}, defaults, options, {
    appId: opts.appId || opts.corpId,
    nonceStr: opts.nonceStr || opts.noncestr,
    signature: opts.signature,
    timestamp: opts.timestamp
  });
  if (success && success instanceof Function) _options.success = success;
  if (error && error instanceof Function) _options.error = error;
  const jssdkInstance = new WeChatJSSDK(_options);
  return jssdkInstance;
}

/**
 * @description 获取签名数据
 * @param {string} url 签名地址
 */
function fetchSignature(url) {
  return new Promise(resolve => {
    httpClient
      .get(url)
      .then(res => {
        console.debug("res.data", res.data);
        resolve(res.data);
      })
      .catch(err => {
        console.warn(err && err.response);
        resolve({});
      });
  });
}

export default { configure, configureAysnc };
