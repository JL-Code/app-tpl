/**
 * 表单验证器
 */
import AsyncValidator from "async-validator";

const wrapper = {
  /**
   * Create an validator Instance
   * @param rules An object declaring validation rules
   */
  create(rules) {
    return new AsyncValidator(rules);
  }
};

export default {
  install(Vue) {
    //  添加实例方法 refs:https://cn.vuejs.org/v2/guide/plugins.html#%E5%BC%80%E5%8F%91%E6%8F%92%E4%BB%B6
    Vue.prototype.$validator = wrapper;
  }
};
