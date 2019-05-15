<template>
  <div class="login">
    <div class="login__hd">
      <p class="login__title">衡泽ERP账号绑定</p>
      <p class="login__desc">仅在首次需要将衡泽ERP账号与微信账号进行绑定,后续就可以直接使用微信登录衡泽ERP的系统。</p>
    </div>
    <div class="login-form">
      <van-field v-model="form.account" autocapitalize="off" placeholder="请输入衡泽ERP账号"/>
      <van-field v-model="form.password" type="password" autocapitalize="off" placeholder="请输入密码"/>
      <z-button-group>
        <van-button
          class="button--primary"
          :loading="loading"
          loading-text="绑定中"
          @click="bindAccount"
        >确认绑定</van-button>
      </z-button-group>
    </div>
  </div>
</template>

<script>
import requestContext from "./mixins/request-context";
import Validator from "@/mixins/validator";
import { mapActions } from "vuex";

export default {
  name: "AccountBinding",
  mixins: [requestContext, Validator],
  data() {
    return {
      loading: false,
      form: {
        account: "",
        password: "",
        uid: ""
      },
      rules: {
        account: {
          type: "string",
          required: true,
          message: "请输入衡泽ERP账号"
        },
        password: {
          type: "string",
          required: true,
          message: "请输入密码"
        },
        uid: {
          type: "string",
          required: true,
          message: "表单无效，缺少uid"
        }
      }
    };
  },
  mounted() {
    this.form.uid = this.query_.corpUserId;
  },
  methods: {
    ...mapActions("framework/account", ["oauth2"]),
    async bindAccount() {
      var valid = await this.isValidAsync_(this.form);
      if (!valid) {
        return;
      }
      // TODO: 考虑后期封装到 vuex中 使用action
      var url = "/api/work/binding/account";
      this.$toast.loading({
        message: "加载中",
        duration: 0
      });
      this.$http
        .post(url, { ...this.form })
        .then(res => {
          if (res.ErrCode !== 0) {
            return Promise.reject(res);
          }
          // 绑定成功后 通过返回的token 直接进行SPA Identity初始
          this.oauth2({ vm: this, token: res });
        })
        .catch(err => {
          this.$toast.clear();
          console.log(err);
          this.$notify(err.ErrMsg || "账号绑定失败");
        });
    }
  }
};
</script>
