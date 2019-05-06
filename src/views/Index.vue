<template>
  <div style="height:100%">
    <div class="framework-index">
      <div class="framework-index--bg"></div>
      <div class="framework-index__hd">
        <div class="hello__box">
          <z-avatar size="45" v-if="userInfo.Avatar!='' && userInfo.Avatar!=null">
            <img :src="userInfo.Avatar" alt>
          </z-avatar>
          <z-avatar class="head-avatar" size="45" v-else color="rgb(103,203,252)" :text="lastName"></z-avatar>
          <div style="position:absolute; left:70px;">
            <p class="hello__text">{{hello}}</p>
            <p class="hello__text hello__time">{{today}}</p>
          </div>
        </div>
        <div class="hello__msg" @click="pierceThroughMsg">
          <i class="iconfont icon-msg"></i>
        </div>
      </div>
    </div>
    <scroll
      ref="scroll"
      style="height:calc(100% - 50px);"
      class="framework-cards"
      :pullDownConfig="pullDownRefresh"
      @pullingDown="getHomeDataCollection"
      :pullUp="false"
    >
      <!-- 快捷方式入口 -->
      <z-card class="framework-card__item" style="height:222px;border-radius: 8px;">
        <van-loading
          v-if="entranceLoading"
          type="spinner"
          style="margin:0 auto;line-height:250px;"
        />
        <van-swipe>
          <van-swipe-item v-for="(data,index) in entrances" :key="index">
            <router-link
              v-for="(entrance,index_item) in data.Items"
              :key="index_item"
              :to="{ name: entrance.Route, query: JSON.parse(entrance.Parameter) }"
              class="entrance"
            >
              <div class="entrance-box" @click="urlquery(entrance.Parameter)">
                <img :src="entrance.Icon" class="entrance__img">
                <i
                  v-if="entrance.BubbleCnt !== 0"
                  class="entrance__msg"
                  :style="'background-color:'+entrance.BubbleColour"
                >{{ entrance.BubbleCnt > 99 ? "99+" : entrance.BubbleCnt }}</i>
              </div>
              <p class="entrance__text" v-text="entrance.Name"></p>
            </router-link>
          </van-swipe-item>
        </van-swipe>
      </z-card>
      <!-- 我负责的任务 -->
      <z-card class="framework-card__item" style="max-height:166px;">
        <van-loading
          v-if="responsibleLoading"
          type="spinner"
          style="margin:0 auto;line-height:200px;"
        />
        <template v-else>
          <div slot="header" class="space-around" @click="goToTask(0)">
            <div style="width:70%;font-weight: bold;position: relative;">
              <span class="list__tag"></span>
              {{responsibleTltle}}
            </div>
            <div style="width:30%;text-align:right;font-weight: bold">
              {{responsibleCnt}}项
              <van-icon name="arrow"/>
            </div>
          </div>
          <div v-if="responsibleTask.length">
            <div
              class="framework-index__list-row"
              v-for="(task, index) in responsibleTask"
              :key="index"
              @click="goToTaskInf(task)"
            >
              <div v-if="task.WarningColor=='red'" class="space-around">
                <div class="framework-index__row-title">{{task.TaskName}}</div>
                <div class="framework-index__row-extend">
                  <van-tag round type="danger" class="framework-index__list-tag">{{task.RightLabel}}</van-tag>
                  <van-icon name="arrow"/>
                </div>
              </div>
              <div v-else-if="task.WarningColor=='yellow'" class="space-around">
                <div class="framework-index__row-title">{{task.TaskName}}</div>
                <div class="framework-index__row-extend">
                  <van-tag
                    round
                    type="danger"
                    color="yellow"
                    class="framework-index__list-tag"
                    text-color="black"
                  >{{task.RightLabel}}</van-tag>
                  <van-icon name="arrow"/>
                </div>
              </div>
              <div v-else-if="task.WarningColor=='white'" class="space-around">
                <div class="framework-index__row-title">{{task.TaskName}}</div>
                <div class="framework-index__row-extend">
                  {{task.RightLabel}}
                  <van-icon name="arrow"/>
                </div>
              </div>
              <div v-else class="space-around">
                <div class="framework-index__row-title">{{task.TaskName}}</div>
                <div class="framework-index__row-extend">
                  <van-tag
                    round
                    type="danger"
                    :color="task.WarningColor"
                    class="framework-index__list-tag"
                    text-color="black"
                  >{{task.RightLabel}}</van-tag>
                  <van-icon name="arrow"/>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="list--nodata">暂无数据</div>
        </template>
      </z-card>
      <!-- 我关注的任务 -->
      <z-card class="framework-card__item" style="max-height:166px;">
        <van-loading v-if="watchLoading" type="spinner" style="margin:0 auto;line-height:200px;"/>
        <template v-else>
          <div slot="header" class="space-around" @click="goToManagement(4)">
            <div style="width:70%;font-weight: bold;position: relative;">
              <span class="list__tag"></span>
              {{attentionTitle}}
            </div>
            <div style="width:30%;text-align:right;font-weight: bold">
              {{attentionCnt}}项
              <van-icon name="arrow"/>
            </div>
          </div>
          <div v-if="attentionTask.length">
            <div
              class="framework-index__list-row"
              v-for="(task, index) in attentionTask"
              :key="index"
              @click="goToTaskInf(task)"
            >
              <div v-if="task.WarningColor=='red'" class="space-around">
                <div class="framework-index__row-title">{{task.TaskName}}</div>
                <div class="framework-index__row-extend">
                  <van-tag round type="danger" class="framework-index__list-tag">{{task.RightLabel}}</van-tag>
                  <van-icon name="arrow"/>
                </div>
              </div>
              <div v-else-if="task.WarningColor=='yellow'" class="space-around">
                <div class="framework-index__row-title">{{task.TaskName}}</div>
                <div class="framework-index__row-extend">
                  <van-tag
                    round
                    type="danger"
                    text-color="black"
                    color="yellow"
                    class="framework-index__list-tag"
                  >{{task.RightLabel}}</van-tag>
                  <van-icon name="arrow"/>
                </div>
              </div>
              <div v-else-if="task.WarningColor=='white'" class="space-around">
                <div class="framework-index__row-title">{{task.RightLabel}}</div>
                <div class="framework-index__row-extend">
                  {{task.RightLabel}}
                  <van-icon name="arrow"/>
                </div>
              </div>
              <div v-else class="space-around">
                <div class="framework-index__row-title">{{task.TaskName}}</div>
                <div class="framework-index__row-extend">
                  <van-tag
                    round
                    type="danger"
                    :color="task.WarningColor"
                    class="framework-index__list-tag"
                    text-color="black"
                  >{{task.RightLabel}}</van-tag>
                  <van-icon name="arrow"/>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="list--nodata">暂无数据</div>
        </template>
      </z-card>
    </scroll>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import dateformat from "dateformat";
import Scroll from "vue-slim-better-scroll";
import RouterMixin from "@/mixins/router";

export default {
  name: "Index",
  mixins: [RouterMixin],
  components: { Scroll },
  data() {
    return {
      isLoading: false,
      entranceLoading: true,
      responsibleLoading: true,
      watchLoading: true,
      finished: false,
      entrances: [],
      responsibleTltle: "",
      responsibleCnt: 0,
      responsibleTask: [],
      attentionTitle: "",
      attentionCnt: 0,
      attentionTask: [],
      pullDownRefresh: {
        threshold: 60,
        stop: 40,
        txt: "刷新成功"
      }
    };
  },
  computed: {
    ...mapState("framework/user", {
      userInfo: state => state.info
    }),
    hello() {
      return `你好，${this.userInfo.UserName}`;
    },
    lastName() {
      return this.userInfo.UserName
        ? this.userInfo.UserName.substring(
            this.userInfo.UserName.length,
            this.userInfo.UserName.length - 3
          )
        : "";
    },
    today() {
      var weeks = [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日"
      ];
      var today = Date.now();
      var isoDate = dateformat(today, "yyyy-mm-dd");
      var week = dateformat(today, "N");
      var week_cn = weeks[week - 1];
      return isoDate + " " + week_cn;
    }
  },
  mounted() {
    this.getHomeDataCollection();
  },
  methods: {
    ...mapMutations("framework/navigation", [
      "setMyTaskActive",
      "setManagementActive"
    ]),
    //获取首页数据集
    getHomeDataCollection() {
      const _url = "/api/OverallPlan/HomeDataCollection";
      this.$http
        .get(_url)
        .then(res => {
          if (res.ErrCode == 0) {
            //快捷入口
            this.entranceLoading = false;
            this.entrances = res.data.QuickEntry;

            //我负责的任务
            this.responsibleLoading = false;
            this.responsibleTltle = res.data.ResponsibleTask.Title;
            this.responsibleCnt = res.data.ResponsibleTask.Cnt;
            this.responsibleTask = res.data.ResponsibleTask.ResponsibleTask;

            //我关注的任务
            this.watchLoading = false;
            this.attentionTitle = res.data.FocusTask.Title;
            this.attentionCnt = res.data.FocusTask.Cnt;
            this.attentionTask = res.data.FocusTask.FocusTask;
          }
          this.$refs.scroll.update(false);
        })
        .catch(err => {
          console.log(err);
          this.$toast.fail("加载失败");
        });
    },
    //穿透
    goToTask(active) {
      this.$router.push({ name: "Task" });
      this.setMyTaskActive(active);
    },
    goToManagement(active) {
      this.$router.push({ name: "Management" });
      this.setManagementActive(active);
    },
    urlquery(para) {
      var ret = JSON.parse(para);
      this.setMyTaskActive(ret.myTaskActive);
      this.setManagementActive(ret.managementActive);
    },
    goToTaskInf(parameter) {
      this.$router.push({
        name: parameter.Route,
        query: JSON.parse(parameter.Parameter)
      });
    },
    pierceThroughMsg() {
      this.$router.push({
        name: "Default",
        query: { content: "功能正在开发中,请联系陈丽" }
      });
    }
  }
};
</script>

<style lang="less" >
@import url("../style/base/fn.less");
.framework-index {
  position: relative;
}
.framework-index__hd {
  display: flex;
  height: 50px;
  width: 100%;
  color: #ffffff;
}
.framework-index--bg {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 160px;
  border-radius: 0 0 20px 20px;
  background-image: linear-gradient(0deg, #2275ef 23%, #22b5ef);
}
.hello__box {
  display: flex;
  flex: 1;
  padding-left: 15px;
  //flex-direction: column;
  align-items: center;
}
.hello__text {
  padding-top: 5px;
  font-size: 14px;
  line-height: 1.6;
  &:last-child {
    padding-top: 0;
  }
}
.hello__time {
  font-size: 11px;
  color: #f8f8f8;
}
.hello__msg {
  flex: 1;
  padding: 8px 15px 0px 0px;
  text-align: right;
  font-size: 24px;
  color: #ddd;
}
.entrance {
  position: relative;
  display: inline-block;
  width: 25%;
  padding: 8px 0;
  box-sizing: border-box;
}
.entrance__text {
  text-align: center;
  font-size: 12px;
  line-height: 1.6;
  margin-top: 3px;
  color: #333;
}
.entrance-box {
  position: relative;
  width: 36px;
  height: 36px;
  margin: 0 auto;
}
.entrance__img {
  display: block;
  width: 100%;
  height: 100%;
}
.entrance__msg {
  position: absolute;
  top: -0.4em;
  right: -0.4em;
  display: inline-block;
  padding: 0.15em 0.4em;
  min-width: 8px;
  border-radius: 18px;
  color: #ffffff;
  line-height: 1.2;
  text-align: center;
  font-size: 12px;
  vertical-align: middle;
}
.list--nodata {
  height: 100px;
  line-height: 100px;
  text-align: center;
  color: #666;
  font-size: 14px;
}
.van-cell__value {
  width: 5%;
}
.framework-index__list-row {
  position: relative;
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
  &::after {
    .setBottomLine();
  }
  &:last-child::after {
    display: none;
  }
}
.framework-index__row-title {
  width: 65%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
}
.framework-index__row-msg--overdue {
  width: 40px;
  height: 20px;
  background-color: red;
  position: absolute;
  top: 8px;
  right: 20px;
  border-radius: 20px;
  text-align: center;
  line-height: 20px;
}
.framework-index__row-msg--warning {
  width: 40px;
  height: 20px;
  background-color: yellow;
  position: absolute;
  top: 8px;
  right: 20px;
  border-radius: 20px;
  text-align: center;
  line-height: 20px;
}
.framework-index__row-extend {
  width: 35%;
  text-align: right;
  position: relative;
  font-size: 12px;
}

.framework-cards {
  padding: 0 8px 8px 8px;
  display: flex;
  flex-direction: column;
}
.framework-card__item {
  font-size: 14px;
  margin-bottom: 5px;
  &:last-child {
    margin-bottom: 0;
  }
}
.space-around {
  display: flex;
  justify-content: space-around;
}
.framework-index__list-tag {
  min-width: 38px;
  text-align: center;
}
.list__tag {
  width: 4px;
  height: 14px;
  border-radius: 2px;
  background-color: #508af1;
  display: inline-block;
  position: absolute;
  left: -5px;
  top: 2px;
}
.head-avatar {
  .headline {
    font-size: 12px;
  }
}
</style>
