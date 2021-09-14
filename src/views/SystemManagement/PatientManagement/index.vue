<template>
  <div class="content" style="display: none" :style="{ display: 'block' }">
    <el-row class="nav-column">
      <el-col :span="4" class="relative">
        <div class="type-box">
          <p>患者总人数</p>
          <h5>{{ patientsTotal }}</h5>
        </div>
      </el-col>
      <!-- <el-col :span="4">
        <p>稳定患者</p>
        <h5>{{ stableTotal }}</h5>
      </el-col>
      <el-col :span="4">
        <p>复发患者</p>
        <h5>{{ relapseTotal }}</h5>
      </el-col>
      <el-col :span="4">
        <p>转移患者</p>
        <h5>{{ transferTotal }}</h5>
      </el-col>
      <el-col :span="4">
        <p>失访患者</p>
        <h5>{{ lostTotal }}</h5>
      </el-col>
      <el-col :span="4">
        <p>死亡患者</p>
        <h5>{{ deathTotal }}</h5>
      </el-col> -->
      <el-col :span="4">
        <p>本院患者人数</p>
        <h5>{{ selfHospPatientNum }}</h5>
      </el-col>
      <el-col :span="4">
        <p>肿瘤患者</p>
        <h5>{{ cancerPatientNum }}</h5>
      </el-col>
      <el-col :span="4" class="relative">
        <!-- <div class="type-box">
          <p>非肿瘤患者</p>
          <h5>{{ noCancerPatientNum }}</h5>
        </div> -->
        <p>非肿瘤患者</p>
        <h5>{{ noCancerPatientNum }}</h5>
      </el-col>
      <el-col :span="4" v-if="false">
        <p>其他中心肿瘤患者</p>
        <h5>{{ otherHospPatientNum }}</h5>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24" class="interval15"></el-col>
    </el-row>

    <el-row v-if="false">
      <el-col :span="24" class="echart-grid">
        <span class="echart-tit"> 患者来源 </span>
        <div
          id="sourceId"
          ref="sourceId"
          v-loading="sourceLoading"
          class="echart-container"
          :style="{ height: sourceIdHeight }"
        ></div>
      </el-col>
    </el-row>

    <el-row :gutter="10" v-if="false">
      <el-col :span="24" class="interval15"></el-col>
    </el-row>

    <div class="page-search query-box">
      <el-form
        label-position="left"
        ref="SurvivalAnalyForm"
        label-width="80px"
        :model="SurvivalAnalyForm"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="医院名称">
              <el-select
                @change="hospitalChange"
                v-model="SurvivalAnalyForm.hospitalName"
                filterable
                collapse-tags
                clearable
                size="mini"
                style="margin-left: 20px"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in hospitalList"
                  :key="item.index"
                  :label="item.data.hos"
                  :value="item.index"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="确诊时间">
              <el-date-picker
                v-model="p31"
                size="mini"
                type="daterange"
                range-separator="至"
                unlink-panels
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="性　　别">
              <el-select
                v-model="SurvivalAnalyForm.sex"
                filterable
                collapse-tags
                clearable
                size="mini"
                style="margin-left: 20px"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in sexOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="职　　业">
              <el-select
                v-model="SurvivalAnalyForm.works"
                filterable
                multiple
                collapse-tags
                clearable
                size="mini"
                style="margin-left: 20px"
                placeholder="请选择职业"
              >
                <el-option
                  v-for="item in worksList"
                  :key="item.index"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="随访状态">
              <el-select
                v-model="SurvivalAnalyForm.lastFollowResult"
                filterable
                collapse-tags
                clearable
                size="mini"
                style="margin-left: 20px"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in lastFollowResultList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="模糊查询">
              <el-input
                size="mini"
                v-model="SurvivalAnalyForm.keyword"
                placeholder="搜索患者姓名、手机号、病案号、主要诊断"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="肿瘤分期">
							<el-select
								v-model="SurvivalAnalyForm.name"
								multiple
								filterable
								collapse-tags
								size="mini"
								style="margin-left: 20px;"
								placeholder="请选择肿瘤分期">
									<el-option
									v-for="item in options"
									:key="item.value"
									:label="item.label"
									:value="item.value">
									</el-option>
								</el-select>
						</el-form-item> -->
            <!-- <el-form-item label="住院医师">
							<el-select
								v-model="SurvivalAnalyForm.P434"
								filterable
								collapse-tags
								size="mini"
								style="margin-left: 20px;"
								placeholder="请选择">
									<el-option
									v-for="item in minorList"
									:key="item.index"
									:label="item.name"
									:value="item.name">
									</el-option>
							</el-select>
						</el-form-item> -->
          </el-col>
          <el-col :span="8">
            <!-- <el-form-item label="随访结局">
              <el-select
                class="marginl24_qx"
                v-model="SurvivalAnalyForm.followResult"
                clearable
                filterable
                size="mini"
                placeholder="选择随访结局"
              >
                <el-option
                  v-for="item in followUpType"
                  :label="item.name"
                  :value="item.code"
                  :key="item.code"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="科室名称">
              <el-select
                v-model="SurvivalAnalyForm.departmentNames"
                filterable
                multiple
                collapse-tags
                clearable
                size="mini"
                style="margin-left: 20px"
                placeholder="请选择科室"
              >
                <el-option
                  v-for="item in departmentList"
                  :key="item.index"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="出院时间">
              <el-date-picker
                v-model="dcDate"
                type="daterange"
                size="mini"
                range-separator="至"
                unlink-panels
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>

            <!-- <el-form-item label="治疗方式">
							<el-select
								v-model="SurvivalAnalyForm.na1me"
								multiple
								filterable
								collapse-tags
								size="mini"
								style="margin-left: 20px;"
								placeholder="请选择">
									<el-option
									v-for="item in options"
									:key="item.value"
									:label="item.label"
									:value="item.value">
									</el-option>
							</el-select>
						</el-form-item> -->
            <!-- <el-form-item label="年龄范围">
							<el-input size="mini" v-model="SurvivalAnalyForm.beforeAge" style="width: 44%;" placeholder="最小年龄"></el-input>
							<span style="display: inline-block;width: 12%;text-align: center;">至</span>
							<el-input size="mini" v-model="SurvivalAnalyForm.afterAge" style="width: 44%;" placeholder="最大年龄"></el-input>
						</el-form-item> -->

            <el-form-item label="年龄范围">
              <el-input
                size="mini"
                v-model="SurvivalAnalyForm.beforeAge"
                style="width: 44%"
                placeholder="最小年龄"
              ></el-input>
              <span
                style="display: inline-block; width: 12%; text-align: center"
                >至</span
              >
              <el-input
                size="mini"
                v-model="SurvivalAnalyForm.afterAge"
                style="width: 44%"
                placeholder="最大年龄"
              ></el-input>
            </el-form-item>

            <el-form-item label="地　　区">
              <el-select
                v-model="SurvivalAnalyForm.areas"
                filterable
                multiple
                collapse-tags
                clearable
                size="mini"
                style="margin-left: 20px"
                placeholder="请选择地区"
              >
                <el-option
                  v-for="item in areasList"
                  :key="item.index"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="随访结局">
              <el-select
                size="mini"
                multiple
                v-model="SurvivalAnalyForm.res"
                placeholder="请选择随访结局"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="疾病病种">
              <el-select
                v-model="SurvivalAnalyForm.diseaseNames"
                filterable
                multiple
                collapse-tags
                clearable
                size="mini"
                style="margin-left: 20px"
                placeholder="请选择病种"
              >
                <el-option
                  v-for="item in diseaseList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="随访时间">
              <el-date-picker
                v-model="followupDate"
                type="daterange"
                size="mini"
                range-separator="至"
                unlink-panels
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item label="民　　族">
              <el-select
                v-model="SurvivalAnalyForm.nations"
                filterable
                multiple
                collapse-tags
                clearable
                size="mini"
                style="margin-left: 20px"
                placeholder="请选择民族"
              >
                <el-option
                  v-for="item in nationsList"
                  :key="item.index"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="病理诊断">
              <el-select
                v-model="SurvivalAnalyForm.mains"
                filterable
                multiple
                collapse-tags
                clearable
                size="mini"
                style="margin-left: 20px"
                placeholder="请选择病理诊断"
              >
                <el-option
                  v-for="item in mainsList"
                  :key="item.index"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="疾病类型">
              <el-select
                v-model="SurvivalAnalyForm.isTumor"
                filterable
                collapse-tags
                clearable
                size="mini"
                style="margin-left: 20px"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in isTumorList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <!-- <el-form-item label="主治医师">
              <el-select
                v-model="SurvivalAnalyForm.P433"
                filterable
                collapse-tags
                clearable
                size="mini"
                style="margin-left: 20px"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in majorList"
                  :key="item.index"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="住院医师">
              <el-select
                v-model="SurvivalAnalyForm.P434"
                filterable
                collapse-tags
                clearable
                size="mini"
                style="margin-left: 20px"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in minorList"
                  :key="item.index"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item> -->
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="24" class="open_relative">
            <el-button
              class="btn_open_more"
              type="primary"
              @click="openMoreSearch"
              size="mini"
            >
              <span v-show="!isMoreSearch"
                >展开更多 <i class="el-icon-arrow-down"></i
              ></span>
              <span v-show="isMoreSearch">
                收起更多 <i class="el-icon-arrow-up"></i
              ></span>
            </el-button>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-if="isMoreSearch">
          <el-col :span="24">
            <IntegratedaDvanced
              ref="integratedaDvancedRef"
              :notSearch="false"
            />
          </el-col>
        </el-row>
        <el-form-item class="buttons-box">
          <el-button
            size="mini"
            class="searchbtn"
            type="primary"
            icon="el-icon-search"
            @click="seacherClick"
          >
            查询
          </el-button>
          <el-upload
            class="upload-demo marginl24 uploadbtn"
            :action="importApi"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            ref="upload"
            multiple
            :show-file-list="false"
            :limit="1"
          >
            <el-button
              size="mini"
              icon="el-icon-upload2"
              @click="submitUpload"
              type="primary"
            >
              批量导入
            </el-button>
          </el-upload>
          <el-button
            size="mini"
            class="searchbtn marginl24"
            icon="el-icon-download"
            type="primary"
          >
            <a
              class="down-template"
              :href="downloadExcel"
              download="模板下载.xlsx"
              title="下载"
            >
              模板下载
            </a>
          </el-button>
          <!-- <el-button
            size="mini"
            class="searchbtn"
            type="primary"
            icon="el-icon-download"
            @click="postExportFileFn"
          >
            患者导出
          </el-button> -->

          <el-button
            size="mini"
            class="searchbtn"
            type="primary"
            icon="el-icon-download"
            @click="postExportSearchFn"
          >
            导出筛选
          </el-button>
          <!-- <a
            class="down-template marginl24"
            :href="downloadExcel"
            download="模板下载.xlsx"
            title="下载"
          >
            模板下载
          </a> -->
          <!-- <el-button size="mini" @click="resetForm('SurvivalAnalyForm')">重置</el-button> -->
          <!-- <el-button size="mini" type="primary" @click="submitForm('SurvivalAnalyForm')">查询</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="导出数据"
      :visible.sync="dialogVisibleList"
      width="60%"
      v-loading="loadingDialog"
      top="116px"
    >
      <div>
        <!-- <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          >全选</el-checkbox
        > -->
        <el-row
          :gutter="10"
          class="groupList"
          v-for="(items, index) in searchAllList"
          :key="index"
        >
          <div class="checkbox-title">
            <span class="marginr20"> {{ items.tableName }}</span>

            <el-checkbox
              :indeterminate="isIndeterminate[index]"
              v-model="checkAll[index]"
              @change="handleCheckAllChange($event, index)"
            >
              全选
            </el-checkbox>
          </div>

          <el-checkbox-group
            v-model="checkedList[index].checkList"
            @change="handleCheckedListChange($event, index)"
          >
            <el-checkbox
              v-for="item in items.columns"
              :label="item.columnDesc"
              :key="item.columnDesc"
            >
              {{ item.columnDesc }}
            </el-checkbox>
          </el-checkbox-group>
        </el-row>
        <el-row>
          <el-col class="dialog-footer">
            <el-button class="cancel-btn" @click="dialogVisibleList = false"
              >取 消</el-button
            >
            <el-button
              class="determine-btn marginl24"
              type="primary"
              @click="determineClick"
              >确 定</el-button
            >
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <div class="page-table">
      <el-table
        stripe
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="tpatno"
          align="center"
          label="病案号"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="patientName"
          align="center"
          label="姓名"
          width="80"
        ></el-table-column>
        <el-table-column prop="sex" align="center" label="性别" width="50">
          <template slot-scope="scope">
            <span v-if="scope.row.sex == 1">男</span>
            <span v-else-if="scope.row.sex == 2">女</span>
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="age"
          align="center"
          label="年龄"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          align="center"
          label="手机号"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="diseaseName"
          align="center"
          label="病种"
          min-width="140"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="firstConfirmDate"
          align="center"
          label="确诊日期"
          width="110"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.firstConfirmDate | dateFilters }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="icd10Name1"
          align="center"
          label="主要诊断"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <!-- <el-table-column
          prop="description"
          align="center"
          label="病理诊断"
        ></el-table-column> -->

        <el-table-column align="center" width="110" label="最后接触时间">
          <template slot-scope="scope">
            <span>{{ scope.row.lastContactTime | dateFilters }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastContactType"
          align="center"
          width="110"
          label="最后接触类型"
        ></el-table-column>
        <el-table-column
          prop="lastContactResult"
          align="center"
          width="110"
          label="最后接触结果"
        ></el-table-column>
        <el-table-column align="center" label="最近随访时间" width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.lastFollowTime | dateFilters }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastFollowResult"
          align="center"
          label="最近随访结局"
          width="110"
        >
          <!-- <template slot-scope="scope">
            {{ followResult[scope.row.lastFollowResult] }}
          </template> -->
        </el-table-column>
        <el-table-column
          prop="hospitalName"
          align="center"
          label="来源医院"
          min-width="170"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="100">
          <template slot-scope="scope">
            <span class="operation-btn" @click="turnTab(scope.row)">查看</span>
            <span
              class="operation-btn"
              v-show="scope.row.lastFollowResult"
              @click="editPatientFn(scope.row)"
              >修改</span
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="修改结果" :visible.sync="dialogVisible" width="35%">
        <el-form
          ref="revokeForm"
          :rules="rules"
          :model="revokeForm"
          label-width="170px"
          size="mini"
        >
          <el-form-item label="最后一次随访时间" prop="date">
            <el-date-picker
              type="date"
              placeholder="最后一次随访时间"
              value-format="yyyy-MM-dd"
              v-model="revokeForm.date"
              :picker-options="pickerOptions"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="最后一次随访方式">
            <el-input
              placeholder="最后一次随访方式"
              v-model="revokeForm.lastFollowType"
              :disabled="true"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="最后一次随访结局" prop="res">
            <el-select
              @change="selFollowResult"
              v-model="revokeForm.res"
              placeholder="最后一次随访结局"
              style="width: 100%"
            >
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="失访原因"
            prop="lostCause"
            v-show="revokeForm.res == '失访'"
          >
            <el-select
              v-model="revokeForm.lostCause"
              placeholder="失访原因"
              style="width: 100%"
            >
              <el-option
                v-for="item in lostCauseList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="死亡时间"
            prop="deathDate"
            v-show="revokeForm.res == '死亡'"
          >
            <el-date-picker
              type="date"
              placeholder="死亡时间"
              value-format="yyyy-MM-dd"
              v-model="revokeForm.deathDate"
              :picker-options="pickerOptions"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="操作人">
            <el-input
              placeholder="操作人"
              v-model="revokeForm.followUser"
              :disabled="true"
            >
            </el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="revokePatientConfirm('revokeForm')"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <div class="pages-modules">
        <el-pagination
          style="float: right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          :pager-count="7"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
//echarts相关插件
let Echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/bar"); //柱状图
require("echarts/lib/chart/pie"); //扇形图
require("echarts/lib/chart/line"); //线形图
require("echarts/lib/chart/pictorialBar"); // 象形柱图

import IntegratedaDvanced from "./Components/IntegratedaDvanced";
import { parseTime } from "@/utils/index.js";
import { getFindAllByTypeCode } from "@/api/user";
import {
  getHospitals,
  getDiseaseName,
  getProjectDiseaseDic,
  getP433,
  getP434,
  getSourcePatients,
  getNations,
  getWorks,
  getAreas,
  getMains,
  getColumns,
} from "@/api/survivalAnaly";
import {
  patientGetAll,
  patientGetAll2,
  postExportFile,
  postExportFileSearch,
  getTotalNum,
  updatePatientFollowResult,
} from "@/api/patientManagement";

export default {
  name: "PatientManagement",
  components: {
    IntegratedaDvanced,
  },
  data() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
    return {
      isMoreSearch: false, //高级检索
      isMoreSearch: false, //
      loadingDialog: false,
      dialogVisibleList: false,
      searchAllList: [], //遍历字段数据
      checkAll: [], //全选
      checkedList: [], //所选值
      allAolumns: [], //所有导出数据
      allAolumnsList: [], //所有导出数据value
      defaultCheckList: [], //默认所选
      isIndeterminate: [], // 是否全选

      sourceIdHeight: "140px",
      sourceLoading: false,
      rules: {
        date: [{ required: true, message: "请选择时间", trigger: "blur" }],
        res: [{ required: true, message: "请选择结局", trigger: "change" }],
        deathDate: [
          { required: false, message: "请选择死亡时间", trigger: "blur" },
        ],
        lostCause: [
          { required: false, message: "请选择失访原因", trigger: "change" },
        ],
      },
      dialogVisible: false,
      revokeForm: {
        id: "",
        date: "",
        res: "",
        lastFollowType: "",
        lostCause: "",
        followUser: "",
        deathDate: "",
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e7就是不可以选择今天的
        },
      },
      typeList: [],
      followUpTypeList: [],
      lostCauseList: [
        { name: "错号" },
        { name: "无人接听" },
        { name: "空号" },
        { name: "拒绝随访" },
        { name: "主动拒绝" },
        { name: "关机" },
        { name: "停机" },
        { name: "无法接通" },
      ],
      dcDate: ["", ""],
      followupDate: ["", ""],
      p31: ["", ""],
      postHospitalName: "",
      SurvivalAnalyForm: {
        hospitalName: "",
        departmentNames: [],
        sex: "",
        beforeAge: "",
        afterAge: "",
        beforeDcDate: "",
        afterDcDate: "",
        beforeFollowupDate: "",
        afterFollowupDate: "",
        beforeP31: "",
        afterP31: "",
        diseaseNames: [],
        res: "",
        // P433: "",
        // P434: "",
      },
      isTumorList: [
        {
          value: 1,
          label: "肿瘤",
        },
        {
          value: 0,
          label: "非肿瘤",
        },
      ],
      lastFollowResultList: [
        {
          value: "已随访",
          label: "已随访",
        },
        {
          value: "待随访",
          label: "待随访",
        },
      ],
      sexOptions: [
        {
          value: 1,
          label: "男",
        },
        {
          value: 2,
          label: "女",
        },
        {
          value: 0,
          label: "未知",
        },
      ],
      hospitalList: [],
      departmentList: [],
      diseaseList: [],
      nationsList: [],
      worksList: [],
      areasList: [],
      mainsList: [],
      majorList: [],
      minorList: [],

      importApi: "",
      downloadExcel: "",
      SurvivalAnalyForm: {
        keyword: "",
        followResult: "",
      },
      followUpType: [],
      tableData: [],
      loading: false,
      pageNum: 1, // 分页数据
      pageSize: 10, // 每页展示数量
      total: 0, // 总数

      stableTotal: 0, // 稳定
      lostTotal: 0, // 失访
      deathTotal: 0,
      transferTotal: 0, // 转移
      relapseTotal: 0, // 复发

      patientsTotal: 0, // 总数
      noCancerPatientNum: 0, // 非肿瘤患者
      cancerPatientNum: 0, // 肿瘤患者
      selfHospPatientNum: 0, // 本院患者人数
      otherHospPatientNum: 0, // 其他中心肿瘤患者
    };
  },
  watch: {},
  created() {
    this.importApi = this.$ajax.defaults.baseURL + "/api/patient/import";
    // /api/patient/downloadExcel
    this.downloadExcel =
      this.$ajax.defaults.baseURL + "/api/patient/downloadTemplate";
    this.getCode();
    this.seacherClick();
    this.getTotalNumFn();

    this.getHospitalsFn();
    this.getDiseaseNameFn();
    this.getFindAllByTypeCodeFn();
    // this.getP433Fn();
    // this.getP434Fn();

    // this.getSourcePatientsFn(); 患者来源

    this.getNationsFn();
    this.getWorksFn();
    // this.getAreasFn();
    // this.getMainsFn();
    this.getColumnsFn();
  },
  mounted() {},
  methods: {
    // 展开高级检索
    openMoreSearch() {
      this.isMoreSearch = !this.isMoreSearch;
    },
    //点击导出
    postExportSearchFn() {
      this.dialogVisibleList = true;
    },
    // 获取导出字段
    getColumnsFn() {
      getColumns().then((res) => {
        this.searchAllList = res.data; // 全部数据

        this.defaultCheckList = []; // 默认选择
        this.allAolumns = []; // 所有对象

        this.searchAllList.forEach((element, index) => {
          let elementDefault = element.checks.map((x) => {
            return x.columnDesc;
          });

          let elementAllAolumns = element.columns.map((x) => {
            return x.columnDesc;
          });

          this.isIndeterminate[index] = elementDefault.length > 0;
          this.checkAll[index] =
            elementDefault.length == elementAllAolumns.length;
          this.defaultCheckList.push({ checkList: elementDefault });
          this.allAolumnsList.push({ columnDescList: elementAllAolumns });
          this.allAolumns = this.allAolumns.concat(element.columns);
        });

        this.checkedList = this.defaultCheckList; // 当前选择数据

        // this.isIndeterminate[0] = false;   空白
        // this.isIndeterminate[1] = true;   // 横杠

        //  this.checkAll[0]= false;  // 空白
        //  this.checkAll[1]= true;   //对号

        // this.checkedList.forEach((item,index) => {
        //   if(item.checkList.checkList.length){
        //     this.checkAll[index] =
        //   }
        // });
        // this.allAolumnsList = this.allAolumns.map((x) => {
        //   return x.columnDesc;
        // });
      });
    },
    // 全选
    handleCheckAllChange(val, index) {
      this.checkedList[index].checkList = val
        ? this.allAolumnsList[index].columnDescList
        : [];
      this.isIndeterminate[index] = false;
    },
    //单选
    handleCheckedListChange(value, index) {
      let checkedCount = value.length;
      this.$set(
        this.checkAll,
        index,
        checkedCount === this.allAolumnsList[index].columnDescList.length
      );
      this.$set(
        this.isIndeterminate,
        index,
        checkedCount > 0 &&
          checkedCount < this.allAolumnsList[index].columnDescList.length
      );
    },
    // 患者来源
    getSourcePatientsFn() {
      this.sourceLoading = true;
      getSourcePatients()
        .then((res) => {
          let yDataList = res.data.map((x) => {
            return x.count;
          });
          let xDataList = res.data.map((x) => {
            return x.hospitalName;
          });
          this.sourceIdHeight = yDataList.length * 50 + "px";
          this.sourceLoading = false;
          this.showSource(xDataList.reverse(), yDataList.reverse());
        })
        .catch((error) => {
          this.sourceLoading = false;
          console.error(error);
        });
    },
    // 患者来源
    showSource(xDataList, yDataList) {
      this.$nextTick(() => {
        let sourceChart = document.getElementById("sourceId");
        let sourcecharts = Echarts.init(sourceChart);
        let sourceOption = {
          color: {
            type: "linear",
            x: 0,
            y: 1,
            x2: 1,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#7683D9", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#D8A0FE", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          grid: {
            left: "16%",
            right: "10%",
            bottom: 0,
            top: 0,
            containLabel: false,
          },
          yAxis: [
            {
              type: "category",
              data: xDataList,
              axisTick: {
                show: false,
              },
              axisLine: {
                show: false,
              },
            },
            {
              type: "category",
              axisTick: "none",
              axisLine: "none",
              show: true,
              axisLabel: {
                textStyle: {
                  color: "#000",
                  fontSize: "12",
                },
              },
              data: yDataList,
            },
          ],
          xAxis: [
            {
              type: "value",
              show: false,
            },
          ],
          series: [
            {
              name: "患者数量",
              type: "bar",
              barGap: "-100%",
              showBackground: true,
              data: yDataList,
              barWidth: 12,
              backgroundStyle: {
                color: "#DFE5F1",
                barBorderRadius: 6,
              },
              itemStyle: {
                borderType: "solid",
                barBorderRadius: 6,
              },
            },
          ],
        };
        // console.log(JSON.stringify(sourceOption));

        sourcecharts.setOption(sourceOption, true);
        window.addEventListener("resize", () => {
          sourcecharts.resize();
        });
      });
    },
    selFollowResult(val) {
      // console.log(val)
      this.rules.lostCause[0].required = val == "失访";
      this.rules.deathDate[0].required = val == "死亡";
    },
    revokePatientConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const postData = {
            id: this.revokeForm.id.toString(),
            lastFollowResult: this.revokeForm.res,
            lastFollowTime: this.revokeForm.date,
          };
          if (this.revokeForm.res == "死亡") {
            postData.deathTime = this.revokeForm.deathDate;
          }
          if (this.revokeForm.res == "失访") {
            postData.dataCheck = this.revokeForm.lostCause;
          }
          console.log(postData, this.revokeForm.date);
          updatePatientFollowResult(postData).then((res) => {
            console.log("撤销", res);
            this.seacherClick();
            this.dialogVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getFindAllByTypeCodeFn() {
      getFindAllByTypeCode({ typeCode: "finish" }).then((res) => {
        this.typeList = res.data;
      });
    },

    // 获取民族下拉框
    getNationsFn() {
      getNations().then((res) => {
        this.nationsList = res.data.reduce((t, e, i) => {
          t.push({ name: e, index: i });
          return t;
        }, []);
        console.log(res, "获取民族下拉框");
      });
    },
    // 获取职业
    getWorksFn() {
      getWorks().then((res) => {
        this.worksList = res.data.reduce((t, e, i) => {
          t.push({ name: e, index: i });
          return t;
        }, []);
        console.log(res, "获取职业");
      });
    },
    // 获取地区
    getAreasFn() {
      getAreas().then((res) => {
        this.areasList = res.data.reduce((t, e, i) => {
          t.push({ name: e, index: i });
          return t;
        }, []);
        console.log(res, "获取地区");
      });
    },
    // 获取病理诊断
    getMainsFn() {
      getMains().then((res) => {
        this.mainsList = res.data.reduce((t, e, i) => {
          t.push({ name: e, index: i });
          return t;
        }, []);
        console.log(res, "获取病理诊断");
      });
    },

    // get医院科室
    getHospitalsFn() {
      getHospitals().then((res) => {
        this.hospitalList = res.data.reduce((t, e, i) => {
          t.push({ data: e, index: i });
          return t;
        }, []);
      });
    },
    // 医院切换赋值科室
    hospitalChange(value) {
      if (typeof value === "string") return false;
      this.postHospitalName = this.hospitalList[value].data.hos;
      this.departmentList = this.hospitalList[value].data.deps.reduce(
        (t, e, i) => {
          t.push({ name: e, index: i });
          return t;
        },
        []
      );
    },
    // get病种
    getDiseaseNameFn() {
      getProjectDiseaseDic().then((res) => {
        this.diseaseList = res.data;
        // this.diseaseList = res.data.reduce((t, e, i) => {
        //   t.push({ label: e, value: e });
        //   return t;
        // }, []);
      });
    },
    // get主治医师
    getP433Fn() {
      getP433().then((res) => {
        this.majorList = res.data.reduce((t, e, i) => {
          t.push({ name: e, index: i });
          return t;
        }, []);
      });
    },
    // get住院医师
    getP434Fn() {
      getP434().then((res) => {
        this.minorList = res.data.reduce((t, e, i) => {
          t.push({ name: e, index: i });
          return t;
        }, []);
      });
    },
    beforeUpload() {
      this.loading = true;
    },
    submitUpload() {
      this.$refs.upload.submit();
      // this.loading=true;
    },
    // 上传成功
    handleSuccess(val) {
      this.loading = false;
      this.$message.success(val.data);
      this.$refs.upload.clearFiles();
      this.seacherClick();
    },
    //   筛选导出
    determineClick() {
      let seacherData = this.seacherData();
      this.loadingDialog = true;
      let this_ = this;

      let allCheckedList = [];
      this.checkedList.forEach((item) => {
        allCheckedList = allCheckedList.concat(item.checkList);
      });

      let postCheckedALLList = this.allAolumns.filter(function (x) {
        return allCheckedList.includes(x.columnDesc);
      });

      let columnsArr = postCheckedALLList.map((x) => {
        return x.columnName;
      });
      let columnNameArr = postCheckedALLList.map((x) => {
        return x.columnDesc;
      });
      seacherData.columnNames = columnNameArr.join(",");
      seacherData.columns = columnsArr.join(",");
      console.log(seacherData, "seacherData");

      postExportFileSearch(seacherData)
        .then((res) => {
          this.loadingDialog = false;
          const content = res;
          const blob = new Blob([content]);
          const fileName = "患者信息.xlsx";
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }

          this.dialogVisibleList = false;
        })
        .catch((error) => {
          this.loadingDialog = false;
          this.dialogVisibleList = false;
          console.error(error);
        });
    },
    // 患者导出
    postExportFileFn() {
      let seacherData = this.seacherData();
      this.loading = true;
      postExportFile(seacherData)
        .then((res) => {
          this.loading = false;
          const content = res;
          const blob = new Blob([content]);
          const fileName = "患者信息.xlsx";
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 获取码值表
    getCode() {
      let data = {
        typeCode: "followResult",
      };
      getFindAllByTypeCode(data)
        .then((res) => {
          this.followUpType = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getTotalNumFn() {
      getTotalNum()
        .then((res) => {
          this.patientsTotal = res.data.total;
          // this.stableTotal = res.data.stableTotal;
          // this.lostTotal = res.data.lostTotal;
          // this.deathTotal = res.data.deathTotal;
          // this.transferTotal = res.data.transferTotal;
          // this.relapseTotal = res.data.relapseTotal;
          this.noCancerPatientNum = res.data.noCancerPatientNum;
          this.cancerPatientNum = res.data.cancerPatientNum;
          this.selfHospPatientNum = res.data.selfHospPatientNum;
          this.otherHospPatientNum = res.data.otherHospPatientNum;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    seacherData() {
      const postData = {
        page: this.pageNum,
        pageSize: this.pageSize,
        ...this.SurvivalAnalyForm,
        hospitalName: this.postHospitalName,
        beforeDcDate: parseTime(this.dcDate[0], "{y}-{m}-{d}"),
        afterDcDate: parseTime(this.dcDate[1], "{y}-{m}-{d}"),
        beforeFollowupDate: parseTime(this.followupDate[0], "{y}-{m}-{d}"),
        afterFollowupDate: parseTime(this.followupDate[1], "{y}-{m}-{d}"),
        beforeP31: parseTime(this.p31[0], "{y}-{m}-{d}"),
        afterP31: parseTime(this.p31[1], "{y}-{m}-{d}"),
      };
      console.log(postData, "?");
      return postData;
    },
    // 查询
    seacherClick() {
      // let params = {
      //   pageNum: this.pageNum,
      //   pageSize: this.pageSize,
      //   keyword: this.SurvivalAnalyForm.keyword,
      //   followResult: this.SurvivalAnalyForm.followResult,
      // };
      // let seacherData = this.seacherData();

      // this.loading = true;
      // patientGetAll2(seacherData)
      //   .then((res) => {
      //     this.loading = false;
      //     this.tableData = res.data.list;
      //     this.total = res.data.total;
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //   });

      // integratedaDvancedRef 是否被使用

      let seacherData = this.seacherData();

      if (this.isMoreSearch) {
        seacherData.conditionItemList = [];
        let conditionItemListVal =
          this.$refs["integratedaDvancedRef"].handleSearch();

        seacherData.conditionItemList = conditionItemListVal.conditionItemList;

        if (
          conditionItemListVal.conditionItemList[0].topicVal &&
          conditionItemListVal.conditionItemList[0].topicVal != ""
        ) {
          seacherData.conditionItemList =
            conditionItemListVal.conditionItemList;
        } else {
          seacherData.conditionItemList = [];
        }
      }

      this.loading = true;
      console.log(seacherData, "oldProcedureoldProcedure,6666666666666");
      patientGetAll2(seacherData)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.list;
          this.total = res.data.total;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    editPatientFn(val) {
      console.log(val,'访原因访原因访原因',val.lastFollowResult)
      this.$refs.revokeForm && this.$refs.revokeForm.resetFields();
      this.dialogVisible = true;
      this.revokeForm.id = val.id;
      if (val.lastFollowTime) {
        this.revokeForm.date = val.lastFollowTime;
      }
      if (val.lastFollowResult) {
        this.revokeForm.res = val.lastFollowResult;
        if (val.deathTime) {
          this.rules.deathDate[0].required = true;
          this.revokeForm.deathDate = val.deathTime;
        } else {
          this.rules.deathDate[0].required = false;
        }
        if (val.lostReason) {
          this.rules.lostCause[0].required = true;
          this.revokeForm.lostCause = val.lostReason;
        } else {
          this.rules.lostCause[0].required = false;
        }
      }
      if (val.lastFollowUser) {
        this.revokeForm.followUser = val.lastFollowUser;
      }
      if (val.lastFollowType) {
        this.revokeForm.lastFollowType = val.lastFollowType;
      }
    },
    // 审批跳转
    turnTab(val) {
      this.$router.push({
        path: "/manage/patient/details",
        query: {
          id: val.id,
          name: val.name,
          diseaseId: val.diseaseID, // jijw 新增
        },
      });
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.seacherClick();
    },
    // 页数按钮
    handleCurrentChange(val) {
      this.pageNum = val;
      console.log(`当前页: ${val}`);
      this.seacherClick();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.query-box {
  background-color: #fff;
  padding: 20px;

  .el-range-editor.el-input__inner {
    width: 100%;
  }

  .el-select {
    width: 100%;
    margin: 0 !important;
  }

  .buttons-box {
    margin-top: 20px;
    text-align: center;
    .searchbtn,
    .uploadbtn {
      display: inline-block;
    }
  }
}
.vertical-bot {
  vertical-align: bottom !important;
}
.type-box:after {
  content: "";
  position: absolute;
  width: 1px;
  height: 40px;
  background: #e5e5e5;
  top: 8px;
  right: 0;
}

.echart-grid {
  padding-bottom: 20px;
  background-color: #fff;
  .echart-tit {
    font-family: "PingFang SC Bold";
    position: relative;
    font-weight: bold;
    font-size: 16px;
    margin-top: 16px;
    margin-left: 23px;
    display: inline-block;
  }

  .echart-tit::before {
    content: "";
    width: 4px;
    height: 16px;
    background-color: #2476c2;
    position: absolute;
    top: 3px;
    left: -7px;
  }

  .echart-container {
    width: 100%;
    height: 128px;
  }
}
.groupList {
  padding: 0 5px;
  .el-checkbox {
    width: 23%;
  }
}

.checkbox-title {
  margin: 10px 0;
  font-size: 15px;
  line-height: 32px;
  font-weight: bold;
}
.open_relative {
  position: relative;
  height: 1px;
  margin-top: -45px;
}
.btn_open_more {
  position: absolute;
  top: 0;
  right: 4px;
}
</style>
