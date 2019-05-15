<template>
  <div class="z-msg">
    <div class="z-msg__icon--area"></div>
    <div class="z-msg__text--area">{{message}}</div>
    <div class="z-msg__action--area">
      <z-button-group>
        <van-button class="button--primary" @click="goToLogin">返回登录页面</van-button>
      </z-button-group>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import RequestContext from "./mixins/request-context";
import Helper from "./mixins/helper";
export default {
  name: "WeixinOAuth",
  mixins: [RequestContext, Helper],
  data() {
    return {
      code: "",
      state: "",
      message: "正在请求微信授权..."
    };
  },
  mounted() {
    let { code, state } = this.query_;
    this.loading_();
    this.code = code;
    this.state = state;
    if (this.code && this.state) {
      this.getAccessToken();
    } else {
      // 发生错误
      this.message = "缺少请求授权的重要参数 code 、state";
    }
  },
  methods: {
    ...mapActions("framework/account", ["oauth2"]),
    goToLogin() {
      this.$toast.clear();
      this.$router.push({ name: "Login" });
    },
    getAccessToken() {
      // TODO: 考虑后期封装到 vuex中 使用action
      var url = "/api/work/oauth2/token";
      this.$http
        .post(url, null, {
          params: {
            code: this.code,
            state: this.state
          }
        })
        .then(res => {
          console.log("=======res message ==========");
          console.log(res);
          if (res.ErrCode !== 0) {
            return Promise.reject(res);
          }
          // 获取到AccessToken
          // 执行后续操作
          this.$toast.clear();
          this.oauth2({ vm: this, token: res });
        })
        .catch(err => {
          console.log("=======error message ==========");
          console.log(err);
          this.$toast.clear();
          if (err.ErrCode === 10002) {
            // 业务账号未绑定企业微信用户
            this.$dialog
              .alert({
                title: "提示信息",
                message: "当前微信账号尚未绑定衡泽ERP账号，即将跳转到绑定界面"
              })
              .then(() => {
                this.$router.push({
                  name: "AccountBinding",
                  query: { corpUserId: err.Content }
                });
              });
          } else {
            this.$toast({
              message: err.ErrMsg
            });
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
.z-msg {
  padding-top: 36px;
  text-align: center;
}
.z-msg__icon--area {
  margin-bottom: 30px;
}
.z-msg__text--area {
  margin-bottom: 25px;
  padding: 0 20px;
}
.z-msg__action--area {
  margin-bottom: 25px;
}
</style>
