<template>
  <z-page id="home">
    <router-view/>
    <van-tabbar :value="active" slot="footer">
      <van-tabbar-item :to="{ name: 'Index' }">
        <span>计划首页</span>
        <img slot="icon" slot-scope="props" :src="props.active ? home : homeSelected">
      </van-tabbar-item>
      <van-tabbar-item :to="{ name :'UCenter'}">
        <span>我的信息</span>
        <img slot="icon" slot-scope="props" :src="props.active ? information : informationSelected">
      </van-tabbar-item>
    </van-tabbar>
  </z-page>
</template>

<script>
import { mapState } from "vuex";
import Icons from "../assets/home/base64";
export default {
  name: "Home",
  data() {
    return {
      ...Icons
    };
  },
  computed: {
    ...mapState("framework/navigation", {
      active: state => state.globalTabbarActive
    })
  }
};
</script>

