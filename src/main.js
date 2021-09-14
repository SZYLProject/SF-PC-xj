import Vue from "vue";
import ElementUI from "element-ui";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import "element-ui/lib/theme-chalk/index.css";
// import zhLocale from "element-ui/lib/locale/lang/zh-CN"; // 中文
import "@/assets/scss/index.scss"; // global css
import "@/assets/Iconfont/iconfont.css";

import axios from 'axios'

import rules from '@/utils/rules'

Vue.use(ElementUI)

Vue.config.productionTip = false

import {
  logout,
  getUserInfo
} from "./api/user";
//获取用户信息
getUserInfo().then(res => {
  sessionStorage.setItem("userData", JSON.stringify(res.data));
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')

}).catch(error => {
  console.error('getUserInfo', error)
  logOut();
});
//退出
var logOut = () => {
  logout().then(res => {
    console.log('logout', res)
    if (res.code == 200) {
      window.localStorage.clear()
      window.location.href = res.data;
    } else {
      this.$message({
        type: 'error',
        showClose: true,
        message: res.msg,
        center: true
      });
    }
  }).catch(error => {
    console.error('logout', error)
  });
}

Vue.prototype.RULE = rules
Vue.prototype.$ajax = axios // 导入 下载
Vue.prototype.VIEW360 = 'http://192.168.1.195:18080' // 重庆



// http://192.168.1.195:18080/#/360View/0257852/visit
// http://192.168.1.195:18080/vinci-web/api/forEdc/getPersonOverviewByIdCard?idCardNo=512222196412185098
// Vue.prototype.VIEW360 = 'http://112.80.40.2:58080'  // 北京

Vue.filter('dateFilters', function (originVal) {
  if (!originVal) {
    return ""
  }
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  return `${y}-${m}-${d}`
})
