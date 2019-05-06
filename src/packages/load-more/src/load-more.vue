<template>
  <div class="z-loadmore" :class="classList">
    <i class="z-loading" v-if="type == 'default'"></i>
    <span class="z-loadmore__tips">{{text}}</span>
  </div>
</template>

<script>
export default {
  name: "ZLoadmore",
  props: {
    type: {
      type: String,
      default: "default" //default line、lineDot
    },
    text: {
      type: String,
      default: "正在加载"
    }
  },
  computed: {
    classList() {
      return {
        "z-loadmore--line": this.type == "line" || this.type == "lineDot",
        "z-loadmore--dot": this.type == "lineDot"
      };
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../../style/base/fn");
.z-loadmore {
  width: 65%;
  margin: 1.5em auto;
  line-height: 1.6em;
  font-size: 14px;
  text-align: center;
}

.z-loadmore--line {
  border-top: 1px solid #e5e5e5;
  margin-top: 2.4em;
  .z-loadmore__tips {
    position: relative;
    top: -0.9em;
    padding: 0 0.55em;
    background-color: #fff;
    color: #999;
  }
}
.z-loadmore_dot {
  .z-loadmore__tips {
    padding: 0 0.16em;
    &:before {
      content: " ";
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: @weuiLineColorLight;
      display: inline-block;
      position: relative;
      vertical-align: 0;
      top: -0.16em;
    }
  }
}
.z-loadmore__tips {
  display: inline-block;
  vertical-align: middle;
}

.z-loading {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  animation: weuiLoading 1s steps(12, end) infinite;
  background: transparent
    url("data:image/svg+xml;charset=utf8, %3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 100 100'%3E%3Cpath fill='none' d='M0 0h100v100H0z'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23E9E9E9' rx='5' ry='5' transform='translate(0 -30)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23989697' rx='5' ry='5' transform='rotate(30 105.98 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%239B999A' rx='5' ry='5' transform='rotate(60 75.98 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23A3A1A2' rx='5' ry='5' transform='rotate(90 65 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23ABA9AA' rx='5' ry='5' transform='rotate(120 58.66 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23B2B2B2' rx='5' ry='5' transform='rotate(150 54.02 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23BAB8B9' rx='5' ry='5' transform='rotate(180 50 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23C2C0C1' rx='5' ry='5' transform='rotate(-150 45.98 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23CBCBCB' rx='5' ry='5' transform='rotate(-120 41.34 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23D2D2D2' rx='5' ry='5' transform='rotate(-90 35 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23DADADA' rx='5' ry='5' transform='rotate(-60 24.02 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23E2E2E2' rx='5' ry='5' transform='rotate(-30 -5.98 65)'/%3E%3C/svg%3E")
    no-repeat;
  background-size: 100%;
}

@-webkit-keyframes weuiLoading {
  0% {
    transform: rotate3d(0, 0, 1, 0deg);
  }

  100% {
    transform: rotate3d(0, 0, 1, 360deg);
  }
}

@keyframes weuiLoading {
  0% {
    transform: rotate3d(0, 0, 1, 0deg);
  }

  100% {
    transform: rotate3d(0, 0, 1, 360deg);
  }
}
</style>
