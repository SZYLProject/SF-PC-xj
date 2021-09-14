<template>
  <div class="LostToFollowUpAnalyContent content">
    <div class="query-result">
      <div class="buttons">
        <span class="analy-staff_title"
          >生存随访失访情况分析
          <span class="second-title"></span>
        </span>
        <!-- <span class="title">生存随访失访情况分析</span> -->
        <div class="fr" style="margin-left: 20px">
          <el-button size="mini" type="primary" @click="down">导出</el-button>
        </div>
        <div class="fr">
          <!-- <el-date-picker
					  v-model="timeFrame"
					  size="mini"
					  type="daterange"
					  range-separator="至"
					  unlink-panels
					  start-placeholder="开始日期"
					  end-placeholder="结束日期">
					</el-date-picker> -->
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-search"
            @click="search"
            >查询</el-button
          >
        </div>

        <div class="fr" style="margin-right: 20px">
          <el-select
            v-model="value"
            placeholder="选择项目"
            multiple
            collapse-tags
            size="mini"
          >
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>

        <!-- <div class="down">
					<i class="el-icon-download fr" @click="down"></i>
				</div> -->
      </div>
      <div class="project-list">
        <el-table
          stripe
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          class="two-lines"
          :cell-class-name="addClass"
        >
          <el-table-column
            prop="name"
            align="center"
            min-width="120"
            show-overflow-tooltip
            label="项目"
          >
          </el-table-column>
          <el-table-column prop="total" align="center" label="应随访人数">
          </el-table-column>
          <el-table-column prop="lost" align="center" label="失访人数">
          </el-table-column>
          <el-table-column prop="lostPercent" align="center" label="失访率">
          </el-table-column>
          <el-table-column label="失访原因" align="center">
            <el-table-column
              prop="activePercent"
              align="center"
              label="主动拒接"
            >
            </el-table-column>
            <el-table-column prop="noPercent" align="center" label="无人接听">
            </el-table-column>
            <el-table-column
              prop="availablePercent"
              align="center"
              label="无法接通"
            >
            </el-table-column>
            <el-table-column
              prop="rejectionPercent"
              align="center"
              label="拒绝随访"
            >
            </el-table-column>
            <el-table-column prop="shutdownPercent" align="center" label="关机">
            </el-table-column>
            <el-table-column prop="downPercent" align="center" label="停机">
            </el-table-column>
            <el-table-column prop="emptyPercent" align="center" label="空号">
            </el-table-column>
            <el-table-column
              prop="wrongPercent"
              align="center"
              label="号码错误"
            >
            </el-table-column>
            <el-table-column
              prop="otherPercent"
              align="center"
              label="其他情况"
            >
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { parseTime } from "@/utils/index.js";
import {
  findProjectList,
  analysisLostVisits,
  downloadLostData,
} from "@/api/survivalAnaly";
export default {
  name: "StatisticAnaly",
  data() {
    return {
      loading: false,
      SurvivalAnalyForm: {},
      value: [],
      projectList: [],
      timeFrame: [], // 时间范围
      tableData: [],
    };
  },
  created() {
    this.findProjectListFn();
    this.analysisLostVisitsFn();
  },
  methods: {
    addClassAssist(val) {
      if (parseFloat(val) >= 50) {
        return "lost-color_50";
      }
      if (parseFloat(val) < 30) {
        return "lost-color_30";
      }
      if (parseFloat(val) >= 30 && parseFloat(val) < 50) {
        return "lost-color_30-50";
      }
    },
    // 修改单元格样式
    addClass({ row, column, rowIndex, columnIndex }) {
      return false;
      let val = null;
      if (columnIndex === 4) {
        val = row.activePercent;
      }
      if (columnIndex === 5) {
        val = row.noPercent;
      }
      if (columnIndex === 6) {
        val = row.availablePercent;
      }
      if (columnIndex === 7) {
        val = row.rejectionPercent;
      }
      if (columnIndex === 8) {
        val = row.shutdownPercent;
      }
      if (columnIndex === 9) {
        val = row.downPercent;
      }
      if (columnIndex === 10) {
        val = row.emptyPercent;
      }
      if (columnIndex === 11) {
        val = row.wrongPercent;
      }
      if (columnIndex === 12) {
        val = row.otherPercent;
      }
      return this.addClassAssist(val);
    },
    search() {
      this.analysisLostVisitsFn();
    },
    // get项目
    findProjectListFn() {
      findProjectList().then((res) => {
        console.log(res);
        this.projectList = res.data;
      });
    },
    //
    analysisLostVisitsFn() {
      // const postData = {
      // 	projectIds: !this.value.length ? null : this.value,
      // };
      this.loading = true;
      analysisLostVisits(this.value).then((res) => {
        console.log(res);
        this.tableData = res.data;
        this.loading = false;
      });
    },
    //下载
    down() {
      downloadLostData(this.value).then((res) => {
        // console.log('downloadLostData',res)
        const timeNow = parseTime(new Date(), "{y}{m}{d}{h}{i}{s}");
        var blob = new Blob([res], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
        }); // 以二进制形式存储，并转化为xlsx类型的Excel
        var downloadElement = document.createElement("a");
        var href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = "生存随访失访情况分析" + timeNow + ".xlsx"; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      });
    },
  },
};
</script>

<style>
.LostToFollowUpAnalyContent .el-date-editor .el-range-separator {
  width: 10%;
}
.lost-color_30-50 {
  background: rgba(247, 121, 96, 0.75);
}
.lost-color_30 {
  background: rgba(247, 121, 96, 0.5);
}
.lost-color_50 {
  background: #f77960;
}
.LostToFollowUpAnalyContent .el-table tbody tr {
  pointer-events: none;
}
</style>

<style lang="scss" scoped>
.LostToFollowUpAnalyContent {
  .query-result {
    background-color: #fff;
    padding-bottom: 20px;
    .project-list {
      margin-top: 12px;
      padding: 20px;
    }
    .buttons {
      padding: 0px 20px;
      padding-top: 29px;

      .analy-staff_title {
        position: relative;
        display: inline-block;
        font-weight: bold;
        /*border-left: 3px solid #2476c2;*/
        /*padding-left: 16px;*/
        ::before {
          content: "";
          width: 4px;
          height: 16px;
          background-color: #2476c2;
          position: absolute;
          top: 3px;
          left: -7px;
        }
      }
      span.title {
        position: relative;
        left: 10px;
      }

      span.title::before {
        content: "";
        position: absolute;
        width: 4px;
        height: 16px;
        background-color: #2476c2;
        display: inline-block;
        left: -10px;
        top: 0;
      }

      .down {
        clear: right;
        height: auto;
        padding: 10px 0px;
        overflow: hidden;
        i {
          color: #2476c2;
          font-weight: bold;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
