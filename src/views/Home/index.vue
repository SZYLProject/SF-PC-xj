<template>
  <div class="home">
    <header>
      <img class="home-logo" src="./../../assets/img/logo.png" alt />
      <Nav type="home" />
    </header>
    <div class="nav-box">
      <div class="home-title-box">
        <div>
          <p class="home-title">智能随访系统</p>
          <p class="home-subtitle">INTELLIGENT FOLLOW-UP SYSTEM</p>
        </div>
      </div>
      <div class="itme-all-box">
        <div
          class="itme-box routine-item"
          v-for="(menuItem, index) in userMenu"
          :key="index"
        >
          <div @click="menuItemClick(menuItem)">
            <div class="icon-box"></div>
            <div class="menu-name">
              <span>{{ menuItem.menuName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "@/components/Nav.vue";
import { getUserMenu } from "@/api/user";
import { logout, getUserInfo } from "@/api/user";
export default {
  name: "Home",
  components: { Nav },
  data() {
    return {
      userMenu: [],
    };
  },
  created() {
    // this.getUserFn();
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
    //获取用户菜单
    getMenu() {
      getUserMenu()
        .then((res) => {
          this.userMenu = res.data.userMenu;
        })
        .catch((error) => {
          console.error("getUserInfo", error);
        });
    },
    getUserFn() {
      getUserInfo()
        .then((res) => {
          sessionStorage.setItem("userData", JSON.stringify(res.data));
          this.getMenu();
        })
        .catch((error) => {
          console.error("getUserInfo", error);
          // alert(JSON.stringify(error))
          // this.logOutFn();
        });
    },
    logOutFn() {
      logout()
        .then((res) => {
          console.log(res.code);
          if (res.code == 200) {
            // alert(JSON.stringify(res))
            console.logt(JSON.stringify(res));
            window.localStorage.clear();
            window.location.href = res.data;
          } else {
            console.logt(JSON.stringify(res));
            // alert('推出失败');
            this.$message({
              type: "error",
              showClose: true,
              message: res.msg,
              center: true,
            });
          }
        })
        .catch((error) => {
          console.error("logout", error);
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
  background: url("./../../assets/img/homeBgImg.png");
  background-size: 100% 100%;

  header {
    padding: 1.067vh 1.0416vw;
    overflow: hidden;
    height: 6.403vh;
    line-height: 100%;

    img.home-logo {
      width: 13.541vw;
    }
  }

  .nav-box {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    width: 50%;
    height: 500px;
    margin: auto;
    bottom: 0;

    .home-title-box,
    .itme-all-box {
      color: #fff;
      text-align: center;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      height: 19.3229vw;
      width: 19.3229vw;
      background: #1d68ae;
      border-radius: 100%;
    }
    .home-title-box {
      & > div {
        position: absolute;
        width: auto;
        height: 8.004vh;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        z-index: 99;

        .home-title {
          font-size: 1.97916vw;
          font-weight: bold;
          margin-bottom: 0.8334vw;
        }

        .home-subtitle {
          font-size: 0.7291vw;
        }
      }
    }

    .itme-all-box {
      height: 38.90625vw;
      width: 38.90625vw;
      background: url(../../assets/img/modelsBg.png) no-repeat 0px 0px;
      background-size: 100% 100%;

      .itme-box {
        width: 8.02083vw;
        height: 8.02083vw;
        cursor: pointer;
        background: url(../../assets/img/itemBg.png) no-repeat 0px 0px;
        background-size: 100% 100%;
        padding: 0.7291vw;
        position: absolute;
        border-radius: 100%;
        font-size: 0.8334vw;

        & > div {
          width: 6.25vw;
          height: 6.25vw;
          border-radius: 100%;
          background-color: #2673ba;
          margin: 0.146vw;
          position: relative;
        }

        // 这个 hover 的效果用于展示 用户的权限  只有系统用户有点击该模块的访问权限才可以有这个 hover 效果  现在暂时没有这个字段
        & > div:hover {
          background-color: #1862a7;
        }

        .icon-box {
          width: 2.135vw;
          height: 2.135vw;
          margin: auto;
          position: absolute;
          left: 0;
          right: 0;
          top: 2.5vh;
        }

        .menu-name {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 2.7vh;
        }
      }

      .itme-box:nth-child(1) {
        left: 0;
        right: 0;
        top: 2.4572vh;
        margin: auto;

        .icon-box {
          background: url(../../assets/img/survival.png) no-repeat 0px 0px;
          background-size: 100% 100%;
        }
      }

      .itme-box:nth-child(2) {
        left: 3.6%;
        top: 30%;

        .icon-box {
          background: url(../../assets/img/routine.png) no-repeat 0px 0px;
          background-size: 100% 100%;
        }
      }

      .itme-box:nth-child(3) {
        right: 3.6%;
        top: 30%;

        .icon-box {
          background: url(../../assets/img/special.png) no-repeat 0px 0px;
          background-size: 100% 100%;
        }
      }

      .itme-box:nth-child(4) {
        left: 17.6%;
        bottom: 10.4%;

        .icon-box {
          background: url(../../assets/img/tumor.png) no-repeat 0px 0px;
          background-size: 100% 100%;
        }
      }

      .itme-box:nth-child(5) {
        right: 17.6%;
        bottom: 10.4%;

        .icon-box {
          background: url(../../assets/img/system.png) no-repeat 0px 0px;
          background-size: 100% 100%;
        }
      }
    }
  }
}
</style>
