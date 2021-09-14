// 每个模块都应该有自己的接口文件去统一管理api
import request from './axios'

// 查询配置详情
export function callsetGetOneById(params) {
  return request({
    url: '/api/callset/getOneById',
    method: 'GET',
    params
  })
}

// 电话拨号录音设置 新增
export function callsetAdd(data) {
  return request({
    url: '/api/callset/add',
    method: 'POST',
    data
  })
}
// 电话拨号录音设置 新增
export function callsetUpdate(data) {
  return request({
    url: '/api/callset/update',
    method: 'POST',
    data
  })
}

// （1）微信测试
export function getTestWechat(params) {
  return request({
    url: '/api/callset/testWechat',
    method: 'GET',
    params
  })
}

// （2）短信测试
export function getTestPhone(params) {
  return request({
    url: '/api/callset/testPhone',
    method: 'GET',
    params
  })
}

// （3)获取接口设置
export function getOneByUserItCode(params) {
  return request({
    url: '/api/callset/getOneByUserItCode',
    method: 'GET',
    params
  })
}

// （4）保存接口设置
export function getTestAdd(data) {
  return request({
    url: '/api/callset/add',
    method: 'POST',
    data
  })
}

