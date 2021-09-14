import request from './axios'

// 患者分析接口
export function getPatientAnalysis(params) {
  return request({
    url: '/api/live/patientAnalysis',
    method: 'GET',
    params
  })
}

// 患者来源接口
export function getSourcePatients(params) {
  return request({
    url: '/api/live/sourcePatients',
    method: 'GET',
    params
  })
}

// 癌症分布接口
export function getInfoByCreateBy(params) {
  return request({
    url: '/api/live/getInfoByCreateBy',
    method: 'GET',
    params
  })
}

// 癌种分布接口
export function getIntoGroupDistribute(params) {
  return request({
    url: '/api/live/getIntoGroupDistribute',
    method: 'GET',
    params
  })
}
// 性别分布接口
export function getGenderDistribution(params) {
  return request({
    url: '/api/live/genderDistribution',
    method: 'GET',
    params
  })
}


// 年龄分布接口
export function getInfoByAge(params) {
  return request({
    url: '/api/live/getInfoByAge',
    method: 'GET',
    params
  })
}

// 地域分布接口
export function getInfoByLocal(params) {
  return request({
    url: '/api/live/getInfoByLocal',
    method: 'GET',
    params
  })
}
// 新疆地域分布接口
export function getXJInfoByLocal(params) {
  return request({
    url: '/api/live/getXJInfoByLocal',
    method: 'GET',
    params
  })
}
