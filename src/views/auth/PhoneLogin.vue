<template>
  <z-page class="login">
    <div class="login__hd">
      <p class="login__title">手机验证码登录</p>
    </div>
    <div class="login-form">
      <van-field v-model="form.phoneNumber" autocapitalize="off" placeholder="手机号码"/>
      <captcha-field
        v-model="form.captcha"
        ref="captcha"
        :before-send="sendSmsAsync"
        placeholder="验证码"
      ></captcha-field>
      <div class="login-way">
        <router-link
          class="login-way__text"
          :class="{'login-way__text--disabled':loading}"
          :disabled="loading"
          to="/Auth/Login"
        >密码登录</router-link>
      </div>
      <z-button-group>
        <van-button class="button--primary" @click="smsLoginAsync">登录</van-button>
      </z-button-group>
      <more-auth></more-auth>
    </div>
    <copyright slot="footer" :desc="about.Description" :contact="about.Contact"></copyright>
  </z-page>
</template>

<script>
import util from "@/lib/util";
import validator from "@/mixins/validator";
import Helper from "./mixins/helper";
import MoreAuth from "./components/MoreAuth";
import Copyright from "./components/Copyright";
import { mapState, mapActions } from "vuex";

export default {
  name: "PhoneLogin",
  mixins: [validator, Helper],
  components: { MoreAuth, Copyright },
  data() {
    return {
      form: {
        phoneNumber: "",
        captcha: ""
      },
      rules: {
        phoneNumber: [
          {
            type: "string",
            required: true,
            message: "请输入手机号码"
          },
          {
            type: "string",
            pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
            message: "请输入正确的手机号码"
          }
        ],
        captcha: {
          type: "string",
          required: true,
          message: "请输入验证码"
        }
      },
      loading: false
    };
  },
  computed: {
    ...mapState("framework/sys", {
      about: state => state.about
    })
  },
  methods: {
    ...mapActions("framework/account", ["login"]),
    async sendSmsAsync() {
      try {
        if (!util.validatePhone(this.form.phoneNumber)) {
          this.$notify("请输入正确的手机号码");
          return false;
        }
        var url = "/api/account/captcha?phoneNumber=" + this.form.phoneNumber;
        var response = await this.$http.post(url);
        console.log(response);
      } catch (error) {
        console.error(error);
        if (error.errmsg) {
          this.$notify(error.errmsg);
        } else {
          this.$notify("发生未知错误");
        }
        return false;
      }
    },
    async smsLoginAsync() {
      var valid = await this.isValidAsync_(this.form);
      if (!valid) {
        return;
      }
      this.login({ vm: this, type: "sms", ...this.form });
    }
  }
};
</script>
