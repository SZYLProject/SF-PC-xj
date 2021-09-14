import request from './axios'
// 患者列表查询
export function patientGetAll(data) {
  return request({
    url: '/api/patient/getAll',
    method: 'POST',
    data
  })
}// 患者列表查询
export function patientGetAll2(data) {
  return request({
    url: '/api/patient/getAll2',
    method: 'POST',
    data
  })
}
// 患者导出系统管理
export function postExportFile(data) {
  return request({
    url: '/api/patient/exportFile',
    method: 'POST',
    responseType: 'blob',
    data
  })
}

// 患者筛选导出系统管理
export function postExportFileSearch(data) {
  return request({
    url: '/api/patient/exportFile3',
    method: 'POST',
    responseType: 'blob',
    data
  })
}

// 患者数据查询  分类统计患者
export function getTotalNum(params) {
  return request({
    url: '/api/patient/getPatientNum',
    method: 'GET',
    params
  })
}
// 患者详情
export function patientGetOneById(params) {
  return request({
    url: '/api/patient/getOneById',
    method: 'GET',
    params
  })
}
// 患者详情-修改
export function patientUpdate(data) {
  return request({
    url: '/api/patient/update',
    method: 'POST',
    data
  })
}

// 肿瘤 患者列表查询  （后期不需要）
export function registrationPatientGetAll(params) {
  return request({
    url: '/api/registrationpatient/getAll',
    method: 'GET',
    params
  })
}
// 肿瘤 患者详情
export function registrationPatientGetOneById(params) {
  return request({
    url: '/api/registrationpatient/getOneById',
    method: 'GET',
    params
  })
}
// 肿瘤 患者详情-修改
export function registrationPatientUpdate(data) {
  return request({
    url: '/api/registrationpatient/update',
    method: 'POST',
    data
  })
}

// 患者分析接口
export function getPatientAnalysis(params) {
  return request({
    url: '/api/live/patientAnalysis',
    method: 'GET',
    params
  })
}

// 全部患者查询
export function getPatientByClassify(params) {
  return request({
    url: '/api/patient/getPatientByClassify',
    method: 'GET',
    params 
  })
}
//  患者数据查询  分类统计患者 生存患者管理数据 /api/patient/getStaticByClassify
export function getStaticByClassify(params) {
  return request({
    url: '/api/patient/getStaticByClassify',
    method: 'GET',
    params
  })
}

//修改随访结果
export function updatePatientFollowResult(data) {
  return request({
    url: '/api/patient/updatePatientFollowResult',
    method: 'POST',
    data
  })
}

// 登记全部患者查询
export function getPatientByRegister(params) {
  return request({
    url: '/api/patient/getPatientByRegister',
    method: 'GET',
    params
  })
}

//  登记患者数据查询  分类统计患者    生存患者管理数据 /api/patient/getStaticByClassify
export function getStaticByRegister(params) {
  return request({
    url: '/api/patient/getStaticByRegister',
    method: 'GET',
    params
  })
}
