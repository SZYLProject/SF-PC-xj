<template>
  <div
    id="nav"
    :style="{
      background: type === 'home' ? 'none' : '#2F7E7D',
      paddingRight: type === 'home' ? '1.0416vw' : '0',
    }"
  >
    <el-row>
      <el-col :span="12" class="system-name" v-show="type === 'notHome'">
        <img
          src="./../assets/img/logonew.png"
          alt
          style="height: 40px; vertical-align: middle"
        />
        |
        <span>智能随访系统</span>
      </el-col>
      <el-col
        :span="type === 'home' ? 24 : 12"
        class="text-right user-box"
        :style="{ paddingRight: type === 'home' ? '1.0416vw' : '30px' }"
      >
        <router-link
          :to="{ path: '/' }"
          class="back-home"
          v-show="type !== 'home'"
        >
          <i class="el-icon-s-home" title="返回首页"><span style="margin-left: 8px;">返回首页</span></i>
          <!-- <span>返回首页</span> -->
        </router-link>
        <el-dropdown :hide-on-click="false">
          <span class="el-dropdown-link user-name">
            <span>您好,</span>
            <span>{{ userData.userName }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item>
                <router-link :to="{ path: '/'}" >
                  首页
                </router-link>
            </el-dropdown-item>-->
            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <span class="el-icon-s-tools settings-icon"></span> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { parseTime } from "@/utils/index.js";

import { logout } from "@/api/user";
export default {
  name: "Nav",
  props: {
    type: {
      type: String,
      default() {
        return "notHome";
      },
    },
  },
  data() {
    return {
      userData: {
        userName: "管理员x",
      },
    };
  },
  mounted() {},
  created() {
    this.getIsView();
  },
  methods: {
    //获取用户信息
    getIsView() {
      let getUserData = sessionStorage.getItem("userData");
      if (getUserData != null) {
        this.userData = JSON.parse(getUserData);
      }

      //   this.userData = JSON.parse(sessionStorage.getItem("userData"));
    },
    logout() {
      // alert("logout");
      // var logOut = () => {
      logout()
        .then((res) => {
          console.log("logout", res);
          if (res.code == 200) {
            window.localStorage.clear();
            window.location.href = res.data;
          } else {
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
      // }
    },
  },
  beforeDestroy: function () {},
};
</script>

<style lang="scss">
.back-home {
  margin-right: 16px;

  i {
    font-size: 24px;
  }

  span {
    font-size: 14px;
  }
}

#nav {
  width: 100%;
  height: 60px;
  line-height: 60px;
  // background: #2476c2;
  color: #feffff;
  position: absolute;
  z-index: 99;
  top: 0;

  .system-name {
    padding-left: 1.0416vw;
    font-size: 18px;
    font-family: PingFang SC Bold, PingFang SC Bold-Bold;
    // font-weight: 700;
  }

  .user-box {
    text-align: right;

    .user-name {
      cursor: pointer;
      color: #feffff;

      span {
        font-size: 16px;
        font-family: PingFang SC Medium, PingFang SC Medium-Medium;
        font-weight: 500;
      }
    }

    .el-dropdown {
      height: 18px;
      line-height: 18px;
    }

    i.el-icon-arrow-down.el-icon--right {
      font-size: 16px;
    }

    .settings-icon {
      font-size: 16px;
      margin-left: 0.5208vw;
    }
  }
}
</style>
