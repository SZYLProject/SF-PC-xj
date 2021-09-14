<template>
  <section>
    <el-tabs
      v-model="activeListName"
      @tab-click="handleTabsClick"
      class="tabboxs"
    >
      <el-tab-pane label="应随访患者" name="first">
        <el-button
          class="marginb16"
          type="primary"
          @click="batchDelet"
          :disabled="multipleSelection.length === 0 || notSearch"
          size="mini"
        >
          批量删除
        </el-button>
        <el-table
          stripe
          :data="tableData1"
          :row-key="getRowKeys"
          ref="multipleTable"
          v-loading="listLoading"
          @selection-change="handleSelectionChange"
          border
          style="width: 99%"
        >
          <el-table-column
            type="selection"
            width="60"
            align="center"
            :reserve-selection="true"
            fixed="left"
          ></el-table-column>
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
            min-width="126"
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
            min-width="126"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="firstDischargedDate"
            align="center"
            width="100"
            label="出院时间"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.firstDischargedDate | dateFilters }}</span>
            </template>
          </el-table-column>
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
          <el-table-column
            label="操作"
            fixed="right"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="360视图"
                placement="top"
                v-if="false"
              >
                <i
                  @click="toFollow360(scope.row)"
                  class="iconfont icon360shitu iconfontColor list-operating"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="还原"
                placement="top"
              >
                <i
                  v-if="scope.row.stagingState == false && notSearch == false"
                  @click="reduction(scope.row)"
                  class="iconfont iconzhongzhi iconfontColor list-operating"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top"
              >
                <i
                  v-if="scope.row.stagingState == true && notSearch == false"
                  @click="deletePatient(scope.row)"
                  class="iconfont iconshanchu iconfontColor list-operating"
                ></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
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
          :data="tableData2"
          border
          v-loading="listLoading"
          style="width: 99%"
        >
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
            min-width="126"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="firstConfirmDate"
            align="center"
            width="100"
            label="确诊日期"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.firstConfirmDate | dateFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="icd10Name1"
            align="center"
            label="主要诊断"
            min-width="126"
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
          <el-table-column
            prop="firstDischargedDate"
            align="center"
            width="100"
            label="出院时间"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.firstDischargedDate | dateFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="100" label="最后接触时间">
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

          <el-table-column
            label="操作"
            width="120"
            fixed="right"
            align="center"
          >
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="360视图"
                placement="top"
                v-if="false"
              >
                <i
                  @click="toFollow360(scope.row)"
                  class="iconfont iconbiaodanguanli iconfontColor list-operating"
                ></i>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="撤销"
                placement="top"
              >
                <i
                  @click="revokePatient(scope.row)"
                  class="iconfont iconchehui iconfontColor list-operating"
                ></i>
              </el-tooltip>
            </template>
          </el-table-column>
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
      <el-tab-pane label="参与其他项目患者" name="third">
        <el-table
          stripe
          :data="tableData3"
          border
          v-loading="listLoading"
          style="width: 99%"
        >
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
            min-width="126"
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
            min-width="126"
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
          <el-table-column
            prop="firstDischargedDate"
            align="center"
            width="100"
            label="出院时间"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.firstDischargedDate | dateFilters }}</span>
            </template>
          </el-table-column>
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
          <el-table-column label="操作" width="80" fixed="right" v-if="false" align="center">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="360视图"
                placement="top"
              >
                <i
                  @click="toFollow360(scope.row)"
                  class="iconfont icon360shitu iconfontColor list-operating"
                ></i>
              </el-tooltip>
            </template>
          </el-table-column>
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
    </el-tabs>
  </section>
</template>

<script>
import Bus from "@/utils/bus.js";
import { parseTime } from "@/utils/index.js";
import {
  projectSearchPatient,
  findByConditionNextSpeciaial,
  projectSearchToConfirm,
  projectSearchOtherProject,
  projectRemovePatient,
  projectRevokePatient,
  postFindPagePatient
} from "@/api/specialFollowUp";
export default {
  name: "TabItemTable",
  props: {
    commonForm: {
      type: Object,
      default() {
        return {
          dateCount: 0,
          dateArray: [["", ""]],
          checked: true,
          medicalNumbers: [],
          departmentNames: [],
          diseases: [],
          beforeDcDate: "",
          afterDcDate: "",
          medicalNumberTextarea: "",
        };
      },
    },
  },
  data() {
    return {
      searchDataFormData: {},
      activeListName: "first",
      listLoading: false,
      tableData1: [],
      tableData2: [],
      tableData3: [],
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
      commonFormNew: {},
      projectStatus: this.$route.query.statusNum,
      notSearch: false,
    };
  },
  created() {
    if (
      this.$route.query.statusNum == 1 ||
      this.$route.query.statusNum == 2 ||
      this.$route.query.statusNum == 3
    ) {
      this.notSearch = true;
    } else {
      this.notSearch = false;
    }
  },
  mounted() {},
  methods: {
    // 360视图
    toFollow360(row) {
      // window.open(this.VIEW360 + "/#/360View/" + row.tpatno + "/visit");
       window.open(
          this.VIEW360 + "/vinci-web/api/forEdc/getPersonOverviewByIdCard?idCardNo=" + row.idNum
        );
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
    // 获取搜索表单的值
    searchDataFormFn(val, typeVal) {
      this.searchDataFormData = this.searchDataFn();
      this.searchDataFormData.operButton = val;
      this.activeListName = "first";
      if (typeVal == "next") {
        this.findByConditionNextSpeciaialFn();
      } else {
        this.projectSearchPatientFn();
      }
    },
    // 下一步查询
    findByConditionNextSpeciaialFn() {
      this.searchDataFormData.flag = 0;
      this.searchDataFormData.pageNum = this.currentPage1;
      this.searchDataFormData.pageSize = this.currentPageSize1;
      if (this.searchDataFormData.operButton == 2) {
        this.$refs.multipleTable.clearSelection();
      }
      this.listLoading = true;
      findByConditionNextSpeciaial(this.searchDataFormData)
        .then((res) => {
          this.$nextTick(() => {
            let resData = res.data.list;
            // const patientSelected = JSON.parse(res.data.patientSelected.split(','));
            const patientSelected = res.data.patientSelected
              ? res.data.patientSelected
              : [];

            resData.forEach((item) => {
              item["stagingState"] = false; // 显示删除
              if (patientSelected.includes(item.id)) {
                item["stagingState"] = true; // 显示还原
              }
            });
            this.searchDataFormData.operButton = 1;
            this.currentPageTotal1 = res.data.total;
            //  this.$set(this.tableData1,'getData',res.data)
            this.listLoading = false;
            this.tableData1 = Object.assign([], resData);
          });
        })
        .catch((error) => {
          this.listLoading = false;
          this.$message.error("获取失败");
        });
    },
    // 应随访患者
    projectSearchPatientFn(val) {
      this.searchDataFormData.flag = 0;
      this.searchDataFormData.pageNum = this.currentPage1;
      this.searchDataFormData.pageSize = this.currentPageSize1;
      if (this.searchDataFormData.operButton == 2) {
        this.$refs.multipleTable.clearSelection();
      }
      this.listLoading = true;
      
      if(val =='page'){
        postFindPagePatient(this.searchDataFormData)
        .then((res) => {
          this.$emit('searchClickFn', 'true');
          this.$nextTick(() => {
            let resData = res.data.list;
            // const patientSelected = JSON.parse(res.data.patientSelected.split(','));
            const patientSelected = res.data.patientSelected
              ? res.data.patientSelected
              : [];

            resData.forEach((item) => {
              item["stagingState"] = false; // 显示删除
              if (patientSelected.includes(item.id)) {
                item["stagingState"] = true; // 显示还原
              }
            });
            this.searchDataFormData.operButton = 1;
            this.currentPageTotal1 = res.data.total;
            //  this.$set(this.tableData1,'getData',res.data)
            this.listLoading = false;
            this.tableData1 = Object.assign([], resData);
          });
        })
        .catch((error) => {
          this.listLoading = false;
          this.$message.error("获取失败");
        });
      }else{
         projectSearchPatient(this.searchDataFormData)
        .then((res) => {
          this.$emit('searchClickFn', 'true');
          this.$nextTick(() => {
            let resData = res.data.list;
            // const patientSelected = JSON.parse(res.data.patientSelected.split(','));
            const patientSelected = res.data.patientSelected
              ? res.data.patientSelected
              : [];

            resData.forEach((item) => {
              item["stagingState"] = false; // 显示删除
              if (patientSelected.includes(item.id)) {
                item["stagingState"] = true; // 显示还原
              }
            });
            this.searchDataFormData.operButton = 1;
            this.currentPageTotal1 = res.data.total;
            //  this.$set(this.tableData1,'getData',res.data)
            this.listLoading = false;
            this.tableData1 = Object.assign([], resData);
          });
        })
        .catch((error) => {
          this.listLoading = false;
          this.$message.error("获取失败");
        });
      }
    },
    // 待确认患者
    projectSearchToConfirmFn() {
      this.searchDataFormData.flag = 1;
      this.searchDataFormData.pageNum = this.currentPage2;
      this.searchDataFormData.pageSize = this.currentPageSize2;
      this.listLoading = true;
      projectSearchToConfirm(this.searchDataFormData)
        .then((res) => {
          this.listLoading = false;
          this.tableData2 = res.data.list;
          this.currentPageTotal2 = res.data.total;
        })
        .catch((error) => {
          this.listLoading = false;
          this.$message.error("获取失败");
        });
    },
    // 参与其他项目患者
    projectSearchOtherProjectFn() {
      this.searchDataFormData.flag = 3;
      this.searchDataFormData.pageNum = this.currentPage3;
      this.searchDataFormData.pageSize = this.currentPageSize3;
      this.listLoading = true;
      projectSearchOtherProject(this.searchDataFormData)
        .then((res) => {
          // this.$message.success("新增成功1");
          this.listLoading = false;
          this.tableData3 = res.data.list;
          this.currentPageTotal3 = res.data.total;
        })
        .catch((error) => {
          this.listLoading = false;
          this.$message.error("获取失败");
        });
    },
    // 列表复选框选择
    getRowKeys(row) {
      return row.id; // 每条数据的唯一识别值
    },
    // 批量删除
    batchDelet() {
      console.log(this.multipleSelection);
      let idsArr = this.multipleSelection.map((x) => {
        return x.id;
      });
      let formData = this.searchDataFn();
      let postData = {
         ...formData,
        pageNum: this.currentPage1,
        pageSize: this.currentPageSize1,
        projectId: this.$route.query.id,
        patients: idsArr.toString(),
      };
      projectRemovePatient(postData)
        .then((res) => {
          this.tableData1 = res.data.list;
          // const patientSelected = JSON.parse(res.data.patientSelected.split(','));
          const patientSelected = res.data.patientSelected
            ? res.data.patientSelected
            : [];

          console.log(patientSelected, "patientSelected,批量删除");
          this.tableData1.forEach((item) => {
            item["stagingState"] = false;
            if (patientSelected.includes(item.id)) {
              item["stagingState"] = true;
            }
          });

          this.currentPageTotal1 = res.data.total;
        })
        .catch((error) => {
          this.$message.error("获取失败");
        });
    },
    // 删除
    deletePatient(row) {
      let formData = this.searchDataFn();
      let postData = {
        ...formData,
        pageNum: this.currentPage1,
        pageSize: this.currentPageSize1,
        projectId: this.$route.query.id,
        patients: row.id,
      };
      projectRemovePatient(postData)
        .then((res) => {
          this.tableData1 = res.data.list;
          // const patientSelected = JSON.parse(res.data.patientSelected.split(','));
          const patientSelected = res.data.patientSelected
            ? res.data.patientSelected
            : [];
          this.tableData1.forEach((item) => {
            item["stagingState"] = false;
            if (patientSelected.includes(item.id)) {
              item["stagingState"] = true;
            }
          });
          this.$refs.multipleTable.toggleRowSelection(row); //添加进去
          this.currentPageTotal1 = res.data.total;
        })
        .catch((error) => {
          this.$message.error("获取失败");
        });

      console.log(" this.multipleSelection", this.multipleSelection);
    },
    // 还原
    reduction(row) {
       let formData = this.searchDataFn();
      let postData = {
         ...formData,
        pageNum: this.currentPage1,
        pageSize: this.currentPageSize1,
        projectId: this.$route.query.id,
        patientId: row.id,
        

      };
      console.log("当前选中", this.multipleSelection);

      projectRevokePatient(postData)
        .then((res) => {
          this.tableData1 = res.data.list;
          let newLisrt = this.multipleSelection.filter(
            (obj) => obj.id !== row.id
          );
          this.$refs.multipleTable.clearSelection();
          newLisrt.forEach((row) => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
          const patientSelected = res.data.patientSelected
            ? res.data.patientSelected
            : [];
          this.tableData1.forEach((item) => {
            item["stagingState"] = false;
            if (patientSelected.includes(item.id)) {
              item["stagingState"] = true;
            }
          });
        })
        .catch((error) => {
          this.$message.error("获取失败");
        });
    },
    // 撤销
    revokePatient() {},
    // 列表复选框选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 切换tab
    handleTabsClick(tab) {
      if (tab.name === "first") {
        //  <!-- 待审批   未发布     审批驳回   进行中   已终止       已完成 -->
        //   <!-- pending  approved  reject     in     suspend      finish -->
        //   <!-- 4         0         5          1       3             2  -->

        if (this.projectStatus != "") {
          this.findByConditionNextSpeciaialFn();
        } else {
          this.projectSearchPatientFn();
        }
      } else if (tab.name === "second") {
        this.projectSearchToConfirmFn();
      } else if (tab.name === "third") {
        this.projectSearchOtherProjectFn();
      }
    },
    handleSizeChange1(val) {
      this.currentPageSize1 = val;
      this.projectSearchPatientFn('page');
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      this.projectSearchPatientFn('page');
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
      this.projectSearchOtherProjectFn();
    },
    handleCurrentChange3(val) {
      this.currentPage3 = val;
      this.projectSearchOtherProjectFn();
    },
  },
};
</script>

<style lang="scss">
</style>