<template lang="html">
  <div
    class="list-view"
    :class="{'list-view--white':items.length==0}"
    :style="{height:computedHeight}"
  >
    <scroll
      ref="scroll"
      class="list-view__content"
      v-bind="$attrs"
      :pullDownConfig="options.pullDownRefresh"
      :pullUpload="options.pullUpload"
      @pullingUp="_onPullingUp"
      @pullingDown="_onPullingDown"
    >
      <div class="list-view__desc" v-if="$slots.desc">
        <slot name="desc"></slot>
      </div>
      <slot :items="items" v-if="items.length">
      </slot>
       <div class="loadmore__wrapper" v-else>
          <z-loadmore v-if="status=='loading'"></z-loadmore>
          <z-loadmore type="line" text="暂无数据" v-else-if="status=='done' || !items.length"></z-loadmore>
          <z-loadmore type="lineDot" v-else></z-loadmore>
        </div>
      <template v-slot:pullup="pullupProps">
       <div style="text-align:center;padding:10px 15px;font-size:13px;color:#999">没有更多了</div>
      </template>
    </scroll>
  </div>
</template>

<script>
import _ from "lodash";
// [vue-slim-better-scroll](https://wannaxiao.github.io/vue-slim-better-scroll/docs/dist/#props)

//  pullDownBefore: true, // 下拉之前
//       pullDownNow: false, // 正在下拉
//       pullDownStyle: '', // 下拉样式
//       pullUpNow: false, // 正在上拉
//       pullUpFinally: false, // true表示到了上拉加载到了最底部
//       isRebounding: false, // 正在回弹
//       bubbleY: 0, // 气泡y坐标
// 在下拉到松手的过程中，经历了三个状态：

// 当前手势滑动位置与初始位置差值大于零时，提示正在进行下拉刷新操作；
// 下拉到一定值时，显示松手释放后的操作提示；
// 下拉到达设定最大值松手时，执行回调，提示正在进行更新操作。
import settins from "@/settings";
import Scroll from "vue-slim-better-scroll";

const LOADING_TEXT = settins.copywriting.loadingText;

export default {
  name: "ListView",
  inheritAttrs: false,
  components: { Scroll },
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          pullDownRefresh: {
            stop: 40,
            threshold: 90,
            txt: "刷新成功"
          },
          pullUpLoad: {
            threshold: 100,
            txt: {
              more: "正在加载",
              noMore: "没有更多的数据"
            }
          }
        };
      }
    },
    // list-view 参数
    height: {
      type: [Number, String],
      default: "100%"
    },
    refreshDelay: {
      type: Number,
      default: 20
    },
    // 数据 参数
    url: {
      type: String,
      default: ""
    },
    queryParams: {
      type: Object,
      default: () => {
        return {};
      }
    },
    method: {
      type: String,
      default: "get"
    },
    // 分页属性
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 15
    }
  },
  data() {
    return {
      mode: "pullDownRefresh", // pullDownRefresh、pullUpLoad
      innerPage: 1,
      noMore: false,
      status: "loading", // loading --> done
      total: 0,
      items: []
    };
  },
  computed: {
    computedHeight() {
      if (typeof this.height === "number") {
        return this.height + " px";
      }
      return this.height;
    },
    pageCount() {
      return Math.ceil(this.total / this.limit);
    }
  },
  watch: {
    url(val) {},
    queryParams(params) {
      // this.reload(); TODO: 暂时不考虑加上参数变化自动重载数据 存在防抖问题和不需要立即预览问题。
    },
    page(val) {
      this.innerPage = val;
    },
    items: {
      handler(val) {
        setTimeout(() => {
          /**
           * refs: https://wannaxiao.github.io/vue-slim-better-scroll/docs/dist/#methods
           * (final:Boolean) 表明pullUp上拉加载是否到了最底部。下拉刷新成功后该值会自动 false。也可传入 false 手动声明不是最后一页
           */
          this.$nextTick(() => {
            this.$refs.scroll && this.$refs.scroll.update(this.noMore);
            if (val.length) {
              this.$refs.scroll && this.$refs.scroll.enable();
            } else {
              this.$refs.scroll && this.$refs.scroll.disable();
            }
          });
        }, this.refreshDelay);
      },
      immediate: true
    }
  },
  mounted() {
    if (this.url) {
      this._onPullingUp();
    } else {
      this.status = "done";
    }
  },
  methods: {
    /**
     * 重载数据
     */
    reload(options) {
      // console.log("reload", options);
      // 重置分页
      this.innerPage = 1;
      this.mode = "pullDownRefresh";
      this.$toast.loading({
        message: "加载中"
      });
      this.request(options);
    },
    /**
     *
     */
    request(options = {}) {
      // console.debug("request", options);
      var defaults = {
        page: this.innerPage,
        limit: this.limit
      };
      var params = Object.assign(
        defaults,
        _.cloneDeep(this.queryParams),
        options
      );
      if (!this.url) {
        console.error("list-view", "missing url");
        this.$nextTick(() => {
          this.$refs.scroll && this.$refs.scroll.update(true);
        });
      }
      // console.debug("request assign params:", params);
      // this.$toast.loading(LOADING_TEXT);
      this.status = "loading";
      this.loader(params);
    },
    /**
     * 加载器(负责发起http请求从远端加载数据 request的具体实现)
     */
    loader(params) {
      var obj =
        this.method == "post"
          ? params
          : {
              params
            };

      this.$http[this.method](this.url, obj)
        .then(res => {
          this.status = "done";
          // TODO: 需要优化处理数据加载成功和失败的场景
          if (res.ErrCode !== 0) {
            this.total = 0;
            return;
          }
          this.total = res.Total;
          if (this.mode === "pullDownRefresh") {
            this.items = res.Items || [];
          } else {
            if (this.limit != res.Items.length) {
              this.noMore = true;
            }
            this.items = this.items.concat(res.Items);
          }
          // console.debug(
          //   "list-view noMore（this.limit != res.Items.length）",
          //   this.limit != res.Items.length
          // );
          this.$toast.clear();
          this.$emit("load-success");
        })
        .catch(err => {
          this.noMore = true;
          this.status = "done";
          this.$toast.clear();
          console.error("list-view loader: ", err.message);
        });
    },
    _onPullingUp() {
      this.mode = "pullUpLoad";
      this.status = "loading";
      // TODO: 判断待优化 应改为首次加载不做赋值操作，从第二次开始赋值
      if (this.innerPage > this.pageCount) {
        this.innerPage = this.pageCount || 1;
      } else {
        this.innerPage++;
      }
      this.request({ page: this.innerPage });
      // console.debug("pullUpLoad");
    },
    _onPullingDown() {
      this.mode = "pullDownRefresh";
      this.status = "loading";
      this.innerPage = 1;
      this.noMore = false;
      this.request();
      // console.debug("pullDownRefresh");
    }
  }
};
</script>

<style lang="less">
@import url("../../../style/base/fn");
.list-view--white {
  background: #fff;
}
.list-view {
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  .pulldown-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
  }
}
.list-view__content {
  position: relative;
}
.default {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
}
.loadmore__wrapper {
  overflow: hidden;
}
</style>
