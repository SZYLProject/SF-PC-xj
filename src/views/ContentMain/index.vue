<template>
  <div style="height:100%;">
    <Nav />
    <div class="content-main">
      <div class="nav-menu">
        <!-- :default-active="this.$route.path"
        :default-active="currentMenu"-->
        <el-menu :default-active="this.$route.path" id="menu">
          <Menu :menu-list="list" :props="defaultProps" @getmenu="onGetMenu" />
        </el-menu>
      </div>
      <div id="main" class="main-content">
				<PageTitle />
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "@/components/Nav.vue";
import Menu from "@/components/Menu.vue";
import PageTitle from "@/components/PageTitle.vue";

export default {
  name: "ContentMain",
  components: {
    Nav,
    Menu,
		PageTitle,
  },
  watch: {
    $route(to, from) {
      this.getCurrentMenu();
    },
  },
  data() {
    return {
      currentMenu: "",
      defaultProps: {
        children: "child",
        label: "menuName",
        index: "menuUrl",
      },
      list: [],
    };
  },
  created() {
    let menu = localStorage.getItem("menu");
    this.list = JSON.parse(menu);
  },
  methods: {
    onGetMenu(item) {
      this.$router.push({
        path: item.menuUrl,
        query: {
          t: new Date().getTime(),
        },
      });
    },
    getCurrentMenu() {
      // 获取当前页面 菜单刷新后能自动选中
      let currentUrl = window.location.href;
      let currentPage = currentUrl.split("/")[3].replace("#", "");
      // console.log("currentUrl", currentUrl, "currentUrl", currentPage);
      this.currentMenu = currentPage;
    },
  },
};
</script>
<style lang="scss">
.content-main {
  display: flex;
  height: calc(100% - 60px);
  width: 100%;
  position: relative;
  overflow: hidden;
	margin-top: 60px;
  .nav-menu {
    width: 200px;
    .el-menu-item {
      color: #666666;
    }
    .el-menu-item:hover {
      color: #317F7E; // 主题修改yuwen
      background: #D5E5E5;
    }
    .el-menu-item.is-active {
      color: #317F7E; // 主题修改yuwen
      background: #D5E5E5;
    }
  }
  .main-content {
    flex: 1;
    // background: #e8f1fa;
    background: #EAF2F2; // 主题修改yuwen
    overflow: auto;
  }
}
</style>

