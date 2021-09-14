<template>
  <div class="page-table" style="padding: 0 !important">
    <el-table
      stripe
      :data="tableData"
      border
      style="width: 99%"
      v-loading="listLoading"
    >
      <!-- <el-table-column
        prop="tpatnoExt"
        align="center"
        label="病案号"
        width="110"
      ></el-table-column> -->
      <el-table-column
        prop="visitId"
        align="center"
        label="住院号"
        width="110"
      ></el-table-column>
      <el-table-column
        prop="patientName"
        align="center"
        label="姓名"
        width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="sex" align="center" label="性别" width="80">
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
        width="80"
      ></el-table-column>
      <el-table-column
        prop="mobile"
        align="center"
        label="手机号"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="departmentName"
        align="center"
        label="所属科室"
        min-width="160"
        show-overflow-tooltip
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
        min-width="160"
        show-overflow-tooltip
      ></el-table-column>
      <!-- <el-table-column
        prop="pathologyDiagnose"
        align="center"
        label="病理诊断"
      ></el-table-column> -->
      <el-table-column
        prop="nurse"
        align="center"
        label="责任护士"
        width="80"
      ></el-table-column>
      <el-table-column
        align="center"
        label="出院时间"
        width="100"
      >
      <template slot-scope="scope">
              <span>{{ scope.row.dischargeDateTime | dateFilters }}</span>
            </template>
      </el-table-column>
      <el-table-column
        prop="batchNumber"
        align="center"
        label="所属病区"
        min-width="160"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="110px">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="基本信息"
            placement="top"
          >
            <i
              @click="toFollow(scope.row, false, 'first')"
              class="iconfont iconbiaodanguanli iconfontColor list-operating"
            ></i>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="电话随访"
            placement="top"
          >
            <i
              v-show="scope.row.status !== 1"
              @click="toFollow(scope.row, false, 'third')"
              class="iconfont icondianhua iconfontColor list-operating"
            ></i>
          </el-tooltip>
          <!-- <el-tooltip
            class="item"
            effect="dark"
            content="微信随访"
            placement="top"
          >
            <i
              v-show="scope.row.status !== 1"
              @click="toFollow(scope.row, false, 'third')"
              class="iconfont iconweixin iconfontColor list-operating"
            ></i>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="短信随访"
            placement="top"
          >
            <i
              v-show="scope.row.status !== 1"
              class="iconfont iconjianzhuanquan- iconfontColor list-operating"
            ></i>
          </el-tooltip> -->
          <el-tooltip
            class="item"
            effect="dark"
            content="随访详情"
            placement="top"
          >
            <i
              v-show="scope.row.status == 1"
              @click="toFollow(scope.row, true, 'third')"
              class="el-icon-tickets iconfontColor list-operating"
            ></i>
          </el-tooltip>
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
import { postRoutineList } from "@/api/routineFollowup";

export default {
  name: "TabItemTable",
  props: {
    searchData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      type: this.$attrs.type,
      listLoading: false,
      tableData: [],
      // 分页数据
      currentPage: 1,
      currentPageSize: 10,
      currentPageTotal: 0,
    };
  },
  created() {
    this.getListFn();
  },
  methods: {
    toFollow(row, isView, viewFlag) {
      // viewFlag 一一对应  first基本信息 third随访信息
      // type  0待随访、 1已随访 、2暂存
      // row.status  0待随访、 1已随访 、2暂存
      if (this.type == 1) {
        isView = true;
      } else {
        isView = false;
      }

      let { id, diseaseId, patientId, resultId, outPid } = row;
      this.$router.push({
        path: "/routine/followup/details",
        query: {
          id,
          patientId,
          diseaseId,
          resultId,
          type: this.type,
          isView: isView,
          viewFlag: viewFlag,
          outPid,
        },
      });
    },
    //获取列表
    getListFn() {
      if (this.searchData.date == null) {
        this.searchData.date = ["", ""];
      }
      const postData = {
        pageNum: this.currentPage,
        pageSize: this.currentPageSize,
        name: this.searchData.name,
        batchNumber: this.searchData.batchNumber,
        p819: this.searchData.p819,
        updateTimePre: parseTime(this.searchData.date[0], "{y}-{m}-{d}") || "",
        updateTimeSuf: parseTime(this.searchData.date[1], "{y}-{m}-{d}") || "",
        hospitalName: this.searchData.hospName || "",
        departmentName: this.searchData.department || "",
        status: this.type,
      };
      this.listLoading = true;
      postRoutineList(postData)
        .then((res) => {
          this.listLoading = false;
          this.tableData = res.data.list;
          this.currentPageTotal = res.data.total;
        })
        .catch((error) => {
          this.listLoading = false;
          console.error("postRoutineList", error);
        });
    },
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.getListFn();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getListFn();
    },
  },
};
</script>
<style lang="scss" >
.iconfontColor {
  color: #2F7E7D; // 主题修改yuwen
}
.list-operating {
  font-size: 20px;
  margin: 0 12px;
  cursor: pointer;
}
</style>