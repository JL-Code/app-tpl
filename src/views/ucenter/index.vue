<template>
  <z-page class="ucenter">
    <div class="ucenter__hd">
      <div class="ucenter__bg"></div>
      <div class="user-box user-box--card">
        <z-avatar v-if="info.Avatar">
          <img :src="info.Avatar">
        </z-avatar>
        <z-avatar v-else size="70" color="#67cbfc" :text="userName"></z-avatar>
        <div class="user">
          <div class="user__hd">
            <p class="user__name">{{info.UserName}}</p>
            <p class="user__date">你已使用{{info.UsageDays}}天</p>
          </div>
          <div class="user__bd">
            <p class="user__job">{{info.Station}}</p>
            <p>{{info.Created}} 注册启用</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card__item">
      <z-card>
        <van-cell title="更改密码" is-link :to="{name:'Password'}">
          <img class="ucenter-icon" slot="icon" src="../../assets/ucenter/锁.png">
        </van-cell>
        <van-cell title="绑定微信" :value="weixinCopywriting" is-link @click="changeWeixinBindingState">
          <img class="ucenter-icon" slot="icon" src="../../assets/wechat.svg">
        </van-cell>
        <van-cell title="退出登录" @click="_logout" is-link>
          <img class="ucenter-icon" slot="icon" src="../../assets/ucenter/用户.png">
        </van-cell>
      </z-card>
    </div>
    <div class="card__item">
      <z-card>
        <van-cell :title="info.HelpCenter" is-link :to="{name:'Help'}">
          <img class="ucenter-icon" slot="icon" src="../../assets/ucenter/问号.png">
        </van-cell>
        <van-cell title="关于我们" @click="showAbout" is-link>
          <img class="ucenter-icon" slot="icon" src="../../assets/ucenter/感叹号.png">
        </van-cell>
        <van-cell title="建议反馈" @click="gray">
          <img class="ucenter-icon" slot="icon" src="../../assets/ucenter/建议.png">
        </van-cell>
      </z-card>
    </div>
    <div class="copyright">
      <div v-html="about.Description"></div>
      <a class="copyright__contact" :href="`tel:${about.Contact}`">
        <p>服务咨询电话：{{about.Contact}}</p>
        <img src="../../assets/ucenter/电话.png">
      </a>
    </div>
  </z-page>
</template>

<script>
import { mapState, mapActions } from "vuex";
import RouterMixin from "@/mixins/router";
export default {
  name: "UCenter",
  mixins: [RouterMixin],
  data() {
    return {
      about: {
        Contact: "186-9655-5281",
        Description: "授权使用：铁建地产西南区域公司<br>系统名称：衡泽ERP - 计划管理系统"
      }
    };
  },
  computed: {
    ...mapState("framework/user", {
      info: state => state.info
    }),
    userName() {
      if (!this.info.UserName) {
        return "";
      }
      return this.info.UserName.substr(-3);
    },
    weixinCopywriting() {
      return this.info.IsBindingWeixin ? "已绑定" : "未绑定";
    }
  },
  methods: {
    ...mapActions("framework/account", ["logout", "unbindWeixin"]),
    _logout() {
      this.logout({ vm: this, confirm: true });
    },
    changeWeixinBindingState() {
      if (this.info.IsBindingWeixin) {
        this.unbindWeixin({ vm: this });
      } else {
        this.bindWeixin();
      }
    },
    bindWeixin() {},
    showAbout() {
      this.$dialog.alert({
        message:
          this.about.Description +
          "<br>" +
          "服务咨询电话：" +
          this.about.Contact
      });
    },
    gray() {
      this.$toast("该功能正在开发中");
    }
  }
};
</script>

<style lang="less" >
@import url("../../style/base/fn");
.ucenter {
  .ucenter__bg {
    height: 80px;
    background: linear-gradient(
      190deg,
      rgba(34, 117, 239, 1) 0%,
      rgba(34, 117, 239, 1) 0%,
      rgba(34, 181, 239, 1) 100%,
      rgba(34, 181, 239, 1) 100%
    );
  }
  .ucenter__hd {
    position: relative;
    height: 160px;
  }
}
.user-box--card {
  border-radius: 10px;
}
.user-box {
  position: absolute;
  top: 20px;
  left: 15px;
  right: 15px;
  z-index: 1;
  display: flex;
  padding: 20px 0 10px 15px;
  height: 85px;
  background-color: #ffffff;
  box-shadow: 1px 1px 5px rgba(200, 201, 204, 0.46);
}
.user {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  padding-left: 15px;
}
.user__hd {
  display: flex;
  justify-content: space-between;
}
.user__bd {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: flex-end;
  font-size: 12px;
}
.user__job {
  padding: 8px 0;
}
.user__name {
  font-size: 18px;
  font-weight: 700;
}
.user__date {
  line-height: 28px;
  min-width: 100px;
  font-size: 12px;
  color: #fff;
  background-color: #67cbfc;
  border-radius: 15px 0 0 15px;
  text-align: right;
}
.card__item {
  padding: 0 10px 0 10px;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
  .switch--mini {
    font-size: 24px !important;
  }
}
.ucenter-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  margin-top: 2px;
  display: block;
}
</style>
