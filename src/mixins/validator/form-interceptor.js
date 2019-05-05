/**
 * 表单录入拦截器
 * 注意：1.保存方法名称必须一致（saveChangesAsync("ts")）  2.表单对象名称必须一致（form）
 *
 */

import objecthash from "object-hash";
import _ from "lodash";

export default {
  data() {
    return {
      $_defaulthash: "",
      $_defaultstart: false
    };
  },
  methods: {
    //表单初始完成调用此方法，传入表单对象(this.form)
    validateEnteringFrom_(_formData) {
      let data = _.cloneDeep(_formData);
      this.$_defaulthash = objecthash(data);
    },
    //在暂存或保存提交方法中必须调用此方法，避免点击暂存或保存提交按钮后出现保存提示
    formSubmission_() {
      this.$_defaultstart = true;
    }
  },
  //离开守卫 通常用来禁止用户在还未保存修改前突然离开
  beforeRouteLeave(to, from, next) {
    let data = _.cloneDeep(this.form);
    let modifyhash = objecthash(data);
    if (!this.$_defaultstart) {
      if (this.$_defaulthash === modifyhash) next();
      else {
        next(false);
        this.$dialog
          .confirm({
            title: "温馨提示",
            message: "存在编辑未保存内容，是否退出？",
            confirmButtonText: "退出",
            cancelButtonText: "取消"
          })
          .then(() => {
            next();
            this.$_defaultstart = true;
            //this.saveChangesAsync("ts");
          })
          .catch(() => {
            this.$dialog.close();
            next(false);
          });
      }
    } else {
      next();
    }
  }
};
