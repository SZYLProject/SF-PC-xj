<template>
  <div class="content" style="background: #fff">
    <div class="page-search">
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline searchformFirst"
      >
        <el-form-item>
          <el-input
            class="md-input"
            v-model="formInline.name"
            placeholder="搜索患者姓名、手机号、住院号、主要诊断"
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <el-cascader v-model="formInline.department" :options="departmentOptions" :props="{value:'deptId',label:'deptName',children:'child'}" @change="handleDepartmentChange"></el-cascader> -->
          <el-select
            @change="departmentChange"
            v-model="formInline.department"
            size="mini"
            placeholder="请选择科室"
            clearable
            filterable
          >
            <el-option
              v-for="item in formTypeList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-loading="batchNumberLoading"
            v-model="formInline.batchNumber"
            size="mini"
            placeholder="请选择病区"
            clearable
            filterable
          >
            <el-option
              v-for="item in chNumberList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-loading="p819Loading"
            v-model="formInline.p819"
            size="mini"
            placeholder="请选择责任护士"
            clearable
            filterable
            multiple
            :collapse-tags="formInline.p819.length > 2"
            :title="formInline.p819"
          >
            <el-option
              v-for="item in nurseList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="breakfFirst">
          <el-date-picker
            v-model="formInline.date"
            type="daterange"
            align="right"
            unlink-panels
            size="mini"
            range-separator="-"
            value-format="yyyy-MM-dd"
            start-placeholder="出院开始日期"
            end-placeholder="出院结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-search"
            @click="onCheckFn"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-tabs
      v-model="activeName"
      @tab-click="handleTabsClick"
      style="padding: 0 24px"
    >
      <el-tab-pane label="待随访" name="first">
        <TabItemTable ref="childfirst" :type="0" :searchData="formInline" />
      </el-tab-pane>
      <el-tab-pane label="已随访" name="second">
        <TabItemTable ref="childsecond" :type="1" :searchData="formInline" />
      </el-tab-pane>
      <el-tab-pane label="暂存" name="third">
        <TabItemTable ref="childthird" :type="2" :searchData="formInline" />
      </el-tab-pane>
      <!-- <el-tab-pane label="7日外" name="other">
        <TabItemTable ref="childother" :type="3" :searchData="formInline" />
      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
import TabItemTable from "./Components/TabItemTable";
import {
  getDepsPatient,
  getBatchNumber,
  getP819,
} from "@/api/visitPlanManagement";
export default {
  name: "FormManagement",
  components: { TabItemTable },
  data() {
    return {
      activeName: "first",
      formTypeList: [],
      chNumberList: [],
      nurseList: [],
      formInline: {
        name: "",
        department: "",
        date: "",
        hospName: "",
        deptName: "",
        batchNumber: "",
        p819: [],
      },
      batchNumberLoading: false,
      p819Loading: false,
      departmentOptions: [],
      //查询时间区间快捷键
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
    };
  },
  created() {
    this.getDepsPatientFn();
    this.getBatchNumberFn();
    this.getP819Fn();
  },
  methods: {
    departmentChange() {
      this.getP819Fn();
      this.getBatchNumberFn();
      this.formInline.p819 = [];
      this.formInline.batchNumber = "";
    },
    // 获取责任护士下拉框
    getP819Fn() {
      let getData = {
        departmentName: this.formInline.department,
      };
      this.p819Loading = true;
      getP819(getData)
        .then((res) => {
          this.p819Loading = false;
          this.nurseList = res.data;
        })
        .catch((error) => {
          console.error("getBatchNumber", error);
        });
    },
    // 获取病区下拉框
    getBatchNumberFn() {
      let getData = {
        departmentName: this.formInline.department,
      };
      this.batchNumberLoading = true;
      getBatchNumber(getData)
        .then((res) => {
          this.batchNumberLoading = false;
          this.chNumberList = res.data;
        })
        .catch((error) => {
          console.error("getBatchNumber", error);
        });
    },
    //获取科室下拉框
    getDepsPatientFn() {
      getDepsPatient()
        .then((res) => {
          // this.departmentOptions = res.data.department;
          this.formTypeList = res.data;
        })
        .catch((error) => {
          console.error("getDepsPatient", error);
        });
    },
    //科室改变时
    // handleDepartmentChange(val){
    //   this.departmentOptions.forEach(_ => {
    //     _.deptId === val[0] && (this.formInline.hospName = _.deptName)
    //     _.child.filter(item => item.deptId === val[1] && (this.formInline.deptName = item.deptName));
    //   })
    // },
    //tab切换
    handleTabsClick(tab) {
      this.$refs["child" + this.activeName].currentPage = 1;
      this.$refs["child" + this.activeName].currentPageSize = 10;
      this.$refs["child" + this.activeName].getListFn();
    },
    // 查询
    onCheckFn() {
      this.$refs["child" + this.activeName].getListFn();
    },
  },
};
</script>
<style lang="scss" scoped>
.el-form-item {
  padding-left: 16px;
}
</style>
<style lang="scss">
.searchformFirst {
  .el-loading-spinner .circular {
    margin-top: 12px;
    height: 24px;
    width: 24px;
  }
}
</style>