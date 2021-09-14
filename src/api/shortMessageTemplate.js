import request from './axios'
// 短信模板-保存
export function smsTemplateAdd(data) {
  return request({
    url: '/api/smsTemplate/add',
    method: 'POST',
    data
  })
}
// 短信模板-获取所有
export function smsTemplateGetAll (params) {
  return request({
    url: '/api/smsTemplate/getAll',
    method: 'GET',
    params
  })
}

// 短信模板-基本信息
export function smsTemplateGetOneById (params) {
  return request({
    url: '/api/smsTemplate/getOneById',
    method: 'GET',
    params
  })
}

// 短信模板-下线
export function smsTemplateUpdate (data) {
  return request({
    url: '/api/smsTemplate/update',
    method: 'POST',
    data
  })
}

// 短信模板-删除
export function smsTemplateDel (params) {
  return request({
    url: '/api/smsTemplate/del',
    method: 'DELETE',
    params
  })
}