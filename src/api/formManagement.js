// 每个模块都应该有自己的接口文件去统一管理api
import request from './axios'

//获取类型列表
export function getTypeList () {
  return request({
    url: '/api/manage/form/types',
    method: 'get'
  })
}
//获取表单列表
// | 参数名   | 说明   | 是否必须 |
// | -------- | ------ | -------- |
// | pageNum  | 当前页 | f        |
// | pageSize | 数量   | f        |
// | typeCode | 类型   | f        |
// | name     | 表单名称| f        |
export function getFormList(params) {
  return request({
    url: '/api/manage/form/getFormList',
    method: 'get',
    params
  })
}
// 表单新建
// | 参数名           | 说明     | 是否必须 |
// | ---------------- | -------- | -------- |
// | name             | 表单名称 | t        |
// | typeCode         | 类型code | t        |
// | typeName         | 类型名称 | t        |
export function saveForm (data) {
  return request({
    url: '/api/manage/form/saveBean',
    method: 'post',
    data
  })
}
// 表单复制
// | 参数名 | 说明 | 是否必须 |
// | -----  | ---  | -------- |
// | id     | 主键 | t       |
export function copyForm (params) {
  return request({
    url: '/api/manage/form/copyBean',
    method: 'get',
    params
  })
}

// 表单删除
// | 参数名 | 说明 | 是否必须 |
// | -----  | ---  | -------- |
// | id     | 主键 | t       |
export function deleteForm (params) {
  return request({
    url: '/api/manage/form/deleteBeanById',
    method: 'get',
    params
  })
}
// 表单编辑
// | 参数名 | 说明 | 是否必须 |
// | -----  | ---  | -------- |
// | id     | 主键 | t       |
export function updateForm (data) {
  return request({
    url: '/api/manage/form/updateBean',
    method: 'post',
    data
  })
}
// 表单状态编辑
// | 参数名    | 说明     | 是否必须 |
// | --------- | -------- | -------- |
// | code      | 表单code | t        |
// | status    | 状态     | t        |
// | tableName | 表名     | t        |
// | pkId      | 主键     | t        |
export function updateStatusForm (data) {
  return request({
    url: '/api/manage/form/updateStatus',
    method: 'post',
    data
  })
}
//获取某个表单
// | 参数名 | 说明 | 是否必须 |
// | ------ | ---- | -------- |
// | id     | id   | t        |
export function getFormItemInfo (params) {
  return request({
    url: '/api/manage/form/getBeanById',
    method: 'get',
    params
  })
}

