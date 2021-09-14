// 每个模块都应该有自己的接口文件去统一管理api
import request from './axios'

//获取项目下的计划
// | 参数名 | 说明   | 是否必须 |
// | ------ | ------ | -------- |
// | planId | 计划id | t        |
export function getPlanList(params) {
  return request({
    url: '/api/manage/node/getAll',
    method: 'get',
    params
  })
}

//项目绑定模板
// | 参数名 | 说明   | 是否必须 |
// | ------ | ------ | -------- |
// | projectId | 项目id | t        |
// | planId | 计划id | t      
export function bindProjectPlan(params) {
  return request({
    url: '/api/project/bindProjectPlan',
    method: 'get',
    params
  })
}
//获取微信模板列表
export function getWeChatList(params) {
  return request({
    url: '/api/wechatTemplate/getTotal',
    method: 'get',
    params
  })
}
//获取短信模板列表
export function getSmsList(params) {
  return request({
    url: '/api/smsTemplate/getTotal',
    method: 'get',
    params
  })
}
//获取表单模板列表
export function getFormList(params) {
  return request({
    url: '/api/manage/form/getTemplateList',
    method: 'get',
    params
  })
}
// 获取表单模板列表改为 通过科室+专题类型  
export function getTemplateListByDepartment(params) {
  return request({
    url: '/api/manage/form/getTemplateListByDepartment',
    method: 'get',
    params
  })
}

// 获取表单模板列表 通过生存类型  
export function getTemplateListByTypeCode(params) {
  return request({
    url: '/api/manage/form/getTemplateListByTypeCode',
    method: 'get',
    params
  })
}
//阶段内容新增
// | 参数名             | 说明                                                      | 是否必须 |
// | ------------------ | --------------------------------------------------------- | -------- |
// | nodeName           | 节点名称                                                  | t        |
// | nodeDesc           | 节点描述（没有框）                                        | f        |
// | frontDays          | 随访点之前多少天                                          | t        |
// | afterDays          | 随访点之后多少天                                          | t        |
// | cycleFrequency     | 次数                                                      | t        |
// | cycleFrequency          | 每隔多少天随访一次                                        | t        |
// //| invalidTimes       | 失效时间，超过随访点几天                                  | t        |
// | followupMethodCode | 随访方式code(/api/dict/findAllByTypeCode?typeCode=method) | t        |
// | followupMethodName | (电话，微信，短信)                                        | t        |
// | startMethodCode    | 开始时间(/api/dict/findAllByTypeCode?typeCode=startTime)  | t        |
// | startMethodName    | （手动选择，手术后开始，。。。）                          | t        |
// | startDate          | 手动选择的时间                                            | f        |
// | formId             | 表单多选后逗号拼接表单id                                  | t        |
// | formName           | 表单多选后逗号拼接表单name                                | t        |
// | templateId         | 微信模板                                                  | t        |
// | templateTitle      |                                                           | t        |
// | exceptions         | 异常信息数组                                              | f        |
// | ends               | 自动结束数组                                              | f        |
// | wechatContent      | 微信模板内容                                              | f        |
// | smsContent         | 短信模板内容                                              | f        |
// | frequencyCode      | 随访频率类型                                              | t        |
// | cycleRegular       | 定期随访天数                                              | f        |
export function addPlan(data) {
  return request({
    url: '/api/manage/node/add',
    method: 'post',
    data
  })
}
//阶段内容更新
// | 参数名             | 说明                                                      | 是否必须 |
// | ------------------ | --------------------------------------------------------- | -------- |
// | planId             | 随访计划id                                                | t        |
// | nodeName           | 节点名称                                                  | t        |
// | nodeDesc           | 节点描述（没有框）                                        | f        |
// | frontDays          | 随访点之前多少天                                          | t        |
// | afterDays          | 随访点之后多少天                                          | t        |
// | cycleFrequency     | 次数                                                      | t        |
// | cycleFrequency          | 每隔多少天随访一次                                        | t        |
// //| invalidTimes       | 失效时间，超过随访点几天                                  | t        |
// | followupMethodCode | 随访方式code(/api/dict/findAllByTypeCode?typeCode=method) | t        |
// | followupMethodName | (电话，微信，短信)                                        | t        |
// | startMethodCode    | 开始时间(/api/dict/findAllByTypeCode?typeCode=startTime)  | t        |
// | startMethodName    | （手动选择，手术后开始，。。。）                          | t        |
// | startDate          | 手动选择的时间                                            | f        |
// | formId             | 表单多选后逗号拼接表单id                                  | t        |
// | formName           | 表单多选后逗号拼接表单name                                | t        |
// | templateId         | 微信模板                                                  | t        |
// | templateTitle      |                                                           | t        |
// | exceptions         | 异常信息数组                                              | f        |
// | ends               | 自动结束数组                                              | f        |
// | wechatContent      | 微信模板内容                                              | f        |
// | smsContent         | 短信模板内容                                              | f        |
// | frequencyCode      | 随访频率类型                                              | t        |
// | cycleRegular       | 定期随访天数                                              | f        |
export function updatePlan(data) {
  return request({
    url: '/api/manage/node/update',
    method: 'post',
    data
  })
}
// 编辑阶段名称
// | 参数名   | 说明  | 是否必须 |
// | -------- | ----- | -------- |
// | nodeName | 名称  | t        |
// | id       | 主键  | t        |
export function updatePlanName(data) {
  return request({
    url: '/api/manage/node/updateName',
    method: 'post',
    data
  })
}
// 删除阶段名称
// | 参数名   | 说明  | 是否必须 |
// | -------- | ----- | -------- |
// | id       | 主键  | t        |
export function deletePlan(params) {
  return request({
    url: '/api/manage/node/deleteById',
    method: 'get',
    params
  })
}
