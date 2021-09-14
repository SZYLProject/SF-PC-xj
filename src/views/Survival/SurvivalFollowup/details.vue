<template>
  <div class="content">
    <div class="nav-header">
      <el-row :gutter="0">
        <el-col :span="11">
          <div class="clearfix">
            <div
              :class="[
                'fl',
                'btn-state',
                statusCode === '3'
                  ? 'reject'
                  : statusCode === '0'
                  ? 'approved'
                  : statusCode === '1'
                  ? 'in'
                  : statusCode === '2'
                  ? 'pending'
                  : '',
              ]"
            >
              <span>{{ statusName }}</span>
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
        <el-col :span="13">
          <el-row>
            <el-col :span="6" class="type-box">
              <p class="type-title">应随访患者总数</p>
              <p class="type-num color2476c2">{{ toFollowTotal }}</p>
            </el-col>
            <el-col :span="6" class="type-box">
              <p class="type-title">
                实际随访{{ followType === "review" ? "患者总数" : "总人次" }}
              </p>
              <p class="type-num color2476c2">
                {{ followType === "review" ? finishTotal : actualTimes }}
              </p>
            </el-col>
            <el-col :span="6" class="type-box">
              <p class="type-title">
                实际有效随访{{ followType === "review" ? "数" : "人次" }}
              </p>
              <p class="type-num color2476c2">
                {{ followType === "review" ? validTotal : vaildTime }}
              </p>
            </el-col>
            <el-col :span="6" class="type-box">
              <p class="type-title">有效随访率</p>
              <p class="type-num color2476c2">
                {{ followType === "review" ? percent : vaildPercent }}%
              </p>
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
          <el-select
            v-model="proValue"
            v-show="followType === 'prospect'"
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
    <div
      class="project-personnel"
      v-show="
        roleName.includes('管理员') || roleName.includes('病案管理科主任')
      "
    >
      <div class="label-module">
        <span>随访人员</span>
      </div>
      <el-table
        class="staffList"
        :data="followPersonnelList"
        border
        style="width: 99%"
        max-height="600"
      >
        <el-table-column
          prop="userName"
          label="随访人员"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="percent"
          label="完成度"
          width="240"
        >
          <!-- v-if="followType === 'review' && statusCode !== '0'" -->
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.percent"></el-progress>
          </template>
        </el-table-column>
        <el-table-column
          prop="avgNum"
          align="center"
          label="应随访人数"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="actual"
          align="center"
          label="已随访人数"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="validPercent"
          align="center"
          label="有效随访率"
          width="100"
        >
          <template slot-scope="scope">
            <span> {{ scope.row.validPercent }}% </span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="分配情况">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 'disease'">
              {{ scope.row.diseases.join("、") }}
            </span>
            <span v-else-if="scope.row.type == 'department'">
              {{ scope.row.departments.join("、") }}
            </span>
            <span v-else-if="scope.row.type == 'nation'">
              <!-- {{ scope.row.nations.join("、") }} -->
              <span
                v-for="(itemUser, index) in scope.row.checkedNation"
                :key="index"
                >
                <span v-if="index>0">、</span>{{ itemUser.ethnicity }}({{ itemUser.currentCount }})
                </span
              >
            </span>
            <span v-else>- -</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="project-table">
      <div class="label-module">
        <span>患者列表</span>
      </div>

      <div class="page-searchlist">
        <el-form
          :inline="true"
          size="mini"
          :model="formInline"
          class="demo-form-inline"
        >
          <el-form-item>
            <el-input
              class="lg-input"
              v-model="formInline.name"
              placeholder="搜索患者姓名、病案号、手机号、诊断"
            ></el-input>
          </el-form-item>
          <el-form-item v-show="followType !== 'review'">
            <el-select
              class
              v-model="formInline.status"
              filterable
              placeholder="快捷查询"
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
            <el-button type="primary" @click="seacherClick">查询</el-button>
            <!-- <el-button type="primary">
              <a
                :href="
                  '/api/project/follow/export?projectId=' + $route.query.id
                "
              >
                导出
              </a>
            </el-button> -->
          </el-form-item>
        </el-form>
      </div>
      <div class="searchList">
        <el-tabs
          v-model="activeName"
          @tab-click="handleTabsClick"
          style="padding: 0 24px"
          :class="{ hideName: followType === 'prospect' }"
        >
          <el-tab-pane label="待随访" name="first">
            <PatientList
              :typeNumber="0"
              ref="childfirst"
              :searchData="formInline"
              :isWxBtn="isWxBtn"
              v-if="followType == 'review'"
            />
            <PatientListForesight
              :typeNumber="0"
              ref="childfirst"
              :searchData="formInline"
              v-else
            />
          </el-tab-pane>
          <el-tab-pane
            label="已随访"
            name="second"
            v-if="followType == 'review'"
          >
            <PatientList
              :typeNumber="1"
              ref="childsecond"
              :searchData="formInline"
              v-if="followType == 'review'"
            />
            <!-- <PatientListForesight
              :typeNumber="1"
              ref="childsecond"
              :searchData="formInline"
              v-else
            /> -->
          </el-tab-pane>
          <el-tab-pane label="暂存" name="third" v-if="followType == 'review'">
            <PatientList
              :typeNumber="2"
              ref="childthird"
              :searchData="formInline"
              v-if="followType == 'review'"
            />
            <!-- <PatientListForesight
              :typeNumber="2"
              ref="childthird"
              :searchData="formInline"
              v-else
            /> -->
          </el-tab-pane>
          <!-- <el-tab-pane label="7日外" name="other">
        <TabItemTable ref="childother" :type="3"  :type="0" :searchData="formInline" />
          </el-tab-pane>-->
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import PatientList from "./Components/PatientList";
import PatientListForesight from "./Components/PatientListForesight";

// echarts相关插件
let Echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/pie"); // 饼状图
require("echarts/lib/chart/bar"); // 柱状图
require("echarts/lib/component/tooltip");
require("echarts/lib/component/toolbox");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");

import {
  getBeanById,
  getDiseasesPercent,
  getPatientPercent,
  getProgress,
  queryNodes,
  findPointsCount,
  getListByProjectId,
  getFindPatientInfoByProject,
} from "@/api/survivalFollowup";

export default {
  name: "SurvivalFollowupDetails",
  components: { PatientList, PatientListForesight },
  data() {
    return {
      roleName: "",
      // 0: "未开始",
      // 1: "进行中",
      // 2: "已完成",
      // 3: "已终止",
      statusCode: this.$route.query.statusCode,
      statusName: this.$route.query.statusName,
      followType: this.$route.query.type, // 随访类型
      projectId: this.$route.query.id,
      activeName: "first",
      projectName: " ",
      createByName: " ",
      planFinishTime: " ",
      toFollowTotal: 0,
      finishTotal: 0,
      validTotal: 0,
      percent: 0,
      actualTimes: 0,
      vaildPercent: 0,
      vaildTime: 0,
      projectStatus: [
        { name: "所有患者", code: 0 },
        { name: "近一周待随访", code: 1 },
        { name: "近一月待随访", code: 2 },
        { name: "暂存", code: 3 },
        { name: "失访", code: 4 },
      ],
      statusList: {
        0: "未开始",
        1: "进行中",
        2: "已完成",
        3: "已终止",
      },
      followPersonnelList: [],
      //进度分布-阶段（前瞻）
      proList: [],
      proValue: null,

      //old
      formInline: {
        status: 0,
      },
      departmentOptions: [],

      // 分页数据
      loading: false,
      pageNum: 1, // 分页数据
      pageSize: 10, // 每页展示数量
      total: 0, // 总数
      isWxBtn: true, //是否显示批量发送微信
    };
  },
  watch: {},
  created() {
    this.roleName = JSON.parse(sessionStorage.getItem("userData")).roleName;
    // this.seacherClick();
    this.getBeanByIdFn(); // 获取某个项目接口
    this.getDiseasesPercentFn(); // 获取某个项目进度 --癌种分布
    this.getPatientPercentFn(); // 按照患者状态分布
    this.getListByProjectIdFn(); // 获取项目下随访人员
    this.followType === "review" && this.getProgressFn(); // 按照进度分布-回顾
    //进度分布-阶段（前瞻）
    this.followType === "prospect" && this.queryNodesFn();
  },
  mounted() {},
  destroyed() {},
  methods: {
    activeChangeToGo() {},
    handleTabsClick(tab) {
      this.$refs["child" + this.activeName].currentPage = 1;
      this.$refs["child" + this.activeName].currentPageSize = 10;
    },
    // 项目下随访人员
    getListByProjectIdFn() {
      const getData = {
        projectId: this.projectId,
      };
      getListByProjectId(getData)
        .then((res) => {
          console.log("随访人员", res);
          this.followPersonnelList = res.data;
        })
        .catch((error) => {
          console.error("getFindPlanByTypesss", error);
        });
    },
    // 获取某个项目接口
    getBeanByIdFn() {
      const getData = {
        id: this.projectId,
      };
      getBeanById(getData)
        .then((res) => {
          this.projectName = res.data.name;
          this.createByName = res.data.createBy;
          this.planFinishTime = res.data.createTime;

          this.toFollowTotal = res.data.patientNum || 0;
          this.finishTotal = res.data.actual || 0;
          this.validTotal = res.data.vaild || 0;
          this.percent = res.data.percent || 0;
          this.actualTimes = res.data.actualTimes || 0;
          this.vaildPercent = res.data.vaildPercent || 0;
          this.vaildTime = res.data.vaildTime || 0;
          this.statusName = res.data.statusName;

          if (this.followType == "review") {
            if (res.data.nodeList) {
              this.isWxBtn = res.data.nodeList[0].followupMethodCode.includes(
                "wechat"
              );
            }
          }
          // patientNum应随访，actual实际随访，vaild有效，percent有效随访率
        })
        .catch((error) => {
          console.error("getFindPlanByTypesss", error);
        });
    },
    // 获取某个项目进度 --癌种分布
    getDiseasesPercentFn() {
      const getData = {
        id: this.projectId,
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
    // 按照患者状态分布
    getPatientPercentFn() {
      const getData = {
        id: this.projectId,
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
    //进度分布-阶段（前瞻）
    queryNodesFn() {
      queryNodes({ projectId: this.projectId }).then((res) => {
        this.proList = res.data;
        this.proValue = res.data.length ? res.data[0].id : null;
        this.proValue && this.findPointsCountFn();
      });
    },
    findPointsCountFn() {
      findPointsCount({ projectPlanId: this.proValue }).then((res) => {
        let Xdata = [];
        let echartData = [];
        if (res.data.xData?.length > 0) {
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
    //进度分布（回顾随访）按照进度分布
    getProgressFn() {
      const getData = {
        id: this.projectId,
      };
      getProgress(getData).then((res) => {
        console.log(getData, " // 进度分布（回顾随访）", res);
        let Xdata = [];
        let echartData = [];
        if (res.data.xData && res.data.xData.length > 0) {
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
    toDetail(row) {
      let specialGroupList = row.specialGroupList;
      let newArr = specialGroupList.find((item) => item.followupEnd == null);

      let {
        id,
        name,
        sex,
        age,
        treatType,
        dcDate,
        dcCondition,
        pil,
        discharge,
      } = row;
      this.$router.push({
        name: "SpecialFollowUPdetailFU",
        query: {
          id,
          followUpId: newArr.id,
        },
      });
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
              // emphasis: {
              //   label: {
              //     show: true,
              //     fontSize: "18",
              //     fontWeight: "bold",
              //   },
              // },
              labelLine: {
                show: true,
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
          // top: this.followType === "review" ? 0 : 12,
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

    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 查询患者
    seacherClick() {
      this.$nextTick(() => {
        let _this = this;
        _this.$refs["child" + this.activeName].getFindPatientInfoByProjectFn();
      });
    },
  },
};
</script>
<style lang="scss">
.long-table {
  position: relative;
  overflow: auto;
  .el-table {
    position: absolute;
    width: auto;
  }
}
.staffList {
  .el-tooltip__popper {
    max-width: 800px;
  }
}
.el-tooltip__popper {
  max-width: 80%;
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
.project-personnel {
  margin-top: 16px;
  background-color: #ffffff;
  padding: 20px;
  .personnel-li {
    padding: 0 20px;
    margin: 8px 0;
    .tag-name {
      height: 32px;
      padding: 0 10px;
      margin: 6px 0px;
      line-height: 30px;
    }
    .tag-box {
      .el-tag {
        margin: 6px 12px;
      }
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
</style>

<style lang="scss" >
// 批量发送微信
.searchList .el-tabs__header {
  margin: 0 !important;
}
.searchList .hideName .el-tabs__header {
  display: none;
}
.page-searchlist {
  .el-form-item--mini.el-form-item {
    margin-bottom: 12px;
  }
}
</style>
