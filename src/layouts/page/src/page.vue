<template>
  <div class="z-page">
    <header class="z-page__hd" v-if="$slots.header">
      <slot name="header"></slot>
    </header>
    <main class="z-page__bd" :class="bdClassList" :style="{backgroundColor:color}">
      <slot></slot>
    </main>
    <footer class="z-page__ft" v-if="$slots.footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
export default {
  name: "ZPage",
  props: {
    /**
     * 水渠
     */
    aqueduct: Boolean,
    /**
     * 背景色
     */
    color: {
      type: String
    },
    title: {
      type: String,
      default: ""
    }
  },
  computed: {
    bdClassList() {
      return {
        "z-page__bd--aqueduct": this.aqueduct
      };
    }
  }
};
</script>

<style lang="less" >
@import url("../../../style/base/fn.less");
.z-page {
  position: absolute;
  z-index: 10;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .z-page__hd {
    min-height: 44px;
  }
  .z-page__bd {
    position: relative;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .z-page__bd--aqueduct {
    padding-top: 10px;
  }
  .z-page__ft {
    min-height: 50px;
  }
}
</style>
