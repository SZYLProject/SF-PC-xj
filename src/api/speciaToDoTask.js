import request from './axios'

//  待办任务-日历统计
export function getFollowTaskByDate(params) {
  return request({
    url: '/api/project/follow/taskByDate',
    method: 'GET',
    params
  })
}
//  待办任务-专题随访待处理任务
export function getPatientTofollow(params) {
  return request({
    url: '/api/project/patient/tofollow',
    method: 'GET',
    params
  })
}