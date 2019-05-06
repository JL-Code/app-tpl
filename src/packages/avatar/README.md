# Avatar 组件

简单实例代码：

```html
 <div class="avatar-demo">
      <!-- 使用图片 -->
      <!-- 控件背景色默认#f8f8f8 -->
      <z-avatar>
        <img src="https://vuetifyjs.com/apple-touch-icon-180x180.png" alt>
      </z-avatar>
      <z-avatar>
        <img src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460" alt>
      </z-avatar>
      <!-- 去掉border-radius -->
      <z-avatar tile>
        <img src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460" alt>
      </z-avatar>
      <!-- 文字头像 -->
      <z-avatar color="#009688" text="蒋勇"></z-avatar>
      <z-avatar style="background-color:#f44336">
        <span class="white--text headline">芯怡</span>
      </z-avatar>
      <!-- 大号头像 -->
      <z-avatar style="background-color:#f44336" size="60">
        <span class="white--text headline">大号</span>
      </z-avatar>
      <!-- 小号头像 -->
      <z-avatar style="background-color:#f44336" mini>
        <span class="white--text headline">小号</span>
      </z-avatar>
    </div>
```