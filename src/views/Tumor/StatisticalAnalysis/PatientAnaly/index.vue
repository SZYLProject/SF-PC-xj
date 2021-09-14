<template>
  <div class="patientAnalyContent content">
    <div class="analy-basic">
      <el-row :gutter="20">
        <el-col :span="4" >
          <div class="grid-content total-people">
            <div class="total-people-value-left">
              <p class="name">患者总数</p>
              <p class="value" style="color: #fd4e71">{{analysis.total}}</p>
            </div>
            <!-- <div class="total-people-value-right">
              <div>
                <p>
                  <span style="color: #2476c2">本院</span><br />
                  <span class="num">121313</span>
                </p>
                <p>
                  <span style="color: #20b280">非肿瘤</span><br />
                  <span class="num">2312423</span>
                </p>
              </div>
              <div>
                <p>
                  <span style="color: #aa24c2">外院</span><br />
                  <span class="num">12423</span>
                </p>
                <p>
                  <span style="color: #c42f1b">肿瘤</span><br />
                  <span class="num">12423</span>
                </p>
              </div>
            </div> -->
          </div>
        </el-col>
         <el-col :span="4">
          <div class="grid-content to-follow-up">
            <p>
              <span class="name">待随访数</span>
              <span class="percentage" style="color: #42ecd1">{{
                analysis.waitPercent + "%"
              }}</span>
            </p>
            <p class="value" style="color: #22c9af">{{ analysis.wait }}</p>
          </div>
        </el-col>
         <el-col :span="4">
          <div class="grid-content stable-patient">
            <p>
              <span class="name">稳定患者</span>
              <span class="percentage" style="color: #6caae3">{{analysis.stablePercent + '%'}}</span>
            </p>
            <p class="value" style="color: #2476c2">{{analysis.stable}}</p>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content lost-to-follow-up">
            <p>
              <span class="name">失访患者</span>
              <span class="percentage" style="color: #ae9ee6">{{analysis.lostPercent + '%'}}</span>
            </p>
            <p class="value" style="color: #5a33e4">{{analysis.lost}}</p>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content dead-patient">
            <p>
              <span class="name">死亡患者</span>
              <span class="percentage" style="color: #988ec6">{{analysis.deathPercent + '%'}}</span>
            </p>
            <p class="value" style="color: #62559d">{{analysis.death}}</p>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content relapsed-patients">
            <p>
              <span class="name">复发/转移</span>
              <span class="percentage" style="color: #eb9962">{{analysis.relapsePercent + '%'}}</span>
            </p>
            <p class="value" style="color: #e16a1a">{{analysis.relapse}}</p>
          </div>
        </el-col>
       
      </el-row>
    </div>
    <div class="echart-box">
      
      <el-row>
        <!-- <el-col :span="12" class="echart-grid">
          <span class="echart-tit"> 癌症性质分布 </span>
          <span class="fr select-box">
            <el-date-picker
              v-model="value1"
              type="daterange"
              size="mini"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </span>

          <div
            id="plagueSpecies"
            ref="plagueSpecies"
            class="echart-container"
          ></div>
        </el-col> -->
        <el-col :span="12" class="echart-grid">
          <span class="echart-tit"> 性别分布 </span>
          <div
            id="genderDistribution"
            ref="genderDistribution"
            class="echart-container"
          ></div>
        </el-col>
        <el-col :span="12" class="echart-grid">
          <span class="echart-tit"> 年龄分布 </span>
          <div
            id="ageDistribution"
            ref="ageDistribution"
            class="echart-container"
          ></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="echart-grid">
          <span class="echart-tit"> 癌种分布 </span>
          <span class="fr select-box" style="margin-right:20px;">
            <el-date-picker
              v-model="value1"
              type="daterange"
              size="mini"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
            <el-button style="margin-left:10px;" type="primary" size="mini" @click="search">查询</el-button>
          </span>
          <div
            id="cancerSpecies"
            ref="cancerSpecies"
            class="echart-container"
          ></div>
        </el-col>
        
      </el-row>
      <el-row>
        <el-col :span="24" class="echart-grid" v-show="!['分中心负责人','分中心随访人员'].filter(v => roleName.split(',').includes(v)).length">
          <span class="echart-tit"> 患者总数 </span>
          <div id="source" ref="source" class="echart-container"></div>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="24" class="echart-grid">
          <span class="echart-tit"> 地域分布 </span>
          <div
            id="geographicalDistribution"
            ref="geographicalDistribution"
            class="echart-container"
          ></div>
        </el-col>
      </el-row> -->
    </div>
  </div>
</template>

<script>
//echarts相关插件
let Echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/bar"); //柱状图
require("echarts/lib/chart/pie"); //扇形图
require("echarts/lib/chart/line"); //线形图
require("echarts/lib/chart/map"); //地图
require("echarts/lib/chart/pictorialBar"); // 象形柱图

import "../../../../../node_modules/echarts/map/js/china.js"; // 引入中国地图数据
import { parseTime } from "@/utils/index.js";

import {
  getPatientAnalysis,
  getSourcePatients,
  getGenderDistribution,
  getInfoByAge,
  getInfoByLocal,
  getInfoByCreateBy,
  getIntoGroupDistribute
} from "@/api/tumor/tumorFollowup";

export default {
  name: "TumorAnaly",
  data() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
    return {
      value1: [start, end],
      value2: "",
      analysis: {
        Nontumor: 0,
        death: 0,
        deathPercent: 0,
        ins: 0,
        lost: 0,
        lostPercent: 0,
        outs: 0,
        relapse: 0,
        relapsePercent: 0,
        stable: 0,
        stablePercent: 0,
        wait: 0,
        waitPercent: 0,
        total: 0,
        tumour: 0
      },
      genderNums: 200, // 性别分布总数
    };
  },
  created() {
    this.roleName = JSON.parse(sessionStorage.getItem("userData")).roleName;
    // this.showSource(); //  患者总数 柱状图
    // this.showPlagueSpecies(); // 加载癌症性质分布 扇形图
    // this.showAgeDistribution(); // 加载年龄分布 线柱图
    // this.showGeographicalDistribution(); // 地域分布 地图
    // this.showCancerSpecies(); // 癌种分布  象形柱图
    // this.showGenderDistribution(); // 性别分布 象形柱图

    this.getPatientAnalysisFn(); // 患者分析接口
    this.getSourcePatientsFn(); // 患者总数接口
    this.getGenderDistributionFn(); // 性别分布接口
    this.getInfoByAgeFn(); // 年龄分布接口
    // this.getInfoByLocalFn(); // 地域分布接口
    this.getInfoByCreateByFn(); // 癌种分布
  },
  methods: {
    //癌种时间查询
    search(){
      this.getInfoByCreateByFn();
    },
    getInfoByCreateByFn() {
      const postData = {
        updateTimePre: parseTime( this.value1[0], "{y}-{m}-{d}" ),
        updateTimeSuf: parseTime( this.value1[1], "{y}-{m}-{d}" )
      }
      getIntoGroupDistribute(postData)
        .then((res) => {
          this.showCancerSpecies(res.data[0]);
          console.log(res, "癌种分布");
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getSourcePatientsFn() {
      getSourcePatients()
        .then((res) => {
          console.log(res, "患者来源接口");
          let yDataList = res.data.map((x) => {
            return x.count;
          });
          let xDataList = res.data.map((x) => {
            return x.hospitalName;
          });
          console.log(xDataList, yDataList);
          this.showSource(xDataList, yDataList);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getGenderDistributionFn() {
      getGenderDistribution()
        .then((res) => {
          console.log(res, "性别分布接口");
          //   let echartData = {
          //     man: res.data.man,
          //     woman: res.data.woman,
          //     total: res.data.total,
          //   };
          this.showGenderDistribution(res.data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getInfoByAgeFn() {
      getInfoByAge()
        .then((res) => {
          this.showAgeDistribution(res.data[0])
          console.log(res, "年龄分布接口");
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getInfoByLocalFn() {
      getInfoByLocal()
        .then((res) => {
          //   console.log(res, "地域分布接口");
          this.showGeographicalDistribution(res.data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getPatientAnalysisFn() {
      getPatientAnalysis()
        .then((res) => {
          console.log(res, "患者分析接口");
          Object.assign(this.analysis,res.data[0]);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 患者来源
    showSource(xDataList, yDataList) {
      this.$nextTick(() => {
        let sourceChart = document.getElementById("source");
        let sourcecharts = Echarts.init(sourceChart);
        let sourceOption = {
          color: {
            type: "linear",
            x: 0,
            y: 1,
            x2: 1,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#7683D9", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#D8A0FE", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          grid: {
            left: "16%",
            right: "10%",
            bottom: 0,
            top: 0,
            containLabel: false,
          },
          yAxis: [
            {
              type: "category",
              data: xDataList,
              axisTick: {
                show: false,
              },
              axisLine: {
                show: false,
              },
            },
            {
              type: "category",
              axisTick: "none",
              axisLine: "none",
              show: true,
              axisLabel: {
                textStyle: {
                  color: "#000",
                  fontSize: "12",
                },
              },
              data: yDataList,
            },
          ],
          xAxis: [
            {
              type: "value",
              show: false,
            },
          ],
          series: [
            {
              name: "患者数量",
              type: "bar",
              barGap: "-100%",
              showBackground: true,
              data: yDataList,
              barWidth: 12,
              backgroundStyle: {
                color: "#DFE5F1",
                barBorderRadius: 6,
              },
              itemStyle: {
                borderType: "solid",
                barBorderRadius: 6,
              },
            },
          ],
        };
        // console.log(JSON.stringify(sourceOption));

        sourcecharts.setOption(sourceOption, true);
        window.addEventListener("resize", () => {
          sourcecharts.resize();
        });
      });
    },

    // 癌症性质分布
    showPlagueSpecies() {
      this.$nextTick(() => {
        let plagueSpeciesChart = document.getElementById("plagueSpecies");
        let plagueSpeciescharts = Echarts.init(plagueSpeciesChart);
        let plagueSpeciesOption = {
          color: [
            "#2EC7C9",
            "#B6A2DE",
            "#8D98B3",
            "#5AB1EF",
            "#FFB980",
            "#D87A80",
          ],
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)",
          },
          series: [
            {
              name: "癌症性质分布",
              type: "pie",
              selectedMode: "single",
              radius: [0, "25%"],

              label: {
                position: "inner",
              },
              labelLine: {
                show: false,
              },
              selectedOffset: 3,
              data: [
                {
                  value: 335,
                  name: "肿瘤",
                  selected: true,
                },
                {
                  value: 679,
                  name: "非肿瘤",
                },
              ],
            },
            {
              name: "访问来源",
              type: "pie",
              radius: ["35%", "45%"],
              labelLine: {
                normal: {
                  length: 16,
                  length2: 180,
                  lineStyle: {
                    type: "solid",
                  },
                },
              },
              label: {
                formatter: " {hr|}     {b|{b}：}{b|{c}} {per|{d}%}",
                padding: [0, -170],
                height: 100,
                rich: {
                  hr: {
                    backgroundColor: "t",
                    borderRadius: 100,
                    width: 0,
                    height: 10,
                    padding: [3, 3, 0, -16],
                    shadowColor: "#1c1b3a",
                    shadowBlur: 1,
                    shadowOffsetX: "0",
                    shadowOffsetY: "0",
                  },
                  b: {
                    color: "#000",
                    fontSize: 16,
                    lineHeight: 80,
                  },
                  per: {
                    color: "#000",
                    fontSize: 16,
                    fontWeight: "bold",
                    padding: [2, 4],
                    borderRadius: 2,
                  },
                },
              },
              data: [
                {
                  value: 335,
                  name: "交界性肿瘤",
                },
                {
                  value: 310,
                  name: "恶性肿瘤",
                },
                {
                  value: 234,
                  name: "良性肿瘤",
                },
                {
                  value: 135,
                  name: "动态未定",
                },
                {
                  value: 1048,
                  name: "非肿瘤",
                },
              ],
            },
          ],
        };

        plagueSpeciescharts.setOption(plagueSpeciesOption, true);
        window.addEventListener("resize", () => {
          plagueSpeciescharts.resize();
        });
      });
    },

    // 性别分布
    showGenderDistribution(echartData) {
      this.$nextTick(() => {
        let genderDistributionChart = document.getElementById(
          "genderDistribution"
        );
        let genderDistributionCharts = Echarts.init(genderDistributionChart);
        let menSvg =
            "path://M725.577143 233.545143a96.987429 96.987429 0 0 0-58.514286-18.432H364.032C318.537143 215.113143 281.6 243.273143 281.6 277.942857v316.050286a29.257143 29.257143 0 0 0 12.580571 23.186286 50.614857 50.614857 0 0 0 30.427429 9.581714 50.395429 50.395429 0 0 0 30.354286-9.581714 29.257143 29.257143 0 0 0 12.580571-23.186286V320.731429h19.163429v633.929142a39.204571 39.204571 0 0 0 16.749714 30.939429 67.657143 67.657143 0 0 0 40.594286 12.8 67.584 67.584 0 0 0 40.521143-12.8 39.204571 39.204571 0 0 0 16.749714-30.939429V597.650286h28.672v357.010285c0 24.137143 25.673143 43.885714 57.344 43.885715a67.364571 67.364571 0 0 0 40.521143-12.8 39.204571 39.204571 0 0 0 16.749714-30.939429V320.731429h19.163429v273.261714a29.257143 29.257143 0 0 0 12.580571 23.186286 52.955429 52.955429 0 0 0 60.781714 0 29.257143 29.257143 0 0 0 12.580572-23.186286V277.942857a56.539429 56.539429 0 0 0-24.137143-44.397714z m-202.605714-39.936a81.554286 81.554286 0 0 0 82.944-80.457143 81.554286 81.554286 0 0 0-82.944-80.457143 81.554286 81.554286 0 0 0-82.944 80.457143 81.554286 81.554286 0 0 0 82.944 80.457143z",
          womenSvg =
            "path://M475.428571 182.857143a82.066286 82.066286 0 1 0-41.106285-71.094857A82.358857 82.358857 0 0 0 475.428571 182.857143z m270.628572 351.817143L658.285714 266.898286A80.018286 80.018286 0 0 0 581.997714 212.114286H443.684571a80.457143 80.457143 0 0 0-76.141714 55.149714L279.917714 534.674286a33.938286 33.938286 0 0 0 64.512 21.211428l67.072-204.8 8.411429-25.819428h15.433143l-23.844572 73.142857-59.318857 180.736-18.432 56.393143a20.114286 20.114286 0 0 0 19.090286 26.331428h57.782857v290.742857a43.885714 43.885714 0 0 0 87.771429 0V661.869714h29.257142v290.742857a43.885714 43.885714 0 0 0 87.771429 0V661.869714H672.914286a20.114286 20.114286 0 0 0 19.090285-26.331428l-18.358857-56.393143-64.950857-198.436572-18.285714-55.808h15.433143l2.852571 8.850286L681.325714 555.885714A33.938286 33.938286 0 1 0 746.057143 534.674286z",
          _this = this;

        let genderDistributionOption = {
          grid: {
            left: "20%",
            top: "12%",
            right: "20%",
            bottom: "26%",
            containLabel: true,
          },
          xAxis: [
            {
              data: [
                {
                  value: "男",
                  textStyle: {
                    color: "#85D1F2",
                  },
                },
                {
                  value: "女",
                  textStyle: {
                    color: "#FEABAC",
                  },
                },
              ],
              axisTick: { show: false },
              axisLine: { show: false },
              axisLabel: {
                show: true,
                textStyle: {
                  fontSize: "16",
                  fontWeight: "bold",
                },
              },
            },
          ],
          yAxis: [
            {
              splitLine: { show: false },
              axisTick: { show: false },
              axisLine: { show: false },
              axisLabel: { show: false },
            },
          ],
          series: [
            {
              type: "pictorialBar",
              barWidth: "60%",
              name: "val",
              symbolBoundingData: echartData.total,
              z: 10,
              symbolClip: true,
              label: {
                show: true,
                position: ["15%", "116%"],
                formatter: function (item) {
                  let val = item.name==='男' ? echartData.iSman : echartData.iSwoman;
                  let percent = item.name==='男' ? echartData.manPercent : echartData.womanPercent;
                  return val + ", " + percent.toString().replace(/0+?$/g,'').replace(/[\.]$/g,'') + '%';
                },
              },
              data: [
                {
                  value: echartData.man,
                  symbol: menSvg,
                  symbolClip: true,
                  itemStyle: {
                    color: "#69CCE6",
                  },
                },
                {
                  value: echartData.woman,
                  symbol: womenSvg,
                  symbolClip: true,
                  itemStyle: {
                    color: "#FF8282",
                  },
                },
              ],
            },
            {
              name: "bg",
              type: "pictorialBar",
              animationDuration: 0,
              barWidth: "60%",
              data: [
                {
                  value: echartData.total,
                  symbol: menSvg,
                  itemStyle: {
                    color: "#C3EBF5",
                  },
                },
                {
                  value: echartData.total,
                  symbol: womenSvg,
                  itemStyle: {
                    color: "#FFCDCD",
                  },
                },
              ],
            },
          ],
        };

        genderDistributionCharts.setOption(genderDistributionOption, true);
        window.addEventListener("resize", () => {
          genderDistributionCharts.resize();
        });
      });
    },

    // 癌种分布
    showCancerSpecies(echartData) {
      this.$nextTick(() => {
        let cancerSpeciesChart = document.getElementById("cancerSpecies");
        let cancerSpeciesCharts = Echarts.init(cancerSpeciesChart);
        let cancerSpeciesOption = {
          color: [""],
          tooltip: {
            trigger: "item",
            backgroundColor: "rgba(0,0,0,0.9)",
            formatter: "{b}<br/>{c}",
          },
          grid: {
            right: 25,
            left: 20,
            top: 60,
            bottom: 30,
            containLabel: true,
          },
          yAxis: [
            {
              type: "value",
              show: true,
              splitLine: {
                show: false,
              },
              axisLabel: {
                color: "#333",
              },
              axisLine: {
                lineStyle: {
                  color: "#FFF9F8",
                },
              },
              axisTick: {
                show: false,
              },
            },
          ],
          xAxis: [
            {
              type: "category",
              axisTick: {
                show: false,
              },
              data: echartData.X,
              axisLabel: {
                interval: 0,
                rotate: 15,
                color: "#333",
              },
              splitLine: {
                show: false,
              },
              axisLine: {
                show: false,
              },
              splitArea: {
                show: false,
              },
            },
          ],
          series: [
            {
              type: "pictorialBar",
              symbol:
                "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
              data: echartData.Y,
              barWidth: "150%",
              symbolOffset: [0, 0],
              z: 1,
              label: {
                show: true,
                formatter: "{c}",
                position: "top",
                fontSize: 16,
                fontWeight: "bolder",
                color: "#D54251",
              },
              itemStyle: {
                normal: {
                  shadowColor: "rgba(0, 0, 0, 0)",
                  shadowBlur: 10,
                  shadowOffsetY: -5,
                  shadowOffsetX: 0,
                  color: function (params) {
                    var colorList = [
                      new Echarts.graphic.LinearGradient(0, 1, 0, 0, [
                        {
                          offset: 0,
                          color: "#fff",
                        },
                        {
                          offset: 1,
                          color: "#D54251",
                        },
                      ]),
                      new Echarts.graphic.LinearGradient(0, 1, 0, 0, [
                        {
                          offset: 0,
                          color: "#fff",
                        },
                        {
                          offset: 1,
                          color: "#D54251",
                        },
                      ]),
                    ];
                    return colorList[params.dataIndex];
                  },
                },
                emphasis: {
                  opacity: 1,
                },
              },
            },
          ],
        };

        cancerSpeciesCharts.setOption(cancerSpeciesOption, true);
        window.addEventListener("resize", () => {
          cancerSpeciesCharts.resize();
        });
      });
    },

    // 年龄分布
    showAgeDistribution(echartData) {
      this.$nextTick(() => {
        let ageDistributionChart = document.getElementById("ageDistribution");
        let ageDistributionCharts = Echarts.init(ageDistributionChart);
        let ageDistributionOption = {
          backgroundColor: "#fff",
          grid: {
            top: "15%",
            right: "5%",
            left: "10%",
            bottom: "12%",
          },
          xAxis: [
            {
              type: "category",
              color: "#59588D",
              data: echartData.X,
              axisLabel: {
                margin: 20,
                color: "#999",
                textStyle: {
                  // fontSize: 18
                },
              },
              axisLine: {
                lineStyle: {
                  color: "rgba(107,107,107,0.37)",
                },
              },
              axisTick: {
                show: false,
              },
            },
          ],
          yAxis: [
            {
              axisLabel: {
                margin: 6,
                // formatter: "{value}",
                color: "#999",
                textStyle: {
                  // fontSize: 18
                },
              },
              axisLine: {
                lineStyle: {
                  color: "rgba(107,107,107,0.37)",
                },
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                lineStyle: {
                  color: "rgba(131,101,101,0.2)",
                  type: "dashed",
                },
              },
            },
          ],
          series: [
            {
              type: "bar",
              data: echartData.Y,
              barWidth: "30px",
              itemStyle: {
                normal: {
                  color: function (params) {
                    //展示正值的柱子，负数设为透明
                    let colorArr =
                      params.value > 0
                        ? ["#FF9A22", "#FFD56E"]
                        : ["rgba(0,0,0,0)", "rgba(0,0,0,0)"];
                    return new Echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: colorArr[0], // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: colorArr[1], // 100% 处的颜色
                        },
                      ],
                      false
                    );
                  },
                  barBorderRadius: [30, 30, 0, 0],
                },
              },
              label: {
                normal: {
                  show: true,
                  // fontSize: 18,
                  fontWeight: "bold",
                  color: "#333",
                  position: "top",
                },
              },
            },
            {
              type: "bar",
              data: echartData.Y,
              barWidth: "30px",
              barGap: "-100%",
              itemStyle: {
                normal: {
                  color: function (params) {
                    //展示负值的柱子，正数设为透明
                    let colorArr =
                      params.value > 0
                        ? ["rgba(0,0,0,0)", "rgba(0,0,0,0)"]
                        : ["#FFD56E", "#FF9A22"];
                    return new Echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: colorArr[0], // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: colorArr[1], // 100% 处的颜色
                        },
                      ],
                      false
                    );
                  },
                  barBorderRadius: [0, 0, 30, 30],
                },
              },
            },
            {
              data: echartData.Y,
              type: "line",
              smooth: true,
              name: "年龄分布",
              symbol: "none",
              lineStyle: {
                color: "#3275FB",
                width: 4,
                shadowColor: "rgba(0, 0, 0, 0.3)", //设置折线阴影
                shadowBlur: 15,
                shadowOffsetY: 20,
              },
            },
          ],
        };

        ageDistributionCharts.setOption(ageDistributionOption, true);
        window.addEventListener("resize", () => {
          ageDistributionCharts.resize();
        });
      });
    },

    // 地图分布
    showGeographicalDistribution(data) {
      let max = data.sort(function(a,b){
        return a.value - b.value
      })[data.length-1].value;
      let visualMapMax = (Number(max[0]) + 1) * Math.pow(10, max.length-1)
      this.$nextTick(() => {
        let geographicalDistributionChart = document.getElementById(
          "geographicalDistribution"
        );
        let geographicalDistributionCharts = Echarts.init(
          geographicalDistributionChart
        );
       
        let mapName = "china";
        let max = 6000,
          min = 9; // todo
        let maxSize4Pin = 35,
          minSize4Pin = 30;

        let geographicalDistributionOption = {
          tooltip: {
            trigger: "item",
            formatter: "{b}: {c}",
          },
          visualMap: {
            // show: false,
            min: 0,
            max: visualMapMax,
            left: 10,
            top: "bottom",
            text: ["高", "低"], // 文本，默认为数值文本
            calculable: true,
            inRange: {
              color: [
                "#48C7C0",
                "#4BBDD6",
                "#479FD2",
                "#FFC188",
                "#FBA853",
                "#FA8737",
                "#FF6B57",
              ], // 黑紫黑
            },
          },
          /*工具按钮组*/
          toolbox: {
            //  show: true,
            //  orient: 'vertical',
            //  left: 'right',
            //  top: 'center',
            //  feature: {
            // 	 saveAsImage: {}
            //  }
          },
          series: [
            {
              type: "map",
              map: mapName,
              label: {
                show: true,
              },
              geoIndex: 0,
              aspectScale: 0.75, //长宽比
              showLegendSymbol: false, // 存在legend时显示
              roam: false,
              itemStyle: {
                normal: {
                  areaColor: "#031525",
                  borderColor: "#3B5077",
                },
                emphasis: {
                  areaColor: "#2B91B7",
                },
              },
              animation: false,
              data: data,
            },
          ],
        };

        geographicalDistributionCharts.setOption(
          geographicalDistributionOption,
          true
        );
        window.addEventListener("resize", () => {
          geographicalDistributionCharts.resize();
        });
      });
    },
     // 新疆分部
    xjMapEchartFn(data) {
      this.$nextTick(() => {
        let xjMapEchartChart = document.getElementById("xjMapEchart");
        let xjMapEchartCharts = Echarts.init(xjMapEchartChart);
        let mapName = "新疆";
        let maxNum =Math.max.apply(Math, data.map(function (o) { return o.value }))
        let max = maxNum+(maxNum*0.2),
          min = 0; 
        let maxSize4Pin = 35,
          minSize4Pin = 30;

        let xjMapEchartOption = {
          tooltip: {
            trigger: "item",
            formatter: "{b}: {c}",
          },
          visualMap: {
            // show: false,
            min: 0,
            max: max,
            left: 10,
            top: "bottom",
            text: ["高", "低"], // 文本，默认为数值文本
            calculable: true,
            inRange: {
              color: [
                "#48C7C0",
                "#4BBDD6",
                "#479FD2",
                "#FFC188",
                "#FBA853",
                "#FA8737",
                "#FF6B57",
              ], // 黑紫黑
            },
          },
          /*工具按钮组*/
          toolbox: {
            //  show: true,
            //  orient: 'vertical',
            //  left: 'right',
            //  top: 'center',
            //  feature: {
            // 	 saveAsImage: {}
            //  }
          },
          series: [
            {
              type: "map",
              map: mapName,
              label: {
                show: true,
              },
              geoIndex: 0,
              aspectScale: 0.75, //长宽比
              showLegendSymbol: false, // 存在legend时显示
              roam: false,
              itemStyle: {
                normal: {
                  areaColor: "#031525",
                  borderColor: "#3B5077",
                },
                emphasis: {
                  areaColor: "#2B91B7",
                },
              },
              animation: false,
              data: data,
            },
          ],
        };

        xjMapEchartCharts.setOption(xjMapEchartOption, true);
        window.addEventListener("resize", () => {
          xjMapEchartCharts.resize();
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.patientAnalyContent {
  font-family: "PingFang SC Medium";

  .analy-basic {
    background-color: #fff;
    padding: 15px 30px;
				p.value {
					font-size: 20px;
					font-weight: bold;
					position: absolute;
					bottom: 40px;
					left: 20px;
				}

    
    .el-col-4:first-child {
      padding-left: 0 !important;
    }
    .el-col-4:last-child {
      padding-right: 0 !important;
    }
    .grid-content {
      height: 138px;
      position: relative;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;

      p.name,
      span.name {
        position: absolute;
        top: 40px;
        left: 20px;
      }

      p.value {
        letter-spacing:2px;
        font-size: 22px;
        font-weight: bold;
        position: absolute;
        bottom: 40px;
        left: 20px;
      }

      span.percentage {
        position: absolute;
        top: 40px;
        right: 20px;
      }
    }

    .grid-content::before {
      content: "";
      width: 4px;
      height: 138px;
      position: absolute;
      left: 0px;
    }

    .total-people {
      background-color: #ffebef;
      overflow: hidden;

      .total-people-value-left {
        float: left;
      }

      .total-people-value-right {
        float: right;
        width: 48%;
        margin-top: 18px;
        margin-right: 20px;

        & > div:nth-last-child(1) {
          margin-top: 6px;
        }

        p {
          display: inline-block;
          width: calc(50% - 3px);
          border: 1px dashed #fd9eb1;
          font-size: 14px;
          background-color: #fff;
          padding: 4px;

          .num {
            display: inline-block;
          }

          &:nth-child(1) {
            margin-right: 3px;
          }

          &:nth-child(2) {
            margin-left: 3px;
          }
        }
      }
    }

    .total-people::before {
      background-color: #fd4e71;
    }
    
    .to-follow-up {
      background-color: #e0fffa;
    }

    .to-follow-up::before {
      background-color: #22c9af;
    }

    .lost-to-follow-up {
      background-color: #efeaff;
    }

    .lost-to-follow-up::before {
      background-color: #5a33e4;
    }

    .dead-patient {
      background-color: #c9c3e6;
    }

    .dead-patient::before {
      background-color: #62559d;
    }

    .relapsed-patients {
      background-color: #ffe9db;
    }

    .relapsed-patients::before {
      background-color: #e16a1a;
    }

    .stable-patient {
      background-color: #dbeeff;
    }

    .stable-patient::before {
      background-color: #2476c2;
    }
  }

  .echart-box {
    & > div {
      background-color: #fff;
      margin-top: 10px;
    }

    .echart-grid {
      .echart-tit {
        font-family: "PingFang SC Bold";
        position: relative;
        font-weight: bold;
        font-size: 16px;
        margin-top: 28px;
        margin-left: 23px;
        display: inline-block;
      }

      .select-box {
        margin-top: 25px;
      }

      .echart-tit::before {
        content: "";
        width: 4px;
        height: 16px;
        background-color: #2476c2;
        position: absolute;
        top: 3px;
        left: -7px;
      }

      .echart-container {
        width: 100%;
        height: 238px;
      }

      #geographicalDistribution,
      #xjMapEchart {
        height: 748px;
      }
      .regionValueBtn {
        position: absolute;
        top: 25px;
        left: 120px;
      }

      &.el-col-12 {
        .echart-container {
          width: 100%;
          height: 436px;
        }
      }
    }
  }
}
</style>
