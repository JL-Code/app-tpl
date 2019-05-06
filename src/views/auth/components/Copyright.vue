<template>
  <div class="copyright copyright--fixed" v-show="visible">
    <div v-html="desc"></div>
    <a class="copyright__contact" :href="`tel:${contact}`">
      <p>服务咨询电话：{{contact}}</p>
      <img src="../../../assets/ucenter/电话.png">
    </a>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Copyright",
  props: {
    desc: String,
    contact: String
  },
  data() {
    return {
      visible: true
    };
  },
  computed: {
    ...mapGetters("framework/ua", ["isAndroid", "isIOS"])
  },
  mounted() {
    this.fixKeyboard();
  },
  methods: {
    /**
     * @description 修复键盘弹出造成的页面布局问题
     * @see https://blog.csdn.net/u012982629/article/details/81905894#
     */
    fixKeyboard() {
      var vm = this;
      var client_h =
        document.documentElement.clientHeight || document.body.clientHeight;
      window.onresize = function() {
        //键盘弹起与隐藏都会引起窗口的高度发生变化
        var resize_h =
          document.documentElement.clientHeight || document.body.clientHeight;
        if (resize_h - 0 < client_h - 0) {
          //当软键盘弹起，在此处操作
          vm.visible = false;
        } else {
          //当软键盘收起，在此处操作
          vm.visible = true;
        }
        console.log("client_h", client_h);
      };

      document.body.addEventListener("focusin", this.hide);
      document.body.addEventListener("focusout", this.show);
    },
    show() {
      if (this.isIOS) {
        this.visible = true;
      }
    },
    hide() {
      if (this.isIOS) {
        this.visible = false;
      }
    }
  },
  beforeDestroy() {
    document.body.removeEventListener("focusin", this.hide);
    document.body.removeEventListener("focusout", this.show);
  }
};
</script>

<style lang="less">
.copyright {
  width: 60%;
  margin: 0 auto;
  padding: 20px;
  font-size: 13px;
  color: #333;
}
.copyright--fixed {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1;
  width: 100%;
  text-align: center;
  box-sizing: border-box;
}
.copyright__contact {
  display: block;
  color: #333;
  p {
    display: inline-block;
    vertical-align: middle;
  }
  img {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
    margin-left: 5px;
  }
}
</style>
