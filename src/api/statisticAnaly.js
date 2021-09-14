import request from './axios'
// 常规随访统计分析

// 随访人员list   
// '/api/base/getAllUsers', 获取所有人员
// 改为 '/api/base/getOperUsers',
export function getAnalyList(params) {
  return request({
    // url: '/api/base/getOperUsers',
    url: '/api/base/getOperUsersCG',
    method: 'GET',
    params
  })
}


// 常规根据随访人统计接口（新）
export function getInfoByCreateByAndDeps(data) {
  return request({
    // url: '/api/base/getOperUsers',
    url: '/api/routine/patient/getInfoByCreateByAndDeps',
    method: 'POST',
    data
  })
}


// 获取数量统计
export function getStatistics(params) {
  return request({
    url: '/api/routine/patient/findStatistics',
    method: 'GET',
    params
  })
}
// 根据随访人员统计
// | 参数名                                              | 说明     | 是否必须 |
// | :-------------------------------------------------- | :------- | -------- |
// | updateTimePre                                       | 前时间窗 | t        |
// | updateTimeSuf                                       | 后时间窗 | t        |
// | creates                                             | 人员数组 | t        |
// | types(下面那个统计图还是这个接口，需要加上这个参数)    | 类型数组 | t        |
export function getAnalyData(data) {
  return request({
    url: '/api/routine/patient/getInfoByCreateBy',
    method: 'POST',
    data
  })
}

// 下载Excel
// | 参数名                                              | 说明         | 是否必须 |
// | :-------------------------------------------------- | :----------- | -------- |
// | updateTimePre                                       | 前时间窗     | t        |
// | updateTimeSuf                                       | 后时间窗     | t        |
// | creates                                             | 人员数组     | t        |      "creates":["system","admin"],
// | createUsers                                         | 人员名称数组 |          |      "createUsers":["管理员","管理员"],
// | flag(1:有效随访，2：实际随访)                        | 标识         | t        |
// | types(按方式的统计图需要加上这个参数)                 | 类型数组     | t        |      "types":["mobile","wechart"]
export function downloadAnalyData(data) {
  return request({
    url: '/api/routine/patient/export',
    method: 'POST',
    responseType:"blob",
    data
  })
}
// XXXXXXX
export function downloadAnalyExportInfo(data) {
  return request({
    url: '/api/routine/patient/exportInfo',
    method: 'POST',
    responseType:"blob",
    data
  })
}

// 按病种统计接口
// | 参数名        | 说明                 | 是否必须 |
// | ------------- | -------------------- | -------- |
// | updateTimePre | 前时间窗             | t        |
// | updateTimeSuf | 后时间窗             | t        |
// | diseaseCodes  | 病种code（逗号拼接） | t        |
// | creates       | 随访人               | t        |
export function getByDisease(data) {
  return request({
    url: '/api/live/findEventByDiease',
    method: 'POST',
    data
  })
}

export function getByDiseaseList(params) {
  return request({
    url: 'api/patient/getDiseaseName',
    method: 'GET',
    params
  })
}

//专题项目列表
export function getSelectAllProject(params) {
  return request({
    url: 'api/project/getSelectAllProject',
    method: 'GET',
    params
  })
}
//专题项目列表 生存情况分析
export function postSurvivalConditionAnalysis(data) {
  return request({
    url: 'api/project/survivalConditionAnalysis',
    method: 'POST',
    data
  })
}
