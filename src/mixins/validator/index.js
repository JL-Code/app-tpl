/**
 * 基于async-validator 的 表单验证 vuejs 混入
 * 使用参考:https://github.com/yiminghe/async-validator
 */

export default {
  data() {
    return {
      $_validator: null
    };
  },
  created() {
    this.createValidator_();
  },
  methods: {
    $_handleErrors(errors, fields) {
      // validation failed, errors is an array of all errors
      // fields is an object keyed by field name with an array of
      // errors per field
      console.warn("fields", fields);
      if (errors && errors.length) {
        this.$notify(errors[0].message);
      }
    },
    createValidator_(force = false) {
      let { rules } = this;
      if (!rules) {
        return;
      }
      if (this.$_validator && !force) {
        return;
      }
      this.$_validator = this.$validator.create(this.rules);
      // console.debug("$_validator", this.$_validator);
    },
    validate_(data, options = {}) {
      return new Promise((resolve, reject) => {
        if (this.$_validator) {
          this.$_validator.validate(data, options, (errors, fields) => {
            if (errors) {
              this.$_handleErrors(errors, fields);
              reject(errors, fields);
            } else {
              resolve();
            }
          });
        } else {
          reject([{ message: "validator is invalid" }]);
        }
      });
    },
    // 异步验证方法 是否有效
    async isValidAsync_(data, options = {}) {
      var valid = true;
      try {
        // await 命令后面的 Promise 对象，运行结果可能是 rejected，所以最好把 await 命令放在 try...catch 代码块中。http://www.ruanyifeng.com/blog/2015/05/async.html
        await this.validate_(data, options);
      } catch (error) {
        // console.warn(error);
        valid = false;
      }
      return valid;
    }
  }
};
