<template>
  <div class="more-auth">
    <div class="more-auth__content more-auth--line">
      <span class="more-auth__tips">更多登录方式</span>
    </div>
    <div class="oauth-box">
      <div class="oauth">
        <!-- <div class="oauth--bg">
          <img title="微信" alt="微信" src="@/assets/wechat.svg" @click="wechatAuth" class="oauth__btn">
        </div>-->
        <z-avatar>
          <img title="微信" alt="微信" src="@/assets/wechat.svg" @click="wechatAuth" class="oauth__btn">
        </z-avatar>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MoreAuth",
  methods: {
    wechatAuth() {
      // 引导用户跳转到认证服务器
      if (typeof window) {
        this.$toast.loading({
          message: "加载中",
          duration: 0
        });
        // TODO: 后续将服务器信息加入到vuex中 document.body.dataset.server
        window.location.href = `http://meunsc.oicp.net:47941/api/work/authorize?appcode=PPMWEBAPP`;
      } else {
        this.$notify("请在浏览器环境下使用");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.more-auth {
  overflow: hidden;
}
.more-auth__content {
  width: 65%;
  margin: 0 auto;
  line-height: 1.6em;
  font-size: 14px;
  text-align: center;
}
.more-auth--line {
  border-top: 1px solid #e5e5e5;
  margin-top: 2.4em;
  .more-auth__tips {
    position: relative;
    top: -0.9em;
    padding: 0 0.55em;
    background-color: #ffffff;
    color: #808080;
  }
}
.more-auth__tips {
  display: inline-block;
  vertical-align: middle;
}
.oauth-box {
  line-height: 1.9rem;
  color: #8b9196;
  .oauth {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .oauth--bg {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #f4f8fb;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .oauth__btn {
    vertical-align: bottom;
    cursor: pointer;
    height: 38px;
  }
}
.ouath-box__hint {
  color: #8b9196;
  line-height: 1.6;
}
</style>
