<template>
  <div class="content" style="height: calc(100% - 32px)">
    <!-- 生存情况分析 -->
    <div class="analy-staff margint0">
      <span class="analy-staff_title"> 生存情况分析 </span>
      <div class="analy-staff_time">
        <el-select
          v-model="typeSearchAnaly"
          class="md-select3"
          placeholder="请选择项目"
          size="mini"
        >
          <el-option
            v-for="item in projectList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="analy-staff_search">
        <el-button
          icon="el-icon-search"
          type="primary"
          size="mini"
          @click="postSurvivalConditionAnalysisFn"
          >查询</el-button
        >
      </div>
      <div class="list-box">
        <el-table
          stripe
          v-loading="loading"
          :data="tableData"
          class="two-lines"
          style="width: 99%"
        >
          <el-table-column
            prop="projectName"
            align="center"
            min-width="180"
            show-overflow-tooltip
            label="项目"
          >
          </el-table-column>
          <el-table-column
            prop="should"
            align="center"
            label="应随访总数"
            width="110"
          >
          </el-table-column>

          <!-- <el-table-column
				  prop="deathNum"
				  label="随访前已死亡人数"
				  width="150">
				</el-table-column>  -->
          <el-table-column
            prop="actual"
            align="center"
            width="110"
            label="实际随访人数"
          >
          </el-table-column>
          <el-table-column
            prop="vaild"
            align="center"
            width="110"
            label="有效随访人数"
          >
          </el-table-column>
          <el-table-column
            prop="vaildPercent"
            align="center"
            width="110"
            label="有效随访率"
          >
          </el-table-column>
          <el-table-column
            prop="lostNum"
            align="center"
            label="期间失访人数"
            width="110"
          >
          </el-table-column>
          <el-table-column
            prop="deathNum"
            align="center"
            width="110"
            label="期间死亡人数"
          >
          </el-table-column>
          <el-table-column
            prop="deathNumPercent"
            align="center"
            width="81"
            label="死亡率"
          >
          </el-table-column>

          <el-table-column label="生存率(K-M算法)" align="center">
            <el-table-column prop="death90Percent" align="center" width="78" label="3个月">
            </el-table-column>
            <el-table-column
              prop="death180Percent"
              align="center"
              label="6个月"
              width="78"
            >
            </el-table-column>
            <el-table-column
              prop="death270Percent"
              align="center"
              label="9个月"
              width="78"
            >
            </el-table-column>
            <el-table-column
              prop="death1365Percent"
              align="center"
              label="12个月"
              width="78"
            >
            </el-table-column>
            <el-table-column
              prop="death2365Percent"
              align="center"
              label="24个月"
              width="78"
            >
            </el-table-column>
            <el-table-column
              prop="death3365Percent"
              align="center"
              label="36个月"
              width="78"
            >
            </el-table-column>
            <el-table-column
              prop="death4365Percent"
              align="center"
              label="48个月"
              width="78"
            >
            </el-table-column>
            <el-table-column
              prop="death5365Percent"
              align="center"
              label="60个月"
            >
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div class="pages-modules">
        <el-pagination
          style="float: right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          :pager-count="7"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { parseTime } from "@/utils/index.js";
import {
  getSelectAllProject,
  postSurvivalConditionAnalysis,
} from "@/api/statisticAnaly";
export default {
  name: "StatisticalAnalysis",
  data() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
    return {
      lostList: [],
      tableData: [],
      loading: false,
      pageNum: 1, // 分页数据
      pageSize: 10, // 每页展示数量
      total: 0, // 总数
      statistics: {
        total: 0,
        actual: 0,
        vaild: 0,
        percent: 0,
      },
      analyList: [],
      projectList: [],
      staffSearchAnaly: [],
      staffSearchAnalyValid: [],
      typeSearchAnaly: "",
      radioSearchAnaly: "mobile",

      staffSearchTime: [start, end],
      staffSearchTimeValid: [start, end],
      typeSearchTime: [start, end],
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
    this.getSelectAllProjectFn();
    this.postSurvivalConditionAnalysisFn();
  },
  methods: {
    getSelectAllProjectFn() {
      getSelectAllProject()
        .then((res) => {
          this.projectList = res.data.reduce((t, e) => {
            t.push({ id: e.id, name: e.name });
            return t;
          }, []);
          console.log(res);
        })
        .catch((error) => {
          console.error("getByDisease", error);
        });
    },
    postSurvivalConditionAnalysisFn() {
      let postData = {
        page: this.pageNum,
        pageSize: this.pageSize,
        projectId: this.typeSearchAnaly,
      };
      this.loading = true;
      postSurvivalConditionAnalysis(postData)
        .then((res) => {
          // this.projectList = res.data.reduce((t,e) => {
          //   t.push({id:e.id,name:e.name})
          //   return t;
          // },[]);
          this.tableData = res.data.list;
          this.total = res.data.total;
          this.loading = false;
        })
        .catch((error) => {
          console.error("getByDisease", error);
        });
    },
    addClassAssist(val) {
      if (parseFloat(val) >= 50) {
        return "survival-color_50";
      }
      if (parseFloat(val) < 30) {
        return "survival-color_30";
      }
      if (parseFloat(val) >= 30 && parseFloat(val) < 50) {
        return "survival-color_30-50";
      }
    },
    // 修改单元格样式
    addClass({ row, column, rowIndex, columnIndex }) {
      return false;
      let val = null;
      if (columnIndex === 8) {
        val = row.death90Percent;
      }
      if (columnIndex === 9) {
        val = row.death180Percent;
      }
      if (columnIndex === 10) {
        val = row.death270Percent;
      }
      if (columnIndex === 11) {
        val = row.death1365Percent;
      }
      if (columnIndex === 12) {
        val = row.death2365Percent;
      }
      if (columnIndex === 13) {
        val = row.death3365Percent;
      }
      if (columnIndex === 14) {
        val = row.death4365Percent;
      }
      if (columnIndex === 15) {
        val = row.death5365Percent;
      }
      return this.addClassAssist(val);
    },

    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.postSurvivalConditionAnalysisFn();
    },
    // 页数按钮
    handleCurrentChange(val) {
      this.pageNum = val;
      this.postSurvivalConditionAnalysisFn();
    },
  },
};
</script>
<style lang="scss" scoped>
.analy-basic {
  // height: 180px;
  padding: 10px 6px;
  background: #fff;
  .el-row {
    height: 100%;
    .el-col {
      height: calc(100% - 20px);
      width: calc(25% - 20px);
      margin: 10px;
      border-radius: 6px;
      color: #fff;
      padding: 40px 20px;
      div p {
        font-size: 14px;
        line-height: 1;
        &:last-child {
          font-size: 28px;
          margin-top: 40px;
        }
      }
      .info-imgSize {
        font-size: 77px;
        margin-top: -6px;
        color: #fff;
      }
      &:nth-of-type(1) {
        background-image: linear-gradient(to right, #1389de, #3cadff);
      }
      &:nth-of-type(2) {
        background-image: linear-gradient(to left, #ffb44a, #ea961e);
      }
      &:nth-of-type(3) {
        background-image: linear-gradient(to left, #ff735b, #d15b47);
      }
      &:nth-of-type(4) {
        background-image: linear-gradient(to left, #51c353, #468847);
      }
    }
  }
}
.analy-staff {
  position: relative;
  // height: 300px;
  margin-top: 16px;
  padding: 24px 0;
  background: #fff;
  .analy-staff_title {
    position: relative;
    display: inline-block;
    font-weight: bold;
    /*border-left: 3px solid #2476c2;*/
    /*padding-left: 16px;*/
    margin-left: 24px;

    &::before {
      content: "";
      width: 4px;
      height: 16px;
      background-color: #2476c2;
      position: absolute;
      top: 3px;
      left: -7px;
    }
  }
  .analy-staff_search,
  .analy-staff_select,
  .analy-staff_time,
  .analy-staff_radio {
    position: absolute;
    top: 20px;
    right: 35px;
    height: 32px;
    z-index: 10;
    & > div {
      width: 200px;
    }
  }
  .analy-staff_time {
    right: 120px;
  }
  .analy-staff_radio {
    left: 38%;
    width: 220px;
    top: 28px;
    & > div {
      width: 100%;
    }
  }
  .analy-staff_select {
    right: 285px;
  }
  .data_view-container {
    // max-width: 1000px;
    // margin: 0 auto;
    // padding: 16px;
    height: 300px;
  }
  .second-title {
    font-size: 14px;
    color: #999;
    margin-left: 12px;
    font-weight: 100;
  }
}
</style>
<style lang="scss">
.list-box {
  padding: 20px;
  // .disList {
  //   // margin-top: 20px;
  //   // margin-left: 20px;
  // }
}

.color50 {
  background: #7cadda !important;
  color: #ffffff !important;
}
.color30 {
  background: #b2b6fd !important;
  color: #ffffff !important;
}
.color10 {
  background: #d6c2f9 !important;
  color: #ffffff !important;
}
</style>
