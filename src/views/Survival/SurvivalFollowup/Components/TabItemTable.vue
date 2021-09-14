<template>
  <section>
    <el-tabs
      v-loading="nextLoading"
      v-model="activeListName"
      @tab-click="handleTabsClick"
      style="padding: 20px 0"
    >
      <el-tab-pane label="应随访患者" name="first">
        <!-- <el-button
          type="primary"
          class="plsc"
          size="mini"
          @click="batchDelet"
          v-if="followType != 'prospect'"
          >批量删除</el-button
        > -->
        <!-- <div class="long-table"> -->
        <el-table
          stripe
          :data="tableDatafirst"
          ref="tableDatafirstRef"
          :row-key="getRowKeys"
          @selection-change="handleSelectionChange"
          border
          v-loading="listLoadingFirst"
          style="width: 99%"
        >
          <!-- <el-table-column
            type="selection"
            width="60"
            align="center"
            :reserve-selection="true"
            fixed="left"
            v-if="followType != 'prospect'"
          ></el-table-column> -->
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
            min-width="160"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" width="100" label="确诊日期">
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
          <el-table-column align="center" width="120" label="出院时间">
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
            prop="recentTime"
            width="120"
            label="最近随访时间"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="recentResult"
            width="120"
            label="最近随访结局"
          ></el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            align="center"
            v-if="false"
          >
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
              <!-- <el-tooltip
                class="item"
                effect="dark"
                content="还原"
                placement="top"
                v-if="followType != 'prospect'"
              >
                <i
                  @click="reduction(scope.row)"
                  class="iconfont iconzhongzhi iconfontColor list-operating"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top"
                v-if="followType != 'prospect'"
              >
                <i
                  @click="deletePatient(scope.row)"
                  class="iconfont iconshanchu iconfontColor list-operating"
                ></i>
              </el-tooltip> -->
            </template>
          </el-table-column>
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
            prop="tpatno"
            align="center"
            label="病案号"
            width="80"
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
          <el-table-column align="center" width="100" label="确诊日期">
            <template slot-scope="scope">
              <span>{{ scope.row.firstConfirmDate | dateFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="icd10Name1"
            align="center"
            label="主要诊断"
            min-width="140"
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
            min-width="180"
            label="来源医院"
            show-overflow-tooltip
          ></el-table-column> -->
          <el-table-column align="center" width="120" label="出院时间">
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
            prop="recentTime"
            width="120"
            label="最近随访时间"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="recentResult"
            width="120"
            label="最近随访结局"
          ></el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="120"
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
                  class="iconfont icon360shitu iconfontColor list-operating"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="修改"
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
        <el-dialog
          title="修改结果"
          :visible.sync="dialogVisible"
          width="50%"
          :append-to-body="true"
        >
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
            <el-form-item label="最后一次随访结局" prop="res">
              <el-select
                v-model="revokeForm.res"
                placeholder="最后一次随访结局"
                style="width: 100%"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="revokePatientConfirm('revokeForm')"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane
        :label="`近${dateCount}天有复诊的患者`"
        name="third"
        v-if="
          checkedVal == true && $route.query.type != 'prospect' && dateCount > 0
        "
      >
        <el-table
          stripe
          v-loading="listLoadingThird"
          :data="tableDatathird"
          border
          style="width: 99%"
        >
          <el-table-column
            prop="tpatno"
            align="center"
            label="病案号"
            width="80"
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
            min-width="130"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" width="100" label="确诊日期">
            <template slot-scope="scope">
              <span>{{ scope.row.firstConfirmDate | dateFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="icd10Name1"
            align="center"
            label="主要诊断"
            min-width="130"
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
            min-width="180"
            label="来源医院"
            show-overflow-tooltip
          ></el-table-column> -->
          <el-table-column align="center" width="120" label="出院时间">
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
            prop="recentTime"
            width="120"
            label="最近随访时间"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="recentResult"
            width="120"
            label="最近随访结局"
          ></el-table-column>

          <el-table-column
            label="操作"
            fixed="right"
            width="120"
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
                  class="iconfont icon360shitu iconfontColor list-operating"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="修改"
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
            min-width="160"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" width="100" label="确诊日期">
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
            min-width="180"
            label="来源医院"
            show-overflow-tooltip
          ></el-table-column> -->
          <el-table-column align="center" width="120" label="出院时间">
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
            prop="recentTime"
            width="120"
            label="最近随访时间"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="recentResult"
            width="120"
            label="最近随访结局"
          ></el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            align="center"
            v-if="false"
          >
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
          :disabled="dataLen == 0 || activeListName !== 'first' || isnextClick"
          >下一步</el-button
        >
      </el-col>
    </el-row>
  </section>
</template>

<script>
import Bus from "@/utils/bus.js";
import { parseTime } from "@/utils/index.js";
import {
  postFindPatientInfoByCondition,
  postAddSearchCondition,
  getFindByCondition,
  getFindByConditionNext,
  updatePatient,
} from "@/api/survivalFollowup";
import { getFindAllByTypeCode } from "@/api/user";
export default {
  name: "TabItemTable",
  // searchData: {
  //   type: Object,
  //   default() {
  //     return {
  //       name: "",
  //       department: "",
  //       date: "",
  //       hospName: "",
  //       deptName: "",
  //     };
  //   },
  // },
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
    advancedSearch: {
      type: Object,
      default() {
        return {
          conditionItemList: [{ topicVal: "", filterList: [] }],
        };
      },
    },
    dateCount: {
      type: String,
      default() {
        return "0";
      },
    },
    checkedVal: {
      type: Boolean,
      default() {
        return false;
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
      nextLoading: false,
      listLoadingFirst: true,
      listLoadingSecond: true,
      listLoadingThird: true,
      listLoadingFourth: true,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e7就是不可以选择今天的
        },
      },
      typeList: [],
      revokeForm: {
        date: "",
        res: "",
      },
      rules: {
        date: [{ required: true, message: "请选择时间", trigger: "blur" }],
        res: [{ required: true, message: "请选择结局", trigger: "change" }],
      },
      dialogVisible: false,
      dataLen: 0,
      followType: this.$route.query.type, // 随访类型
      searchType: "isFirst", // isFirst 常规检索     isSecond 高级查询（isSecond抛弃）
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
      multipleSelection: [],
      conventionalData: {}, // 常规检索查询data
      isnextClick: false,
      projectStatus: this.$route.query.projectStatus,
    };
  },
  created() {
    this.getFindAllByTypeCodeFn();
    console.log(797979, this.filterClickCount);
  },
  mounted() {},
  methods: {
    // 上一步
    backOn() {
      this.$emit("filterClickCountChange");
      this.$emit("activeChangeToGo", 1);
    },
    // 下一步
    nextStep() {
      this.isnextClick = true;
      let ids = this.multipleSelection.map((x) => {
        return x.id;
      });
      ids.toString();
      let idArray = this["tableData" + this.activeListName].reduce((t, e) => {
        t.push(e.id);
        return t;
      }, []);
      let dataV = {
        ...this.searchDataFormData,
        patientIds: idArray,
        projectId: this.$route.query.id,
        searchCondition: JSON.stringify(this.searchDataFormData),
        // patients: ids.toString(),
        patients: "",
      };
      this.nextLoading = true;

      if (dataV.conditionItemList.length) {
        if (dataV.conditionItemList.some((x) => x.topicVal == "")) {
          dataV.conditionItemList = [];
        }
      }
      postAddSearchCondition(dataV)
        .then((res) => {
          this.isnextClick = false;
          this.nextLoading = false;
          this.$emit("activeChangeToGo", 3);
        })
        .catch((error) => {
          this.$message.error("获取失败");
        });
    },
    // 查询的数据整理
    searchDataFn() {
      let val = this.commonForm;
      let dateArrayVal = val.dateArray.reduce((t, e) => {
        if (!!e[0]) {
          if (typeof e[0] == "string") {
            t.push([
              parseTime(e[0], "{y}-{m}-{d}"),
              parseTime(e[1], "{y}-{m}-{d}"),
            ]);
          } else if (typeof e[0] == "object") {
            t.push([
              this.$moment(Number(e[0])).format("YYYY-MM-DD"),
              this.$moment(Number(e[1])).format("YYYY-MM-DD"),
            ]);
          }
        }
        return t;
      }, []);
      let searchData = {
        operButton: 1, //operButton   1: 筛选    2： 重置
        tableName: "t_data_patient",
        pageSize: 1,
        pageNum: 10,
        projectId: Number(this.$route.query.id),
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
    // 获取搜索表单的值 常规检索
    getComSearchFn(val, typeVal) {
      this.searchType = "isFirst";

      if (val == "next") {
        typeVal = "next";
      }

      this.searchDataFormData = this.searchDataFn();
      console.log(this.advancedSearch, " 获取搜索表单的值 常规检索");
      if (this.advancedSearch.conditionItemList) {
        this.searchDataFormData.conditionItemList =
          this.advancedSearch.conditionItemList;
      } else {
        this.searchDataFormData.conditionItemList = [
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
      }
      // if (
      //   this.advancedSearch.conditionItemList[0].topicVal &&
      //   this.advancedSearch.conditionItemList[0].topicVal != ""
      // ) {
      //   this.searchDataFormData.conditionItemList = this.advancedSearch.conditionItemList;
      // } else {
      //   this.searchDataFormData.conditionItemList = [];
      // }
      // if (val.timeDcDate == null) {
      //   val.timeDcDate = ["", ""];
      // }
      // val.timeDcDate = val.timeDcDate || ["", ""];
      // val.timeDcDate2 = val.timeDcDate2 || ["", ""];
      // if (!val.timeDcDate[0] && val.timeDcDate2[0]) {
      //   val.timeDcDate = val.timeDcDate2.splice(0);
      //   val.timeDcDate2 = ["", ""];
      // }

      let flagVal = 0;
      if (this.activeListName === "first") {
        flagVal = 0;
      } else if (this.activeListName === "second") {
        flagVal = 1;
      } else if (this.activeListName === "third") {
        flagVal = 2;
      } else if (this.activeListName === "fourth") {
        flagVal = 2;
      }
      this.lastSearchDataFn(
        this.currentPage1,
        this.currentPageSize1,
        flagVal,
        typeVal
      );
    },

    // 查询患者
    lastSearchDataFn(currentPageVal, currentPageSizeVal, flagVal, typeVal) {
      let loadList = ["First", "Second", "Third", "Fourth"];
      // flagVal != 2 && (this["listLoading" + loadList[flagVal]] = true);
      this["listLoading" + loadList[flagVal]] = true;
      let data = this.searchDataFormData;
      // if (this.searchType == "isFirst") {
      //   data = this.conventionalData;
      // } else {
      //   data = this.searchDataFormData;
      // }
      data["flag"] = flagVal; // 0应随访患者 1 待确认患者 2 90天 3 参与其他项目患者
      data.pageNum = currentPageVal;
      data.pageSize = currentPageSizeVal;
      data.dateCount = this.dateCount;

      let searchDatLast = JSON.parse(JSON.stringify(data));

      let judgeEmptyArr = searchDatLast.conditionItemList.reduce((t, e, i) => {
        if (e.topicVal != "") {
          if (e.filterList.length > 0) {
            e.filterList.forEach((itme, index) => {
              if (itme.topicVal == "") {
                e.filterList.splice(index, 1);
              }
            });
          }
          t.push(e);
        }
        return t;
      }, []);

      searchDatLast.conditionItemList = judgeEmptyArr;

      if (this.searchType == "isFirst") {
        typeVal === "next"
          ? getFindByConditionNext(searchDatLast)
              .then((res) => {
                console.log();
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
                // flagVal != 2 &&
                //   (this["listLoading" + loadList[flagVal]] = false);
                this["listLoading" + loadList[flagVal]] = false;
                // //判断筛选列表是否有数据
                // this.dataLen =
                //   this.activeListName == "first"
                //     ? this.tableDatafirst.length
                //     : this.activeListName == "second"
                //     ? this.tableDatasecond.length
                //     : this.activeListName == "fourth"
                //     ? this.tableDatafourth.length
                //     : 10;
              })
              .catch((error) => {
                this.$message.error("获取失败");
              })
          : getFindByCondition(searchDatLast)
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
                // flagVal != 2 &&
                //   (this["listLoading" + loadList[flagVal]] = false);
                this["listLoading" + loadList[flagVal]] = false;
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
                this.$message.error("获取失败");
              });
      } else {
        // 高级检索
        postFindPatientInfoByCondition(searchDatLast)
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
      if (this.projectStatus == 1) {
        this.lastSearchDataFn(
          this.currentPage1,
          this.currentPageSize1,
          0,
          "next"
        );
      } else {
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
      this.$refs.tableDatafirstRef.toggleRowSelection(row, true);
      this.tableDatafirst.forEach((item) => {
        item["stagingState"] = true;
        if (this.multipleSelection.includes(item)) {
          item["stagingState"] = false;
        }
      });
    },
    // 还原
    reduction(row) {
      this.$refs.tableDatafirstRef.toggleRowSelection(row, false);
      this.tableDatafirst.forEach((item) => {
        item["stagingState"] = true;
        if (this.multipleSelection.includes(item)) {
          item["stagingState"] = false;
        }
      });
    },
    // 撤销
    getFindAllByTypeCodeFn() {
      getFindAllByTypeCode({ typeCode: "finish" }).then((res) => {
        console.log("getFindAllByTypeCodeFn", res);
        this.typeList = res.data;
      });
    },
    revokePatient(row) {
      console.log(row);
      this.$refs.revokeForm && this.$refs.revokeForm.resetFields();
      this.revokePatientData = row;
      this.dialogVisible = true;
    },
    revokePatientConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const postData = {
            id: this.revokePatientData.id.toString(),
            lastFollowResult: this.revokeForm.res,
            lastFollowTime: this.revokeForm.date,
          };
          console.log(postData, this.revokeForm.date);
          updatePatient(postData).then((res) => {
            console.log("撤销", res);
            this.projectSearchToConfirmFn();
            if (this.activeListName === "second") {
              this.projectSearchToConfirmFn();
            } else if (this.activeListName === "third") {
              this.projectSearchOtherProjectFn90();
            }
            this.dialogVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 360视图
    toFollow360(row) {
      window.open(
        this.VIEW360 +
          "/vinci-web/api/forEdc/getPersonOverviewByIdCard?idCardNo=" +
          row.idNum
      );
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
  watch: {},
  beforeDestroy() {
    //组件销毁前需要解绑事件。否则会出现重复触发事件的问题
    // this.$Bus.$off("searchDataForm");
    // this.$Bus.$off("searchDataForm");
    // Bus.$off("searchDataFormGj", this.getADataFn);
  },
  //高级检索
  getADataFn(val) {
    this.searchType = "isSecond";
    const advancedData = {
      tableName: "t_data_patient",
      dateCount: "90",
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
    let searchVVal = advancedData.conditionItemList[0];
    let columnNameCode = searchVVal.restaurants.filter(
      (_) => _.value === searchVVal.topicVal
    )[0].columnName;
    advancedData.conditionItemList[0].topicVal = columnNameCode;
    this.searchDataFormData = advancedData;
    this.activeListName = "first";
    this.lastSearchDataFn(this.currentPage1, this.currentPageSize1, "0");
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
