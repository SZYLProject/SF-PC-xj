import request from './axios'

//获取类型列表
export function getTypeList() {
  return request({
    url: '/api/manage/form/types',
    method: 'GET'
  })
}
// 获取字典
export function getFindAllByTypeCode(params) {
  return request({
    url: '/api/dict/findAllByTypeCode',
    method: 'GET',
    params
  })
}
//获取组织部门接口
export function getDepartments(params) {
  return request({
    url: '/api/base/getDepartments',
    method: 'GET',
    params
  })
}

//获取专题项目成员
export function getHospitalUsers(params) {
  return request({
    url: '/api/base/getHospitalUsers',
    method: 'GET',
    params
  })
}



// 专题随访新建项目
export function specialAddProject(data) {
  return request({
    url: '/api/project/save',
    method: 'POST',
    data
  })
}

// 项目审批通过/驳回
export function postProjectAudit(data) {
  return request({
    url: '/api/project/audit',
    method: 'POST',
    data
  })
}

// 查询专题随访中的访视计划模板
export function getFindPlanByType(params) {
  return request({
    url: '/api/manage/plan/findPlanByType',
    method: 'GET',
    params
  })
}

// 专题随访中新增访视计划下的阶段
export function specialAddPlanNode(data) {
  return request({
    url: '/api/project/saveNextStep',
    method: 'POST',
    data
  })
}
// 专题随访中 查看项目访视计划
export function specialVisitPlan(params) {
  return request({
    url: '/api/project/visitPlan',
    method: 'GET',
    params
  })
}

// 专题随访中保存访视计划模板
export function specialSaveFollowupPlan(data) {
  return request({
    url: '/api/project/savePlanTemplate',
    method: 'POST',
    data
  })
}


// 患者筛选中的查询条件
export function getFindCondition(params) {
  return request({
    url: '/api/project/findCondition',
    method: 'GET',
    params
  })
}

// 患者筛选中的应随访患者
export function specialFindPatientInfoByCondition(data) {
  return request({
    url: '/api/special/findPatientInfoByCondition',
    method: 'POST',
    data
  })
}

// 搜索并保存患者筛选条件
export function projectSearchPatient(data) {
  return request({
    url: '/api/project/searchPatient',
    method: 'POST',
    data
  })
}



// 下一步  搜索并保存患者筛选条件
export function findByConditionNextSpeciaial(data) {
  return request({
    url: '/api/project/findByConditionNext',
    method: 'POST',
    data
  })
}
// 患者筛选中的待确认患者
export function projectSearchToConfirm(data) {
  return request({
    url: '/api/project/searchToConfirm',
    method: 'POST',
    data
  })
}
//  患者筛选中的参与其他项目患者
export function projectSearchOtherProject(data) {
  return request({
    url: '/api/project/searchOtherProject',
    method: 'POST',
    data
  })
}

// 移除待随访患者
export function projectRemovePatient(data) {
  return request({
    url: '/api/project/removePatient',
    method: 'POST',
    data
  })
}

// 撤销待确认患者
export function projectRevokePatient(data) {
  return request({
    url: '/api/project/revokePatient',
    method: 'POST',
    data
  })
}

// 筛选后的分页
export function postFindPagePatient(data) {
  return request({
    url: '/api/project/findPagePatient',
    method: 'POST',
    data
  })
}

// 4.11 患者信息按病种统计
export function getProjectDiseaseCount(params) {
  return request({
    url: '/api/project/disease/count',
    method: 'GET',
    params
  })
}

// 跳过不分配
export function projectSkipAllocation(data) {
  return request({
    url: '/api/project/skipAllocation',
    method: 'POST',
    data
  })
}

// 项目列表
export function projectFindAllProject(params) {
  return request({
    url: '/api/project/findAllProject',
    method: 'GET',
    params
  })
}
// 获取项目详情
export function getProjectOneById(params) {
  return request({
    url: '/api/project/getOneById',
    method: 'GET',
    params
  })
}
// 获取项目统计数量
export function getProjectCountByDept(params) {
  return request({
    url: '/api/project/countByDept',
    method: 'GET',
    params
  })
}
// 获取项目进度
export function getProjectProgress(params) {
  return request({
    url: '/api/project/getProgress',
    method: 'GET',
    params
  })
}
// 获取患者列表
export function getProjectFindPatient(params) {
  return request({
    url: '/api/project/findPatient',
    method: 'GET',
    params
  })
}



// 按照患者结局状态  专题
export function getPatientPercent(params) {
  return request({
    url: '/api/project/getPatientPercent',
    method: 'GET',
    params
  })
} 
// 获取某个项目进度 专题
export function getDiseasesPercent(params) {
  return request({
    url: '/api/project/getDiseasesPercent',
    method: 'GET',
    params
  })
}
// 进度分布-阶段（前瞻随访）
// projectId
export function queryNodes(params) {
  return request({
    url: '/api/project/queryNodes',
    method: 'GET',
    params
  })
}
// 进度分布-数据（前瞻随访）
// projectPlanId
export function findPointsCount(params) {
  return request({
    url: '/api/project/findPointsCount',
    method: 'GET',
    params
  })
}




// 高级筛选
// 患者管理一级筛选框
export function getFindTableAndColumn(params) {
  return request({
    url: '/api/live/findTableAndColumn',
    method: 'GET',
    params
  })
}
// 患者管理二级筛选框
export function getFindColumns(params) {
  return request({
    url: '/api/live/findColumns',
    method: 'GET',
    params
  })
}


// 生存随访-筛选菜单
export function gitFindTabl(params) {
  return request({
    url: '/api/live/findTable',
    method: 'GET',
    params
  })
}
// 患者管理-筛选菜单
export function gitPatientFindTabl(params) {
  return request({
    url: '/api/patient/findTable',
    method: 'GET',
    params
  })
}

// 患者管理   一级筛选框
export function getPatientFindTableAndColumn(params) {
  return request({
    url: '/api/patient/findTableAndColumn',
    method: 'GET',
    params
  })
}
// 二级筛选框
export function getPatientFindColumns(params) {
  return request({
    url: '/api/patient/findColumns',
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
// 0.3 获取患者病种接口
export function getProjectDiseaseDic(params) {
  return request({
    url: '/api/project/diseaseDic',
    method: 'GET',
    params
  })
}

// 专题获取左侧列表+随访信息接口 getBeansByPro
export function getSpecialBeansByPro(params) {
  return request({
    url: '/api/project/getBeansByPro',
    method: 'GET',
    params
  })
}

// 专题去随访填写表单
export function postPatientFillForm(data) {
  return request({
    url: '/api/project/patient/fillForm',
    method: 'POST',
    data
  })
}

// 微信发送
// | 参数名    | 说明     | 是否必须 |
// | :-------- | :------- | -------- |
// | patientId | 病人id   | t        |
// | wechats   | 微信内容 | f        |
export function sendSpcialWx(data) {
  return request({
    url: '/api/project/sendMsg',
    method: 'POST',
    data
  })
}
// 短信发送
// | 参数名    | 说明     | 是否必须 |
// | :-------- | :------- | -------- |
// | patientId | 病人id   | t        |
// | wechats   | 微信内容 | f        |
export function sendSpcialSms(data) {
  return request({
    url: '/api/project/sendSms',
    method: 'POST',
    data
  })
}