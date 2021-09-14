import Vue from 'vue'
import Router from 'vue-router'
import VueRouter from 'vue-router';
import Home from '@/views/Home/indexOld' // xj byyuwen
import ContentMain from '@/views/ContentMain'
Vue.use(Router,VueRouter)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */


const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)

}
export const constantRoutes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/routine',
    component: ContentMain,
    redirect: '/routine/followup',
    children: [{
        path: '/routine/followup',
        component: () => import('@/views/Routine/RoutineFollowup'),
        name: 'RoutineFollowup',
        meta: {
          title: '常规随访',
          icon: 'table',
          affix: true
        }
      },
      {
        path: '/routine/followup/details',
        component: () => import('@/views/Routine/RoutineFollowup/details'),
        name: 'RoutineFollowupDetails',
        meta: {
          title: '常规随访详情',
          icon: 'table',
          type: 'children',
          affix: true
        }
      },
      {
        path: '/routine/analy',
        component: () => import('@/views/Routine/StatisticAnaly'),
        name: 'StatisticAnaly',
        meta: {
          title: '统计分析',
          icon: 'table',
          affix: true
        }
      }
    ]
  },
  {
    path: '/survival/index',
    component: ContentMain,
    redirect: '/survival/index',
    children: [{
        path: '/survival/index',
        component: () => import('@/views/Survival/SurvivalFollowup'),
        name: 'SurvivalFollowup',
        meta: {
          title: '生存随访',
          icon: 'table',
          affix: true
        }
      }, {
        path: '/survival/planSetUp',
        component: () => import('@/views/Survival/SurvivalFollowup/planSetUp'),
        name: 'PlanSetUp',
        meta: {
          title: '访视计划',
          icon: 'table',
          type: 'children',
          affix: true
        }
      },
      {
        path: '/survival/followup/details',
        component: () => import('@/views/Survival/SurvivalFollowup/details'),
        name: 'SurvivalFollowupDetails',
        meta: {
          title: '项目详情',
          icon: 'table',
          type: 'children',
          affix: true
        }
      },
      {
        path: '/survival/followUpDetails',
        component: () => import('@/views/Survival/SurvivalFollowup/followupDetails'),
        name: 'SurvivalFollowUPdetailFU',
        meta: {
          title: '随访详情',
          icon: 'table',
          type: 'children',
          affix: true
        }
      },
      {
        path: '/survival/patient',
        component: () => import('@/views/Survival/PatientManagement'),
        name: 'SurvivalPatientManagement',
        meta: {
          title: '患者管理',
          icon: 'table',
          affix: true
        }
      },
      {
        path: '/survival/patient/all',
        component: () => import('@/views/Survival/PatientManagement/AllPatients'),
        name: 'SurvivalAllPatients',
        meta: {
          title: '全部患者管理',
          icon: 'table',
          affix: true
        }
      }, {
        path: '/survival/patient/details',
        component: () => import('@/views/Survival/PatientManagement/details'),
        name: 'SurvivalPatientManagementDetails',
        meta: {
          title: '患者详情',
          icon: 'table',
          type: 'children',
          affix: true
        }
      },
      {
        path: '/survival/patient/lost',
        component: () => import('@/views/Survival/PatientManagement/Lostpatients'),
        name: 'SurvivalLostpatients',
        meta: {
          title: '失访患者',
          icon: 'table',
          affix: true
        }
      },
      // {
      //   path: '/survival/analysis',
      //   component: () => import('@/views/Survival/StatisticAnaly'),
      //   name: 'SurvivalStatisticAnaly',
      //   meta: {
      //     title: '统计分析',
      //     icon: 'table',
      //     affix: true
      //   }, 
      // },
      {
        path: '/survival/analysis/patient',
        component: () => import('@/views/Survival/StatisticAnaly/PatientAnaly'),
        name: 'SurvivalPatientAnaly',
        meta: {
          title: '患者情况分析',
          icon: 'table',
          affix: true
        }
      },
      {
        path: '/survival/analysis/surv',
        component: () => import('@/views/Survival/StatisticAnaly/SurvivalAnaly'),
        name: 'SurvivalStatisticAnaly',
        meta: {
          title: '生存情况分析',
          icon: 'table',
          affix: true
        }
      },
      {
        path: '/survival/analysis/workload',
        component: () => import('@/views/Survival/StatisticAnaly/FollowUpAnaly'),
        name: 'SurvivalFollowUpAnaly',
        meta: {
          title: '随访工作量分析',
          icon: 'table',
          affix: true
        }
      },
      {
        path: '/survival/analysis/lost',
        component: () => import('@/views/Survival/StatisticAnaly/LostToFollowUpAnaly'),
        name: 'SurvivalLostToFollowUpAnaly',
        meta: {
          title: '失访情况分析',
          icon: 'table',
          affix: true
        }
      },
    ]
  },
  {
    path: '/registration',
    component: ContentMain,
    redirect: '/tumor/index',
    children: [{
        path: '/tumor/index',
        component: () => import('@/views/Tumor/TumorFollowup'),
        name: 'TumorFollowup',
        meta: {
          title: '登记随访',
          icon: 'table',
          affix: true
        }
      },
      {
        path: '/tumor/planSetUp',
        component: () => import('@/views/Tumor/TumorFollowup/planSetUp'),
        name: 'TumorPlanSetUp',
        meta: {
          title: '访视计划设置',
          icon: 'table',
          type: 'children',
          affix: true
        }
      },
      {
        path: '/tumor/followup/details',
        component: () => import('@/views/Tumor/TumorFollowup/details'),
        name: 'TumorFollowupDetails',
        meta: {
          title: '项目详情',
          icon: 'table',
          type: 'children',
          affix: true
        }
      },
      {
        path: '/tumor/followUpDetails',
        component: () => import('@/views/Tumor/TumorFollowup/followupDetails'),
        name: 'TumorFollowUPdetailFU',
        meta: {
          title: '随访详情',
          icon: 'table',
          type: 'children',
          affix: true
        }
      }, {
        path: '/tumor/patientManagement/allPatients',
        component: () => import('@/views/Tumor/PatientManagement/TumorAllPatients'),
        name: 'TumorAllPatients',
        meta: {
          title: '全部患者',
          icon: 'table',
          affix: true
        }
      }, {
        path: '/tumor/patientManagement/lostpatients',
        component: () => import('@/views/Tumor/PatientManagement/TumorLostpatients'),
        name: 'TumorLostpatients',
        meta: {
          title: '失访患者',
          icon: 'table',
          affix: true
        }
      }, {
        path: '/tumor/patientManagement/details',
        component: () => import('@/views/Tumor/PatientManagement/details'),
        name: 'TumorPatientManagementDetails',
        meta: {
          title: '患者详情',
          icon: 'table',
          type: 'children',
          affix: true
        }
      },
      {
        path: '/tumor/statisticalAnalysis/patient',
        component: () => import('@/views/Tumor/StatisticalAnalysis/PatientAnaly'),
        name: 'TumorPatientAnaly',
        meta: {
          title: '患者情况分析',
          icon: 'table',
          affix: true
        }
      },
      {
        path: '/tumor/statisticalAnalysis/survival',
        component: () => import('@/views/Tumor/StatisticalAnalysis/SurvivalAnaly'),
        name: 'TumorStatisticAnaly',
        meta: {
          title: '生存情况分析',
          icon: 'table',
          affix: true
        }
      },
      {
        path: '/tumor/statisticalAnalysis/followUp',
        component: () => import('@/views/Tumor/StatisticalAnalysis/FollowUpAnaly'),
        name: 'TumorFollowUpAnaly',
        meta: {
          title: '随访工作量分析',
          icon: 'table',
          affix: true
        }
      },
      {
        path: '/tumor/statisticalAnalysis/lostToFollowUp',
        component: () => import('@/views/Tumor/StatisticalAnalysis/LostToFollowUpAnaly'),
        name: 'TumorLostToFollowUpAnaly',
        meta: {
          title: '失访情况分析',
          icon: 'table',
          affix: true
        }
      }
    ]
  },
  {
    path: '/special',
    component: ContentMain,
    redirect: '/special/index',
    children: [{
        path: '/special/index',
        component: () => import('@/views/Special/SpecialFollowUp'),
        name: 'SpecialFollowUp',
        meta: {
          title: '专题随访',
          icon: 'table',
          affix: true
        }
      },
      {
        path: '/special/addProject',
        component: () => import('@/views/Special/SpecialFollowUp/addProject'),
        name: 'AddProject',
        meta: {
          title: '随访计划',
          icon: 'table',
          type: 'children',
          affix: true
        }
      }, {
        path: '/special/details',
        component: () => import('@/views/Special/SpecialFollowUp/details'),
        name: 'SpecialFollowUpDetails',
        meta: {
          title: '项目详情',
          icon: 'table',
          type: 'children',
          affix: true
        }
      },
      {
        path: '/special/followUpDetails',
        component: () => import('@/views/Special/SpecialFollowUp/followUpDetails'),
        name: 'SpecialFollowUPdetailFU',
        meta: {
          title: '专题随访详情',
          icon: 'table',
          type: 'children',
          affix: true
        }
      },
      {
        path: '/special/toDoTask',
        component: () => import('@/views/Special/ToDoTask'),
        name: 'ToDoTask',
        meta: {
          title: '待办任务',
          icon: 'table',
          affix: true
        }
      },
      {
        path: '/special/statisticalAnalysis',
        component: () => import('@/views/Special/StatisticalAnalysis'),
        name: 'StatisticalAnalysis',
        meta: {
          title: '统计分析',
          icon: 'table',
          affix: true
        }
      }
    ]
  },
  {
    path: '/manage',
    component: ContentMain,
    redirect: '/manage/project',
    children: [{
        path: '/manage/project',
        component: () => import('@/views/SystemManagement/ProjectAudit'),
        name: 'RoutineFollowUp',
        meta: {
          title: '项目审核',
          icon: 'table',
          affix: true
        }
      },
      {
        path: '/manage/projectApproval',
        component: () => import('@/views/SystemManagement/ProjectAudit/approval'),
        name: 'Approval',
        meta: {
          title: '项目审批',
          icon: 'table',
          type: 'children',
          affix: true
        }
      },
      {
        path: '/manage/patient',
        component: () => import('@/views/SystemManagement/PatientManagement'),
        name: 'PatientManagement',
        meta: {
          title: '患者管理',
          icon: 'table',
          affix: true
        }
      },
      {
        path: '/manage/patient/details',
        component: () => import('@/views/SystemManagement/PatientManagement/details'),
        name: 'PatientManagementDetails',
        meta: {
          title: '患者详情',
          icon: 'table',
          type: 'children',
          affix: true
        }
      },
      {
        path: '/manage/form',
        component: () => import('@/views/SystemManagement/FormManagement/list'),
        name: 'FormManagement',
        meta: {
          title: '表单管理',
          icon: 'table',
          affix: true
        }
      },
      {
        path: '/manage/form/details',
        component: () => import('@/views/SystemManagement/FormManagement/details'),
        name: 'FormManagementDetails',
        meta: {
          title: '表单详情',
          icon: 'table',
          type: 'children',
          affix: true
        }
      },
      {
        path: '/manage/form/design',
        component: () => import('@/views/SystemManagement/FormManagement/design'),
        name: 'FormManagementDesign',
        meta: {
          title: '表单设计',
          icon: 'table',
          type: 'children',
          affix: true
        }
      },
      {
        path: '/manage/sms',
        component: () => import('@/views/SystemManagement/ShortMessageTemplate'),
        name: 'ShortMessageTemplate',
        meta: {
          title: '短信模板',
          icon: 'table',
          affix: true
        }
      },
      {
        path: '/manage/chat',
        component: () => import('@/views/SystemManagement/WeChatTemplate'),
        name: 'WeChatTemplate',
        meta: {
          title: '微信模板',
          icon: 'table',
          affix: true
        }
      }, {
        path: '/manage/phoneManagement',
        component: () => import('@/views/SystemManagement/PhoneManagement'),
        name: 'PhoneManagement',
        meta: {
          title: '接口测试',
          icon: 'table',
          affix: true
        }
      },
      {
        path: '/manage/plan',
        component: () => import('@/views/SystemManagement/VisitPlanManagement/list'),
        name: 'VisitPlanManagement',
        meta: {
          title: '计划管理',
          icon: 'table',
          affix: true
        }
      },
      {
        path: '/manage/plan/details',
        component: () => import('@/views/SystemManagement/VisitPlanManagement/details'),
        name: 'VisitPlanManagementDetails',
        meta: {
          title: '计划详情',
          icon: 'table',
          type: 'children',
          affix: true
        }
      }
    ]
  }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  // mode: 'history',
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
// router.beforeEach((to, from, next) => {
//   to.path.indexOf('jsessionid') != -1 && next('/');
//   next()
// })

export default router
