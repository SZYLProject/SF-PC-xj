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
          :projectId="projectId"
          :planId="planId"
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
                        v-model="commonForm.medicalNumber"
                        :disabled="projectStatus == 1"
                      ></el-input> </el-form-item
                  ></el-col>
                  <el-col :span="12">
                    <el-form-item class="elect100" label="首次确诊入院科室">
                      <el-select
                        v-model="commonForm.departmentNames"
                        :disabled="projectStatus == 1"
                        multiple
                        :collapse-tags="commonForm.departmentNames.length > 3"
                        placeholder="请选择"
                        @change="medicalNumbersChangeVal"
                      >
                        <el-option
                          v-for="(item, index) in departmentOption"
                          :key="index"
                          :label="item.departmentName"
                          :value="item.departmentName"
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
                      <!-- <el-date-picker
                    v-model="commonForm.dcDate"
                    type="daterange"
                    align="right"
                    value-format="yyyy-MM-dd"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                  ></el-date-picker> -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="elect100" label="标准病种">
                      <el-select
                        v-model="commonForm.diseases"
                        :disabled="projectStatus == 1"
                        multiple
                        :collapse-tags="commonForm.diseases.length > 3"
                        placeholder="请选择"
                        @change="medicalNumbersChange"
                      >
                        <el-option
                          v-for="(item, index) in diseasesOption"
                          :key="index"
                          :label="item.diseaseName"
                          :value="item.diseaseName"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-checkbox
                        v-model="commonForm.checked"
                        :disabled="projectStatus == 1"
                      >
                        <!-- <span>
                      去除有就诊记录的患者,去除天数:
                      <el-input
                        type="number"
                        size="mini"
                        class="input-dateCount"
                        v-model="commonForm.dateCount"
                        style="width: 100px"
                      ></el-input>
                    </span> -->
                        <span>患者自动入组</span>
                      </el-checkbox>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item size="large" style="text-align: right">
                  <!-- <el-button type="primary" size="mini">重置</el-button>
                  <el-button type="primary" @click="onSubmit" size="mini">筛选</el-button> -->
                  <el-button
                    type="primary"
                    @click="resetClick"
                    size="mini"
                    :disabled="projectStatus == 1"
                    >重置</el-button
                  >
                  <el-button
                    type="primary"
                    @click="onSubmit"
                    size="mini"
                    :disabled="projectStatus == 1"
                    >筛选</el-button
                  >
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <!-- <el-tab-pane label="高级检索" name="second">
              <IntegratedaDvanced />
            </el-tab-pane> -->
          </el-tabs>
        </div>
        <div class="search-data">
          <TabItemTable
            ref="tabItemTableList"
            @activeChangeToGo="activeChangeToGo"
            :filterClickCount="filterClickCount"
            @filterClickCountChange="filterClickCountChange"
          />
        </div>
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
import {
  getDepartments,
  getTypeList,
  getFindPlanByType,
} from "@/api/specialFollowUp";

import {
  registrationSaveNextStep, // 访视计划保存
  registrationFindPatientInfoByCondition, // 自定义查询条件查询应随访病人信息接口
  registrationGetAllDepartment, // 查询所有科室
  registrationGetAllDiseases, // 查询所有病种
} from "@/api/tumor/tumorFollowup";

import FollowUpPlan from "./Components/FollowUpPlan";
import TemplateSelect from "@/components/TemplateSelect";
import TabItemTable from "./Components/TabItemTable";
import TaskDistribution from "./Components/TaskDistribution";
import IntegratedaDvanced from "./Components/IntegratedaDvanced";
export default {
  name: "TumorPlanSetUp",
  components: {
    TemplateSelect,
    FollowUpPlan,
    TabItemTable,
    TaskDistribution,
    IntegratedaDvanced,
  },
  data() {
    return {
      followType: this.$route.query.type, // 随访类型
      projectId: this.$route.query.id,
      projectStatus: this.$route.query.projectStatus,
      active: 1,
      planId: -1,
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
        dateArray: [["", ""]],
        dateCount: 0,
        checked: true,
        medicalNumbers: [],
        medicalNumber: "",
        departmentNames: [],
        diseases: [],
        beforeDcDate: "",
        afterDcDate: "",
        // dcDate: [],
        value13: [],
        flag: 0,
      },
      diseaseChecked: [],
      diseaseCheckedVal: [],

      diseaseList: [],
      departmentList: [],

      diseasesOption: [], // 病种 Option
      departmentOption: [], // 科室 Option
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
    this.getFindPlanByTypeFn();
    this.registrationGetAllDiseasesFn(); // 查询所有病种
    this.registrationGetAllDepartmentFn(); // 查询所有科室
  },
  mounted() {},
  destroyed() {},
  methods: {
    addDateArray() {
      this.commonForm.dateArray.push(["", ""]);
    },
    delDateArray(index) {
      this.commonForm.dateArray.splice(index, 1);
    },
    // 获取病种(暂定)
    getLiveDiseasesFn() {
      let dataV = {
        id: this.$route.query.id,
      };
      getLiveDiseases(dataV)
        .then((res) => {
          console.log(res, "病种");
          this.diseaseList = res.data;
        })
        .catch((error) => {
          this.$message.error("获取失败");
        });
    },
    // 获取科室(暂定)
    getLiveDepartsFn() {
      let dataV = {
        id: this.$route.query.id,
      };
      getLiveDeparts(dataV)
        .then((res) => {
          console.log(res, "科室");
          this.departmentList = res.data;
        })
        .catch((error) => {
          this.$message.error("获取失败");
        });
    },
    medicalNumbersChange(val) {
      this.diseaseChecked = val;
    },
    medicalNumbersChangeVal(val) {
      this.diseaseCheckedVal = val;
    },
    // 重置
    resetClick() {
      Object.assign(this.commonForm, this.$options.data.call(this).commonForm); // 部分重置
    },
    // 筛选
    onSubmit(badge) {
      let postData = this.commonForm;
      console.log(333, this.commonForm);
      if (this.commonForm.dcDate != null) {
        postData.beforeDcDate = this.commonForm.dcDate[0];
        postData.afterDcDate = this.commonForm.dcDate[1];
      } else {
        postData.beforeDcDate = "";
        postData.afterDcDate = "";
      }
      postData.departmentName = this.commonForm.departmentName;

      console.log("点击", postData, badge);

      this.$nextTick(() => {
        this.filterClickCount++;
        this.$refs.tabItemTableList.getComSearchFn(postData, badge);
      });
    },
    //查询 常规检索
    handleClick() {},

    // 患者筛选下一步
    activeChangeToGo(varl) {
      this.active = varl;
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
        this.onSubmit("next");
      }
    },

    //plan1
    //获取常用专题随访计划模板
    getFindPlanByTypeFn() {
      const postData = {
        typeCode: "special",
      };
      getFindPlanByType(postData)
        .then((res) => {
          this.templateList = res.data;
        })
        .catch((error) => {
          console.error("getFindPlanByType", error);
        });
    },

    //查询所有病种
    registrationGetAllDiseasesFn() {
      registrationGetAllDiseases()
        .then((res) => {
          this.diseasesOption = res.data;
        })
        .catch((error) => {
          console.error("getFindPlanByType", error);
        });
    },

    //查询所有科室
    registrationGetAllDepartmentFn() {
      registrationGetAllDepartment()
        .then((res) => {
          this.departmentOption = res.data;
        })
        .catch((error) => {
          console.error("getFindPlanByType", error);
        });
    },

    turnBack(active) {
      this.$router.push("/survival/followup");
    },
  },
  watch: {
    active: function (n, o) {
      if (n === 2 && o === 3) {
        this.onSubmit("next");
      }
      if (n === 2) {
        this.searchConditionTumor = localStorage.getItem("searchConditionTumor")
          ? JSON.parse(localStorage.getItem("searchConditionTumor"))
          : null;
        if (this.searchConditionTumor) {
          Object.assign(this.commonForm, this.searchConditionTumor);
          this.commonForm.dateArray =
            this.searchConditionTumor.dateArray.length === 0
              ? [["", ""]]
              : this.searchConditionTumor.dateArray;
          this.commonForm.medicalNumber =
            this.searchConditionTumor.medicalNumbers.length > 0
              ? this.searchConditionTumor.medicalNumbers.join(",")
              : "";
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
