import request from './axios'

// 获取导出字段
export function getColumns(params) {
  return request({
    url: '/api/patient/getColumns',
    method: 'GET',
    params
  })
}

// 获取民族下拉框
export function getNations(params) {
  return request({
    url: '/api/patient/getNations',
    method: 'GET',
    params
  })
}
// 获取职业
export function getWorks(params) {
  return request({
    url: '/api/patient/getWorks',
    method: 'GET',
    params
  })
}
// 获取地区
export function getAreas(params) {
  return request({
    url: '/api/patient/getAreas',
    method: 'GET',
    params
  })
}
// 获取病理诊断
export function getMains(params) {
  return request({
    url: '/api/patient/getMains',
    method: 'GET',
    params
  })
}



// 患者总数
export function getSourcePatients(params) {
  return request({
    url: '/api/patient/sourcePatients',
    method: 'GET',
    params
  })
}

// 医院科室
export function getHospitals(params) {
  return request({
    url: '/api/patient/getHospitals',
    method: 'GET',
    params
  })
}
 
// 病种 
export function getDiseaseName(params) {
  return request({
    url: '/api/patient/getDiseaseName',
    method: 'GET',
    params
  })
}
// 0.3 获取患者病种接口
export function getProjectDiseaseDic(params) {
  return request({
    url: '/api/project/diseaseDic',
    method: 'GET',
    params
  })
}

// KM病种
export function getFindDiseases(params) {
  return request({
    url: '/api/live/findDiseases',
    method: 'GET',
    params
  })
}

// KM病种折线
export function getInfoByDisease(data) {
  return request({
    url: '/api/live/getInfoByDisease',
    method: 'POST',
    data
  })
}

// 主治医师
export function getP433(params) {
  return request({
    url: '/api/patient/getP433',
    method: 'GET',
    params
  })
}

// 住院医师
export function getP434(params) {
  return request({
    url: '/api/patient/getP434',
    method: 'GET',
    params
  })
}


// ！-----------失访------------------------------------！
// 项目 
export function findProjectList(params) {
  return request({
    url: '/api/live/findProjectList',
    method: 'GET',
    params
  })
}
// 失访列表 
export function analysisLostVisits(data) {
  return request({
    url: '/api/live/analysisLostVisits',
    method: 'POST',
    data
  })
}

// 生存情况
export function SurvivalConditionAnalysis(data) {
  return request({
    url: '/api/live/SurvivalConditionAnalysis',
    method: 'POST',
    data
  })
}
// 生存情况-KM
export function SurvivalConditionAnalysisKM(data) {
  return request({
    url: '/api/live/SurvivalConditionAnalysisByKV',
    method: 'POST',
    data
  })
}

// 随访人员list   
// '/api/base/getAllUsers', 获取所有人员
// 改为 '/api/base/getOperUsers',
export function getAnalyList(params) {
  return request({
    // url: '/api/base/getOperUsers',
    url: '/api/base/getOperUsers',
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
    url: '/api/live/getInfoByCreateBy',
    method: 'POST',
    data
  })
}
// 按年月统计
export function getInfoByCreateByVaild(data) {
  return request({
    url: '/api/live/getInfoByCreateByVaild',
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
    url: '/api/live/export',
    method: 'POST',
    responseType:"blob",
    data
  })
}
// 生存情况分析excel-寿命表法
export function exportBySur(data) {
  return request({
    url: '/api/live/exportBySur',
    method: 'POST',
    responseType:"blob",
    data
  })
}
// 生存情况分析excel-KM
export function exportByKM(data) {
  return request({
    url: '/api/live/exportByKM',
    method: 'POST',
    responseType:"blob",
    data
  })
}

// 生存情况分析---寿命表法
export function lifeTableMethod(data) {
  return request({
    url: '/api/live/SurvivalConditionAnalysis3',
    method: 'POST',
    data
  })
}

// 下载
export function downloadLostData(data) {
  return request({
    url: '/api/live/exportByLost',
    method: 'POST',
    responseType:"blob",
    data
  })
}
// 按年月下载excel
export function exportByVaild(data) {
  return request({
    url: '/api/live/exportByVaild',
    method: 'POST',
    responseType:"blob",
    data
  })
}