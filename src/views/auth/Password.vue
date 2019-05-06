<template>
  <z-page aqueduct>
    <van-nav-bar slot="header" left-text="返回" left-arrow @click-left="back_"/>
    <!-- 手机验证码修改密码 -->
    <template v-if="forgetPassword">
      <van-cell-group v-if="validCaptcha">
        <form action>
          <van-field v-model="form.new_password" autocomplete type="password" placeholder="请输入新密码"/>
          <van-field
            v-model="form.confirm_password"
            autocomplete
            type="password"
            placeholder="请再次输入新密码"
          />
        </form>
      </van-cell-group>
      <van-cell-group v-else>
        <van-field v-model="phoneNumber" placeholder="请输入手机号"/>
        <captcha-field
          v-model="captcha"
          ref="captcha"
          :before-send="sendSmsAsync"
          placeholder="请输入验证码"
        ></captcha-field>
      </van-cell-group>
      <z-button-group>
        <van-button v-if="validCaptcha" class="button--primary" @click="changePassBySMS">确认修改</van-button>
        <van-button v-else class="button--primary" @click="validateCaptcha">提交</van-button>
      </z-button-group>
    </template>
    <!-- 旧密码修改密码 -->
    <template v-else>
      <van-cell-group>
        <form action>
          <van-field v-model="form.password" autocomplete type="password" placeholder="请输入密码"/>
          <van-field v-model="form.new_password" autocomplete type="password" placeholder="请输入新密码"/>
          <van-field
            v-model="form.confirm_password"
            autocomplete
            type="password"
            placeholder="再次输入新密码"
          />
        </form>
      </van-cell-group>
      <p class="login-way__text" @click="forgetPassword=!forgetPassword">忘记旧密码？</p>
      <z-button-group>
        <van-button
          :disabled="btnDisabled"
          class="button--primary"
          @click="changePassByOldPass"
        >确认修改</van-button>
      </z-button-group>
    </template>
  </z-page>
</template>

<script>
import { mapState } from "vuex";
import util from "@/lib/util";
import routerMixin from "@/mixins/router";
import { Promise } from "q";
export default {
  name: "Password",
  mixins: [routerMixin],
  data() {
    return {
      form: {
        password: "",
        new_password: "",
        confirm_password: ""
      },
      forgetPassword: false,
      validCaptcha: false,
      phoneNumber: "",
      captcha: ""
    };
  },
  computed: {
    ...mapState("framework/user", {
      userInfo: state => state.info
    }),
    btnDisabled() {
      let { password, new_password, confirm_password } = this.form;
      return !(password && new_password && confirm_password);
    }
  },
  mounted() {
    this.forgetPassword = this.$route.query.forgetPassword || false;
  },
  methods: {
    validate() {
      var flag = true;
      var form = this.form;
      if (form.password == "") {
        this.$notify("旧密码必填");
        flag = false;
      } else if (form.new_password == "") {
        this.$notify("新密码必填");
        flag = false;
      } else if (form.confirm_password == "") {
        this.$notify("确认密码必填");
        flag = false;
      }
      //  else if (form.password == form.new_password) {
      //   this.$notify("新密码不能与旧密码相同");
      //   flag = false;
      // }
      else if (form.new_password != form.confirm_password) {
        this.$notify("新密码两次输入不一致，请重新输入！");
        flag = false;
      }
      return flag;
    },
    /**
     * 提供原密码修改密码
     */
    changePassByOldPass() {
      var valid = this.validate();
      if (!valid) return;
      const url = "/api/Account/Password";
      this.$toast.loading("加载中");
      this.$http
        .put(url, {
          oldPassword: this.form.password,
          password: this.form.new_password,
          confirmPassword: this.form.confirm_password
        })
        .then(res => {
          if (res.ErrCode !== 0) {
            return Promise.reject(res);
          }
          this.$dialog
            .alert({
              message: "修改成功"
            })
            .then(() => {
              this.$router.push({ name: "Index" });
            });
        })
        .catch(err => {
          if (typeof err === "string") {
            this.$notify(err);
          } else if (err && err.ErrMsg) {
            this.$notify(err.ErrMsg);
          } else if (err && err.message) {
            this.$notify(err.message);
          } else {
            this.$notify("发生了未知错误");
          }
        });
    },
    changePassBySMS() {
      var url = "/api/Account/ChangePwdByCaptcha";
      this.$http
        .put(url, {
          password: this.form.new_password,
          confirmPassword: this.form.confirm_password
        })
        .then(res => {
          if (res.ErrCode !== 0) {
            return Promise.reject(res);
          }
          this.$dialog
            .alert({
              message: "修改成功"
            })
            .then(() => {
              this.$router.push({ name: "Index" });
            });
        })
        .catch(err => {
          if (typeof err === "string") {
            this.$notify(err);
          } else if (err && err.ErrMsg) {
            this.$notify(err.ErrMsg);
          } else {
            this.$notify("发生了未知错误");
          }
        });
    },
    validateCaptcha() {
      if (!util.validatePhone(this.phoneNumber)) {
        this.$notify("请输入正确的手机号码");
        return;
      }
      var url = "/api/Account/ValidateCaptcha";
      this.$http
        .post(url, {
          phoneNumber: this.phoneNumber,
          captcha: this.captcha
        })
        .then(res => {
          this.validCaptcha = true;
          if (res.ErrCode !== 0) {
            return Promise.reject(res);
          }
        })
        .catch(error => {
          if (typeof error) {
            this.$notify(error);
          } else if (error && error.ErrMsg) {
            this.$notify(error.ErrMsg);
          } else {
            this.$notify("获取验证码失败");
          }
        });
    },
    async sendSmsAsync() {
      try {
        if (!util.validatePhone(this.phoneNumber)) {
          this.$notify("请输入正确的手机号码");
          return false;
        }
        var url =
          "/api/account/password/captcha?phoneNumber=" + this.phoneNumber;
        var res = await this.$http.post(url);
        if (res.ErrCode !== 0) {
          this.$notify(res.ErrMsg);
          return false;
        }
      } catch (error) {
        if (typeof error) {
          this.$notify(error);
        } else if (error && error.ErrMsg) {
          this.$notify(error.ErrMsg);
        } else {
          this.$notify("获取验证码失败");
        }
        return false;
      }
    }
  }
};
</script>
