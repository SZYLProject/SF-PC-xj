<template>
  <div class="content" style="height: calc(100% - 32px)">
    <!-- 按随访方式统计工作量 -->
    <div class="analy-staff margint0">
      <span class="analy-staff_title">
        按随访方式统计工作量
        <span class="second-title">( 实际随访人次 )</span>
      </span>
      <div id="typeEchart" ref="typeEchart" class="data_view-container"></div>
      <div class="analy-staff_radio">
        <!-- @change="typeChange" -->
        <el-radio-group v-model="radioSearchAnaly">
          <el-radio label="mobile">电话随访</el-radio>
          <el-radio label="wechat">微信随访</el-radio>
        </el-radio-group>
      </div>
      <div class="analy-staff_select">
        <!-- @visible-change="typeStaffChange" -->
        <el-select
          v-model="typeSearchAnaly"
          :multiple-limit="5"
          :collapse-tags="typeSearchAnaly.length > 3"
          class="md-select3"
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
        <el-button type="primary" size="mini" @click="search(2)"
          >查询</el-button
        >
      </div>
    </div>
    <!-- 按病种统计 -->
    <div class="analy-staff">
      <span class="analy-staff_title">按病种统计</span>
      <div class="list-box">
         <el-table stripe v-loading="loading" :data="tableData" border class="disList">
          <el-table-column prop="title" label="病种"
            min-width="160"
            show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="depart"
            label="已随访患者总人数"
          ></el-table-column>
          <el-table-column
            prop="typeName"
            label="已随访患者总人次"
          ></el-table-column>
          <el-table-column
            prop="typeName"
            label="有效随访人次"
          ></el-table-column>
          <el-table-column
            prop="content"
            label="有效随访率"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="typeName"
            label="无效随访人次"
          ></el-table-column>
          <el-table-column
            prop="content"
            label="随访无效率"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="有效随访人次" align="center">
            <el-table-column
              align="center"
              label="小计"
              prop="province"
            ></el-table-column>
            <el-table-column
              align="center"
              label="稳定"
              prop="province"
            ></el-table-column>
            <el-table-column
              align="center"
              label="复发"
              prop="province"
            ></el-table-column>
            <el-table-column
              align="center"
              label="转移"
              prop="province"
            ></el-table-column>
            <el-table-column
              align="center"
              label="死亡"
              prop="province"
            ></el-table-column>
          </el-table-column>
          <el-table-column label="无效随访人次" align="center">
            <el-table-column
              align="center"
              label="小计"
              prop="province"
            ></el-table-column>
            <el-table-column
              align="center"
              label="主动拒接"
              prop="province"
            ></el-table-column>
            <el-table-column
              align="center"
              label="无人接听"
              prop="province"
            ></el-table-column>
            <el-table-column
              align="center"
              label="无法接通"
              prop="province"
            ></el-table-column>
            <el-table-column
              align="center"
              label="拒绝随访"
              prop="province"
            ></el-table-column>
            <el-table-column
              align="center"
              label="关机"
              prop="province"
            ></el-table-column>
            <el-table-column
              align="center"
              label="停机"
              prop="province"
            ></el-table-column>
            <el-table-column
              align="center"
              label="空号"
              prop="province"
            ></el-table-column>
            <el-table-column
              align="center"
              label="号码错误"
              prop="province"
            ></el-table-column>
            <el-table-column
              align="center"
              label="其他情况"
              prop="province"
            ></el-table-column>
          </el-table-column>
          <el-table-column
            label="随访失访例数"
            align="center"
          ></el-table-column>
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
    <!-- 失访情况分析 -->
    <div class="analy-staff marginb20">
      <span class="analy-staff_title">失访情况分析</span>
      <div class="analy-staff_table list-box">
        <el-table stripe
           :data="lostList"
          style="width: 99%"
          :cell-class-name="addClass"
        >
          <el-table-column
            prop="date"
            align="center"
            label="项目"
          ></el-table-column>
          <el-table-column
            prop="date"
            align="center"
            label="应随访人数"
          ></el-table-column>
          <el-table-column
            prop="date"
            align="center"
            label="失访人数"
          ></el-table-column>
          <el-table-column
            prop="date"
            align="center"
            label="失访率"
          ></el-table-column>
          <el-table-column
            prop="date"
            align="center"
            label="终止随访人数"
          ></el-table-column>
          <el-table-column
            prop="date"
            align="center"
            label="终止率"
          ></el-table-column>
          <el-table-column label="终止原因" align="center">
            <!-- <el-table-column label="死亡" align="center" width="120">
              <template slot-scope="scope">
                <span
                  :style="{ color: scope.row.zip>40 ? '#cccccc' : '#ED3F14' }"
                >{{ scope.row.zip}}</span>
              </template>
            </el-table-column>-->
            <el-table-column
              align="center"
              label="死亡"
              width="120"
              prop="zip"
            ></el-table-column>
            <el-table-column
              align="center"
              label="失访"
              width="120"
              prop="address"
            ></el-table-column>
            <el-table-column
              align="center"
              label="拒访"
              width="120"
              prop="province"
            ></el-table-column>
            <el-table-column
              align="center"
              label="误诊"
              width="120"
              prop="province"
            ></el-table-column>
            <el-table-column
              align="center"
              label="迁居"
              width="120"
              prop="province"
            ></el-table-column>
            <el-table-column
              align="center"
              label="移民"
              width="120"
              prop="province"
            ></el-table-column>
            <el-table-column
              align="center"
              label="其他"
              width="120"
              prop="province"
            ></el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div class="analy-staff_select">
        <el-select
          v-model="staffSearchAnaly"
          placeholder="请选择"
          @visible-change="staffChange"
          multiple
          filterable
          clearable
          collapse-tags
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
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
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
//echarts相关插件
let Echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/line"); //折线图
require("echarts/lib/chart/bar"); //柱状图
require("echarts/lib/chart/sankey"); //桑基图
require("echarts/lib/component/tooltip");
require("echarts/lib/component/toolbox");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
require("echarts/lib/component/markPoint");

import { parseTime } from "@/utils/index.js";
import {
  getAnalyList,
  getStatistics,
  getAnalyData,
  downloadAnalyData,
} from "@/api/statisticAnaly";
export default {
  name: "StatisticalAnalysis",
  data() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
    return {
      lostList: [
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: 30,
          zip: 50,
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: 70,
          zip: 20,
        },
      ],
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
      staffSearchAnaly: [],
      staffSearchAnalyValid: [],
      typeSearchAnaly: [],
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
    this.getStatisticsFn();
    this.getAnalyListFn();
  },
  methods: {
    // 修改单元格样式
    addClass({ row, column, rowIndex, columnIndex }) {
      if (row.zip >= 30) {
        if (column.label == "死亡") {
          return " color50";
        }
      }
    },
    //按人员搜索
    staffChange(bool) {
      !bool && setTimeout(this.getStaffData(1, this.staffInit), 200);
    },
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
        t.push(this.analyList.filter((_) => _.userItcode === e)[0].userName);
        return t;
      }, []);
      console.log(postData);
      getAnalyData(postData)
        .then((res) => {
          if (res.data.length === 0) return false;
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
          // console.log(dataX, dataY, dataLegend, "这里是获取完数据");
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
          this.$set(this.staffSearchAnalyValid, 0, res.data[0].userItcode);
          this.$set(this.staffSearchAnaly, 0, res.data[0].userItcode);
          this.$set(this.typeSearchAnaly, 0, res.data[0].userItcode);

          // this.getStaffData(1, this.staffInit);
          // this.getStaffData(3, this.staffInitValid);
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
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 页数按钮
    handleCurrentChange(val) {
      this.pageNum = val;
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
    display: inline-block;
    font-weight: bold;
    border-left: 3px solid #2476c2;
    padding-left: 16px;
    margin-left: 24px;
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
      width: 200px;
    }
  }
  .analy-staff_time {
    right: 80px;
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
