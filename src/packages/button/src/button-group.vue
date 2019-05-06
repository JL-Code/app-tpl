<template>
  <div class="z-button-group">
    <slot></slot>
  </div>
</template>

<script>
export default { name: "ZButtonGroup" };
</script>

<style lang="less">
.z-button-group {
  display: flex;
  justify-content: space-around;
  margin: 10px;
}
</style>
