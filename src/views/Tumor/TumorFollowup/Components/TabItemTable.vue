<template>
  <section>
    <el-tabs
      v-model="activeListName"
      @tab-click="handleTabsClick"
      style="padding: 20px 0"
    >
      <el-tab-pane label="应随访患者" name="first">
        <el-button
          type="primary"
          class="plsc"
          size="mini"
          @click="batchDelet"
          v-if="followType != 'prospect'"
          >批量删除</el-button
        >
        <!-- <div class="long-table"> -->
        <el-table
          stripe
          :data="tableDatafirst"
          ref="tableData1Ref"
          :row-key="getRowKeys"
          @selection-change="handleSelectionChange"
          border
          v-loading="listLoadingFirst"
          style="width: 99%"
        >
          <el-table-column
            type="selection"
            width="60"
            align="center"
            :reserve-selection="true"
            fixed="left"
            v-if="followType != 'prospect'"
          ></el-table-column>
          <el-table-column
            prop="tpatno"
            align="center"
            label="病案号"
          ></el-table-column>
          <el-table-column
            prop="patientName"
            align="center"
            label="姓名"
            width="80"
          ></el-table-column>
          <el-table-column prop="sex" align="center" label="性别" width="50">
            <template slot-scope="scope">
              <!-- <span>{{ scope.row.sex == 1 ? "男" : "女" }}</span>
              性别(0 表示未知，1 表示男， 2 表示女)， -->
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
            min-width="160"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="firstConfirmDate"
            align="center"
            label="确诊日期"
            width="100"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.firstConfirmDate | dateFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="icd10Name1"
            align="center"
            label="主要诊断"
            min-width="160"
            show-overflow-tooltip
          ></el-table-column>
          <!-- <el-table-column
          prop="description"
          align="center"
          label="病理诊断"
        ></el-table-column> -->
          <!-- <el-table-column
            prop="hospitalName"
            align="center"
            label="来源医院"
            min-width="180"
            show-overflow-tooltip
          ></el-table-column> -->
          <el-table-column align="center" width="120" label="最后接触时间">
            <template slot-scope="scope">
              <span>{{ scope.row.lastContactTime | dateFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="lastContactType"
            align="center"
            width="120"
            label="最后接触类型"
          ></el-table-column>
          <el-table-column
            prop="lastContactResult"
            align="center"
            width="120"
            label="最后接触结果"
          ></el-table-column>
          <el-table-column
            align="center"
            label="最近随访时间"
            width="120"
             prop="recentTime"
          >
             <template slot-scope="scope">
              <span>{{ scope.row.recentTime | dateFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="recentResult"
            align="center"
            width="120"
            label="最近随访结局"
          ></el-table-column>
          <!-- <el-table-column label="操作" fixed="right"  align="center">
            <template slot-scope="scope">
              <span class="operation-btn" @click="toDetail(scope.row)">查看</span>
              <span
                v-if="scope.row.stagingState ==false"
                class="operation-btn marginl24"
                @click="reduction(scope.row)"
              >还原</span>
              <span v-else class="operation-btn marginl24" @click="deletePatient(scope.row)">删除</span>
            </template>
          </el-table-column> -->
        </el-table>
        <!-- </div> -->
        <div class="pages-modules">
          <el-pagination
            style="float: right"
            :total="currentPageTotal1"
            :current-page="currentPage1"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="currentPageSize1"
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            layout="total, sizes, prev, pager, next, jumper"
            background
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="待确认患者" name="second">
        <el-table
          stripe
          :data="tableDatasecond"
          border
          style="width: 99%"
          v-loading="listLoadingSecond"
        >
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
            min-width="160"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="firstConfirmDate"
            align="center"
            label="确诊日期"
            width="100"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.firstConfirmDate | dateFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="icd10Name1"
            align="center"
            label="主要诊断"
            min-width="160"
            show-overflow-tooltip
          ></el-table-column>
          <!-- <el-table-column
          prop="description"
          align="center"
          label="病理诊断"
        ></el-table-column> -->
          <!-- <el-table-column
            prop="hospitalName"
            align="center"
            label="来源医院"
            min-width="180"
            show-overflow-tooltip
          ></el-table-column> -->
          <el-table-column align="center" width="120" label="最后接触时间">
            <template slot-scope="scope">
              <span>{{ scope.row.lastContactTime | dateFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="lastContactType"
            align="center"
            width="120"
            label="最后接触类型"
          ></el-table-column>
          <el-table-column
            prop="lastContactResult"
            align="center"
            width="120"
            label="最后接触结果"
          ></el-table-column>
          <el-table-column
            align="center"
            label="最近随访时间"
            width="120"
             prop="recentTime"
          >
             <template slot-scope="scope">
              <span>{{ scope.row.recentTime | dateFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="recentResult"
            align="center"
            width="120"
            label="最近随访结局"
          ></el-table-column>

          <!-- <el-table-column label="操作" fixed="right"  align="center">
            <template slot-scope="scope">
              <span class="operation-btn" @click="toDetail(scope.row)">查看</span>
              <span class="operation-btn marginl24" @click="revokePatient(scope.row)">撤销</span>
            </template>
          </el-table-column> -->
        </el-table>
        <div class="pages-modules">
          <el-pagination
            style="float: right"
            :total="currentPageTotal2"
            :current-page="currentPage2"
            :page-size="currentPageSize2"
            :page-sizes="[10, 20, 30, 40]"
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            layout="total, sizes, prev, pager, next, jumper"
            background
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="近90天有复诊的患者" v-if="false" name="third">
        <el-table stripe :data="tableDatathird" border style="width: 99%">
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
            min-width="160"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="firstConfirmDate"
            align="center"
            label="确诊日期"
            width="100"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.firstConfirmDate | dateFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="icd10Name1"
            align="center"
            label="主要诊断"
            min-width="160"
            show-overflow-tooltip
          ></el-table-column>
          <!-- <el-table-column
          prop="description"
          align="center"
          label="病理诊断"
        ></el-table-column> -->
          <!-- <el-table-column
            prop="hospitalName"
            align="center"
            label="来源医院"
            min-width="180"
            show-overflow-tooltip
          ></el-table-column> -->
          <el-table-column align="center" width="120" label="最后接触时间">
            <template slot-scope="scope">
              <span>{{ scope.row.lastContactTime | dateFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="lastContactType"
            align="center"
            width="120"
            label="最后接触类型"
          ></el-table-column>
          <el-table-column
            prop="lastContactResult"
            align="center"
            width="120"
            label="最后接触结果"
          ></el-table-column>
          <el-table-column
            align="center"
            label="最近随访时间"
            width="120"
             prop="recentTime"
          >
             <template slot-scope="scope">
              <span>{{ scope.row.recentTime | dateFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="recentResult"
            align="center"
            width="120"
            label="最近随访结局"
          ></el-table-column>

          <!-- <el-table-column label="操作" fixed="right"  align="center">
            <template slot-scope="scope">
              <span class="operation-btn" @click="toDetail(scope.row)">查看</span>
              <span class="operation-btn marginl24" @click="revokePatient(scope.row)">撤销</span>
            </template>
          </el-table-column> -->
        </el-table>
        <div class="pages-modules">
          <el-pagination
            style="float: right"
            :total="currentPageTotal3"
            :current-page="currentPage3"
            :page-size="currentPageSize3"
            :page-sizes="[10, 20, 30, 40]"
            @size-change="handleSizeChange3"
            @current-change="handleCurrentChange3"
            layout="total, sizes, prev, pager, next, jumper"
            background
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="参与其他项目患者" name="fourth">
        <el-table
          stripe
          :data="tableDatafourth"
          border
          style="width: 99%"
          v-loading="listLoadingFourth"
        >
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
            min-width="160"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="firstConfirmDate"
            align="center"
            label="确诊日期"
            width="100"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.firstConfirmDate | dateFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="icd10Name1"
            align="center"
            label="主要诊断"
            min-width="160"
            show-overflow-tooltip
          ></el-table-column>
          <!-- <el-table-column
          prop="description"
          align="center"
          label="病理诊断"
        ></el-table-column> -->
          <!-- <el-table-column
            prop="hospitalName"
            align="center"
            label="来源医院"
            min-width="180"
            show-overflow-tooltip
          ></el-table-column> -->
          <el-table-column align="center" width="120" label="最后接触时间">
            <template slot-scope="scope">
              <span>{{ scope.row.lastContactTime | dateFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="lastContactType"
            align="center"
            width="120"
            label="最后接触类型"
          ></el-table-column>
          <el-table-column
            prop="lastContactResult"
            align="center"
            width="120"
            label="最后接触结果"
          ></el-table-column>
          <el-table-column
            align="center"
            label="最近随访时间"
            width="120"
             prop="recentTime"
          >
             <template slot-scope="scope">
              <span>{{ scope.row.recentTime | dateFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="recentResult"
            align="center"
            width="120"
            label="最近随访结局"
          ></el-table-column>
          <!-- <el-table-column label="操作" fixed="right"  align="center">
            <template slot-scope="scope">
              <span class="operation-btn" @click="toDetail(scope.row)">查看</span>
            </template>
          </el-table-column> -->
        </el-table>
        <div class="pages-modules">
          <el-pagination
            style="float: right"
            :total="currentPageTotal4"
            :current-page="currentPage4"
            :page-size="currentPageSize4"
            :page-sizes="[10, 20, 30, 40]"
            @size-change="handleSizeChange4"
            @current-change="handleCurrentChange4"
            layout="total, sizes, prev, pager, next, jumper"
            background
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-row :gutter="10">
      <el-col :span="24" class="text-center margintb24">
        <el-button
          type="primary"
          @click="backOn"
          :disabled="filterClickCount >= 2"
          >上一步</el-button
        >
        <el-button
          type="primary"
          @click="nextStep"
          :disabled="
            filterClickCount < 2 || dataLen == 0 || activeListName !== 'first'
          "
          >下一步</el-button
        >
      </el-col>
    </el-row>
  </section>
</template>

<script>
import Bus from "@/utils/bus.js";
import { parseTime } from "@/utils/index.js";
import { registrationAddSearchCondition } from "@/api/tumor/tumorFollowup";
import {
  postFindPatientInfoByCondition,
  postAddSearchCondition,
  getFindByCondition,
} from "@/api/survivalFollowup";

import {
  registrationSaveNextStep, // 访视计划保存
  registrationFindPatientInfoByCondition, // 自定义查询条件查询应随访病人信息接口
  registrationFindPatientInfoByConditionNext,
  registrationGetAllDepartment, // 查询所有科室
  registrationGetAllDiseases, // 查询所有病种
} from "@/api/tumor/tumorFollowup";

export default {
  name: "TabItemTable",
  props: {
    searchData: {
      type: Object,
      default() {
        return {
          name: "",
          department: "",
          date: "",
          hospName: "",
          deptName: "",
        };
      },
    },
    filterClickCount: {
      type: Number,
      default() {
        return 2;
      },
    },
  },
  data() {
    return {
      listLoadingFirst: true,
      listLoadingSecond: true,
      listLoadingFourth: true,
      dataLen: 0,
      followType: this.$route.query.type, // 随访类型
      searchType: "isFirst", // 搜索类型  常规 / 高级   默认为  isFirst 常规
      searchDataFormData: {},
      activeListName: "first",
      tableDatafirst: [],
      tableDatasecond: [],
      tableDatathird: [],
      tableDatafourth: [],
      // 分页数据
      currentPage1: 1,
      currentPageSize1: 10,
      currentPageTotal1: 0,
      // 分页数据
      currentPage2: 1,
      currentPageSize2: 10,
      currentPageTotal2: 0,
      // 分页数据
      currentPage3: 1,
      currentPageSize3: 10,
      currentPageTotal3: 0,
      multipleSelection: [],
      // 分页数据
      currentPage4: 1,
      currentPageSize4: 10,
      currentPageTotal4: 0,
      conventionalData: {},
      projectStatus:this.$route.query.projectStatus,
    };
  },
  created() {},
  mounted() {
    // 高级检索
    console.log("TabItemTable - this ----->>>>", this.$parent);
    // Bus.$on("searchDataFormGj", this.getADataFn);
    // 常规检索
    // Bus.$on("getTumorComSearchFnChange", this.getComSearchFn);
  },
  methods: {
    // 上一步
    backOn() {
      this.$emit("filterClickCountChange");
      this.$emit("activeChangeToGo", 1);
    },
    // 下一步
    nextStep() {
      // 前瞻随访 默认获取项目中所有患者的 id
      let idsList = this.tableDatafirst.map((x) => {
        return x.id;
      });
      idsList.toString();

      let dataV = {
        // projectId: this.$route.query.id,
        patientIds: idsList,
        searchCondition: JSON.stringify(this.conventionalData),
        patients: "",
        ...this.conventionalData,
      };

      // 随访方案 患者入组 查询
      registrationAddSearchCondition(dataV)
        .then((res) => {
          this.$emit("activeChangeToGo", 3);
        })
        .catch((error) => {
          this.$message.error("获取失败");
        });
    },

    // 获取搜索表单的值 常规检索
    getComSearchFn(val, badge) {
      this.searchType = "isFirst";
      console.log(val, badge, "获取搜索表单的值  ");
      this.conventionalData = JSON.parse(JSON.stringify(val));
      this.lastSearchDataFn(
        this.currentPage1,
        this.currentPageSize1,
        "0",
        badge
      );
    },
    // 查询患者
    lastSearchDataFn(currentPageVal, currentPageSizeVal, flagVal, badge) {
      let loadList = ["First", "Second", "", "Fourth"];
      flagVal != 2 && (this["listLoading" + loadList[flagVal]] = true);
      let data = {};
      if (this.searchType == "isFirst") {
        data = this.conventionalData;
      } else {
        data = this.searchDataFormData;
      }
      data["flag"] = flagVal;
      data.pageNum = currentPageVal;
      data.pageSize = currentPageSizeVal;

      if (this.searchType == "isFirst") {
        //   搜索类型  isFirst 常规
        console.log(this.conventionalData);
        let dateArray = this.conventionalData.dateArray.reduce((t, e) => {
          console.log(t, e);
          if (!!e[0]) t.push([e[0].split("T")[0], e[1].split("T")[0]]);
          return t;
        }, []);
        this.conventionalData.projectId = this.$route.query.id;
        this.conventionalData.dateArray = dateArray;
        this.conventionalData.medicalNumbers = this.conventionalData
          .medicalNumber
          ? this.conventionalData.medicalNumber.split(/\,|\，/)
          : [];
        badge === "next"
          ? registrationFindPatientInfoByConditionNext(
              this.conventionalData
            ).then((res) => {
              if (flagVal == 0) {
                this.tableDatafirst = res.data.list;
                this.currentPageTotal1 = res.data.total;
              } else if (flagVal == 1) {
                this.tableDatasecond = res.data.list;
                this.currentPageTotal2 = res.data.total;
              } else if (flagVal == 2) {
                this.tableDatathird = res.data.list;
                this.currentPageTotal3 = res.data.total;
              } else if (flagVal == 3) {
                this.tableDatafourth = res.data.list;
                this.currentPageTotal4 = res.data.total;
              }
              flagVal != 2 && (this["listLoading" + loadList[flagVal]] = false);
              //判断筛选列表是否有数据
              this.dataLen =
                this.activeListName === "first"
                  ? this.tableDatafirst.length
                  : this.activeListName === "second"
                  ? this.tableDatasecond.length
                  : this.activeListName === "fourth"
                  ? this.tableDatafourth.length
                  : 10;
            })
          : registrationFindPatientInfoByCondition(this.conventionalData)
              .then((res) => {
                if (flagVal == 0) {
                  this.tableDatafirst = res.data.list;
                  this.currentPageTotal1 = res.data.total;
                } else if (flagVal == 1) {
                  this.tableDatasecond = res.data.list;
                  this.currentPageTotal2 = res.data.total;
                } else if (flagVal == 2) {
                  this.tableDatathird = res.data.list;
                  this.currentPageTotal3 = res.data.total;
                } else if (flagVal == 3) {
                  this.tableDatafourth = res.data.list;
                  this.currentPageTotal4 = res.data.total;
                }
                flagVal != 2 &&
                  (this["listLoading" + loadList[flagVal]] = false);
                //判断筛选列表是否有数据
                this.dataLen =
                  this.activeListName === "first"
                    ? this.tableDatafirst.length
                    : this.activeListName === "second"
                    ? this.tableDatasecond.length
                    : this.activeListName === "fourth"
                    ? this.tableDatafourth.length
                    : 10;
              })
              .catch((error) => {
                this.tableLoading = false;
                console.error("getFindPlanByType", error);
              });
      } else {
        //   搜索类型  高级
        postFindPatientInfoByCondition(data)
          .then((res) => {
            if (flagVal == 0) {
              this.tableDatafirst = res.data.list;
              this.currentPageTotal1 = res.data.total;
            } else if (flagVal == 1) {
              this.tableDatasecond = res.data.list;
              this.currentPageTotal2 = res.data.total;
            } else if (flagVal == 2) {
              this.tableDatathird = res.data.list;
              this.currentPageTotal3 = res.data.total;
            } else if (flagVal == 3) {
              this.tableDatafourth = res.data.list;
              this.currentPageTotal4 = res.data.total;
            }
          })
          .catch((error) => {
            this.$message.error("获取失败");
          });
      }
    },
    // 应随访患者
    projectSearchPatientFn() {
       if(this.projectStatus ==1){
        this.lastSearchDataFn(this.currentPage1, this.currentPageSize1, 0, 'next');
      }else{
        this.lastSearchDataFn(this.currentPage1, this.currentPageSize1, 0);
      }
    },
    // 待确认患者
    projectSearchToConfirmFn() {
      this.lastSearchDataFn(this.currentPage2, this.currentPageSize2, 1);
    },
    // 近90天有复诊的患者
    projectSearchOtherProjectFn90() {
      this.lastSearchDataFn(this.currentPage3, this.currentPageSize3, 2);
    },

    // 参与其他项目患者
    projectSearchOtherProjectFn() {
      this.lastSearchDataFn(this.currentPage4, this.currentPageSize4, 3);
    },

    // 列表复选框选择
    getRowKeys(row) {
      return row.id; // 每条数据的唯一识别值
    },

    // 批量删除
    batchDelet() {
      console.log(this.multipleSelection);
    },
    // 删除
    deletePatient(row) {
      this.$refs.tableData1Ref.toggleRowSelection(row, true);
      this.tableDatafirst.forEach((item) => {
        item["stagingState"] = true;
        if (this.multipleSelection.includes(item)) {
          item["stagingState"] = false;
        }
      });
    },

    // 还原
    reduction(row) {
      this.$refs.tableData1Ref.toggleRowSelection(row, false);
      this.tableDatafirst.forEach((item) => {
        item["stagingState"] = true;
        if (this.multipleSelection.includes(item)) {
          item["stagingState"] = false;
        }
      });
    },
    // 撤销
    revokePatient() {},

    // 查看
    toDetail(row) {
      // this.$router.push({
      //   name: "StatisticAnaly",
      //   query: {
      //     id: row.id,
      //   },
      // });
      //   const {href} = this.$router.resolve({
      //   path: '/pdf',
      //   query: {
      //     pdf: JSON.stringify(this.pdf)
      //   }
      // })
      // window.open(href, '_blank')
    },
    // 列表复选框选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.tableDatafirst.forEach((item) => {
        item["stagingState"] = true;
        if (this.multipleSelection.includes(item)) {
          item["stagingState"] = false;
        }
      });
    },
    // 切换tab
    handleTabsClick(tab) {
      if (tab.name === "first") {
        this.projectSearchPatientFn();
      } else if (tab.name === "second") {
        this.projectSearchToConfirmFn();
      } else if (tab.name === "third") {
        this.projectSearchOtherProjectFn90();
      } else if (tab.name === "fourth") {
        this.projectSearchOtherProjectFn();
      }
    },

    // 分页change
    handleSizeChange1(val) {
      this.currentPageSize1 = val;
      this.projectSearchPatientFn();
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      this.projectSearchPatientFn();
    },
    handleSizeChange2(val) {
      this.currentPageSize2 = val;
      this.projectSearchToConfirmFn();
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val;
      this.projectSearchToConfirmFn();
    },
    handleSizeChange3(val) {
      this.currentPageSize3 = val;
      this.projectSearchOtherProjectFn90();
    },
    handleCurrentChange3(val) {
      this.currentPage3 = val;
      this.projectSearchOtherProjectFn90();
    },
    handleSizeChange4(val) {
      this.currentPageSize4 = val;
      this.projectSearchOtherProjectFn();
    },
    handleCurrentChange4(val) {
      this.currentPage4 = val;
      this.projectSearchOtherProjectFn();
    },
  },

  //高级检索
  getADataFn(val) {
    this.searchType = "isSecond";
    const sss = {
      tableName: "t_data_patient",
      dateCount: 90,
      projectId: this.$route.query.id,
      conditionItemList: [
        {
          logicVal: "0",
          logicList: [
            { label: "并且", value: "0" },
            { label: "排除", value: "1" },
            { label: "或者", value: "3" },
          ],
          topicVal: "年龄",
          restaurants: [
            { columnName: "id", columnType: "bigint(20)", value: "主键ID" },
            {
              columnName: "patient_id",
              columnType: "varchar(255)",
              value: "病人ID（唯一标识，发送微信用）",
            },
            {
              columnName: "inpatient_number",
              columnType: "varchar(100)",
              value: "住院号",
            },
            {
              columnName: "outpatient_number",
              columnType: "varchar(100)",
              value: "门诊号",
            },
            { columnName: "name", columnType: "varchar(100)", value: "姓名" },
            { columnName: "birthday", columnType: "date", value: "出生日期" },
            { columnName: "sex", columnType: "int(11)", value: "性别" },
            { columnName: "age", columnType: "int(11)", value: "年龄" },
            {
              columnName: "address_na",
              columnType: "int(11)",
              value: "0无地址 1有地址",
            },
            {
              columnName: "address",
              columnType: "varchar(200)",
              value: "地址",
            },
            { columnName: "ssn_na", columnType: "int(11)", value: "0无 1有" },
            {
              columnName: "ssn",
              columnType: "varchar(200)",
              value: "社保号",
            },
            {
              columnName: "id_type",
              columnType: "varchar(100)",
              value: "证件类型",
            },
            {
              columnName: "id_num",
              columnType: "varchar(20)",
              value: "证件号",
            },
            {
              columnName: "ethnicity",
              columnType: "varchar(50)",
              value: "民族",
            },
            {
              columnName: "marital_status",
              columnType: "varchar(20)",
              value: "结婚状态",
            },
            {
              columnName: "education",
              columnType: "varchar(20)",
              value: "教育状态",
            },
            {
              columnName: "mobile",
              columnType: "varchar(11)",
              value: "手机",
            },
            {
              columnName: "emerg_contact1",
              columnType: "varchar(20)",
              value: "联系方式1",
            },
            {
              columnName: "emerg_contact2",
              columnType: "varchar(20)",
              value: "联系方式2",
            },
            {
              columnName: "emerg_contact3",
              columnType: "varchar(20)",
              value: "联系方式3",
            },
            {
              columnName: "homephone",
              columnType: "varchar(20)",
              value: "家庭电话",
            },
            {
              columnName: "contact_name",
              columnType: "varchar(50)",
              value: "联系人",
            },
            {
              columnName: "relationship_with_patient",
              columnType: "varchar(50)",
              value: "和病人关系",
            },
            {
              columnName: "email",
              columnType: "varchar(100)",
              value: "邮箱",
            },
            {
              columnName: "password",
              columnType: "varchar(50)",
              value: "如果登录需要的密码",
            },
            {
              columnName: "status",
              columnType: "int(11)",
              value: "状态 1 表示正常 2 表示刪除",
            },
            {
              columnName: "hospital_name",
              columnType: "varchar(255)",
              value: "医院ID",
            },
            {
              columnName: "department_name",
              columnType: "varchar(255)",
              value: "部门ID",
            },
            {
              columnName: "create_by",
              columnType: "varchar(200)",
              value: "创建人",
            },
            {
              columnName: "create_time",
              columnType: "datetime",
              value: "创建时间",
            },
            {
              columnName: "update_by",
              columnType: "varchar(200)",
              value: "修改人",
            },
            {
              columnName: "update_time",
              columnType: "datetime",
              value: "修改时间",
            },
            {
              columnName: "contact_time",
              columnType: "datetime",
              value: "最后接触时间",
            },
            {
              columnName: "contact_type",
              columnType: "varchar(255)",
              value: "最后接触类型",
            },
            {
              columnName: "contact_result",
              columnType: "varchar(255)",
              value: "最后接触结果",
            },
          ],
          conditionVal: "3",
          conditionList: [
            { label: "等于", value: "1" },
            { label: "不等于", value: "2" },
            { label: "大于", value: "3" },
            { label: "大于等于", value: "4" },
            { label: "小于", value: "5" },
            { label: "小于等于", value: "6" },
            { label: "区间内", value: "7" },
            { label: "区间外", value: "8" },
            { label: "包含", value: "9" },
            { label: "不包含", value: "10" },
            { label: "是", value: true },
            { label: "否", value: false },
            { label: "任意值", value: "11" },
          ],
          range: "0",
          filterList: [],
        },
      ],
      pageNum: 1,
      pageSize: 10,
    };
    // this.searchDataFormData = val;
    let searchVVal = sss.conditionItemList[0];
    let columnNameCode = searchVVal.restaurants.filter(
      (_) => _.value === searchVVal.topicVal
    )[0].columnName;
    sss.conditionItemList[0].topicVal = columnNameCode;
    this.searchDataFormData = sss;
    this.activeListName = "first";
    console.log("获取2221", "获取搜索表单的值");
    // this.lastSearchDataFn(
    //   this.currentPage1,
    //   this.currentPageSize1,
    //   this.searchDataFormData,
    //   0
    // );
    // this.lastSearchDataFn()
    this.lastSearchDataFn(this.currentPage1, this.currentPageSize1, "0");
  },

  beforeDestroy() {
    //组件销毁前需要解绑事件。否则会出现重复触发事件的问题
    // this.$Bus.$off("searchDataForm");
    // this.$Bus.$off("searchDataForm");
    Bus.$off("getComSearchFnChange", this.getComSearchFn);
    Bus.$off("searchDataFormGj", this.getADataFn);
  },
};
</script>

<style lang="scss">
.plsc {
  margin-bottom: 16px;
}
.long-table {
  position: relative;
  overflow: auto;
  height: 630px;
  .el-table {
    width: auto;
  }
}
</style>