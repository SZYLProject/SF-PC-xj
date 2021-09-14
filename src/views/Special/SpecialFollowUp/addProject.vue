<template>
  <div class="content">
    <div class="page-nav">
      <el-row :gutter="10">
        <el-col :span="4" class="steps"></el-col>
        <el-col :span="16" class="steps">
          <el-steps :active="active">
            <el-step title="访视计划"></el-step>
            <el-step title="患者筛选"></el-step>
            <el-step v-if="false" title="任务分配"></el-step>
          </el-steps>
        </el-col>
        <el-col :span="4" class="steps"></el-col>
      </el-row>
    </div>
    <!-- 访视计划 -->
    <div v-if="active === 1">
      <!-- v-if="isPlan" -->
      <div class="plan1" v-if="isPlan">
        <div class="new-plan1 bgfff margintb24">
          <el-button class type="primary" icon="el-icon-plus" @click="addPlan"
            >新增访视计划</el-button
          >
        </div>
        <div class="plan1-list">
          <div class="label-module">
            <span>常用专题随访计划模板</span>
          </div>
          <div class="margintb24">
            <TemplateSelect
              :options="{ label: 'name', id: 'id' }"
              :tempList="templateList"
              width="22%"
              :checkArr="templateVal"
            />
          </div>
          <div class="text-center">
            <el-button class type="primary" @click="determineClicK"
              >确定</el-button
            >
          </div>
        </div>
      </div>
      <!-- v-else -->
      <div class="plan-details" v-else>
        <FollowUpPlan
          ref="FollowUpPlanRef"
          :projectId="projectId"
          :planName="planName"
          @childFn="parentFn"
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
                        placeholder="请输入要查询的输入号，多个病案号用英文逗号隔开，单个病号支持模糊查询，多个病案号只支持精准查询"
                        v-model="commonForm.medicalNumberTextarea"
                        :disabled="notSearch"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      label="首次确诊入院科室"
                      class="elect100"
                      :title="showDepartmentNamesval()"
                    >
                      <el-select
                        :disabled="notSearch"
                        v-model="commonForm.departmentNames"
                        multiple
                        :collapse-tags="commonForm.departmentNames.length > 3"
                        placeholder="请选择"
                        @change="medicalNumbersChangeDepartment"
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
                      <!-- <el-date-picker
                    v-model="commonForm.timeDcDate"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                  ></el-date-picker> -->
                      <div
                        v-for="(item, index) in commonForm.dateArray"
                        :key="index"
                      >
                        <el-date-picker
                          :disabled="notSearch"
                          v-model="commonForm.dateArray[index]"
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
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      class="elect100"
                      label="标准病种"
                      :title="showValue()"
                    >
                      <el-select
                        :disabled="notSearch"
                        v-model="commonForm.diseases"
                        multiple
                        :collapse-tags="commonForm.diseases.length > 3"
                        placeholder="请选择"
                        @change="medicalNumbersChange"
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
                        :disabled="notSearch"
                      >
                        <!-- <span v-if="false">
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
                  <el-button
                    type="primary"
                    :disabled="notSearch"
                    @click="resetClick"
                    size="mini"
                    >重置</el-button
                  >
                  <el-button
                    type="primary"
                    :disabled="notSearch"
                    @click="filterClick(1)"
                    size="mini"
                    >筛选</el-button
                  >
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="高级检索" name="second" v-if="false">
              <IntegratedaDvanced />
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="search-data" v-loading="turnLoading">
          <TabItemTable
            ref="tabItemTableList"
            :commonForm="commonForm"
            @searchClickFn="searchClickFn"
          />
        </div>
        <el-row :gutter="10">
          <el-col :span="24" class="text-center margintb24">
            <el-button type="primary" @click="backOn">上一步</el-button>
            <!-- <el-button type="primary" @click="nextStep">下一步</el-button> -->
            <el-button
              type="primary"
              :disabled="turnLoading || notSearch || !isSearchClick"
              @click="jumpOver"
              >确定</el-button
            >
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-if="active === 3" v-loading="turnLoading">
      <TaskDistribution />
      <el-row :gutter="10">
        <el-col :span="24" class="text-center margintb24">
          <el-button type="primary" @click="backOn">上一步</el-button>
          <el-button type="primary" @click="distributionClick"
            >确认分配</el-button
          >
          <el-button type="primary" @click="jumpOver">跳过分配</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Bus from "@/utils/bus.js";
import { parseTime } from "@/utils/index.js";
import {
  getDepartments,
  getTypeList,
  getFindPlanByType,
  projectSkipAllocation,
  getProjectDeptDic,
  getProjectDiseaseDic,
} from "@/api/specialFollowUp";
import TemplateSelect from "@/components/TemplateSelect";
import FollowUpPlan from "./Components/FollowUpPlan";
import TabItemTable from "./Components/TabItemTable";
import TaskDistribution from "./Components/TaskDistribution";
import IntegratedaDvanced from "./Components/IntegratedaDvanced";
export default {
  name: "AddProject",
  components: {
    TemplateSelect,
    FollowUpPlan,
    TabItemTable,
    TaskDistribution,
    IntegratedaDvanced,
  },
  data() {
    return {
      isSearchClick: false,
      notSearch: false,
      projectId: "",
      active: 1,
      isPlan: true,
      planId: -1,
      planName: "",
      templateList: [],
      templateVal: [],
      // plan3
      turnLoading: false,
      // plan2
      commonForm: {
        dateCount: 0,
        dateArray: [["", ""]],
        checked: true,
        medicalNumbers: [],
        departmentNames: [],
        diseases: [],
        beforeDcDate: "",
        afterDcDate: "",
        medicalNumberTextarea: "",
      },

      diseaseChecked: [],
      diseaseCheckedDepart: [],

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
    };
  },
  watch: {
    active: function (n, o) {
      if (n === 2) {
        console.log(
          localStorage.getItem("searchConditionSpecial"),
          "searchConditionSpecial"
        );
        let searchConditionSpecialVal = localStorage.getItem(
          "searchConditionSpecial"
        );
        if (searchConditionSpecialVal !== "undefined") {
          this.searchCondition = localStorage.getItem("searchConditionSpecial")
            ? JSON.parse(localStorage.getItem("searchConditionSpecial"))
            : null;
        }
        if (this.searchCondition) {
          Object.assign(this.commonForm, this.searchCondition);
          this.commonForm.dateArray =
            this.searchCondition.dateArray.length === 0
              ? [["", ""]]
              : this.searchCondition.dateArray;
          this.commonForm.checked = this.searchCondition.checked;
          this.commonForm.medicalNumberTextarea =
            this.searchCondition.medicalNumbers.length > 0
              ? this.searchCondition.medicalNumbers.join(",")
              : "";
        
        }
      }
    },
  },
  created() {
    if (this.$route.query.status != "新增") {
      this.isPlan = false;
    }
    // <!-- 待审批   未发布     审批驳回   进行中   已终止       已完成 -->
    //   <!-- pending  approved  reject     in     suspend      finish -->
    //   <!-- 4         0         5          1       3             2  -->
    if (
      this.$route.query.statusNum == 1 ||
      this.$route.query.statusNum == 2 ||
      this.$route.query.statusNum == 3
    ) {
      this.notSearch = true;
    } else {
      this.notSearch = false;
    }
    this.projectId = this.$route.query.id.toString();
    this.getFindPlanByTypeFn();
    this.getProjectDeptDicFn();
    this.getProjectDiseaseDic();
  },
  mounted() {},
  destroyed() {},
  methods: {
    addDateArray() {
      this.commonForm.dateArray.push(["", ""]);
    },
    delDateArray(index) {
      console.log(index);
      console.log(this.commonForm.dateArray);
      this.commonForm.dateArray.splice(index, 1);
    },
    // plan3
    distributionClick() {
      this.$router.push({
        name: "SpecialFollowUp",
      });
    },
    jumpOver() {
      const getData = {
        projectId: this.$route.query.id,
        searchCondition: JSON.stringify(this.searchDataFn()),
        ...this.searchDataFn(),
      };
      this.turnLoading = true;
      projectSkipAllocation(getData)
        .then((res) => {
          this.turnLoading = false;
          this.$router.push({
            name: "SpecialFollowUp",
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    //  plan2
    //  获取患者科室字典接口
    getProjectDeptDicFn() {
      getProjectDeptDic()
        .then((res) => {
          this.departmentList = res.data;
        })
        .catch((error) => {
          console.error("getFindPlanByType", error);
        });
    },
    // 3 获取患者病种接口
    getProjectDiseaseDic() {
      getProjectDiseaseDic()
        .then((res) => {
          this.diseaseList = res.data;
        })
        .catch((error) => {
          console.error("getFindPlanByType", error);
        });
    },
    resetClick() {
      Object.assign(this.$data.commonForm, this.$options.data().commonForm); // 部分重置
      this.filterClick(2);
    },
    searchDataFn() {
      let val = this.commonForm;
      let dateArrayVal = val.dateArray.reduce((t, e) => {
        if (!!e[0])
          t.push([
            parseTime(e[0], "{y}-{m}-{d}"),
            parseTime(e[1], "{y}-{m}-{d}"),
          ]);
        console.log(t);
        return t;
      }, []);
      let searchData = {
        operButton: 1, //operButton   1: 筛选    2： 重置
        tableName: "t_data_patient",
        pageSize: 1,
        pageNum: 10,
        projectId: this.$route.query.id,
        flag: 0,
        medicalNumbers:
          val.medicalNumberTextarea != ""
            ? val.medicalNumberTextarea.split(",")
            : [],
        departmentNames: val.departmentNames,
        diseases: val.diseases,
        checked: val.checked,
        dateArray: dateArrayVal,
      };
      return searchData;
    },
    filterClick(operButtonNum) {
      // let searchData  = this.searchDataFn()
      // searchData.operButton = operButtonNum

      this.$nextTick(() => {
        this.$refs.tabItemTableList.searchDataFormFn(operButtonNum);
      });
    },
    searchClickFn(val) {
      // 点击筛选之后
      this.isSearchClick = val;
    },
    //常规检索切换
    handleClick() {},
    //标准病种title显示
    showValue() {
      return this.diseaseChecked
        .reduce((t, e) => {
          t.push(this.diseaseList.filter((_) => _.value === e)[0].label);
          return t;
        }, [])
        .join(",");
    },
    showDepartmentNamesval() {
      return this.diseaseCheckedDepart
        .reduce((t, e) => {
          t.push(this.departmentList.filter((_) => _.value === e)[0].label);
          return t;
        }, [])
        .join(",");
    },
    medicalNumbersChange(val) {
      this.diseaseChecked = val;
    },
    medicalNumbersChangeDepartment(val) {
      this.diseaseCheckedDepart = val;
    },

    backOn() {
      this.active--;
    },
    nextStep() {
      this.active++;
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
    // 新增访视计划
    addPlan() {
      this.isPlan = false;
      this.planName = "";
    },
    // 模板确定
    determineClicK() {
      this.isPlan = false;
      console.log(this.templateVal);
      if (this.templateVal.length > 0) {
        this.planId = this.templateVal[0];
        let data = {
          projectId: this.$route.query.id,
          planId: this.planId,
        };
        this.$nextTick(() => {
          this.$refs["FollowUpPlanRef"].getPlanIdFn(this.planId);
          //  this.$refs["FollowUpPlanRef"].bindProjectPlan(data);
        });
      } else {
        this.isPlan = false;
      }
    },
    // 方式计划下一步
    parentFn(active) {
      this.active = active;
      if (this.active == 2) {
        // this.filterClick();

        //   let searchData  = this.searchDataFn()
        // searchData.operButton = 1
        this.$nextTick(() => {
          this.$refs.tabItemTableList.searchDataFormFn(1, "next");
        });
      }
    },
    turnBack(active) {
      this.isPlan = true;
    },
    // 下一步
    next() {
      console.log(this.active, "this.active");
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
