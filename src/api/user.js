import request from './axios'
//退出
export function logout(data) {
  return request({
    url: '/api/base/logout',
    method: 'POST',
    data
  })
}
//获取用户信息
export function getUserInfo () {
  return request({
    url: '/api/base/getUserInfo',
    method: 'GET'
  })
}
//获取用户权限列表
export function getUserMenu () {
  return request({
    url: '/api/base/getUserMenu',
    method: 'GET'
  })
}
// 获取字典
export function getFindAllByTypeCode (params) {
  return request({
    url: '/api/dict/findAllByTypeCode',
    method: 'GET',
    params
  })
}