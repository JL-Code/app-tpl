<template lang="html">
  <div class="login">
    <div class="login__hd">
      <p class="login__title">账号登录</p>
    </div>
    <div class="login-form">
      <van-field v-model="form.account" autocapitalize="off" placeholder="用户名/手机号码"/>
      <van-field v-model="form.password" type="password" placeholder="密码"/>
      <div class="login-way">
        <router-link
          :disabled="loading"
          class="login-way__text"
          :class="{'login-way__text--disabled':loading}"
          :to="{name:'PhoneLogin'}"
        >手机验证码登录</router-link>
          <div class="login-way__spacer"></div>
          <router-link
          :disabled="loading"
          class="login-way__text"
          :class="{'login-way__text--disabled':loading}"
          :to="{name:'Password',query:{forgetPassword:true}}"
        >忘记密码?</router-link>
      </div>
      <z-button-group>
          <van-button
          class="button--primary"
          @click="passLoginAsync"
        >登录</van-button>
      </z-button-group>
     <more-auth></more-auth>
    </div>
  </div>
</template>

<script>
import Validator from "@/mixins/validator";
import MoreAuth from "./components/MoreAuth";
import Copyright from "./components/Copyright";
import Helper from "./mixins/helper";
import { mapState, mapActions } from "vuex";

export default {
  name: "Login",
  mixins: [Validator, Helper],
  components: { MoreAuth, Copyright },
  data() {
    return {
      loading: false,
      visible: true,
      rules: {
        account: {
          type: "string",
          required: true,
          message: "请输入用户名或手机号"
        },
        password: {
          type: "string",
          required: true,
          message: "请输入密码"
        }
      },
      form: {
        account: "",
        password: ""
      }
    };
  },
  methods: {
    ...mapActions("framework/account", ["login"]),
    async passLoginAsync() {
      var valid = await this.isValidAsync_(this.form);
      if (!valid) {
        return;
      }
      this.login({ vm: this, type: "password", ...this.form });
    }
  }
};
</script>

