import request from './../axios'

//获取微信模板列表
export function getWeChatList (params) {
  return request({
      url: '/api/wechatTemplate/getWebChatTemplateByStatus',
      method: 'get',
      params
  })
}
//获取短信模板列表
export function getSmsList (params) {
  return request({
      url: '/api/smsTemplate/getSmsTemplateByStatus',
      method: 'get',
      params
  })
}

// 获取列表接口 生存随访项目列表   肿瘤
export function registrationLiveFindAllProject(params) {
  return request({
    url: '/api/live/registration/findAllProject',
    method: 'GET',
    params
  })
}

// 查询所有医院列表 肿瘤
export function registrationAllHospital(params) {
  return request({
    url: '/api/live/registration/getAllHospital',
    method: 'GET',
    params
  })
}

// 生存随访 肿瘤 新建 
export function registrationAddProject(data) {
  return request({
    url: '/api/live/registration/addProject',
    method: 'POST',
    data
  })
}

// 生存随访 肿瘤 访视计划  保存
export function registrationSaveNextStep(data) {
  return request({
    url: '/api/live/registration/saveNextStep',
    method: 'POST',
    data
  })
}

// 根据自定义查询条件查询应随访病人信息接口  肿瘤
export function registrationFindPatientInfoByCondition(data) {
  return request({
    url: '/api/live/registration/findByCondition',
    method: 'POST',
    data
  })
}
// 根据自定义查询条件查询应随访病人信息接口  肿瘤
export function registrationFindPatientInfoByConditionNext(data) {
  return request({
    url: '/api/live/registration/findByConditionNext',
    method: 'POST',
    data
  })
}

// 查询所有病种  肿瘤
export function registrationGetAllDiseases(params) {
  return request({
    url: '/api/live/registration/getAllDiseases',
    method: 'GET',
    params
  })
}

// 查询所有科室  肿瘤
export function registrationGetAllDepartment(params) {
  return request({
    url: '/api/live/registration/getAllDepartment',
    method: 'GET',
    params
  })
}

// 项目详情查询 患者列表   肿瘤
export function registrationGetProspectAllPatient(params) {
  return request({
    url: '/api/live/registration/findPatientInfoById',
    method: 'GET',
    params
  })
}

// 项目详情 随访方案 查询    肿瘤
export function registrationGetBeanById(params) {
  return request({
    url: '/api/live/registration/getBeanById',
    method: 'GET',
    params
  })
}
// 项目进度 患者状态分布
export function getPatientPercent(params) {
  return request({
    url: '/api/live/registration/getPatientPercent',
    method: 'GET',
    params
  })
}
// 项目进度 癌种分布
export function getDiseasesPercent(params) {
  return request({
    url: '/api/live/registration/getDiseasesPercent',
    method: 'GET',
    params
  })
}
// 项目进度 进度分布-阶段list
// projectId
export function queryNodes(params) {
  return request({
    url: '/api/live/registration/queryNodes',
    method: 'GET',
    params
  })
}
// 项目进度 进度分布-阶段detail
// projectPlanId
export function findPointsCount(params) {
  return request({
    url: '/api/live/registration/findPointsCount',
    method: 'GET',
    params
  })
}

// 项目详情 随访方案 患者入组 查询    肿瘤
export function registrationAddSearchCondition(data) {
  return request({
    url: '/api/live/registration/addSearchCondition',
    method: 'POST',
    data
  })
}


// 更新项目的患者   表格统计接口 肿瘤
export function getRegistrationLiveInfoById(params) {
  return request({
    url: '/api/live/registration/getInfoById',
    method: 'GET',
    params
  })
}


// 更新项目的患者数量等信息接口  确认分配 肿瘤
export function postRegistrationAddAllocation(data) {
  return request({
    // url: '/api/live/registration/addAllocation',
    url: '/api/allocation/addAllocation',
    method: 'POST',
    data
  })
}

// 前瞻获取左侧时间轴列表+随访信息接口
export function getRegistrationBeansByPro(params) {
  return request({
    url: '/api/live/registration/getBeansByPro',
    method: 'GET',
    params
  })
}

// ### 随访信息保存接口 肿瘤
export function postLiveRegistrationResultAdd(data) {
  return request({
    url: '/api/live/registration/result/add',
    method: 'POST',
    data
  })
}


// ### 肿瘤登记随访工作量分析 按病种统计  肿瘤
export function getRegistrationWorkloadAnalysis(params) {
  return request({
    url: '/api/live/registration/workloadAnalysis',
    method: 'GET',
    params
  })
}

//终止项目
// id、status=3
export function stopPro(data) {
  return request({
    url: '/api/live/registration/updateStatus',
    method: 'POST',
    data
  })
}
//获取随访人员
export function getRegisterUsers(params) {
  return request({
    url: '/api/live/registration/getRegisterUsers',
    method: 'GET',
    params
  })
}
// 项目 获取随访人员
// projectId
export function getListByProjectId(params) {
  return request({
    url: '/api/allocation/getListByProjectId',
    method: 'GET',
    params
  })
}
/*--------------统计分析-患者情况分析--------------*/
export function getPatientAnalysis(params) {
  return request({
    url: '/api/live/registration/patientAnalysis',
    method: 'GET',
    params
  })
}

// 患者来源接口
export function getSourcePatients(params) {
  return request({
    url: '/api/live/registration/sourcePatients',
    method: 'GET',
    params
  })
}

// 癌症分布接口
export function getInfoByCreateBy(params) {
  return request({
    url: '/api/live/registration/getInfoByCreateBy',
    method: 'GET',
    params
  })
}

// 癌种分布接口
export function getIntoGroupDistribute(data) {
  return request({
    url: '/api/live/registration/getIntoGroupDistribute',
    method: 'POST',
    data
  })
}
// 性别分布接口
export function getGenderDistribution(params) {
  return request({
    url: '/api/live/registration/genderDistribution',
    method: 'GET',
    params
  })
}


// 年龄分布接口
export function getInfoByAge(params) {
  return request({
    url: '/api/live/registration/getInfoByAge',
    method: 'GET',
    params
  })
}

// 地域分布接口
export function getInfoByLocal(params) {
  return request({
    url: '/api/live/registration/getInfoByLocal',
    method: 'GET',
    params
  })
}
/*--------------统计分析-失访情况分析--------------*/
// 项目list 
export function findProjectList(params) {
  return request({
    url: '/api/live/registration/findProjectList',
    method: 'GET',
    params
  })
}
// 表格数据
export function analysisLostVisits(data) {
  return request({
    url: '/api/live/registration/analysisLostVisits',
    method: 'POST',
    data
  })
}
// 下载
export function downloadLostData(data) {
  return request({
    url: '/api/live/registration/exportByLost',
    method: 'POST',
    responseType:"blob",
    data
  })
}
/*--------------统计分析-生存情况分析--------------*/
// 生存情况分析excel-寿命表法
export function exportBySur(data) {
  return request({
    url: '/api/live/registration/exportBySur',
    method: 'POST',
    responseType:"blob",
    data
  })
}
// 生存情况分析excel-KM算法
export function exportByKM(data) {
  return request({
    url: '/api/live/registration/exportByKM',
    method: 'POST',
    responseType:"blob",
    data
  })
}
// 医院科室
export function getHospitals(params) {
  return request({
    url: '/api/live/registration/getHospitals',
    method: 'GET',
    params
  })
}
// 病种
export function getDiseaseName(params) {
  return request({
    url: '/api/live/registration/getDiseaseName',
    method: 'GET',
    params
  })
}
// 主治医师
export function getP433(params) {
  return request({
    url: '/api/live/registration/getP433',
    method: 'GET',
    params
  })
}
// 住院医师
export function getP434(params) {
  return request({
    url: '/api/live/registration/getP434',
    method: 'GET',
    params
  })
}
// table数据
export function SurvivalConditionAnalysis(data) {
  return request({
    url: '/api/live/registration/SurvivalConditionAnalysis',
    method: 'POST',
    data
  })
}
// table数据-KM
export function SurvivalConditionAnalysisKM(data) {
  return request({
    url: 'api/live/registration/SurvivalConditionAnalysisByKV',
    method: 'POST',
    data
  })
}
// 生存情况分析---寿命表法
export function lifeTableMethod(data) {
  return request({
    url: '/api/live/registration/SurvivalConditionAnalysis3',
    method: 'POST',
    data
  })
}
/*--------------统计分析-随访情况分析--------------*/

// 随访人员list
export function getAnalyList(params) {
  return request({
    url: '/api/base/getRegisterUsers',
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
    url: '/api/live/registration/getInfoByCreateBy',
    method: 'POST',
    data
  })
}
//病种列表
export function getByDiseaseList(params) {
  return request({
    url: 'api/live/registration/getDiseaseName',
    method: 'GET',
    params
  })
}
// 随访有效率
export function efficient(data) {
  return request({
    url: '/api/live/registration/getInfoByCreateByVaild',
    method: 'POST',
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
    url: '/api/live/registration/findEventByDiease',
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
    url: '/api/live/registration/export',
    method: 'POST',
    responseType:"blob",
    data
  })
}
