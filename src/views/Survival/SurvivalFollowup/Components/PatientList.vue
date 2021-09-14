<template>
  <div
    class="page-table"
    style="padding: 0 !important; margin-top: 16px; display: none"
    :style="{ display: 'block' }"
  >
    <el-button
      class="piliangfs"
      type="primary"
      @click="wxClick"
      v-if="typeNumber == 0"
      size="mini"
      :disabled="multipleSelection.length === 0"
    >
      发送微信
    </el-button>
    <el-button
      class="piliangfs"
      type="primary"
      @click="wxALLClick"
      v-if="typeNumber == 0"
      size="mini"
    >
      全发微信
    </el-button>
    <!-- <el-button
      class="piliangfs"
      type="primary"
      size="mini"
    >
      全发短信（未开发）
    </el-button> -->
    <el-table
      stripe
      :data="tableData"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
      border
      style="width: 99%"
    >
      <el-table-column
        type="selection"
        width="40"
        align="center"
        :reserve-selection="true"
        v-if="typeNumber == 0"
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
        prop="departmentName"
        align="center"
        label="所属科室"
        min-width="101"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="diseaseName"
        align="center"
        label="病种"
        min-width="160"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column align="center" label="确诊日期" width="100">
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
        prop="pathologyDiagnose"
        align="center"
        label="病理诊断"
      ></el-table-column> -->
      <!-- <el-table-column
        prop="nurse"
        align="center"
        label="责任护士"
        width="121"
      ></el-table-column> -->
      <el-table-column
        prop="p434"
        align="center"
        label="经管医师"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="firstDischargedDate"
        align="center"
        label="出院时间"
        width="100"
      ></el-table-column>
      <el-table-column
        align="center"
        label="随访类型"
        width="100"
        v-if="typeNumber == 1"
      >
        <template slot-scope="scope">
          <span>
            {{
              scope.row.lastContactType == "微信随访" ? "微信随访" : "电话随访"
            }}
          </span>
        </template>
      </el-table-column>
       <el-table-column
        prop="createBy"
        align="center"
        label="随访人员"
        width="100"
        v-if="typeNumber == 1"
      >
      </el-table-column>

      <!-- width="210px"  4个 -->
      <!-- width="120px"  2个 -->
      <el-table-column label="操作" fixed="right" align="center" width="180px">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="基本信息"
            placement="top"
          >
            <i
              @click="toFollowClick(scope.row, false, 'first')"
              class="iconfont iconbiaodanguanli iconfontColor list-item list-operating"
            ></i>
          </el-tooltip>
          <!-- smsStatus 发送短信  smsStatus为1已经发送过短信 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="电话随访"
            placement="top"
          >
            <i
              v-if="statusCode == 1 && typeNumber != 1"
              @click="toFollowClick(scope.row, false, 'third')"
              class="iconfont icondianhua iconfontColor list-item list-operating"
            ></i>
          </el-tooltip>
          <!--  随访详情只有已随访  || scope.row.smsStatus == 1 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="随访详情"
            placement="top"
          >
            <i
              v-show="typeNumber == 1 "
              @click="toFollowClick(scope.row, true, 'third')"
              class="iconfont iconicon_xiangqing iconfontColor list-item list-operating"
            ></i>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="微信随访"
            placement="top"
          >
            <i
              v-if="
                scope.row.followupMethodCode.includes('wechat') &&
                statusCode == 1 &&
                typeNumber != 1
              "
              @click="toFollowClick(scope.row, false, 'third')"
              class="iconfont iconweixinPro-copy iconfontColor list-item list-operating"
            ></i>
          </el-tooltip>

          <!-- v-if="scope.row.followupMethodCode.includes('wechat')" -->
          <!-- <el-tooltip
            class="item"
            effect="dark"
            content="短信随访"
            placement="top"
          >
            <i
              v-show="scope.row.smsStatus !== 1"
              class="iconfont iconjianzhuanquan- iconfontColor list-operating"
            ></i>
          </el-tooltip> -->
          <!-- <el-tooltip
            class="item"
            effect="dark"
            content="随访详情"
            placement="top"
          >
            <i
              v-show="scope.row.smsStatus == 1"
              @click="toFollowClick(scope.row, true, 'third')"
              class="el-icon-tickets iconfontColor list-operating"
            ></i>
          </el-tooltip> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="pages-modules">
      <el-pagination
        style="float: right"
        :total="currentPageTotal"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        background
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { parseTime } from "@/utils/index.js";
import {
  getFindPatientInfoByProject,
  sendAllMsg,
  sendAll,
} from "@/api/survivalFollowup";

export default {
  name: "PatientList",
  props: {
    searchData: {
      type: Object,
      default() {
        return {};
      },
    },
    typeNumber: {
      type: Number,
      default() {
        return 0;
      },
    },
    
    
    // 暂时不加  bug 5975
    isWxBtn: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      // 分页数据
      currentPage: 1,
      currentPageSize: 10,
      currentPageTotal: 0,
      // 0: "未开始",
    // 1: "进行中",
    // 2: "已完成",
    // 3: "已终止",
      statusCode: this.$route.query.statusCode,
      statusName: this.$route.query.statusName,
      followType: this.$route.query.type, // 随访类型
    };
  },
  created() {
    this.getFindPatientInfoByProjectFn();
  },
  methods: {
    // 发送微信
    wxClick() {
      // console.log('multipleSelection',this.multipleSelection);
      this.$confirm("请问您确定要给所选全部用户发送微信吗？", "批量发送微信", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        const postData = {
          projectId: this.$route.query.id,
          patientIds: this.multipleSelection.reduce((t, e) => {
            t.push(e.id);
            return t;
          }, []),
        };
        console.log(postData);
        sendAllMsg(postData).then((res) => {
          console.log("批量发送微信", res);
          this.$message({
            type: "success",
            message: res.data,
          });
        });
      });
    },
    // 全部发送微信
    wxALLClick() {
      this.$confirm("请问您确定要给全部用户发送微信吗？", "批量发送微信", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        const postData = {
          projectId: this.$route.query.id,
        };
        console.log(postData);
        sendAll(postData).then((res) => {
          console.log("批量发送微信", res);
          this.$message({
            type: "success",
            message: res.data,
          });
        });
      });
    },
    // 列表复选框选择
    handleSelectionChange(val) {
      this.multipleSelection = val;

      // this.tableData1.forEach((item) => {
      //   item["stagingState"] = true;
      //   if (this.multipleSelection.includes(item)) {
      //     item["stagingState"] = false;
      //   }
      // });
    },
    // 列表复选框记忆
    getRowKeys(row) {
      return row.id; // 每条数据的唯一识别值
    },
    // 去看详情
    toFollowClick(row, isView, viewFlag) {
      //      id | 患者id
      // patientId | 患者的微信id
      // diseaseId | 病例id

      if (this.typeNumber == 1) {
        isView = true;
      } else {
        isView = false;
      }
    
      let {
        id,
        diseaseId,
        patientId,
        groupId,
        ppId,
        prePatientId,
        sufPatientId,
      } = row;
      let resultId = row.resultId ? row.resultId : "";
      this.$router.push({
        path: "/survival/followUpDetails",
        query: {
          id,
          groupId,
          ppId,
          projectId: this.$route.query.id,
          patientId,
          diseaseId,
          resultId,
          prePatientId,
          sufPatientId,
          type: this.typeNumber,
          isView: isView,
          viewFlag: viewFlag,
          statusCode_old: this.statusCode,
          statusName_old: this.statusName,
          followType_old: this.followType,
          followUpType: "review",
        },
      });
    },
    //获取列表
    // getFindPatientInfoByProject
    getFindPatientInfoByProjectFn() {
      const getData = {
        projectId: this.$route.query.id,
        status: this.typeNumber,
        name: this.searchData.name,
        pageNum: this.currentPage,
        pageSize: this.currentPageSize,
      };
      getFindPatientInfoByProject(getData)
        .then((res) => {
          this.tableData = res.data.list;
          this.currentPageTotal = res.data.total;
        })
        .catch((error) => {
          console.error("getFindPlanByTypesss", error);
        });
    },

    handleSizeChange(val) {
      this.currentPageSize = val;
      this.getFindPatientInfoByProjectFn();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getFindPatientInfoByProjectFn();
    },
  },
};
</script>
<style lang="scss" >
.list-item {
  font-size: 24px !important;
  color: #2F7E7D;
  margin: 0 10px;
  cursor: pointer;
}
// .list-operating {
//   font-size: 20px;
//   margin: 0 12px;
//   cursor: pointer;
// }
.piliangfs {
  // margin: 16px 0;
  margin-bottom: 16px;
}
</style>