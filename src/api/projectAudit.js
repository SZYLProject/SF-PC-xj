import request from './axios'
// 项目审核列表
export function projectFindAllProject(params) {
  return request({
    url: '/api/project/findAllProject',
    method: 'GET',
    params
  })
}

// 审核中病人列表
export function projectFindPatientByProjectId(params) {
  return request({
    url: '/api/project/findPatientByProjectId',
    method: 'GET',
    params
  })
}

// 审核中病人列表
export function projectFindOtherPatientByProjectId(params) {
  return request({
    url: '/api/project/findOtherPatientByProjectId',
    method: 'GET',
    params
  })
}

// 项目审批通过/驳回 old
export function projectApprovePass(params) {
  return request({
    url: '/api/project/projectApprovePass',
    method: 'GET',
    params
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
/**
 * 表单录入
 */
//获取表单列表
export function getFormList(params) {
  return request({
    url: '/api/followupTemplateValue/getFormByProject',
    method: 'GET',
    params
  })
}
//获取表单详情
export function getFormDetails(params) {
  return request({
    url: '/api/followupTemplateValue/getEventsDdListByTemplateNodeId',
    method: 'GET',
    params
  })
}
//保存表单
export function saveFormDetails(data) {
  return request({
    url: '/api/followupTemplateValue/saveFollowupCaseForm',
    method: 'POST',
    data
  })
}
//图片上传
export function deletePic(params) {
  return request({
    url: '/api/followupTemplateValue/delFile',
    method: 'GET',
    params
  })
}
export function uploadImage(data) {
  return request({
    url: '/api/followupTemplateValue/uploadImage',
    method: 'POST',
    data
  })
}