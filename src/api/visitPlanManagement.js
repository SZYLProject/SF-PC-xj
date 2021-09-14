// 每个模块都应该有自己的接口文件去统一管理api
import request from './axios'

//获取类型列表
export function getTypeList () {
    return request({
        url: '/api/manage/form/types',
        method: 'get'
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
// 患者所属科室
export function getDepsPatient(params) {
    return request({
        url: '/api/routine/patient/getDeps',
        method: 'get',
        params
    })
}
// 患者所属病区
export function getBatchNumber(params) {
    return request({
        url: '/api/routine/patient/getBatchNumber',
        method: 'get',
        params
    })
}

// 获取责任护士
export function getP819(params) {
    return request({
        url: '/api/patient/getP819',
        method: 'get',
        params
    })
}
//获取随访列表
// | 参数名   | 说明   | 是否必须 |
// | -------- | ------ | -------- |
// | pageNum  | 当前页 | f        |
// | pageSize | 数量   | f        |
// | typeCode | 类型   | f        |
// | name     | 随访名称| f        |
export function getVisitList(params) {
    return request({
        url: '/api/manage/plan/lookForAll',
        method: 'get',
        params
    })
}
// 随访新建
// | 参数名         | 说明                                       | 是否必须 |
// | -------------- | ------------------------------------------ | -------- |
// | name           | 表单名称                                   | t        |
// | departmentId   | 部门id(取部门查询接口中子部门的deptId)     | t        |
// | departmentName | 部门name(取部门查询接口中子部门的deptName) | t        |
// | hospitalId     | 医院id(取部门查询接口中parentId=0的deptId) | t        |
// | typeCode       | 类型code                                   | t        |
// | typeName       | 类型名称                                   | t        |
export function saveVisit (data) {
    return request({
        url: '/api/manage/plan/saveBean',
        method: 'post',
        data
    })
}
// 随访复制
// | 参数名 | 说明 | 是否必须 |
// | -----  | ---  | -------- |
// | id     | 主键 | t       |
export function copyVisit (params) {
    return request({
        url: '/api/manage/plan/copyBean',
        method: 'get',
        params
    })
}
// 随访删除
// | 参数名 | 说明 | 是否必须 |
// | -----  | ---  | -------- |
// | id     | 主键 | t       |
export function deleteVisit (params) {
    return request({
        url: '/api/manage/plan/deleteBeanById',
        method: 'get',
        params
    })
}
// 随访编辑
// | 参数名         | 说明                                       | 是否必须 |
// | -------------- | ------------------------------------------ | -------- |
// | name           | 表单名称                                   | t        |
// | departmentId   | 部门id(取部门查询接口中子部门的deptId)     | t        |
// | departmentName | 部门name(取部门查询接口中子部门的deptName) | t        |
// | hospitalId     | 医院id(取部门查询接口中parentId=0的deptId) |          |
// | typeCode       | 类型code                                   | t        |
// | typeName       | 类型名称                                   | t        |
// | id             | 主键                                       |          |
export function updateVisit (data) {
    return request({
        url: '/api/manage/plan/updateBean',
        method: 'post',
        data
    })
}
// 随访状态编辑
// | 参数名    | 说明     | 是否必须 |
// | --------- | -------- | -------- |
// | status    | 状态     | t        |
// | id      | 主键     | t        |
export function updateStatusVisit (data) {
    return request({
        url: '/api/manage/plan/updatePlanStatus',
        method: 'post',
        data
    })
}
//获取某个随访--unuse
// | 参数名 | 说明 | 是否必须 |
// | ------ | ---- | -------- |
// | id     | id   | t        |
export function getVisitItemInfo (params) {
    return request({
        url: '/api/manage/plan/getBeanById',
        method: 'get',
        params
    })
}