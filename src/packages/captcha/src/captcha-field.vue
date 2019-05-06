<template>
  <div>
    <van-field
      type="number"
      pattern="\d*"
      v-model="innerValue"
      center
      clearable
      v-bind="$attrs"
      v-on="$listeners"
      class="captcha-field"
    >
      <van-button
        class="button--primary"
        size="small"
        slot="button"
        :disabled="btnDisabled"
        :loading="btnLoading"
        @click.stop="_sendSmsAsync"
      >{{btnText}}</van-button>
    </van-field>
  </div>
</template>

<script>
const BTN_INIT_TEXT = "获取验证码";
const BTN_AGAIN_TEXT = "重新获取";
export default {
  name: "CaptchaField",
  inheritAttrs: false,
  props: {
    value: String,
    disabled: Boolean,
    beforeSend: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      innerValue: "",
      show: false,
      time: 60,
      btnText: BTN_INIT_TEXT,
      btnDisabled: false,
      btnLoading: false
    };
  },
  watch: {
    value(val) {
      this.innerValue = val;
    },
    innerValue(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    start() {
      this.startCountDown();
    },
    reset() {
      this.resetCountDown();
    },
    onInput(value) {
      let _captcha = this.innerValue;
      this.innerValue = _captcha + value;
    },
    onDelete() {
      let _captcha = this.innerValue.slice(0, this.innerValue.length - 1);
      this.innerValue = _captcha;
    },
    focus() {
      document.activeElement.blur(); //禁用手机自带键盘
      this.show = true;
    },
    blur() {
      this.show = false;
    },
    startCountDown() {
      const _this = this;
      let countDown = _this.time;
      _this.timer = setInterval(function() {
        _this.btnLoading = false;
        _this.btnText = `(${countDown})重新获取`;
        countDown--;
        if (countDown <= 0) {
          _this.resetCountDown();
        }
      }, 1000);
    },
    resetCountDown() {
      clearInterval(this.timer);
      this.btnDisabled = false;
      this.btnLoading = false;
      this.btnText = BTN_AGAIN_TEXT;
    },
    _disabled() {
      this.btnDisabled = true;
      this.btnLoading = true;
    },
    _enable() {
      this.btnDisabled = false;
      this.btnLoading = false;
    },
    async _sendSmsAsync() {
      this._disabled();
      if (
        typeof this.beforeSend == "function" &&
        (await this.beforeSend()) === false
      ) {
        this._enable();
        return;
      }
      this.start();
      this.$emit("send-sms");
    },
    _handleFocus() {
      this.$emit("focus");
    }
  }
};
</script>
<style lang="less">
.captcha-field.van-cell {
  padding: 7px 15px;
}
.captcha__button {
  border: none;
  box-sizing: border-box;
  height: 30px;
  padding: 0 8px;
  min-width: 60px;
  line-height: 28px;
  text-align: center;
}
</style>
