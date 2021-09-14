<template>
  <div class="content" style="height: calc(100% - 32px)">
    <div class="analy-basic-new clearfix">
      <div class="fl item-basic clearfix">
        <div class="fl">
          <div class="info-imgbox">
            <span
              class="fl info-imgsize iconfont iconweibiaoti-2_huanzhezongshu"
            ></span>
          </div>
        </div>
        <div class="fl">
          <p class="name">应随访患者总人次</p>
          <p class="card-val">{{ statistics.total }}</p>
        </div>
      </div>
      <div class="fl item-basic clearfix">
        <div class="fl">
          <div class="info-imgbox">
            <span
              class="fl info-imgsize iconfont iconweibiaoti-2_suifangrenshu"
            ></span>
          </div>
        </div>
        <div class="fl">
          <p class="name">实际随访人次</p>
          <p class="card-val">{{ statistics.actual }}</p>
        </div>
      </div>
      <div class="fl item-basic clearfix">
        <div class="fl">
          <div class="info-imgbox">
            <span
              class="fl info-imgsize iconfont iconweibiaoti-2_suifangshuai"
            ></span>
          </div>
        </div>
        <div class="fl">
          <p class="name">有效随访率</p>
          <p class="card-val">{{ statistics.percent }}%</p>
        </div>
      </div>
    </div>

    <div class="analy-basic" v-if="false">
      <el-row>
        <el-col class="clearfix">
          <div class="fl">
            <p>应随访患者总人次</p>
            <p class="routine-analy-card-val">{{ statistics.total }}</p>
          </div>
          <span
            class="fr info-imgSize iconfont iconweibiaoti-2_huanzhezongshu"
          ></span>
        </el-col>
        <el-col class="clearfix">
          <div class="fl">
            <p>实际随访人次</p>
            <p>{{ statistics.actual }}</p>
          </div>
          <span
            class="fr info-imgSize iconfont iconweibiaoti-2_suifangrenshu"
          ></span>
        </el-col>
        <!-- <el-col class="clearfix">
          <div class="fl">
            <p>有效随访人次</p>
            <p>{{ statistics.vaild }}</p>
          </div>

          <span
            class="fr info-imgSize iconfont iconweibiaoti-2_youxiaosuifang"
          ></span>
        </el-col> -->
        <el-col class="clearfix">
          <div class="fl">
            <p>有效随访率</p>
            <p>{{ statistics.percent }}%</p>
          </div>
          <span
            class="fr info-imgSize iconfont iconweibiaoti-2_suifangshuai"
          ></span>
        </el-col>
      </el-row>
    </div>

    <!-- 按随访人员统计工作量 -->
    <div
      class="analy-staff"
      v-show="
        ['管理员', '护理部主任', '科护士长'].filter((v) =>
          roleName.split(',').includes(v)
        ).length
      "
    >
      <span class="analy-staff_title">
        实际随访工作量统计
        <span class="second-title"></span>
      </span>
      <div
        id="workNewEchart"
        ref="workNewEchart"
        class="data_view-container"
      ></div>
      <div class="analy-staff_radio">
        <el-radio-group
          v-model="radioSearchTypeRange"
          @change="typeRangeChange"
        >
          <el-radio label="departmentRange">科室</el-radio>
          <el-radio label="inpatientAreaRange">病区</el-radio>
          <el-radio label="nurseRange">责任护士</el-radio>
        </el-radio-group>
      </div>
      <div class="analy-staff_select">
        <!-- @visible-change="staffChange" -->
        <el-select
          v-show="radioSearchTypeRange == 'departmentRange'"
          v-model="departmentValArr"
          :multiple-limit="5"
          :collapse-tags="departmentValArr.length > 1"
          class="md-select2 marginr10"
          placeholder="请选择科室"
          multiple
          clearable
          filterable
          size="mini"
          :title="departmentValArr"
        >
          <el-option
            v-for="item in formTypeList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <el-select
          @change="departmentChange"
          v-show="radioSearchTypeRange != 'departmentRange'"
          v-model="departmentVal"
          class="md-select2 marginr10"
          size="mini"
          placeholder="请选择科室"
          clearable
          filterable
        >
          <el-option
            v-for="item in formTypeList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>

        <el-select
           @change="batchNumberValChange"
          v-if="radioSearchTypeRange == 'inpatientAreaRange'"
          v-model="batchNumberVal"
          :multiple-limit="5"
          :collapse-tags="batchNumberVal.length > 1"
          class="md-select2 marginr10"
          placeholder="请选择病区"
          clearable
          multiple
          filterable
          size="mini"
          :title="batchNumberVal"
        >
          <el-option
            v-for="item in chNumberList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <el-select
          @change="p819ValChange"
          v-if="radioSearchTypeRange == 'nurseRange'"
          v-model="p819Val"
          :multiple-limit="5"
          :collapse-tags="p819Val.length > 2"
          class="md-select2 marginr10"
          placeholder="请选择责任护士"
          multiple
          clearable
          filterable
          size="mini"
          :title="p819Val"
        >
          <el-option
            v-for="item in nurseList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </div>
      <div class="analy-staff_time">
        <el-date-picker
          v-model="staffSearchTimeVal"
          ref="picker1"
          type="daterange"
          size="mini"
          align="right"
          unlink-panels
          range-separator="-"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
      <div class="analy-staff_search">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-search"
          :disabled="isSearchCondition"
          @click="searchTypeRangeFn()"
          >查询</el-button
        >
      </div>
    </div>
    <!-- 按随访人员统计工作量 -->
    <!-- 实际随访人次 -->
    <!-- v-show="
        ['管理员', '护理部主任', '科护士长'].filter((v) =>
          roleName.split(',').includes(v)
        ).length
      " -->
    <div class="analy-staff" v-if="false">
      <span class="analy-staff_title">
        按随访人员统计工作量
        <span class="second-title">( 实际随访人次 )</span>
      </span>
      <div id="workEchart" ref="workEchart" class="data_view-container"></div>
      <div class="analy-staff_select">
        <!-- @visible-change="staffChange" -->
        <el-select
          v-model="staffSearchAnaly"
          :multiple-limit="5"
          :collapse-tags="staffSearchAnaly.length > 3"
          class="md-select2"
          placeholder="请选择"
          multiple
          filterable
          size="mini"
        >
          <el-option
            v-for="item in analyList"
            :key="item.userItcode"
            :label="item.userName"
            :value="item.userItcode"
          ></el-option>
        </el-select>
      </div>
      <div class="analy-staff_time">
        <el-date-picker
          v-model="staffSearchTime"
          ref="picker1"
          type="daterange"
          size="mini"
          align="right"
          unlink-panels
          range-separator="-"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期A"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
      <div class="analy-staff_search">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-search"
          @click="search(1)"
          >查询</el-button
        >
      </div>
    </div>
    <!-- 有效随访人次 -->
    <!-- v-show="
        ['管理员', '护理部主任', '科护士长'].filter((v) =>
          roleName.split(',').includes(v)
        ).length
      " -->
    <div class="analy-staff" v-if="false">
      <span class="analy-staff_title">
        按随访人员统计工作量
        <span class="second-title">( 有效随访人次 )</span>
      </span>
      <div
        id="effectiveJobEchart"
        ref="effectiveJobEchart"
        class="data_view-container"
      ></div>
      <div class="analy-staff_select">
        <!-- @visible-change="staffChangeValid" -->
        <el-select
          v-model="staffSearchAnalyValid"
          :multiple-limit="5"
          :collapse-tags="staffSearchAnalyValid.length > 3"
          class="md-select2"
          placeholder="请选择"
          multiple
          filterable
          size="mini"
        >
          <el-option
            v-for="item in analyList"
            :key="item.userItcode"
            :label="item.userName"
            :value="item.userItcode"
          ></el-option>
        </el-select>
      </div>
      <div class="analy-staff_time">
        <!-- @change="timeChangeValid(3)" -->
        <el-date-picker
          v-model="staffSearchTimeValid"
          ref="picker1"
          type="daterange"
          size="mini"
          align="right"
          unlink-panels
          range-separator="-"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
      <div class="analy-staff_search">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-search"
          @click="search(3)"
          >查询</el-button
        >
      </div>
    </div>
    <!-- 按随访方式统计工作量 -->
    <!-- v-show="
        ['管理员', '护理部主任', '科护士长'].filter((v) =>
          roleName.split(',').includes(v)
        ).length
      " -->
    <div class="analy-staff marginb20" v-if="false">
      <span class="analy-staff_title">
        按随访方式统计工作量
        <span class="second-title">( 实际随访人次 )</span>
      </span>
      <div id="typeEchart" ref="typeEchart" class="data_view-container"></div>
      <div class="analy-staff_radio">
        <!-- @change="typeChange" -->
        <el-radio-group v-model="radioSearchAnaly">
          <el-radio label="telephone">电话随访</el-radio>
          <el-radio label="wechat">微信随访</el-radio>
          <el-radio label="sms">短信随访</el-radio>
        </el-radio-group>
      </div>
      <div class="analy-staff_select">
        <!-- @visible-change="typeStaffChange" -->
        <el-select
          v-model="typeSearchAnaly"
          :multiple-limit="5"
          :collapse-tags="typeSearchAnaly.length > 3"
          class="md-select2"
          placeholder="请选择"
          multiple
          filterable
          size="mini"
        >
          <el-option
            v-for="item in analyList"
            :key="item.userItcode"
            :label="item.userName"
            :value="item.userItcode"
          ></el-option>
        </el-select>
      </div>
      <div class="analy-staff_time">
        <!-- @change="timeChange(2)" -->
        <el-date-picker
          v-model="typeSearchTime"
          ref="picker1"
          type="daterange"
          size="mini"
          align="right"
          unlink-panels
          range-separator="-"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
      <div class="analy-staff_search">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-search"
          @click="search(2)"
          >查询</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
//echarts相关插件
let Echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/line"); //折线图
require("echarts/lib/chart/bar"); //柱状图
require("echarts/lib/component/tooltip");
require("echarts/lib/component/toolbox");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
require("echarts/lib/component/markPoint");

import { parseTime } from "@/utils/index.js";
import {
  getAnalyList,
  getInfoByCreateByAndDeps,
  getStatistics,
  getAnalyData,
  downloadAnalyData,
  downloadAnalyExportInfo,
} from "@/api/statisticAnaly";

import {
  getDepsPatient,
  getBatchNumber,
  getP819,
} from "@/api/visitPlanManagement";
export default {
  name: "StatisticAnaly",
  data() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
    return {
      roleName: "",
      analyList: [],
      staffSearchAnaly: [],
      staffSearchAnalyValid: [],
      typeSearchAnaly: [],
      radioSearchAnaly: "telephone",
      radioSearchTypeRange: "departmentRange",

      formTypeList: [],
      chNumberList: [],
      nurseList: [],
      departmentValArr: [],
      departmentVal: "",
      batchNumberVal: [],
      p819Val: [],
      statistics: {
        total: 0,
        actual: 0,
        vaild: 0,
        percent: 0,
      },
      staffSearchTimeVal: [start, end],
      staffSearchTime: [start, end],
      staffSearchTimeValid: [start, end],
      typeSearchTime: [start, end],
      isSearchCondition:false,
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
    this.roleName = JSON.parse(sessionStorage.getItem("userData")).roleName;
    this.getStatisticsFn();
    // this.getAnalyListFn();

    this.getDepsPatientFn();
    this.searchTypeRangeFn();
    // this.getBatchNumberFn();
    // this.getP819Fn();
  },
  methods: {
    // 获取责任护士下拉框
    getP819Fn() {
      let getData = {
        departmentName: this.departmentVal,
      };
      // this.p819Loading = true;
      getP819(getData)
        .then((res) => {
          // this.p819Loading = false;
          this.nurseList = res.data;
        })
        .catch((error) => {
          console.error("getBatchNumber", error);
        });
    },
    // 获取病区下拉框
    getBatchNumberFn() {
      let getData = {
        departmentName: this.departmentVal,
      };
      // this.batchNumberLoading = true;
      getBatchNumber(getData)
        .then((res) => {
          // this.batchNumberLoading = false;
          this.chNumberList = res.data;
        })
        .catch((error) => {
          console.error("getBatchNumber", error);
        });
    },
    //获取科室下拉框
    getDepsPatientFn() {
      getDepsPatient()
        .then((res) => {
          this.formTypeList = res.data;
        })
        .catch((error) => {
          console.error("getDepsPatient", error);
        });
    },
    typeRangeChange(val) {
      this.$nextTick(() => {
        this.isSearchCondition =false;
        this.departmentValArr = [];
        this.departmentVal = "";
        this.batchNumberVal = [];
        this.p819Val = [];
      });

      if (val == "departmentRange") {
        this.getDepsPatientFn();
      } else if (val == "inpatientAreaRange") {
        this.getBatchNumberFn();
      } else {
        this.getP819Fn();
      }
    },
    departmentChange(val) {
      if (this.radioSearchTypeRange == "inpatientAreaRange") {
        this.batchNumberVal = [];
        this.isSearchCondition =true;
        this.getBatchNumberFn();
      } else if (this.radioSearchTypeRange == "nurseRange") {
        this.p819Val = [];
        this.isSearchCondition =true;
        this.getP819Fn();
      }
    },
    batchNumberValChange(val){
      if(val){
        this.isSearchCondition =false;
      }
    },
    p819ValChange(val){
      if(val){
        this.isSearchCondition =false;
      }
    },
    searchData() {
      let postData = {
        flag: 1,
        departmentNames: this.departmentValArr,
        batchNumbers: this.batchNumberVal,
        p819s: this.p819Val,
        updateTimePre: parseTime(this.staffSearchTimeVal[0], "{y}-{m}-{d}"),
        updateTimeSuf: parseTime(this.staffSearchTimeVal[1], "{y}-{m}-{d}"),
      };
      if (this.radioSearchTypeRange == "departmentRange") {
        postData.flag = 1;
      } else if (this.radioSearchTypeRange == "inpatientAreaRange") {
        postData.departmentNames = this.departmentVal
          ? [this.departmentVal]
          : [];
        postData.flag = 2;
      } else if (this.radioSearchTypeRange == "nurseRange") {
        postData.departmentNames = this.departmentVal
          ? [this.departmentVal]
          : [];
        postData.flag = 3;
      }
      return postData;
    },
    searchTypeRangeFn() {
      let postData = this.searchData();
      getInfoByCreateByAndDeps(postData)
        .then((res) => {
          if (res.data.length) {
            let dataX = res.data[0].X;
            let dataLegend = [];
            let dataY = res.data.reduce((total, item, index) => {
              dataLegend.push(item.name);
              total.push({
                name: item.name,
                data: item.Z,
                type: "line",
                smooth: true,
              });
              return total;
            }, []);
            this.staffInitWorkNewEchart(dataX, dataY, dataLegend);
          } else {
            this.$message.warning("暂无数据");
          }
        })
        .catch((error) => {
          console.error("getInfoByCreateByAndDeps", error);
        });
    },

    staffInitWorkNewEchart(dataX, dataY, dataLegend) {
      this.$nextTick(() => {
        let _this = this;
        let staffChart = document.getElementById("workNewEchart");
        let staffEcharts = Echarts.init(staffChart);
        let option = {
          color: ["#c257f6", "#6f7de3", "#ffac34", "#50bb51", "#ff583a"],
          grid: {
            bottom: "10%",
            left: "4.5%",
            right: "4.5%",
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {
                type: "jpg",
                name: "随访统计表",
              },
              myTool1: {
                show: true,
                title: "下载列表",
                icon:
                  "path://M319.9 472.2l-51.2-63h-64l83.2 102.4L204.8 614h64l51.2-63 51.2 63h64L352 511.6l83.2-102.4h-64l-51.3 63zM204.8 716.4h-51.2c-14.1 0-25.6-11.5-25.6-25.6V332.4c0-14.1 11.5-25.6 25.6-25.6h51.2V153.2c0-28.3 22.9-51.2 51.2-51.2h588.8c28.3 0 51.2 22.9 51.2 51.2V870c0 28.3-22.9 51.2-51.2 51.2H255.9c-28.3 0-51.2-22.9-51.2-51.2V716.4z m25.5 0V870c0 14.1 11.5 25.6 25.6 25.6h588.8c14.1 0 25.6-11.5 25.6-25.6V153.2c0-14.1-11.5-25.6-25.6-25.6H255.9c-14.1 0-25.6 11.5-25.6 25.6v153.6h256c14.1 0 25.6 11.5 25.6 25.6v358.4c0 14.1-11.5 25.6-25.6 25.6h-256z m358.5-320h204.8c7.1 0 12.8 5.7 12.8 12.8 0 7.1-5.7 12.8-12.8 12.8H588.8c-7.1 0-12.8-5.7-12.8-12.8-0.1-7.1 5.7-12.8 12.8-12.8z m0 102.4h204.8c7.1 0 12.8 5.7 12.8 12.8 0 7.1-5.7 12.8-12.8 12.8H588.8c-7.1 0-12.8-5.7-12.8-12.8-0.1-7.1 5.7-12.8 12.8-12.8z m0 102.4h204.8c7.1 0 12.8 5.7 12.8 12.8 0 7.1-5.7 12.8-12.8 12.8H588.8c-7.1 0-12.8-5.7-12.8-12.8-0.1-7.1 5.7-12.8 12.8-12.8z m0 0",
                onclick: function () {
                  _this.downloadChartNew();
                },
              },
              // myTool2: {
              //   show: true,
              //   title: "查询",
              //   icon:
              //     "path://M882.6369 904.308991 730.351542 708.192358c7.884574-6.656607 15.529695-13.647835 22.890336-21.0095 33.348526-33.350572 59.533908-72.194252 77.8296-115.453499 18.948561-44.803415 28.555359-92.378967 28.555359-141.40659 0-49.021483-9.607822-96.593965-28.556383-141.393287-18.295692-43.256176-44.481074-82.09781-77.828576-115.446335S681.053766 113.948215 637.797589 95.652524C592.99929 76.703963 545.429879 67.096141 496.409418 67.096141c-49.021483 0-96.593965 9.607822-141.394311 28.556383-43.256176 18.295692-82.098833 44.482097-115.446335 77.830623-33.348526 33.347502-59.533908 72.189136-77.830623 115.446335-18.948561 44.800345-28.556383 92.371804-28.556383 141.393287 0 49.027623 9.607822 96.603175 28.556383 141.40659 18.295692 43.259246 44.481074 82.10395 77.8296 115.453499 33.347502 33.349549 72.189136 59.536978 115.446335 77.833693 44.800345 18.948561 92.371804 28.556383 141.394311 28.556383 49.019437 0 96.590895-9.608845 141.389194-28.557406 12.920264-5.465478 25.436322-11.649318 37.541011-18.502399l154.415882 198.860117c11.339256 14.603603 31.987528 17.545608 46.119387 6.572696l1.705851-1.325182C891.713626 939.6458 893.977179 918.912593 882.6369 904.308991zM496.409418 732.173538c-166.428473 0-301.82928-135.410016-301.82928-301.851792 0-166.428473 135.399783-301.828256 301.82928-301.828256 166.423357 0 301.818023 135.399783 301.818023 301.828256C798.228465 596.763522 662.832775 732.173538 496.409418 732.173538z",
              //   onclick: function () {
              //     _this.getStaffData(3, _this.staffInitValid);
              //   },
              // },
            },
            top: 10,
            right: 40,
          },
          tooltip: {
            trigger: "axis",
            // formatter: '{a}:<br/>{b}<br/>{c}',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle: {
                color: "rgba(53,167,255,.3)",
              },
            },
          },
          legend: {
            data: dataLegend,
            align: "auto",
            padding: [24, 0, 0, 0],
          },
          xAxis: {
            type: "category",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#ccc",
              },
            },
            axisLabel: {
              textStyle: {
                color: "#ccc",
              },
            },
            data: dataX,
          },
          yAxis: {
            type: "value",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: "#eee",
              },
            },
            axisLabel: {
              textStyle: {
                color: "#ccc",
              },
            },
            name: "随访人次",
            nameTextStyle: {
              align: "right",
              color: "#ccc",
            },
          },
          series: dataY,
        };
        staffEcharts.setOption(option, true);
        window.addEventListener("resize", () => {
          staffEcharts.resize();
        });
      });
    },
    downloadChartNew() {
      let postData = this.searchData();
      downloadAnalyExportInfo(postData).then((res) => {
        console.log("下载表单---------1人员实际2方式实际3人员有效", res);
        const timeNow = parseTime(new Date(), "{y}{m}{d}{h}{i}{s}");
        var blob = new Blob([res], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
        }); // 以二进制形式存储，并转化为xlsx类型的Excel
        var downloadElement = document.createElement("a");
        var href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = "实际随访工作量统计" + timeNow + ".xlsx"; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      });
    },

    // old
    //查询
    search(type) {
      this.getStaffData(
        type,
        type === 1
          ? this.staffInit
          : type === 2
          ? this.typeInit
          : this.staffInitValid
      );
    },
    //统计人数及比率
    getStatisticsFn() {
      getStatistics().then((res) => {
        Object.assign(this.statistics, res.data);
      });
    },
    // 获取图表查询结果---------1人员实际2方式实际  3人员有效
    getStaffData(type, fn) {
      const postData = {
        updateTimePre: "",
        updateTimeSuf: "",
        creates: [],
        flag: 2,
      };
      //  creates: type === 1 ? this.staffSearchAnaly : this.typeSearchAnaly,
      if (type === 1) {
        postData.updateTimePre = parseTime(
          this.staffSearchTime[0],
          "{y}-{m}-{d}"
        );
        postData.updateTimeSuf = parseTime(
          this.staffSearchTime[1],
          "{y}-{m}-{d}"
        );
        postData.creates = this.staffSearchAnaly;
      } else if (type === 2) {
        postData.updateTimePre = parseTime(
          this.typeSearchTime[0],
          "{y}-{m}-{d}"
        );
        postData.updateTimeSuf = parseTime(
          this.typeSearchTime[1],
          "{y}-{m}-{d}"
        );
        postData.creates = this.typeSearchAnaly;
        postData.types = [this.radioSearchAnaly];
      } else if (type === 3) {
        postData.updateTimePre = parseTime(
          this.staffSearchTimeValid[0],
          "{y}-{m}-{d}"
        );
        postData.updateTimeSuf = parseTime(
          this.staffSearchTimeValid[1],
          "{y}-{m}-{d}"
        );
        postData.creates = this.staffSearchAnalyValid;
        postData.flag = 1;
      }
      postData.createUsers = this[
        type === 1
          ? "staffSearchAnaly"
          : type === 2
          ? "typeSearchAnaly"
          : "staffSearchAnalyValid"
      ].reduce((t, e) => {
        console.log(e);
        t.push(this.analyList.filter((_) => _.userItcode === e)[0].userName);
        return t;
      }, []);
      console.log(postData);
      getAnalyData(postData)
        .then((res) => {
          if (res.data.length === 0) {
            this.$message({
              message: "无随访数据，无法查询统计数据",
              type: "warning",
            });
            return false;
          }
          let dataX = res.data[0].X;
          let dataLegend = [];
          let dataY =
            type === 1
              ? res.data.reduce((total, item, index) => {
                  dataLegend.push(item.creates);
                  total.push({
                    name: item.creates,
                    data: item.Z,
                    type: "line",
                    smooth: true,
                    // markPoint: {
                    //   data: [
                    //     {
                    //       type: "max",
                    //     },
                    //   ],
                    //   symbol: "pin",
                    // },
                  });
                  // total.push({
                  //   name: item.creates,
                  //   data: item.Y,
                  //   type: "bar",
                  // });
                  return total;
                }, [])
              : res.data.reduce((total, item, index) => {
                  dataLegend.push(item.creates);
                  total.push({
                    name: item.creates,
                    data: item.Z,
                    type: "line",
                    smooth: true,
                    areaStyle: {
                      opacity: 0.2,
                    },
                  });
                  return total;
                }, []);
          fn(dataX, dataY, dataLegend);
        })
        .catch((error) => {
          console.error("getAnalyData", error);
        });
    },
    // 获取人员列表
    getAnalyListFn() {
      getAnalyList()
        .then((res) => {
          this.analyList = res.data;
          // this.analyList = [];
          // this.$set(this.staffSearchAnalyValid, 0, res.data[0].userItcode);
          // this.$set(this.staffSearchAnaly, 0, res.data[0].userItcode);
          // this.$set(this.typeSearchAnaly, 0, res.data[0].userItcode);
          this.staffSearchAnalyValid = this.staffSearchAnaly = this.typeSearchAnaly = [
            this.analyList[0]?.userItcode,
          ].filter((_) => _);
          console.log(this.staffSearchAnalyValid);
          this.getStaffData(1, this.staffInit);
          this.getStaffData(3, this.staffInitValid);
          this.getStaffData(2, this.typeInit);
        })
        .catch((error) => {
          console.error("getAnalyList", error);
        });
    },
    // 下载表单---------1人员实际2方式实际3人员有效
    downloadChart(type) {
      const postData =
        type === 1
          ? {
              //1
              updateTimePre: parseTime(this.staffSearchTime[0], "{y}-{m}-{d}"),
              updateTimeSuf: parseTime(this.staffSearchTime[1], "{y}-{m}-{d}"),
              creates: this.staffSearchAnaly,
              createUsers: this.staffSearchAnaly.reduce((t, e) => {
                t.push(
                  this.analyList.filter((_) => _.userItcode === e)[0].userName
                );
                return t;
              }, []),
              flag: 2,
            }
          : type === 2
          ? {
              //2
              updateTimePre: parseTime(this.typeSearchTime[0], "{y}-{m}-{d}"),
              updateTimeSuf: parseTime(this.typeSearchTime[1], "{y}-{m}-{d}"),
              creates: this.typeSearchAnaly,
              createUsers: this.typeSearchAnaly.reduce((t, e) => {
                t.push(
                  this.analyList.filter((_) => _.userItcode === e)[0].userName
                );
                return t;
              }, []),
              flag: 2,
              types: [this.radioSearchAnaly],
            }
          : {
              //3
              updateTimePre: parseTime(
                this.staffSearchTimeValid[0],
                "{y}-{m}-{d}"
              ),
              updateTimeSuf: parseTime(
                this.staffSearchTimeValid[1],
                "{y}-{m}-{d}"
              ),
              creates: this.staffSearchAnalyValid,
              createUsers: this.staffSearchAnalyValid.reduce((t, e) => {
                t.push(
                  this.analyList.filter((_) => _.userItcode === e)[0].userName
                );
                return t;
              }, []),
              flag: 1,
            };
      downloadAnalyData(postData).then((res) => {
        console.log("下载表单---------1人员实际2方式实际3人员有效", res);
        const timeNow = parseTime(new Date(), "{y}{m}{d}{h}{i}{s}");
        var blob = new Blob([res], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
        }); // 以二进制形式存储，并转化为xlsx类型的Excel
        var downloadElement = document.createElement("a");
        var href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download =
          "按随访" +
          (type === 2 ? "方式" : "人员") +
          "统计工作量(" +
          (type === 3 ? "有效" : "实际") +
          "随访)" +
          timeNow +
          ".xlsx"; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      });
    },
    // 人员查询图表初始化  ( 实际随访人次 )
    staffInit(dataX, dataY, dataLegend) {
      this.$nextTick(() => {
        let _this = this;
        let staffChart = document.getElementById("workEchart");
        let staffEcharts = Echarts.init(staffChart);
        let option = {
          color: ["#c257f6", "#6f7de3", "#ffac34", "#50bb51", "#ff583a"],
          grid: {
            bottom: "10%",
            left: "4.5%",
            right: "4.5%",
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {
                type: "jpg",
                name: "随访统计表",
              },
              myTool1: {
                show: true,
                title: "下载列表",
                icon:
                  "path://M319.9 472.2l-51.2-63h-64l83.2 102.4L204.8 614h64l51.2-63 51.2 63h64L352 511.6l83.2-102.4h-64l-51.3 63zM204.8 716.4h-51.2c-14.1 0-25.6-11.5-25.6-25.6V332.4c0-14.1 11.5-25.6 25.6-25.6h51.2V153.2c0-28.3 22.9-51.2 51.2-51.2h588.8c28.3 0 51.2 22.9 51.2 51.2V870c0 28.3-22.9 51.2-51.2 51.2H255.9c-28.3 0-51.2-22.9-51.2-51.2V716.4z m25.5 0V870c0 14.1 11.5 25.6 25.6 25.6h588.8c14.1 0 25.6-11.5 25.6-25.6V153.2c0-14.1-11.5-25.6-25.6-25.6H255.9c-14.1 0-25.6 11.5-25.6 25.6v153.6h256c14.1 0 25.6 11.5 25.6 25.6v358.4c0 14.1-11.5 25.6-25.6 25.6h-256z m358.5-320h204.8c7.1 0 12.8 5.7 12.8 12.8 0 7.1-5.7 12.8-12.8 12.8H588.8c-7.1 0-12.8-5.7-12.8-12.8-0.1-7.1 5.7-12.8 12.8-12.8z m0 102.4h204.8c7.1 0 12.8 5.7 12.8 12.8 0 7.1-5.7 12.8-12.8 12.8H588.8c-7.1 0-12.8-5.7-12.8-12.8-0.1-7.1 5.7-12.8 12.8-12.8z m0 102.4h204.8c7.1 0 12.8 5.7 12.8 12.8 0 7.1-5.7 12.8-12.8 12.8H588.8c-7.1 0-12.8-5.7-12.8-12.8-0.1-7.1 5.7-12.8 12.8-12.8z m0 0",
                onclick: function () {
                  _this.downloadChart(1);
                },
              },
            },
            top: 10,
            right: 40,
          },
          tooltip: {
            trigger: "axis",
            // formatter: '{a}:<br/>{b}<br/>{c}',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle: {
                color: "rgba(53,167,255,.3)",
              },
            },
          },
          legend: {
            data: dataLegend,
            align: "auto",
            padding: [20, 0, 0, 0],
          },
          xAxis: {
            type: "category",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#ccc",
              },
            },
            axisLabel: {
              textStyle: {
                color: "#ccc",
              },
            },
            data: dataX,
          },
          yAxis: {
            type: "value",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: "#eee",
              },
            },
            axisLabel: {
              textStyle: {
                color: "#ccc",
              },
            },
            name: "随访人次",
            nameTextStyle: {
              align: "right",
              color: "#ccc",
            },
          },
          series: dataY,
        };
        staffEcharts.setOption(option, true);
        window.addEventListener("resize", () => {
          staffEcharts.resize();
        });
      });
    },
    // 人员查询图表初始化 ( 有效随访人次 )
    staffInitValid(dataX, dataY, dataLegend) {
      this.$nextTick(() => {
        let _this = this;
        let staffChart = document.getElementById("effectiveJobEchart");
        let staffEcharts = Echarts.init(staffChart);
        let option = {
          color: ["#c257f6", "#6f7de3", "#ffac34", "#50bb51", "#ff583a"],
          grid: {
            bottom: "10%",
            left: "4.5%",
            right: "4.5%",
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {
                type: "jpg",
                name: "随访统计表",
              },
              myTool1: {
                show: true,
                title: "下载列表",
                icon:
                  "path://M319.9 472.2l-51.2-63h-64l83.2 102.4L204.8 614h64l51.2-63 51.2 63h64L352 511.6l83.2-102.4h-64l-51.3 63zM204.8 716.4h-51.2c-14.1 0-25.6-11.5-25.6-25.6V332.4c0-14.1 11.5-25.6 25.6-25.6h51.2V153.2c0-28.3 22.9-51.2 51.2-51.2h588.8c28.3 0 51.2 22.9 51.2 51.2V870c0 28.3-22.9 51.2-51.2 51.2H255.9c-28.3 0-51.2-22.9-51.2-51.2V716.4z m25.5 0V870c0 14.1 11.5 25.6 25.6 25.6h588.8c14.1 0 25.6-11.5 25.6-25.6V153.2c0-14.1-11.5-25.6-25.6-25.6H255.9c-14.1 0-25.6 11.5-25.6 25.6v153.6h256c14.1 0 25.6 11.5 25.6 25.6v358.4c0 14.1-11.5 25.6-25.6 25.6h-256z m358.5-320h204.8c7.1 0 12.8 5.7 12.8 12.8 0 7.1-5.7 12.8-12.8 12.8H588.8c-7.1 0-12.8-5.7-12.8-12.8-0.1-7.1 5.7-12.8 12.8-12.8z m0 102.4h204.8c7.1 0 12.8 5.7 12.8 12.8 0 7.1-5.7 12.8-12.8 12.8H588.8c-7.1 0-12.8-5.7-12.8-12.8-0.1-7.1 5.7-12.8 12.8-12.8z m0 102.4h204.8c7.1 0 12.8 5.7 12.8 12.8 0 7.1-5.7 12.8-12.8 12.8H588.8c-7.1 0-12.8-5.7-12.8-12.8-0.1-7.1 5.7-12.8 12.8-12.8z m0 0",
                onclick: function () {
                  _this.downloadChart(3);
                },
              },
            },
            top: 10,
            right: 40,
          },
          tooltip: {
            trigger: "axis",
            // formatter: '{a}:<br/>{b}<br/>{c}',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle: {
                color: "rgba(53,167,255,.3)",
              },
            },
          },
          legend: {
            data: dataLegend,
            align: "auto",
            padding: [20, 0, 0, 0],
          },
          xAxis: {
            type: "category",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#ccc",
              },
            },
            axisLabel: {
              textStyle: {
                color: "#ccc",
              },
            },
            data: dataX,
          },
          yAxis: {
            type: "value",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: "#eee",
              },
            },
            axisLabel: {
              textStyle: {
                color: "#ccc",
              },
            },
            name: "随访人次",
            nameTextStyle: {
              align: "right",
              color: "#ccc",
            },
          },
          series: dataY,
        };
        staffEcharts.setOption(option, true);
        window.addEventListener("resize", () => {
          staffEcharts.resize();
        });
      });
    },
    // 方式查询图表初始化
    typeInit(dataX, dataY, dataLegend) {
      this.$nextTick(() => {
        let _this = this;
        let staffChart = document.getElementById("typeEchart");
        let staffEcharts = Echarts.init(staffChart);
        let option = {
          color: ["#c257f6", "#6f7de3", "#ffac34", "#50bb51", "#ff583a"],
          grid: {
            bottom: "10%",
            left: "4.5%",
            right: "4.5%",
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {
                type: "jpg",
                name: "随访统计表",
              },
              myTool1: {
                show: true,
                title: "下载列表",
                icon:
                  "path://M319.9 472.2l-51.2-63h-64l83.2 102.4L204.8 614h64l51.2-63 51.2 63h64L352 511.6l83.2-102.4h-64l-51.3 63zM204.8 716.4h-51.2c-14.1 0-25.6-11.5-25.6-25.6V332.4c0-14.1 11.5-25.6 25.6-25.6h51.2V153.2c0-28.3 22.9-51.2 51.2-51.2h588.8c28.3 0 51.2 22.9 51.2 51.2V870c0 28.3-22.9 51.2-51.2 51.2H255.9c-28.3 0-51.2-22.9-51.2-51.2V716.4z m25.5 0V870c0 14.1 11.5 25.6 25.6 25.6h588.8c14.1 0 25.6-11.5 25.6-25.6V153.2c0-14.1-11.5-25.6-25.6-25.6H255.9c-14.1 0-25.6 11.5-25.6 25.6v153.6h256c14.1 0 25.6 11.5 25.6 25.6v358.4c0 14.1-11.5 25.6-25.6 25.6h-256z m358.5-320h204.8c7.1 0 12.8 5.7 12.8 12.8 0 7.1-5.7 12.8-12.8 12.8H588.8c-7.1 0-12.8-5.7-12.8-12.8-0.1-7.1 5.7-12.8 12.8-12.8z m0 102.4h204.8c7.1 0 12.8 5.7 12.8 12.8 0 7.1-5.7 12.8-12.8 12.8H588.8c-7.1 0-12.8-5.7-12.8-12.8-0.1-7.1 5.7-12.8 12.8-12.8z m0 102.4h204.8c7.1 0 12.8 5.7 12.8 12.8 0 7.1-5.7 12.8-12.8 12.8H588.8c-7.1 0-12.8-5.7-12.8-12.8-0.1-7.1 5.7-12.8 12.8-12.8z m0 0",
                onclick: function () {
                  _this.downloadChart(2);
                },
              },
              // myTool2: {
              //   show: true,
              //   title: "查询",
              //   icon:
              //     "path://M882.6369 904.308991 730.351542 708.192358c7.884574-6.656607 15.529695-13.647835 22.890336-21.0095 33.348526-33.350572 59.533908-72.194252 77.8296-115.453499 18.948561-44.803415 28.555359-92.378967 28.555359-141.40659 0-49.021483-9.607822-96.593965-28.556383-141.393287-18.295692-43.256176-44.481074-82.09781-77.828576-115.446335S681.053766 113.948215 637.797589 95.652524C592.99929 76.703963 545.429879 67.096141 496.409418 67.096141c-49.021483 0-96.593965 9.607822-141.394311 28.556383-43.256176 18.295692-82.098833 44.482097-115.446335 77.830623-33.348526 33.347502-59.533908 72.189136-77.830623 115.446335-18.948561 44.800345-28.556383 92.371804-28.556383 141.393287 0 49.027623 9.607822 96.603175 28.556383 141.40659 18.295692 43.259246 44.481074 82.10395 77.8296 115.453499 33.347502 33.349549 72.189136 59.536978 115.446335 77.833693 44.800345 18.948561 92.371804 28.556383 141.394311 28.556383 49.019437 0 96.590895-9.608845 141.389194-28.557406 12.920264-5.465478 25.436322-11.649318 37.541011-18.502399l154.415882 198.860117c11.339256 14.603603 31.987528 17.545608 46.119387 6.572696l1.705851-1.325182C891.713626 939.6458 893.977179 918.912593 882.6369 904.308991zM496.409418 732.173538c-166.428473 0-301.82928-135.410016-301.82928-301.851792 0-166.428473 135.399783-301.828256 301.82928-301.828256 166.423357 0 301.818023 135.399783 301.818023 301.828256C798.228465 596.763522 662.832775 732.173538 496.409418 732.173538z",
              //   onclick: function () {
              //     _this.getStaffData(2, _this.typeInit);
              //   },
              // },
            },
            top: 10,
            right: 40,
          },
          tooltip: {
            trigger: "axis",
            // formatter: '{a}:<br/>{b}<br/>{c}'
          },
          xAxis: {
            type: "category",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#ccc",
              },
            },
            axisLabel: {
              textStyle: {
                color: "#ccc",
              },
            },
            data: dataX,
          },
          yAxis: {
            type: "value",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "#eee",
              },
            },
            axisLabel: {
              textStyle: {
                color: "#ccc",
              },
            },
            name: "随访人次",
            nameTextStyle: {
              align: "right",
              color: "#ccc",
            },
          },
          series: dataY,
        };
        staffEcharts.setOption(option, true);
        window.addEventListener("resize", () => {
          staffEcharts.resize();
        });
      });
    },
    //  end
  },
};
</script>
<style lang="scss" scoped>
.analy-basic-new {
  background: #e8f1fa;
  .item-basic {
    margin-right: 16px;
    height: 160px;
    width: calc(33.3333% - 16px);
    background: #fff;
    padding: 40px;
    position: relative;
    .info-imgbox {
      position: relative;
      height: 80px;
      width: 80px;
      background: #d4ebfc;
      border-radius: 50%;
      .info-imgsize {
        position: absolute;
        font-size: 36px;
        top: 20px;
        left: 22px;
      }
    }
    .name {
      position: absolute;
      left: 160px;
      top: 56px;
      font-size: 14px;
      line-height: 14px;
      color: #666666;
    }
    .card-val {
      position: absolute;
      left: 160px;
      top: 82px;
      line-height: 32px;
      font-size: 32px;
      font-family: PingFang SC Bold, PingFang SC Bold-Bold;
      font-weight: 700;
      color: #333;
    }
    &:nth-of-type(1) {
      .info-imgbox {
        background: #d4ebfc;
        .info-imgsize {
          font-size: 42px;
          top: 17px;
          left: 19px;
        }
        .info-imgsize {
          color: #299cf1;
        }
      }
    }
    &:nth-of-type(2) {
      .info-imgbox {
        background: #fff3cd;
        .info-imgsize {
          color: #ffc404;
        }
      }
    }
    &:nth-of-type(3) {
      .info-imgsize {
        font-size: 42px;
        top: 17px;
        left: 19px;
      }
      .info-imgbox {
        background: #d0f3f3;
        .info-imgsize {
          color: #12c3c5;
        }
      }
    }
  }
  .item-basic:last-child {
    width: 33.3333%;
    margin-right: 0px;
  }
}

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
          font-size: 30px;
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
      // &:nth-of-type(3) {
      //   background-image: linear-gradient(to left, #ff735b, #d15b47);
      // }
      &:nth-of-type(3) {
        background-image: linear-gradient(to left, #51c353, #468847);
      }
    }
  }
}
.analy-staff {
  position: relative;
  // height: 300px;
  margin-top: 16px;
  padding: 20px 0;
  background: #fff;
  .analy-staff_title {
    position: relative;
    display: inline-block;
    font-weight: bold;

    margin-left: 30px;

    &::before {
      content: "";
      width: 4px;
      height: 16px;
      background-color: #2476c2;
      position: absolute;
      top: 3px;
      left: -9px;
    }
  }
  .analy-staff_search,
  .analy-staff_select,
  .analy-staff_time,
  .analy-staff_radio {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
    & > div {
      width: 220px;
    }
  }
  .analy-staff_time {
    right: 100px;
  }
  .analy-staff_radio {
    left: 200px;
    width: 300px;
    top: 24px;
    & > div {
      width: 100%;
    }
  }
  .analy-staff_select {
    right: 320px;
  }
  .data_view-container {
    height: 300px;
  }
  .second-title {
    font-size: 14px;
    color: #999;
    margin-left: 12px;
    font-weight: 100;
  }
}
.marginr10 {
  margin-right: 10px;
}
// /deep/ .el-tag--mini {
//   padding: 0 10px!important;
// }
</style>
<style lang="scss" >
.md-select2 {
  .el-select__tags {
    flex-wrap: nowrap;
    overflow: hidden;
  }
}
.analy-staff_time {
  .el-input__icon.el-range__icon.el-icon-date {
    line-height: 21px !important;
  }
}
</style>