<template>
  <a href="javascript:void(0)" v-if="external" @click="jumpLink(url)">
    <slot></slot>
  </a>
  <router-link v-else class="navigator" :to="routeData" @click="onClick(routeData)">
    <slot></slot>
  </router-link>
</template>

<script>
import { Base64 } from "js-base64";
export default {
  name: "Navigator",
  props: {
    // URL地址
    url: String,
    // `external` 外部链接
    external: {
      type: Boolean,
      default: false
    },
    name: String,
    path: String,
    query: [String, Object],
    to: {
      type: [Object, String],
      default: null
    }
  },
  data() {
    return {};
  },
  computed: {
    routeData() {
      let data = {};
      if (this.to) {
        data = this.to;
      } else {
        if (this.query) {
          if (typeof this.query === "string") {
            let query = JSON.parse(this.query);
            data.query = query;
          }
          data.query = this.query;
        }
      }
      if (this.path) data.path = this.path;
      if (this.name) data.name = this.name;

      return data;
    }
  },
  methods: {
    jumpLink(url) {
      try {
        let returnUrl = Base64.encode(window.location.href.toLocaleLowerCase());
        this.$toast.loading("正在跳转中");
        this.onClick();
        window.location.href = `${url}&returnUrl=${returnUrl}`;
      } catch (error) {
        this.$toast.clear();
        this.$dialog.alert({
          message: error.message
        });
      }
    },
    onClick(params) {
      this.$emit("click", params || {});
    }
  }
};
</script>

<style lang="less">
</style>
