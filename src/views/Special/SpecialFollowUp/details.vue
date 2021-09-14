<template>
  <div class="content">
    <div class="nav-header">
      <el-row :gutter="0">
        <el-col :lg="10" :xl="8">
          <div class="clearfix">
            <div
              :class="[
                'fl',
                'btn-state',
                $route.query.status === 'suspend'
                  ? 'reject'
                  : statesType === 'approved'
                  ? 'approved'
                  : statesType === 'in'
                  ? 'in'
                  : statesType === 'pending'
                  ? 'pending'
                  : statesType == 'finish'
                  ? 'finish'
                  : '',
              ]"
            >
              <span>{{ $route.query.statusName }}</span>
            </div>
              <div class="fl prodect-information">
              <div class="information-name">{{ projectName }}</div>
              <div class="information-create">
                <span>
                  创建人：
                  <span>{{ createByName }}</span>
                </span>
              </div>
              <div class="information-create">
                <span class="">
                  创建时间：
                  <span>{{ planFinishTime }}</span>
                </span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :lg="14" :xl="16">
          <el-row>
            <el-col :span="5" class="type-box">
              <p class="type-title">应随访患者总数</p>
              <p class="type-num color2476c2">{{ toFollowTotal }}</p>
            </el-col>
            <el-col :span="5" class="type-box">
              <p class="type-title">实际随访总人次</p>
              <p class="type-num color2476c2">{{ finishTotal }}</p>
            </el-col>
            <el-col :span="5" class="type-box">
              <p class="type-title">实际有效随访人次</p>
              <p class="type-num color2476c2">{{ validTotal }}</p>
            </el-col>
            <el-col :span="5" class="type-box">
              <p class="type-title">有效随访率</p>
              <p class="type-num color2476c2">{{ validPercent }}</p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="project-schedule">
      <div class="label-module">
        <span>项目进度</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="7">
          <div class="echart-box" id="patientStatus"></div>
        </el-col>
        <el-col :span="7">
          <div class="echart-box" id="cancerDistributed"></div>
        </el-col>
        <el-col :span="10" class="relative">
          <!-- <div class="echart-box last" id="scheduleDistributed"></div> -->
          <el-select
            v-model="proValue"
            @change="findPointsCountFn"
            class="project-schedule_proSelect"
            placeholder="请选择"
            filterable
            size="mini"
          >
            <el-option
              v-for="item in proList"
              :key="item.id"
              :label="item.nodeName"
              :value="item.id"
            ></el-option>
          </el-select>
          <div class="echart-box last" id="scheduleDistributed"></div>
        </el-col>
      </el-row>
    </div>
    <div class="project-table">
      <div class="label-module">
        <span>患者列表</span>
      </div>
      <div class="page-search-list">
        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
          size="mini"
        >
          <el-form-item>
            <el-input
              class="lg-input"
              v-model="formInline.name"
              placeholder="搜索患者姓名、病案号、手机号、诊断"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-select
              class
              v-model="formInline.status"
              clearable
              filterable
              placeholder="项目状态"
            >
              <el-option
                v-for="item in projectStatus"
                :label="item.name"
                :value="item.code"
                :key="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="seacherClick"
              >查询</el-button
            >
            <el-button type="primary" icon="el-icon-download" v-if="false">
              <a
                :href="
                  '/api/project/follow/export?projectId=' + $route.query.id
                "
              >
                导出
              </a>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="paddingl20">
        <el-table
          stripe
          v-loading="loading"
          :data="tableData"
          border
          style="width: 99%"
        >
          <el-table-column
            prop="tpatno"
            align="center"
            label="病案号"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="patientName"
            align="center"
            label="姓名"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="mobile"
            align="center"
            label="手机号"
            min-width="110"
          ></el-table-column>
          <el-table-column align="center" min-width="120" label="确诊日期">
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
          <el-table-column align="center" width="120" label="最后接触时间">
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
            prop="recentTime"
            min-width="120"
            label="最近随访时间"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="recentResult"
            min-width="120"
            label="最近随访结局"
          ></el-table-column>

          <template class="details_table_column" v-if="tableData.length">
            <el-table-column
              align="center"
              :label="`随访点${index + 1}`"
              v-for="(item, index) in tableData[0].specialGroupList"
              :key="index"
              width="140"
            >
              <template slot-scope="scope">
                <span
                  class="cursor"
                  @click="
                    toFollowClick(scope.row, scope.row.specialGroupList[index])
                  "
                >
                  {{
                    scope.row.specialGroupList[index]
                      ? scope.row.specialGroupList[index]["statusName"]
                      : ""
                  }}
                </span>
              </template>
            </el-table-column>
          </template>
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
// echarts相关插件
let Echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/pie"); // 饼状图
require("echarts/lib/chart/bar"); // 柱状图
require("echarts/lib/component/tooltip");
require("echarts/lib/component/toolbox");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
import DetailsComponent from "../../../components/detailsComponent";
import {
  getDepartments,
  specialAddProject,
  getProjectOneById,
  getProjectProgress,
  getProjectFindPatient,
  getPatientPercent,
  getDiseasesPercent,
  queryNodes,
  findPointsCount,
} from "@/api/specialFollowUp";
export default {
  name: "SpecialFollowUpDetails",
  data() {
    return {
      statusName: this.$route.query.statusName || "进行中",
      statesType: "approved",
      projectName: " ",
      createByName: " ",
      planFinishTime: " ",
      toFollowTotal: 0,
      finishTotal: 0,
      validTotal: 0,
      validPercent: "0%",
      projectStatus: [
        { name: "所有患者", code: 0 },
        { name: "近一周待随访", code: 1 },
        { name: "近一月待随访", code: 2 },
        { name: "暂存", code: 3 },
        { name: "失访", code: 4 },
      ],
      proList: [],
      proValue: null,
      //old
      formInline: {},
      departmentOptions: [],
      tableData: [],
      istableData: false,
      // 分页数据
      loading: false,
      pageNum: 1, // 分页数据
      pageSize: 10, // 每页展示数量
      total: 0, // 总数

      //fxl 第一假数据 格式
      dataList: [],
      projectId: this.$route.query.id,
    };
  },
  watch: {},
  components: {
    DetailsComponent,
  },
  created() {
    this.getdetails(); // 项目信息
    this.seacherClick(); // 查询患者

    this.getPatientPercentFn(); // 按照患者状态分布
    this.getDiseasesPercentFn(); // 获取某个项目进度 --癌种分布
    this.queryNodesFn(); // 获取阶段列表
  },
  mounted() {},
  destroyed() {},
  methods: {
    parseTime(time, cFormat) {
      if (arguments.length === 0 || !time) {
        return null;
      }
      const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
      let date;
      if (typeof time === "object") {
        date = time;
      } else {
        if (typeof time === "string") {
          if (/^[0-9]+$/.test(time)) {
            // support "1548221490638"
            time = parseInt(time);
          } else {
            // support safari
            // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
            time = time.replace(new RegExp(/-/gm), "/");
          }
        }
        if (typeof time === "number" && time.toString().length === 10) {
          time = time * 1000;
        }
        date = new Date(time);
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay(),
      };
      const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === "a") {
          return ["日", "一", "二", "三", "四", "五", "六"][value];
        }
        return value.toString().padStart(2, "0");
      });
      return timeStr;
    },
    // 按照患者状态分布
    getPatientPercentFn() {
      const getData = {
        projectId: this.projectId,
      };
      getPatientPercent(getData)
        .then((res) => {
          let echartData = [];
          if (res.data.length > 0) {
            echartData = res.data.reduce((total, item, index) => {
              total.push({
                value: item.count,
                name: item.followupEnd,
              });
              return total;
            }, []);
          } else {
            echartData = [{ value: 0, name: "该项目下患者暂无状态分布" }];
          }
          this.patientPercentEchart(echartData);
        })
        .catch((error) => {
          console.error("getFindPlanByTypesss", error);
        });
    },
    // 获取某个项目进度 --癌种分布
    getDiseasesPercentFn() {
      const getData = {
        projectId: this.projectId,
      };
      getDiseasesPercent(getData)
        .then((res) => {
          let echartData = [];
          if (res.data.length > 0) {
            echartData = res.data.reduce((total, item, index) => {
              total.push({
                value: item.count,
                name: item.name,
              });
              return total;
            }, []);
          } else {
            echartData = [{ value: 0, name: "暂无数据" }];
          }
          this.diseasesPercentEchart(echartData);
        })
        .catch((error) => {
          console.error("getFindPlanByTypesss", error);
        });
    },
    //进度分布-阶段（前瞻）
    queryNodesFn() {
      queryNodes({ projectId: this.projectId }).then((res) => {
        this.proList = res.data;
        this.proValue = res.data.length ? res.data[0].id : null;
        this.proValue && this.findPointsCountFn();
      });
    },
    findPointsCountFn() {
      findPointsCount({
        projectId: this.projectId,
        projectPlanId: this.proValue,
      }).then((res) => {
        let Xdata = [];
        let echartData = [];
        if (res.data.xData.length > 0) {
          Xdata = res.data.xData;
          echartData = res.data.yData.reduce((total, item, index) => {
            total.push({
              data: item.value,
              type: "bar",
              stack: "Ydata",
              barWidth: 30,
              name: item.name,
            });
            return total;
          }, []);
        }
        this.statusScheduleEchart(Xdata, echartData);
      });
    },
    // 项目信息
    getdetails() {
      const getData = {
        projectId: this.projectId,
      };
      getProjectOneById(getData)
        .then((res) => {
          this.projectName = res.data.tFollowupProject.name;
          this.createByName = res.data.tFollowupProject.createBy;
          this.planFinishTime = res.data.tFollowupProject.createTime;
          this.toFollowTotal = res.data.toFollowTotal;
          this.finishTotal = res.data.finishTotal;
          this.validTotal = res.data.validTotal;
          this.validPercent = res.data.validPercent;
        })
        .catch((error) => {
          console.error("getFindPlanByTypesss", error);
        });
    },
    // 进度
    getProjectProgressFn() {
      const getData = {
        projectId: this.projectId,
      };
      getProjectProgress(getData)
        .then((res) => {
          console.log("getFindPlanByTypess", res);
        })
        .catch((error) => {
          console.error("getFindPlanByTypesss", error);
        });
    },
    // 去随访
    toFollowClick(row, groupsVal, isView) {
      //      id | 患者id
      // patientId | 患者的微信id
      // diseaseId | 病例id'
      // -1:未开始，0：待随访，1：已完成，2：暂存，3：失访，4：超时随访，5：超时未随访
      let { id, diseaseId, patientId, ppId, groupId } = row;
      if (groupsVal.status != -1) {
        if (groupsVal.status == 1) {
          isView = true;
        } else {
          isView = false;
        }
        let resultId = groupsVal.resultId ? groupsVal.resultId : "";
        let followUpId = groupsVal.id;
        this.$router.push({
          path: "/special/followUpDetails",
          query: {
            resultId,
            followUpId,
            id,
            groupId,
            ppId,
            projectId: this.$route.query.id,
            patientId,
            diseaseId,
            isView: isView,
            statusNum: groupsVal.status,
          },
        });
      } else {
        this.$message.success("暂时不可以去随访");
      }
    },
    // 患者状态分布
    patientPercentEchart(echartData) {
      this.$nextTick(() => {
        let echartId = document.getElementById("patientStatus");
        let staffEcharts = Echarts.init(echartId);
        let option = {
          color: ["#73DDFF", "#73ACFF", "#FDD56A", "#FDB36A", "#FD866A"],
          title: {
            text: "状态分布",
            left: "center",
            top: 0,
            textStyle: {
              color: "#666666",
              fontWeight: "normal",
              fontSize: "16",
            },
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}: {c} ({d}%)",
          },
          series: [
            {
              type: "pie",
              radius: ["40%", "60%"],
              center: ["50%", "55%"],
              label: {
                show: true,
                position: "outer",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "18",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: true,
                // normal: {
                //   length: 22,
                //   length2: 44,
                // },
              },
              data: echartData,
            },
          ],
        };

        staffEcharts.setOption(option);
        window.addEventListener("resize", () => {
          staffEcharts.resize();
        });
      });
    },
    // 癌种分布
    diseasesPercentEchart(echartData) {
      this.$nextTick(() => {
        let echartId = document.getElementById("cancerDistributed");
        let staffEcharts = Echarts.init(echartId);
        let option = {
          color: [
            "#E690D1",
            "#E062AE",
            "#FB7293",
            "#FB7293",
            "#FF9F7F",
            "#FEDB5C",
            "#9FE6B8",
            "#67DFE2",
            "#67E0E3",
            "#31C4E8",
            "#34A0D9",
          ].reverse(),
          title: {
            text: "癌种分布",
            left: "center",
            top: 0,
            textStyle: {
              color: "#666666",
              fontWeight: "normal",
              fontSize: "16",
            },
          },
          tooltip: {
            trigger: "item",
            formatter: "{b} : {c} ({d}%)",
          },
          // toolbox: {
          //   show: true,
          //   feature: {
          //     mark: { show: true },
          //     dataView: { show: true, readOnly: false },
          //     magicType: {
          //       show: true,
          //       type: ["pie", "funnel"],
          //     },
          //     restore: { show: true },
          //     saveAsImage: { show: true },
          //   },
          // },
          series: [
            {
              name: "面积模式",
              type: "pie",
              radius: [30, 110],
              center: ["50%", "55%"],
              roseType: "area",
              data: echartData,
            },
          ],
        };

        staffEcharts.setOption(option);
        window.addEventListener("resize", () => {
          staffEcharts.resize();
        });
      });
    },
    // 进度分布
    statusScheduleEchart(Xdata, echartData) {
      this.$nextTick(() => {
        let echartId = document.getElementById("scheduleDistributed");
        let staffEcharts = Echarts.init(echartId);
        let option = {
          color: ["#5AB1EF", "#2EC7C9", "#B6A2DE", "#FFB980", "#D87A80"],
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          legend: {
            data: ["待随访", "已完成", "暂存", "已失访"],
            top: 46,
          },
          title: {
            text: "进度分布",
            left: "center",
            top: 0,
            textStyle: {
              color: "#666666",
              fontWeight: "normal",
              fontSize: "16",
            },
          },
          grid: {
            left: "3%",
            right: "6%",
            top: "120px",
            bottom: "30px",
            containLabel: true,
          },
          xAxis: [
            {
              minInterval: 1, //人次最小为1
              type: "value",
            },
          ],
          yAxis: [
            {
              type: "category",
              axisLabel: {
                // margin: 150,
                interval: 0,
                // align: "left",
                formatter: function (value) {
                  var result = "";
                  var maxLen = 10; //每项每行显示文字个数
                  var valLen = value.length;
                  var rowN = Math.ceil(valLen / maxLen);

                  if (rowN > 1) {
                    let ret = "";
                    for (var i = 0; i < rowN; i++) {
                      var temp = "";
                      var start = i * maxLen;
                      var end = start + maxLen;
                      if (i == rowN - 1) {
                        temp = value.substring(start);
                        temp = temp.padEnd(10, "　");
                      } else {
                        temp = value.substring(start, end) + "\n";
                      }
                      ret += temp;
                    }
                    return ret;
                  } else {
                    return value;
                  }
                },
              },
              data: Xdata,
            },
          ],
          series: echartData,
        };

        staffEcharts.setOption(option);
        window.addEventListener("resize", () => {
          staffEcharts.resize();
        });
      });
    },
    // 获取科室列表
    getDepartmentsFn() {
      getDepartments()
        .then((res) => {
          console.log("getDepartments", res);
          this.departmentOptions = res.data.department;
        })
        .catch((error) => {
          console.error("getDepartments", error);
        });
    },
    //科室改变时
    handleDepartmentChange(val) {
      this.departmentOptions.forEach((_) => {
        _.child.filter(
          (item) => item.deptId === val[1] && (this.deptName = item.deptName)
        );
      });
      console.log("hospitalId", this.deptName);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 查询患者
    seacherClick() {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.formInline.name,
        status: this.formInline.status,
        projectId: this.projectId,
      };
      this.loading = true;
      getProjectFindPatient(params)
        .then((res) => {
          console.log("请求返回数据=====>>>>", res.data.list);
          if (res.data.list.length != 0) {
            this.$nextTick(() => {
              this.tableData = res.data.list;
              this.total = res.data.total;
            });
          } else {
            this.tableData = [];
            this.total = 0;
          }
          this.loading = false;
          console.log(res);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.seacherClick();
    },
    // 页数按钮
    handleCurrentChange(val) {
      this.pageNum = val;
      this.seacherClick();
    },
  },
};
</script>
<style lang="scss">
.long-table {
  position: relative;
  overflow: auto;
  .el-table {
    width: auto;
  }
}
</style>
<style lang="scss">
// fxl  tooltip样式
body > .tooltip_class.el-tooltip__popper.is-dark {
  background: #999;
  color: #333;
}
</style>
<style lang="scss" scoped>
.nav-header {
  background-color: #ffffff;
  height: 80px;
  .btn-state {
    width: 80px;
    height: 28px;
    background: #2476c2;
    border-radius: 2px;
    text-align: center;
    margin: 26px;
    span {
      font-size: 14px;
      line-height: 26px;
      font-family: PingFang SC Medium, PingFang SC Medium-Medium;
      font-weight: 500;
      color: #f5fafe;
    }
  }
  .reject {
    background: #e43f3f;
  }
  .pending {
    background: #46a28b;
  }
  .prodect-information {
    margin-top: 10px;
    margin-left: 10px;
    .information-name {
      font-size: 16px;
      font-family: PingFang SC Bold, PingFang SC Bold-Bold;
      font-weight: 700;
      color: #333333;
    }
    .information-create {
      margin-top: 2px;
      font-size: 14px;
      font-family: PingFang SC Medium, PingFang SC Medium-Medium;
      font-weight: 500;
      text-align: left;
      color: #666666;
    }
  }
  .type-box {
    position: relative;
    padding: 14px 16px;
    height: 80px;
    .type-title {
      font-size: 14px;
    }
    .type-num {
      font-size: 24px;
      line-height: 42px;
    }
    &:after {
      content: "";
      position: absolute;
      width: 1px;
      height: 40px;
      background: #cccccc;
      top: 22px;
      right: 0;
    }
    &:last-child:after {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
    }
  }
}
.project-schedule {
  margin-top: 16px;
  padding: 20px;
  background-color: #ffffff;
  .project-schedule_proSelect {
    position: absolute;
    z-index: 10;
    top: 35px;
    left: 24px;
  }
  .echart-box {
    position: relative;
    width: 100%;
    height: 360px;
    &:after {
      content: "";
      position: absolute;
      width: 1px;
      height: 80%;
      background: #cccccc;
      top: 10%;
      right: 0;
    }
  }
  .last.echart-box {
    &:last-child:after {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
    }
  }
}
@media screen and (max-width: 1560px) {
  .project-schedule {
    .project-schedule_proSelect {
      top: 0px;
      left: 0px;
      width: 160px;
      overflow: hidden;
    }
  }
}
.project-table {
  margin-top: 16px;
  background-color: #ffffff;
  padding: 20px;
}

.label-module {
  line-height: 20px;
  color: #333333;
  padding-bottom: 20px;
  span {
    display: inline-block;
    border-left: 3px solid #2476c2;
    padding-left: 16px;
  }
}
.reject {
  background-color: red;
}
.cursor {
  cursor: pointer;
  &:hover {
    color: #2476c2;
  }
}
</style>
<style lang="scss">
.page-search-list {
  .el-form-item:first-child {
    padding-left: 20px;
  }
}
</style>