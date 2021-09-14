<template>
  <div class="content">
    <div class="page-nav">
      <el-row :gutter="10">
        <el-col :span="4" class="steps"></el-col>
        <el-col :span="16" class="steps">
          <el-steps :active="active">
            <el-step title="访视计划"></el-step>
            <el-step title="患者筛选"></el-step>
            <el-step title="任务分配"></el-step>
          </el-steps>
        </el-col>
        <el-col :span="4" class="steps"></el-col>
      </el-row>
    </div>
    <!-- 访视计划 -->
    <div v-if="active === 1">
      <div class="plan-details">
        <FollowUpPlan
          :planName="planName"
          @childNextStep="nextStep"
          @turnBack="turnBack"
        />
      </div>
    </div>
    <div v-if="active === 2">
      <div class="screening-box">
        <div class="nav-search formStyle">
          <el-tabs v-model="activeSearchName" @tab-click="handleClick">
            <el-tab-pane label="常规检索" name="first">
              <el-form
                ref="commonForm"
                :model="commonForm"
                size="mini"
                label-width="140px"
              >
                <el-row :gutter="10">
                  <el-col :span="24">
                    <el-form-item label="批量病案号查询">
                      <el-input
                        type="textarea"
                        placeholder="请输入要查询的病案号，多个病案号用英文逗号隔开，单个病案号支持模糊查询，多个病案号只支持精准查询"
                        v-model="commonForm.medicalNumberTextarea"
                        :disabled="projectStatus == 1"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      class="elect100"
                      label="首次确诊入院科室"
                      :title="admissionDepartment()"
                    >
                      <el-select
                        v-model="commonForm.departmentNames"
                        multiple
                        :collapse-tags="commonForm.departmentNames.length > 3"
                        placeholder="请选择"
                        @change="medicalNumbersChangeVal"
                        :disabled="projectStatus == 1"
                      >
                        <el-option
                          v-for="item in departmentList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="首次确诊出院时间">
                      <div
                        v-for="(item, index) in commonForm.dateArray"
                        :key="index"
                      >
                        <el-date-picker
                          v-model="commonForm.dateArray[index]"
                          :disabled="projectStatus == 1"
                          type="daterange"
                          align="right"
                          unlink-panels
                          :clearable="false"
                          range-separator="-"
                          value-format="yyyy-MM-dd"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :picker-options="pickerOptions"
                        ></el-date-picker>
                        <i
                          class="el-icon-circle-close"
                          v-if="projectStatus != 1"
                          @click="delDateArray(index)"
                          style="margin-left: 2px; font-size: 20px"
                        ></i>
                      </div>
                      <i
                        class="el-icon-circle-plus-outline"
                        @click="addDateArray"
                        v-show="
                          commonForm.dateArray.length === 0 ||
                          commonForm.dateArray[
                            commonForm.dateArray.length - 1
                          ][0]
                        "
                        style="font-size: 20px"
                      ></i>
                      <!-- <i class="el-icon-circle-plus-outline" @click="addDateArray"></i> -->
                      <!-- <el-date-picker
                    v-model="commonForm.timeDcDate2"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                  ></el-date-picker> -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      class="elect100"
                      label="标准病种"
                      :title="showValue()"
                    >
                      <el-select
                        v-model="commonForm.diseases"
                        multiple
                        :collapse-tags="commonForm.diseases.length > 3"
                        placeholder="请选择"
                        @change="medicalNumbersChange"
                        :disabled="projectStatus == 1"
                      >
                        <el-option
                          v-for="item in diseaseList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-checkbox
                        v-model="commonForm.checked"
                        :disabled="projectStatus == 1"
                      >
                        <span v-if="followType == 'review'">
                          去除有就诊记录的患者,去除天数:
                          <el-input
                            type="number"
                            size="mini"
                            :disabled="projectStatus == 1"
                            class="input-dateCount"
                            v-model="commonForm.dateCount"
                            style="width: 100px"
                          ></el-input>
                        </span>
                        <span v-else>患者自动入组</span>
                      </el-checkbox>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :span="4">
                    <el-button
                      type="primary"
                      @click="openMoreSearch"
                      size="mini"
                      >展开更多
                      <i v-show="!isMoreSearch" class="el-icon-arrow-down"></i>
                      <i v-show="isMoreSearch" class="el-icon-arrow-up"></i>
                    </el-button>
                  </el-col>
                </el-row>
                <el-row :gutter="10" v-if="isMoreSearch">
                  <el-col :span="24">
                    <IntegratedaDvanced
                      ref="integratedaDvancedRef"
                      :notSearch="projectStatus == 1"
                    />
                  </el-col>
                </el-row>

                <el-form-item size="large" style="text-align: right">
                  <el-button
                    type="primary"
                    @click="resetClick"
                    size="mini"
                    :disabled="projectStatus == 1"
                    >重置</el-button
                  >
                  <el-button
                    type="primary"
                    @click="filterClickFn"
                    size="mini"
                    :disabled="projectStatus == 1"
                    >筛选</el-button
                  >
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <!-- <el-tab-pane label="高级检索" name="second" v-if="false">
              <IntegratedaDvanced />
            </el-tab-pane> -->
          </el-tabs>
        </div>
        <div class="search-data">
          <TabItemTable
            ref="tabItemTableList"
            :commonForm="commonForm"
            :advancedSearch="advancedSearch"
            :dateCount="commonForm.dateCount"
            :checkedVal="commonForm.checked"
            @activeChangeToGo="activeChangeToGo"
            :filterClickCount="filterClickCount"
            @filterClickCountChange="filterClickCountChange"
          />
        </div>
        <!-- <el-row :gutter="10">
          <el-col :span="24" class="text-center margintb24">
            <el-button type="primary" @click="backOn">上一步</el-button>
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </el-col>
        </el-row>-->
      </div>
    </div>
    <div v-if="active === 3">
      <TaskDistribution
        :filterClickCount="filterClickCount"
        @filterClickCountChange="filterClickCountChange"
      />
    </div>
  </div>
</template>

<script>
import Bus from "@/utils/bus.js";
import { getFindPlanByType } from "@/api/specialFollowUp";

import {
  getProjectDiseaseDic,
  getProjectDeptDic,
} from "@/api/survivalFollowup";

import FollowUpPlan from "./Components/FollowUpPlan";
import TemplateSelect from "@/components/TemplateSelect";
import TabItemTable from "./Components/TabItemTable";
import TaskDistribution from "./Components/TaskDistribution";
import IntegratedaDvanced from "./Components/IntegratedaDvanced";
export default {
  name: "PlanSetUp",
  components: {
    TemplateSelect,
    FollowUpPlan,
    TabItemTable,
    TaskDistribution,
    IntegratedaDvanced,
  },
  data() {
    return {
      isMoreSearch: false,
      isClickMoreSearch: false,
      advancedSearch: {
        conditionItemList: [
          {
            esType: "", //类型
            logicVal: "",
            logicList: [
              {
                label: "并且",
                value: "0",
              },
              {
                label: "或者",
                value: "3",
              },
            ],
            topicVal: "",
            conditionVal: "",
            conditionList: [],
            range: "",
            filterList: [],
          },
        ],
      },

      followType: "",
      active: 1,
      isPlan: false,
      planName: "",
      dataVisit: {
        name: "",
        typeCode: "",
        department: [],
      },
      templateList: [],
      templateVal: [],
      // plan3
      distributionType: "average",
      // plan2
      commonForm: {
        dateCount: "0",
        dateArray: [["", ""]],
        // timeDcDate: ['',''],
        // timeDcDate2: ['',''],
        checked: false,
        medicalNumbers: [],
        departmentNames: [],
        diseases: [],
        beforeDcDate: "",
        afterDcDate: "",
        medicalNumberTextarea: "",
      },
      diseaseChecked: [],
      admissionDepartmentChecked: [],
      projectStatus: "",

      diseaseList: [],
      departmentList: [],

      pickerOptions: {
        shortcuts: [
          {
            text: "最近7天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近30天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近90天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 89);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },

      activeSearchName: "first",

      filterClickCount: 0,
    };
  },
  created() {
    this.followType = this.$route.query.type;
    this.projectStatus = this.$route.query.projectStatus;

    this.getFindPlanByTypeFn(); //获取常用专题随访计划模板
    this.getProjectDiseaseDicFn(); // 病种
    this.getProjectDeptDicFn(); // 科室
    if (this.$route.query.type == "review") {
      this.commonForm.dateCount = "90";
    }
  },
  mounted() {},
  destroyed() {},
  methods: {
    // 展开高级检索
    openMoreSearch() {
      this.isMoreSearch = !this.isMoreSearch;
      this.isClickMoreSearch = !this.isClickMoreSearch;
    },

    addDateArray() {
      this.commonForm.dateArray.push(["", ""]);
    },
    delDateArray(index) {
      console.log(index);
      console.log(this.commonForm.dateArray);
      this.commonForm.dateArray.splice(index, 1);
    },
    //标准病种title显示
    showValue() {
      return this.diseaseChecked
        .reduce((t, e) => {
          t.push(this.diseaseList.filter((_) => _.value === e)[0].label);
          return t;
        }, [])
        .join(",");
    },
    admissionDepartment() {
      return this.admissionDepartmentChecked
        .reduce((t, e) => {
          t.push(this.departmentList.filter((_) => _.value === e)[0].label);
          return t;
        }, [])
        .join(",");
    },
    medicalNumbersChange(val) {
      this.diseaseChecked = val;
    },
    medicalNumbersChangeVal(val) {
      this.admissionDepartmentChecked = val;
    },
    //筛选

    // 获取病种(暂定)
    getProjectDiseaseDicFn() {
      let dataV = {
        id: this.$route.query.id,
      };
      getProjectDiseaseDic(dataV)
        .then((res) => {
          console.log(res, "病种");
          this.diseaseList = res.data;
        })
        .catch((error) => {
          this.$message.error("获取失败");
        });
    },
    // 获取科室(暂定)
    getProjectDeptDicFn() {
      let dataV = {
        id: this.$route.query.id,
      };
      getProjectDeptDic(dataV)
        .then((res) => {
          console.log(res, "科室");
          this.departmentList = res.data;
        })
        .catch((error) => {
          this.$message.error("获取失败");
        });
    },
    // 重置
    resetClick() {
      Object.assign(this.$data.commonForm, this.$options.data().commonForm); // 部分重置
      if (this.isClickMoreSearch) {
        this.advancedSearch = this.$refs["integratedaDvancedRef"].resetSearch(); // 重置高级检索
      }
      this.filterClickFn(2);
    },
    filterClickFn(operButtonNum) {
      // integratedaDvancedRef 是否被使用
      if (this.isClickMoreSearch) {
        this.advancedSearch =
          this.$refs["integratedaDvancedRef"].handleSearch();
      }

      this.$nextTick(() => {
        this.$refs.tabItemTableList.getComSearchFn(operButtonNum);
      });
    },
    //查询 常规检索
    handleClick() {},

    // plan3

    //  plan2
    //tab切换
    // 患者筛选下一步
    activeChangeToGo(val) {
      this.active = val;
    },
    filterClickCountChange() {
      this.filterClickCount = 0;
    },
    backOn() {
      this.active--;
    },
    nextStep() {
      this.active++;
      // 默认患者筛选
      if (this.active == 2) {
        this.filterClickFn("next");
      }
    },
    //plan1
    //获取常用专题随访计划模板
    getFindPlanByTypeFn() {
      const postData = {
        // pageNum: 1,
        // pageSize: 100000,
        typeCode: "special",
      };
      // this.tableLoading = true;
      getFindPlanByType(postData)
        .then((res) => {
          // console.log("getFindPlanByType", res);
          this.templateList = res.data;
          // this.tableLoading = false;
        })
        .catch((error) => {
          // this.tableLoading = false;
          console.error("getFindPlanByType", error);
        });
    },
    // 新增访视计划
    addPlan() {
      this.isPlan = false;
      this.planName = "";
    },
    determineClicK() {
      this.isPlan = false;
    },
    parentFn() {},
    turnBack(active) {
      // http://localhost:8080/#/survival/followup?t=1598249112601
      // this.$router.push("/survival/followup");
      this.$router.go(-1);
    },
    // 下一步
    next() {
      console.log(this.active, "this.active");
    },
  },
  watch: {
    active: function (n, o) {
      if (n === 2 && o === 3) {
        this.filterClickFn("next");
      }
      if (n === 2) {
        this.searchCondition = localStorage.getItem("searchCondition")
          ? JSON.parse(localStorage.getItem("searchCondition"))
          : null;
        if (this.searchCondition) {
          Object.assign(this.commonForm, this.searchCondition);
          this.commonForm.dateArray =
            this.searchCondition.dateArray.length === 0
              ? [["", ""]]
              : this.searchCondition.dateArray;
          this.commonForm.checked =
            this.searchCondition.dateCount > 0 ? true : false;
          this.commonForm.medicalNumberTextarea =
            this.searchCondition.medicalNumbers.length > 0
              ? this.searchCondition.medicalNumbers.join(",")
              : "";
          // this.commonForm.timeDcDate = [this.searchCondition.beforeDcDate,this.searchCondition.afterDcDate];
          // this.commonForm.timeDcDate2 = [this.searchCondition.secondBeforeDcDate,this.searchCondition.secondAfterDcDate];

          //  高级检索
          this.advancedSearch.conditionItemList =
            this.searchCondition.conditionItemList;

          if (this.advancedSearch.conditionItemList.length != 0) {
            this.isMoreSearch = true;
            this.isClickMoreSearch = true;
          } else {
            this.advancedSearch.conditionItemList = [
              {
                esType: "", //类型
                logicVal: "",
                logicList: [
                  {
                    label: "并且",
                    value: "0",
                  },
                  {
                    label: "或者",
                    value: "3",
                  },
                ],
                topicVal: "",
                conditionVal: "",
                conditionList: [],
                range: "",
                filterList: [],
              },
            ];
            console.log(" 11111111111111111111111111111111111111111");
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-nav {
  background: #ffffff;
  height: 80px;
  margin-bottom: 16px;
}
.plan1 {
  background: #ffffff;
  padding: 20px;
}
.screening-box {
  background-color: #ffffff;
  padding: 20px;
  // height: calc(100% - 200px);
  .automatic {
    margin-left: 24px;
  }
  .search-data {
    width: 100%;
  }
}
</style>
<style lang="scss">
.steps {
  height: 80px;
  .el-steps.el-steps--horizontal {
    padding-top: 20px;
  }
  .el-step__icon {
    background: #44b1af;
    color: #2f7e7d;
  }
  .el-step__line {
    background-color: #cadef1;
  }
  .el-step__title {
    margin-left: -20px;
    font-size: 14px;
    font-family: PingFang SC Bold, PingFang SC Bold-Bold;
    font-weight: 700;
  }
  .el-step__head.is-finish {
    .el-step__icon.is-text {
      color: #ffffff;
      background: #2f7e7d;
    }
    .el-step__line {
      background-color: #2f7e7d;
    }
  }
  .el-step__head.is-process,
  .el-step__head.is-wait {
    border-color: #44b1af;
    .el-step__icon.is-text {
      color: #ffffff;
    }
  }
  .el-step__main {
    .el-step__title.is-finish {
      color: #333;
    }
    .el-step__title.is-process,
    .el-step__title.is-wait {
      color: #666;
    }
  }

  .el-step__head.is-success {
    color: #2476c2;
    border-color: #2476c2;
  }
  .el-step__title.is-success {
    color: #333333;
  }
}

.label-module {
  line-height: 20px;
  color: #333333;
  span {
    display: inline-block;
    border-left: 3px solid #2476c2;
    padding-left: 16px;
  }
}
.formStyle .el-select,
.formStyle .el-date-editor {
  width: calc(100% - 24px);
}
</style>
