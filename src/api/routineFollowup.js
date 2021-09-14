import request from './axios'
// 常规各类型列表
// | 参数名         | 说明                                               | 是否必须 |
// | -------------- | -------------------------------------------------- | -------- |
// | pageNum        | 当前页                                             | f        |
// | pageSize       | 数量                                               | f        |
// | name           | 名称                                               | f        |
// | updateTimePre  | 前时间                                             | f        |
// | updateTimeSuf  | 后时间                                             | f        |
// | hospitalName   | 医院名称                                           | f        |
// | departmentName | 部门名称                                           | f        |
// | status         | 随访状态**0：待随访，1：已随访，2：已暂存，3:7日外   | t        |
// export function getList(params) {
//   return request({
//     url: '/api/routine/patient/getAll',
//     method: 'GET',
//     params
//   })
// }
// 改为post
export function postRoutineList(data) {
  return request({
    url: '/api/routine/patient/getAll',
    method: 'POST',
    data
  })
}
// 获取基本信息  患者基本信息（）
// | 参数名 | 说明 | 是否必须 |
// | ------ | ---- | -------- |
// | id     | id   | t        |
export function getBaseInfo(params) {
  return request({
    url: '/api/routine/patient/getOneById',
    method: 'GET',
    params
  })
}

// 获取患者基本信息接口    /api/live/getPatientById  （患者基本信息被统一/api/routine/patient/getOneById）
export function getPatientById(params) {
  return request({
    url: '/api/live/getPatientById',
    method: 'GET',
    params
  })
}

// 获取联系人关系列表
// | 参数名     | 说明 | 是否必须 |
// | -----------| ---- | -------- |
// | typeCode   |      | t        |
export function getRelationship(params) {
  return request({
    url: '/api/dict/findAllByTypeCode',
    method: 'GET',
    params
  })
}
// 获取随访信息
// | 参数名 | 说明 | 是否必须 |
// | ------ | ---- | -------- |
// | id     | id   | t        |

export function getFollowupBeanById(params) {
  return request({
    url: '/api/routine/patient/getBeanById',
    method: 'GET',
    params
  })
}
// 更新基本信息-联系人列表
// | 参数名 | 说明 | 是否必须 |
// | ------ | ---- | -------- |
// | id     | id   | t        |
export function updateBaseInfo(data) {
  return request({
    url: '/api/routine/patient/update',
    method: 'POST',
    data
  })
}
// 更新基本信息-联系人列表 删除
export function deleteBeanById(params) {
  return request({
    url: '/api/routine/patient/deleteBeanById',
    method: 'GET',
    params
  })
}
// 获取日志列表
// | 参数名   | 说明    | 是否必须 |
// | -------- | ------- | -------- |
// | pageNum  | 当前页  | f        |
// | pageSize | 数量    | f        |
// | type     | routine | f        |
export function getLogList(params) {
  return request({
    url: '/api/routine/log/getAll',
    method: 'GET',
    params
  })
}
// 获取联系方式
// | 参数名   | 说明     | 是否必须 |
// | -------- | ------- | -------- |
// | patientId |        | t        |
export function getContentNumList(params) {
  return request({
    url: '/api/routine/patient/getMobiles',
    method: 'GET',
    params
  })
}


// 标记接通方式
// | 参数名   | 说明     | 是否必须 |
// | -------- | ------- | -------- |
// | idStr |        | t        |
// | connections |        | t        |
export function postUpdateConcat(data) {
  return request({
    url: '/api/routine/patient/updateConcat',
    method: 'POST',
    data
  })
}
// 获取接通情况（connection）和随访方式（meth）
// | 参数名   | 说明 | 是否必须 |
// | -------- | ---- | -------- |
// | typeCode |      | t        |
export function getConnectionOrMeth(params) {
  return request({
    url: '/api/dict/findAllByTypeCode',
    method: 'GET',
    params
  })
}
// 保存、暂存随访信息
// | 参数名       | 说明                                       | 是否必须 |
// | :----------- | :----------------------------------------- | -------- |
// | patientId   | 病人id                                     | t        |
// | followupType | 随访方式                                   | t        |
// | mobile       | 手机号                                     | t        |
// | connections  | 接通情况                                   | t        |
// | description  | 补充                                       | f        |
// | wechats      | 微信内容                                   | f        |
// | results      | 结果                                       | f        |
// | idea         | 意见                                       | f        |
// | status       | 1:完成随访（保存时传1）2：暂存（暂存时传）   | t        |
export function addFollowup(data) {
  return request({
    url: '/api/routine/patient/add',
    method: 'POST',
    data
  })
}
// 微信发送
// | 参数名    | 说明     | 是否必须 |
// | :-------- | :------- | -------- |
// | patientId | 病人id   | t        |
// | wechats   | 微信内容 | f        |
export function sendWx(data) {
  return request({
    url: '/api/routine/patient/sendMsg',
    method: 'POST',
    data
  })
}
// 短信发送
// | 参数名    | 说明     | 是否必须 |
// | :-------- | :------- | -------- |
// | patientId | 病人id   | t        |
// | wechats   | 微信内容 | f        |
export function sendSms(data) {
  return request({
    url: '/api/routine/patient/sendSms',
    method: 'POST',
    data
  })
}

// 获取左侧列表+随访信息接口 常规
// | 参数名    | 说明   | 是否必须 |
// | --------- | ------ | -------- |
// | patientId | 患者id | t        |
export function getpatientGetBeans(params) {
  return request({
    url: '/api/routine/patient/getBeans',
    method: 'GET',
    params
  })
}


// 上传录音文件
// | 参数名    | 说明   | 是否必须 |
// | --------- | ------ | -------- |
// | patientId | 患者id | t        |
export function postUploadRecord(data) {
  return request({
    url: '/api/file/uploadRecord',
    method: 'POST',
    data
  })
}


// 生存上传录音文件
// | 参数名    | 说明   | 是否必须 |
// | --------- | ------ | -------- |
// | patientId | 患者id | t        |
export function postUploadRecordLive(data) {
  return request({
    url: '/api/file/uploadRecord/live',
    method: 'POST',
    data
  })
}

// 获取电话归属地
// | 参数名    | 说明   | 是否必须 |
// | --------- | ------ | -------- |
// | phoneNumber | 手机号 | t        |
export function getMobileAddress(params) {
  return request({
    url: '/api/smsTemplate/getMobileAddress',
    method: 'GET',
    params
  })
}