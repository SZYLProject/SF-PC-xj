// 每个模块都应该有自己的接口文件去统一管理api
import request from './axios'
/*
    表单设计
*/
//获取组列表
export function getGroupList(params) {
    return request({
        url: '/api/manage/group/lookForAll',
        method: 'get',
        params
    })
}
//新增组
// | 参数名                      | 说明                         | 是否必须 |
// | ---------------------------| ------------------------------| -------- |
// | groupName                  | 组名                          | t        |
// | isCopy                     | 是否可以复制（0：不能，1：能）  | t        |
// | questionnaireTitleCode     | 表单code                      | t        |
export function addGroup(data) {
    return request({
        url: '/api/manage/group/saveBean',
        method: 'post',
        data
    })
}
//删除组
// | 参数名 | 说明 | 是否必须 |
// | -----  | ---  | -------- |
// | id     | 主键 | t       |
export function deleteGroup(params) {
    return request({
        url: '/api/manage/group/deleteBeanById',
        method: 'get',
        params
    })
}

//编辑组
// | 参数名         | 说明 | 是否必须 |
// | ------------  | ---  | -------- |
// | groupCode     | ---  | t       |
// | groupName     | 组名 | t       |
// | isCopy        | 可重复| t       |
export function updataGroup(data) {
    return request({
        url: '/api/manage/group/updateBean',
        method: 'post',
        data
    })
}


//获取项列表
// | 参数名                 | 说明     | 是否必须 |
// | ---------------------- | -------- | -------- |
// | questionnaireTitleCode | 表单code | t        |
export function getFormList(params) {
    return request({
        url: '/api/manage/element/getElement',
        method: 'get',
        params
    })
}
//新增项
export function addFormItem(data) {
    return request({
        url: '/api/manage/element/saveBean',
        method: 'post',
        data
    })
}
//编辑项
export function editFormItem(data) {
    return request({
        url: '/api/manage/element/updateBean',
        method: 'post',
        data
    })
}
//删除项
export function deleteFormItem(params) {
    return request({
        url: '/api/manage/element/deleteBean',
        method: 'get',
        params
    })
}
//项列表排序
export function sortFormList(data) {
    return request({
        url: '/api/manage/element/updateSort',
        method: 'post',
        data
    })
}

//更新计算规则
export function updateFormulaRule(data) {
    return request({
        url: '/api/followupTemplateValue/updatepCaseForm',
        method: 'post',
        data
    })
}


//预览表单
export function previewFormDetails(params) {
    return request({
        url: '/api/followupTemplateValue/getEventsDdListPreview',
        method: 'GET',
        params
    })
}