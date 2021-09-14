<template>
  <div class="home">
    <Nav type="home" />
    <img class="home-logo" src="./../../assets/img/logonew.png" alt />
    <p class="home-title">智能随访系统</p>
    <p class="home-subtitle">INTELLIGENT FOLLOW-UP SYSTEM</p>
    <div class="nav-box">
      <div
        class="itme-box routine-item"
        v-for="(menuItem, index) in userMenu"
        :key="index"
      >
        <div @click="menuItemClick(menuItem)">
          <div class="icon-box">
            <span class="iconfont"></span>
          </div>
          <div>
            <span>{{ menuItem.menuName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "@/components/Nav.vue";
import { getUserMenu } from "@/api/user";
//  新疆
export default {
  name: "Home",
  components: { Nav },
  data() {
    return {
      userMenu: [],
    };
  },
  created() {
    console.log(this.userData);
    this.getMenu();
  },
  methods: {
    menuItemClick(menuItemVal) {
      let arr = menuItemVal.child;
      arr.sort((a, b) => {
        return a.menuOrder - b.menuOrder;
      });
      localStorage.setItem("menu", JSON.stringify(arr));
      this.$router.push({
        path: menuItemVal.child[0].menuUrl,
        query: {
          t: new Date().getTime(),
        },
      });
    },
    getMenu() {
      //获取用户菜单
      getUserMenu()
        .then((res) => {
          this.userMenu = res.data.userMenu;
          console.log("getUserInfo", res);
        })
        .catch((error) => {
          console.error("getUserInfo", error);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/mixin.scss";
@import "~@/assets/scss/variables.scss";
.home {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: url("./../../assets/img/111.png");
  background-size: 100% 100%;
  text-align: center;
  overflow: hidden;
  .home-logo,
  .home-title,
  .home-subtitle {
    position: absolute;
    left: 50%;
    color: #feffff;
  }
  .home-logo {
    top: 18%;
    // margin-left: -280px;
    margin-left: -252px;
  }
  .home-title {
    top: 36%;
    font-size: 50px;
    line-height: 50px;
    font-weight: bold;
    margin-left: -150px;
  }
  .home-subtitle {
    top: 44%;
    margin-left: -150px;
    font-size: 18px;
    line-height: 20px;
  }
  .nav-box {
    position: absolute;
    top: 65%;
    width: 100%;
    .itme-box {
      cursor: pointer;
      margin: 0 20px;
      background: rgba(47, 126, 125, 0.6);  // xj byyuwen
      padding: 20px 36px;
      display: inline-block;
      color: #feffff;
      .icon-box {
        font-size: 60px;
        height: 60px;
        width: 60px;
        margin-bottom: 20px;
        background: url(../../assets/img/special.png) no-repeat 0px 0px;
        background-size: 100% 100%;
      }
    }
    .itme-box:nth-child(1) {
      .icon-box {
        background: url(../../assets/img/survival.png) no-repeat 0px 0px;
        background-size: 100% 100%;
      }
    }

    .itme-box:nth-child(2) {
      .icon-box {
        background: url(../../assets/img/routine.png) no-repeat 0px 0px;
        background-size: 100% 100%;
      }
    }

    .itme-box:nth-child(3) {
      .icon-box {
        background: url(../../assets/img/special.png) no-repeat 0px 0px;
        background-size: 100% 100%;
      }
    }

    .itme-box:nth-child(4) {
      .icon-box {
        background: url(../../assets/img/tumor.png) no-repeat 0px 0px;
        background-size: 100% 100%;
      }
    }

    .itme-box:nth-child(5) {
      .icon-box {
        background: url(../../assets/img/system.png) no-repeat 0px 0px;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
