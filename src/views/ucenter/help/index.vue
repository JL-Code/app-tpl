<template>
  <z-page aqueduct>
    <van-nav-bar slot="header" left-text="返回" title="帮助中心" left-arrow @click-left="back_"/>
    <list-view url="/api/OverallPlan/FAQ?systemGUID=7442A641-A7FC-4C90-B938-20E32A1A765A">
      <template v-slot="props">
        <van-cell-group v-if="props.items.length">
          <van-cell
            :title="item.Question"
            is-link
            v-for="item in props.items"
            :to="{
            name: 'Answer',
            query: {
              guid: item.FAQGUID
            }
          }"
            :key="item.FAQGUID"
          />
        </van-cell-group>
      </template>
    </list-view>
  </z-page>
</template>

<script>
import routerMixin from "@/mixins/router";
export default {
  name: "Help",
  mixins: [routerMixin],
  data() {
    return {};
  }
};
</script>
