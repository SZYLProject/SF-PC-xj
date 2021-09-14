import request from './axios'

// 统计数据接口1
export function liveFindByType(params) {
  return request({
    url: '/api/live/findByType',
    method: 'GET',
    params
  })
}

// 统计数据接口2
export function liveFindByStatus(params) {
  return request({
    url: '/api/live/findByStatus',
    method: 'GET',
    params
  })
}

// 获取列表接口 生存随访项目列表
export function liveFindAllProject(params) {
  return request({
    url: '/api/live/findAllProject',
    method: 'GET',
    params
  })
}

//获取组织部门接口
export function getDepartments(params) {
  return request({
    url: '/api/base/getDepartments',
    method: 'get',
    params
  })
}

// 生存项目新增更新接口
export function liveAddProject(data) {
  return request({
    url: '/api/live/addProject',
    method: 'POST',
    data
  })
}

//  生存项目回顾新增
export function liveAddReview(data) {
  return request({
    url: '/api/live/addReview',
    method: 'POST',
    data
  })
}
//  项目终止
export function liveUpdateStatus(data) {
  return request({
    url: '/api/live/updateStatus',
    method: 'POST',
    data
  })
}


// 患者筛选中的查询条件  根据维度获取属性信息接口
export function getFindCondition(params) {
  return request({
    url: '/api/live/findCondition',
    method: 'GET',
    params
  })
}


// 搜索并保存患者筛选条件
// 高级条件查询随访病人信息接口（不用）
export function postFindPatientInfoByCondition(data) {
  return request({
    url: '/api/live/findPatientInfoByCondition',
    method: 'POST',
    data
  })
}


// 更新项目的患者数量等信息接口
export function postAddSearchCondition(data) {
  return request({
    url: '/api/live/addSearchCondition',
    method: 'POST',
    data
  })
}


// 更新项目的患者   表格统计接口
export function getLiveInfoById(params) {
  return request({
    url: '/api/live/getInfoById',
    method: 'GET',
    params
  })
}

// 获取所有用户接口
export function getBaseAllUsers(params) {
  return request({
    url: '/api/base/getOperUsers',
    method: 'GET',
    params
  })
}
// 按民族查询接口    患者筛选
export function getLiveNations(params) {
  return request({
    url: '/api/live/getNations',
    method: 'GET',
    params
  })
}
// 按病种查询接口    患者筛选
export function getLiveDiseases(params) {
  return request({
    url: '/api/live/getDiseases',
    method: 'GET',
    params
  })
}
// 按按部门查询接口  患者筛选
export function getLiveDeparts(params) {
  return request({
    url: '/api/live/getDeparts',
    method: 'GET',
    params
  })
}

// .2 获取患者科室字典接口
export function getProjectDeptDic(params) {
  return request({
    url: '/api/project/deptDic',
    method: 'GET',
    params
  })
}
// .3 获取患者科室字典接口
export function getUserDeptDic(params) {
  return request({
    url: '/api/base/getDepartments',
    method: 'GET',
    params
  })
}
// 0.3 获取患者病种接口
export function getProjectDiseaseDic(params) {
  return request({
    url: '/api/project/diseaseDic',
    method: 'GET',
    params
  })
}

// 民族随访人员新增
export function posAddUserByNation(data) {
  return request({
    url: '/api/allocation/addUserByNation',
    method: 'POST',
    data
  })
}

// 民族单人分配
export function postAddByNation(data) {
  return request({
    url: '/api/allocation/addByNation',
    method: 'POST',
    data
  })
}

// 更新项目的患者数量等信息接口
export function postAddAllocation(data) {
  return request({
    url: '/api/allocation/addAllocation',
    method: 'POST',
    data
  })
}
// 更新项目的患者数量等信息接口
export function postAddAll(data) {
  return request({
    url: '/api/allocation/addAll',
    method: 'POST',
    data
  })
}

//项目详情

// 获取某个项目详情
export function getBeanById(params) {
  return request({
    url: '/api/live/getBeanById',
    method: 'GET',
    params
  })
}
// 获取某个项目进度
export function getDiseasesPercent(params) {
  return request({
    url: '/api/live/getDiseasesPercent',
    method: 'GET',
    params
  })
}
// 按照患者结局状态
export function getPatientPercent(params) {
  return request({
    url: '/api/live/getPatientPercent',
    method: 'GET',
    params
  })
}
// 进度分布（回顾随访）
export function getProgress(params) {
  return request({
    url: '/api/live/getProgress',
    method: 'GET',
    params
  })
}
// 进度分布-阶段（前瞻随访）
// projectId
export function queryNodes(params) {
  return request({
    url: '/api/live/queryNodes',
    method: 'GET',
    params
  })
}
// 进度分布-数据（前瞻随访）
// projectPlanId
export function findPointsCount(params) {
  return request({
    url: '/api/live/findPointsCount',
    method: 'GET',
    params
  })
}
// 项目 获取随访人员
// projectId
export function getListByProjectId(params) {
  return request({
    url: '/api/allocation/getListByProjectId',
    method: 'GET',
    params
  })
}

// 回顾随访获取某个项目的患者信息接口
export function getFindPatientInfoByProject(params) {
  return request({
    url: '/api/live/findPatientInfoByProject',
    method: 'GET',
    params
  })
}
// 前瞻随访获取某个项目的患者信息接口
export function getFindPatientInfoById(params) {
  return request({
    url: '/api/live/findPatientInfoById',
    method: 'GET',
    params
  })
}
// 获取左侧列表+随访信息接口  生存
export function getLiveBeans(params) {
  return request({
    url: '/api/live/getBeans',
    method: 'GET',
    params
  })
}
// 前瞻获取左侧列表+随访信息接口
export function getBeansByPro(params) {
  return request({
    url: '/api/live/getBeansByPro',
    method: 'GET',
    params
  })
}
// ### 随访信息上一个、下一个接口 生存回顾
export function findPatientByProject(params) {
  return request({
    url: '/api/live/findPatientByProject',
    method: 'GET',
    params
  })
}

// ### 随访信息保存接口 生存
export function postLiveResultAdd(data) {
  return request({
    url: '/api/live/result/add',
    method: 'POST',
    data
  })
}

// 获取某个随访信息接口  生存
export function getLiveBeanByMulId(params) {
  return request({
    url: '/api/live/getBeanByMulId',
    method: 'GET',
    params
  })
}


// 获取日志列表接口  生存
// type=survival
export function getfindLogByReview(params) {
  return request({
    url: '/api/routine/log/findLogByReview',
    method: 'GET',
    params
  })
}


// 前瞻阶段保存更新接口
export function postSaveNextStep(data) {
  return request({
    url: '/api/live/saveNextStep',
    method: 'POST',
    data
  })
}

// 获取前瞻阶段接口
// type=survival
export function getLiveBeanById(params) {
  return request({
    url: '/api/live/getBeanById',
    method: 'GET',
    params
  })
}

//常规查询条件查询随访病人信息接口
// 0：应随访，1：待随访，2：近90天有复诊记录，3：参与专题随访的患者
export function getFindByConditionNext(data) {
  return request({
    url: '/api/live/findByConditionNext',
    method: 'POST',
    data
  })
}
export function getFindByCondition(data) {
  return request({
    url: '/api/live/findByCondition',
    method: 'POST',
    data
  })
}

// 微信发送
// | 参数名    | 说明     | 是否必须 |
// | :-------- | :------- | -------- |
// | groupId   | 入组id   | t        |
// | wechats   | 微信内容 | f        |
export function sendWx(data) {
  return request({
    url: '/api/live/sendMsg',
    method: 'POST',
    data
  })
}
// 短信发送
// | 参数名    | 说明     | 是否必须 |
// | :-------- | :------- | -------- |
// | groupId   | 入组id   | t        |
// | sms       | 短信内容 | f        |
export function sendSms(data) {
  return request({
    url: '/api/live/sendSms',
    method: 'POST',
    data
  })
}
// 微信发送-批量
// | 参数名    | 说明       | 是否必须 |
// | :-------- | :-------  | -------- |
// | projectId | 项目id     | t        |
// | patientIds | 患者id数组 | t        |
export function sendAllMsg(data) {
  return request({
    url: '/api/live/sendAllMsg',
    method: 'POST',
    data
  })
}

export function sendAll(data) {
  return request({
    url: '/api/live/sendAll',
    method: 'POST',
    data
  })
}


// 待确认患者-撤销
// | 参数名    | 说明     | 是否必须 |
// | :-------- | :------- | -------- |
// | patientId | id       | t        |
export function updatePatient(data) {
  return request({
    url: '/api/live/updatePatient',
    method: 'POST',
    data
  })
}

//获取微信模板列表
export function getWeChatList (params) {
  return request({
      url: '/api/wechatTemplate/getWebChatTemplateByStatus',
      method: 'get',
      params
  })
}
//获取短信模板列表
export function getSmsList (params) {
  return request({
      url: '/api/smsTemplate/getSmsTemplateByStatus',
      method: 'get',
      params
  })
}