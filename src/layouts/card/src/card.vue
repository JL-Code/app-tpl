<template>
  <section class="z-card" :style="{borderRadius:radius}">
    <header class="z-card__header" v-if="$slots.header">
      <slot name="header"></slot>
    </header>
    <main class="z-card__body">
      <slot></slot>
    </main>
  </section>
</template>

<script>
export default {
  name: "ZCard",
  props: {
    radius: {
      type: String,
      default: "8px"
    }
  }
};
</script>
<style lang="less">
@import url("../../../style/base/fn.less");
.z-card {
  overflow: hidden;
  border: 1px solid @weuiLineColorLight;
  background-color: #fff;
  text-decoration: none;
}
.z-card__header {
  position: relative;
  padding: 14px 15px 10px;
  font-size: 13px;
  &::after {
    .setBottomLine();
  }
}
.z-card__body {
  height: 100%;
}
</style>
