<template>
  <div class="page-title">
    <span class="to-from" v-if="isChildren" @click="handleToFrom">
      {{ fromPageInfo.meta.title }}
      <span class="clearance">></span>
    </span>
    <span class="crumb-last">{{ pageTit }}</span>
  </div>
</template>

<script>
export default {
  name: "Nav",
  props: {},
  data() {
    return {
      isChildren: false, // 判断是否为页面内的点击
      pageTit: this.$route.meta.title, // 当前页面的title
      fromPageInfo: JSON.parse(sessionStorage.getItem("fromPageInfo")),
    };
  },
  watch: {
    $route(to, from) {
      console.log(to.meta,'watch')
      if (!to.meta.type) {
        this.isChildren = false;
        this.pageTit = to.meta.title;
      } else {
        // from  表示上一个页面的  但页面刷新 this.fromPageInfo 重新渲染值为空 故需将他存起来
        let fromFilter = {
          name: from.name,
          fullPath: from.fullPath,
          path: from.path,
          meta: from.meta,
        };
        sessionStorage.setItem("fromPageInfo", JSON.stringify(fromFilter));
        this.fromPageInfo = JSON.parse(sessionStorage.getItem("fromPageInfo"));
        this.isChildren = true;
        this.pageTit = to.meta.title;
      }
    },
  },
  created() {
    if (this.$route.meta.type) {
      if (this.$route.meta.type == "children") {
        this.isChildren = true;
      }
    } else {
      this.urlArr = [this.$route.meta.title];
    }
  },
  methods: {
    // 点击返回父页面
    handleToFrom: function () {
      let { fromPageInfo } = this;
      this.$router.push({
        path: fromPageInfo.fullPath,
      });
    },
  },
  beforeDestroy: function () {},
};
</script>

<style lang="scss" scoped>
.page-title {
  margin: 16px;

  .to-from {
    cursor: pointer;
    color: #666666;
    font-size: 14px;
  }

  .clearance {
    margin: 0 10px;
  }

  .crumb-last {
    font-family: PingFang SC Bold, PingFang SC Bold-Bold;
    font-weight: 700;
    font-size: 18px;
    color: #2F7E7D; // xj byyuwen
  }
}
</style>
