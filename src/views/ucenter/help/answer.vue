<template>
  <z-page aqueduct>
    <van-nav-bar left-text="返回" left-arrow @click-left="back_" slot="header"/>
    <article class="article">
      <h1 class="article__topic" v-text="faq.Question"></h1>
      <p class="article__date">最近更新日期：{{faq.ModifiedOn}}</p>
      <section class="article__content" v-html="faq.Answer"></section>
      <footer class="article__actionbar" v-if="false">
        <van-button plain size="small">有帮助({{faq.Usable}})</van-button>&emsp;
        <van-button plain size="small">没帮助({{faq.Useless}})</van-button>
      </footer>
    </article>
  </z-page>
</template>

<script>
import RouterMixin from "@/mixins/router";
import util from "@/lib/util";

export default {
  name: "Answer",
  mixins: [RouterMixin],
  data() {
    return {
      faq: {}
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData: function() {
      let { title, guid } = this.$route.query;
      const url = "/api/OverallPlan/FAQDetail?faqId=" + guid;
      const loading = this.$toast.loading("加载中");
      this.$http
        .get(url)
        .then(res => {
          loading.clear();
          this.faq = res;
        })
        .catch(err => {
          loading.clear();
          console.log(err);
          this.$toast.fail("加载失败");
        });
    }
  }
};
</script>
<style lang="less" scoped>
.article {
  background-color: #ffffff;
  .article__topic {
    position: relative;
    padding: 15px;
    font-size: 14px;
    font-weight: bold;
    &::after {
      content: " ";
      position: absolute;
      z-index: 2;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 1px solid #ebedf0;
      margin: 0 15px;
      transform-origin: 0 100%;
      transform: scaleY(0.5);
    }
  }
}
.article__date {
  padding: 5px 15px;
  font-size: 13px;
  color: #888;
  text-align: left;
  line-height: 22px;
}
.article__content {
  padding: 15px;
  padding-top: 0;
  * {
    max-width: 100%;
    box-sizing: border-box;
    word-wrap: break-word;
  }
}
.article__actionbar {
  display: flex;
  justify-content: center;
  padding: 15px;
}
</style>
