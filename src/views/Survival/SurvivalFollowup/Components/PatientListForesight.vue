<template>
  <div
    class="page-table"
    style="padding: 0 !important; margin-top: 16px; display: none"
    :style="{ display: 'block' }"
  >
    <el-table stripe :data="tableData" border style="width: 99%">
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
      <el-table-column
        prop="mobile"
        align="center"
        label="手机号"
        width="110"
      ></el-table-column>
      <el-table-column align="center"  min-width="100" label="确诊日期">
        <template slot-scope="scope">
          <span>{{ scope.row.firstConfirmDate | dateFilters }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="mainDiagnosis"
        align="center"
        label="主要诊断"
        min-width="160"
        show-overflow-tooltip
      ></el-table-column>
      <!-- <el-table-column prop="treatType" align="center" label="状态" width="80"></el-table-column> -->
      <el-table-column align="center"  min-width="120" label="最后接触时间">
        <template slot-scope="scope">
          <span>{{ scope.row.lastContactTime | dateFilters }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="lastContactType"
        align="center"
        min-width="120"
        label="最后接触类型"
      ></el-table-column>
      <el-table-column
        prop="lastContactResult"
        align="center"
        min-width="120"
        label="最后接触结果"
      ></el-table-column>
      <el-table-column
        align="center"
        label="最近随访时间"
        min-width="120"
        prop="recentTime"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.recentTime | dateFilters }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="recentResult"
         min-width="120"
        label="最近随访结局"
      ></el-table-column>
      <template class="details_table_column" v-if="tableData.length">
        <!-- :label="`随访点${index + 1}`" -->
        <!--  -->
        <el-table-column
          align="center"
          :label="`${item.nodeName} - ${item.nodePoint}`"
           min-width="160"
          v-for="(item, index) in tableData[0].groups"
          :key="index"
        >
          <template slot-scope="scope">
            <el-tooltip placement="top" popper-class="tooltip_class">
              <div slot="content">
                <!-- 已随访 2020-6-20 -->
                <!-- statusName  -->
                {{ scope.row.groups[index].statusName }}
              </div>
              <!-- 已完成也可以看 yuwen -->
              <!-- :style="{'pointer-events': scope.row.groups[index].statusName === '已完成' ? 'none' : ''}" -->
              <span
                class="cursor"
                @click="toFollowClick(scope.row, scope.row.groups[index])"
                >{{ scope.row.groups[index].statusName }}</span
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
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
import { getFindPatientInfoById } from "@/api/survivalFollowup";

export default {
  name: "PatientListForesight",
  props: {
    searchData: {
      type: Object,
      default() {
        return {
          status: 0,
        };
      },
    },
    typeNumber: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  data() {
    return {
      nodata: true,
      tableData: [],
      // 分页数据
      currentPage: 1,
      currentPageSize: 10,
      currentPageTotal: 0,
      statusCode: this.$route.query.statusCode,
      statusName: this.$route.query.statusName,
      followType: this.$route.query.type, // 随访类型
    };
  },
  created() {
    this.getFindPatientInfoByProjectFn();
  },
  methods: {
    toFollowClick(row, groupsVal, isView) {
      //      id | 患者id
      // patientId | 患者的微信id
      // diseaseId | 病例id'
      //groupsVal.status  -1:未开始，0：待随访，1：已完成，2：暂存，3：失访，4：超时随访，5：超时未随访
      let { id, diseaseId, patientId, ppId } = row;
      let followEndtype = "prospect";
      if (groupsVal.status != -1) {
        if (groupsVal.status == 1 || groupsVal.status == 3) {
          isView = true;
          followEndtype = "1";
        } else {
          isView = false;
        }
        let groupId = groupsVal.id;
        let resultId = groupsVal.resultId ? groupsVal.resultId : "";
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
            type: groupsVal.status,
            isView: isView,
            isfollowType: followEndtype,
            statusCode_old:this.statusCode,
            statusName_old:this.statusName,
            followType_old:this.followType,
          },
        });
      } else {
        this.$message.success("暂时不可以去随访");
      }
    },
    //获取表单列表
    // getFindPatientInfoById
    //  ***/api/live/findPatientInfoById***
    getFindPatientInfoByProjectFn() {
      console.log(this.searchData, "获取表单列表h");
      const getData = {
        projectId: this.$route.query.id,
        // status: this.typeNumber,
        status: this.searchData.status,
        name: this.searchData.name,
        pageNum: this.currentPage,
        pageSize: this.currentPageSize,
      };

      getFindPatientInfoById(getData)
        .then((res) => {
          this.nodata = false;
          this.tableData = res.data.list;
          this.total = res.data.total;
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
<style lang="scss" scoped>
.list-operating {
  font-size: 20px;
  margin: 0 12px;
  cursor: pointer;
}
.cursor {
  cursor: pointer;
  &:hover {
    color: #2476c2;
  }
}
</style>