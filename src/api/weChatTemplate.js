import request from './axios'
// 微信模板-保存
export function weChatTemplateAdd(data) {
  return request({
    url: '/api/wechatTemplate/add',
    method: 'POST',
    data
  })
}
// 微信模板-获取所有
export function weChatTemplateGetAll (params) {
  return request({
    url: '/api/wechatTemplate/getAll',
    method: 'GET',
    params
  })
}

// 微信模板-基本信息
export function weChatTemplateGetOneById (params) {
  return request({
    url: '/api/wechatTemplate/getOneById',
    method: 'GET',
    params
  })
}

// 微信模板-下线
export function weChatTemplateUpdate (data) {
  return request({
    url: '/api/wechatTemplate/update',
    method: 'POST',
    data
  })
}

// 微信模板-删除
export function weChatTemplateDel (params) {
  return request({
    url: '/api/wechatTemplate/del',
    method: 'DELETE',
    params
  })
}