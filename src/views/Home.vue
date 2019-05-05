<template>
  <z-page id="home">
    <router-view/>
    <van-tabbar :value="topNavActive" slot="footer">
      <van-tabbar-item :to="{ name: 'Index' }">
        <span>计划首页</span>
        <img slot="icon" slot-scope="props" :src="props.active ? home : homeSelected">
      </van-tabbar-item>
      <van-tabbar-item :to="{ name: 'Task' }">
        <span>我的任务</span>
        <img slot="icon" slot-scope="props" :src="props.active ? task : taskSelected">
      </van-tabbar-item>
      <van-tabbar-item :to="{ name: 'Management' }">
        <span>我的管理</span>
        <img slot="icon" slot-scope="props" :src="props.active ? management : managementSelected">
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
      active: 0,
      ...Icons
    };
  },
  computed: {
    ...mapState("ppm/navigation", {
      topNavActive: state => state.topNavActive
    })
  }
};
</script>

