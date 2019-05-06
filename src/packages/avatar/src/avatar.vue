<template>
  <div class="z-avatar" :class="classList" :style="styleObj">
    <slot>
      <span class="white--text headline">{{text}}</span>
    </slot>
  </div>
</template>

<script>
export default {
  name: "ZAvatar",
  props: {
    // 删除边框弧度
    tile: {
      type: Boolean,
      default: false
    },
    // 控件背景色
    color: {
      type: String,
      default: "#f8f8f8"
    },
    // 设置元素的高度和宽度
    size: {
      type: [String, Number],
      default: 48
    },
    // 文案
    text: {
      type: String
    },
    // 小版 medium / small / mini
    mini: Boolean
  },
  computed: {
    classList() {
      return {
        "z-avatar--tile": this.tile,
        "z-avatar--mini": this.mini
      };
    },
    styleObj() {
      return {
        height: `${this.size}px`,
        width: `${this.size}px`,
        backgroundColor: this.color
      };
    }
  }
};
</script>

<style lang="less">
.z-avatar {
  align-items: center;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  position: relative;
  text-align: center;
  vertical-align: middle;
  img {
    display: inline-flex;
    height: inherit;
    width: inherit;
    border-radius: 50%;
    border-style: none;
  }
}
.z-avatar--tile {
  border-radius: 0;
}
.z-avatar--mini {
  .headline {
    font-size: 10px;
    line-height: 20px;
  }
  width: 32px !important;
  height: 32px !important;
}
.white--text {
  caret-color: #fff;
  color: #fff;
}
.headline {
  font-size: 14px;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: normal;
}
</style>
