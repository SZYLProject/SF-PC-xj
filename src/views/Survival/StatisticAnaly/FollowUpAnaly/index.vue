<template>
  <div class="content" style="height: calc(100% - 32px);">
    <!-- 按随访人员统计工作量 -->
      <!-- 实际随访人次 -->
    <div class="analy-staff">
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
          class="md-select3"
          placeholder="请选择"
          multiple
          filterable
          size="mini"
        >
          <el-option
            v-for="item in analyList"
            :key="item.userCode"
            :label="item.userName"
            :value="item.userCode"
          ></el-option>
        </el-select>
      </div>
      <div class="analy-staff_time">
        <!-- @change="timeChange(1)" -->
        <el-date-picker
          v-model="staffSearchTime"
          ref="picker1"
          type="daterange"
          size="mini"
          align="right"
          :clearable="false"
          unlink-panels
          range-separator="-"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
      <div class="analy-staff_search">
        <el-button type="primary" size="mini" icon="el-icon-search"  @click="search(1)"
          >查询</el-button
        >
      </div>
    </div>
      <!-- 有效随访人次 -->
    <div class="analy-staff">
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
          class="md-select3"
          placeholder="请选择"
          multiple
          filterable
          size="mini"
        >
          <el-option
            v-for="item in analyList"
            :key="item.userCode"
            :label="item.userName"
            :value="item.userCode"
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
          :clearable="false"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
      <div class="analy-staff_search">
        <el-button type="primary" icon="el-icon-search"  size="mini" @click="search(3)"
          >查询</el-button
        >
      </div>
    </div>
    <!-- 按病种统计 -->
    <div class="analy-staff">
      <span class="analy-staff_title">按病种统计
        <span class="second-title"></span>
      </span>
      <div class="analy-staff_select" style="right:484px;">
        <!-- @visible-change="staffChangeValid" -->
        <el-select
          v-model="diseaseSelect"
          placeholder="请选择病种"
          filterable
          class="md-select3"
          :multiple-limit="5"
          :collapse-tags="diseaseSelect.length > 3"
          multiple
          size="mini"
        >
          <el-option
            v-for="item in diseaseList"
            :key="item.index"
            :label="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="analy-staff_select" style="right:286px;">
        <!-- @visible-change="staffChangeValid" -->
        <el-select
          v-model="diseaseValid"
          placeholder="请选择随访人员"
          filterable
          size="mini"
          style="width:80%;"
        >
          <el-option
            v-for="item in analyList"
            :key="item.userCode"
            :label="item.userName"
            :value="item.userName"
          ></el-option>
        </el-select>
      </div>
      <div class="analy-staff_time">
        <!-- @change="timeChangeValid(3)" -->
        <el-date-picker
          v-model="diseaseTime"
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
        <el-button type="primary" size="mini" icon="el-icon-search"  @click="getByDiseaseFn"
          >查询</el-button
        >
      </div>
      <div class="list-box">
         <el-table stripe v-loading="loading" :data="tableData" border class="disList two-lines">
          <el-table-column prop="name" align="center" label="病种"
            min-width="180"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="finish" align="center" width="140" label="随访患者总人数"></el-table-column>
          <el-table-column prop="totalTime" align="center" width="140" label="随访患者总人次"></el-table-column>
          <el-table-column prop="vaildTime" align="center" width="120" label="有效随访人次"></el-table-column>
          <el-table-column prop="vaildPercent" align="center" width="120" label="有效随访率" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.vaildPercent + '%'}}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="invaildTime" align="center" min-width="120"  label="无效随访人次"></el-table-column>
          <el-table-column prop="invaildPercent" align="center" min-width="120"  label="无效随访率" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.invaildPercent + '%'}}
            </template>
          </el-table-column> -->
          <el-table-column label="有效随访人次" align="center">
            <el-table-column align="center" width="50" label="小计" prop="vaildSub"></el-table-column>
            <el-table-column align="center" width="50" label="稳定" prop="stable"></el-table-column>
            <el-table-column align="center" width="50" label="复发" prop="relapse"></el-table-column>
            <el-table-column align="center" width="50" label="转移" prop="transfer"></el-table-column>
            <el-table-column align="center" width="50" label="死亡" prop="death"></el-table-column>
          </el-table-column>
          <el-table-column label="无效随访人次" align="center">
            <el-table-column align="center" width="50" label="小计" prop="invaildSub"></el-table-column>
            <el-table-column align="center" width="80" label="主动拒接" prop="active"></el-table-column>
            <el-table-column align="center" width="80" label="无人接听" prop="noEnd"></el-table-column>
            <el-table-column align="center" width="80" label="无法接通" prop="available"></el-table-column>
            <el-table-column align="center" width="80" label="拒绝随访" prop="rejection"></el-table-column>
            <el-table-column align="center" width="50" label="关机" prop="shutdown"></el-table-column>
            <el-table-column align="center" width="50" label="停机" prop="down"></el-table-column>
            <el-table-column align="center" width="50" label="空号" prop="empty"></el-table-column>
            <el-table-column align="center" width="80" label="号码错误" prop="wrong"></el-table-column>
            <el-table-column align="center" width="80" label="其他情况" prop="other"></el-table-column>
          </el-table-column>
          <el-table-column label="失访例数" width="80" align="center" prop="lost"></el-table-column>
        </el-table>
      </div>
      <div class="pages-modules">
        <el-pagination
          style="float:right"
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
    <!-- 按随访方式统计工作量 -->
    <div class="analy-staff">
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
          <!-- <el-radio label="sms">短信随访</el-radio> -->
        </el-radio-group>
      </div>
      <div class="analy-staff_select">
        <!-- @visible-change="typeStaffChange" -->
        <el-select
          v-model="typeSearchAnaly"
          :multiple-limit="5"
          :collapse-tags="typeSearchAnaly.length>3"
          class="md-select3"
          placeholder="请选择"
          multiple
          filterable
          size="mini"
        >
          <el-option
            v-for="item in analyList"
            :key="item.userCode"
            :label="item.userName"
            :value="item.userCode"
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
          :clearable="false"
          range-separator="-"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
      <div class="analy-staff_search">
        <el-button type="primary" size="mini" icon="el-icon-search"  @click="search(2)">查询</el-button>
      </div>
    </div>
    <!-- 按随访有效率 -->
    <div class="analy-staff">
      <span class="analy-staff_title">
        随访有效率统计<span class="second-title"></span>
      </span>
      <div id="dataTypeEchart" ref="dataTypeEchart" class="data_view-container"></div>
      <div class="analy-staff_radio">
        <!-- @change="typeChange" -->
        <el-radio-group v-model="dataTypeSearchAnaly" @change="dataTypeChange">
          <el-radio :label="1">按年</el-radio>
          <el-radio :label="2">按月</el-radio>
        </el-radio-group>
      </div>
      <div class="analy-staff_time">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-if="dataTypeSearchAnaly===1" style="width:220px;">
          <el-form-item prop="startYear">
            <el-col :span="11">
              <el-date-picker v-model="ruleForm.startYear" size="mini" type="year" placeholder="年份" format="yyyy" value-format="yyyy" style="width: 100%;"/>
            </el-col>
            <el-col style="padding:0 6px;" :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker v-model="ruleForm.endYear" size="mini" type="year" placeholder="年份" format="yyyy" value-format="yyyy" style="width: 100%;"/>
            </el-col>
          </el-form-item>
        </el-form>
        <!-- <div v-if="dataTypeSearchAnaly===1">
          <el-date-picker v-model="startYear" size="mini" type="year" placeholder="选择日期" format="yyyy" value-format="yyyy" style="width: 45%;"/>
          <span style="margin:0 6px;">-</span>
          <el-date-picker v-model="endYear" size="mini" type="year" placeholder="选择日期" format="yyyy" value-format="yyyy" style="width: 45%;"/>
        </div> -->
        <el-form :model="ruleFormMonth" :rules="rules" ref="ruleForm" v-else>
          <el-form-item prop="startYear">
            <el-date-picker
             style="width:200px;"
              v-model="ruleFormMonth.dataTypeSearchTime"
              ref="picker1"
              type="monthrange"
              size="mini"
              align="right"
              unlink-panels
              :clearable="false"
              range-separator="-"
              :value-format="dataTypeSearchAnaly === 1 ? 'yyyy' : 'yyyy-MM'"
              :format="dataTypeSearchAnaly === 1 ? 'yyyy' : 'yyyy-MM'"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="analy-staff_search">
        <el-button type="primary" size="mini" icon="el-icon-search"  @click="search(4)">查询</el-button>
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
  // downloadAnalyData,
  getByDisease,
  getByDiseaseList
} from "@/api/statisticAnaly";
import {getAnalyList,getAnalyData,downloadAnalyData,getInfoByCreateByVaild,exportByVaild} from "@/api/survivalAnaly";
export default {
  name: "StatisticalAnalysis",
  data() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
    const threeYearAgo = new Date();
    threeYearAgo.setTime(threeYearAgo.getTime() - 3600 * 1000 * 24 * 365 * 2);
    var validatePass = (rule, value, callback) => {
      if(this.dataTypeSearchAnaly===1){
        if (!value || !this.ruleForm.endYear) {
          callback(new Error('前后时间不可为空'));
        } else if (parseTime(value,'{y}') > parseTime(this.ruleForm.endYear,'{y}')) {
          callback(new Error('开始时间不可晚于结束时间'));
        } else {
          callback();
        }
      }
        callback();
    };
    return {
      ruleForm: {
        startYear: threeYearAgo,
        endYear: end,
      },
      rules: {
        startYear: [
          { validator: validatePass, trigger: 'change,blur' }
        ],
      },
      lostList: [
      ],
      tableData: [],
      loading: false,
      pageNum: 1, // 分页数据
      pageSize: 10, // 每页展示数量
      total: 0, // 总数
      analyList: [],
      diseaseList: [],
      staffSearchAnaly: [],
      staffSearchAnalyValid: [],
      diseaseSelect: [],
      diseaseValid: '',
      typeSearchAnaly: [],
      radioSearchAnaly: "telephone",
      dataTypeSearchAnaly: 1,
      staffSearchTime: [start, end],
      staffSearchTimeValid: [start, end],
      typeSearchTime: [start, end],
      ruleFormMonth:{
        dataTypeSearchTime: [threeYearAgo, end],
      },
      dateList: [threeYearAgo,start,end],
      diseaseTime: ['', ''],
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
    this.getAnalyListFn();
    this.getByDiseaseListFn();
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
    getByDiseaseListFn(){
      getByDiseaseList().then((res) => {
          this.diseaseList = res.data.reduce((t,e) => {
            t.push({value:e,label:e,index:e})
            return t;
          },[]);
      })
      .catch((error) => {
        console.error("getByDisease", error);
      });
    },
    
    //按病种统计
    getByDiseaseFn(){
      const postData = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        updateTimePre: parseTime(this.diseaseTime[0],"{y}-{m}-{d}") || '',
        updateTimeSuf: parseTime(this.diseaseTime[1],"{y}-{m}-{d}") || '',
        diseaseCodes: this.diseaseSelect,
        creates: this.diseaseValid,
      };
     
      this.loading = true
      getByDisease(postData).then((res) => {
          this.tableData = res.data.list;
          this.total = res.data.total;
          this.loading = false
          console.log('getByDisease',res)
      })
      .catch((error) => {
        console.error("getByDisease", error);
      });
    },
    // 获取人员列表
    getAnalyListFn() {
      getAnalyList()
        .then((res) => {
          this.analyList = res.data;
          // userItcode
          this.staffSearchAnalyValid = this.staffSearchAnaly = this.typeSearchAnaly = [this.analyList[0]?.userCode].filter(_ => _);
          this.getStaffData(1, this.staffInit);
          this.getStaffData(3, this.staffInitValid);
          this.getStaffData(2, this.typeInit);
          this.getStaffData(4, this.dataTypeInit);
          this.getByDiseaseFn();
        })
        .catch((error) => {
          console.error("getAnalyList", error);
        });
    },
    //按人员搜索
    staffChange(bool) {
      !bool && setTimeout(this.getStaffData(1, this.staffInit), 200);
    },
    // 时间方式切换时  清空
    dataTypeChange(val){
      if(val === 1){
        this.ruleForm.startYear = this.dateList[0];
        this.ruleForm.endYear = this.dateList[2];
        // this.dataTypeSearchTime = [this.dateList[0],this.dateList[2]];
      }
        this.ruleFormMonth.dataTypeSearchTime = [this.dateList[1],this.dateList[2]];
    },
    //查询
    search(type) {
      this.getStaffData(
        type,
        type === 1
          ? this.staffInit
          : type === 2
          ? this.typeInit
          : type === 3
          ? this.staffInitValid
          : this.dataTypeInit
      );
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
        ) || '';
        postData.updateTimeSuf = parseTime(
          this.staffSearchTime[1],
          "{y}-{m}-{d}"
        ) || '';
        postData.creates = this.staffSearchAnaly;
      } else if (type === 2) {
        postData.updateTimePre = parseTime(
          this.typeSearchTime[0],
          "{y}-{m}-{d}"
        ) || '';
        postData.updateTimeSuf = parseTime(
          this.typeSearchTime[1],
          "{y}-{m}-{d}"
        ) || '';
        postData.creates = this.typeSearchAnaly;
        postData.types = [this.radioSearchAnaly];
      } else if (type === 3) {
        postData.updateTimePre = parseTime(
          this.staffSearchTimeValid[0],
          "{y}-{m}-{d}"
        ) || '';
        postData.updateTimeSuf = parseTime(this.staffSearchTimeValid[1],"{y}-{m}-{d}") || '';
        postData.creates = this.staffSearchAnalyValid;
        postData.flag = 1;
      } else if (type === 4) {
        // console.log(parseTime(this.dataTypeSearchTime[0],postData.flag===1 ? "{y}" : "{y}-{m}"))
        postData.flag = this.dataTypeSearchAnaly;
        if(postData.flag===1){
          postData.updateTimePre = this.ruleForm.startYear;
          postData.updateTimeSuf = this.ruleForm.endYear;
        }else{
          postData.updateTimePre = this.ruleFormMonth.dataTypeSearchTime[0];
          postData.updateTimeSuf = this.ruleFormMonth.dataTypeSearchTime[1];
        }
        
      }
      // console.log(postData);
      type !== 4 &&
      (postData.createUsers = this[
        type === 1
          ? "staffSearchAnaly"
          : type === 2
          ? "typeSearchAnaly"
          : "staffSearchAnalyValid"
      ].reduce((t, e) => {
        t.push(this.analyList.filter((_) => _.userCode === e)[0].userName);
        return t;
      }, []));
      // console.log(postData);
      type === 4 ? 
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          getInfoByCreateByVaild(postData)
          .then((res) => {
            console.log(7979,res)
            if (res.data.length === 0) return false;
            let dataX = res.data[0].X;
            let dataY = res.data[0].Y;
            fn(dataX, dataY);
          })
        } else {
          console.error('error submit!!');
          return false;
        }
      }) :
      getAnalyData(postData)
        .then((res) => {
          if (res.data.length === 0){
            this.$message({
              message: '无随访数据，无法查询统计数据',
              type: 'warning'
            });
            return false
          };
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
                  });
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
                  this.analyList.filter((_) => _.userCode === e)[0].userName
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
                  this.analyList.filter((_) => _.userCode === e)[0].userName
                );
                return t;
              }, []),
              flag: 2,
              types: [this.radioSearchAnaly],
            }
          : type === 3
          ? {
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
                  this.analyList.filter((_) => _.userCode === e)[0].userName
                );
                return t;
              }, []),
              flag: 1,
            } : {
              //4  按年月
              // code......
              
            }
      type === 4 ? 
      exportByVaild({
        updateTimePre : String(typeof this.ruleFormMonth.dataTypeSearchTime[0]==='object' ? this.ruleFormMonth.dataTypeSearchTime[0].getFullYear() : this.ruleFormMonth.dataTypeSearchTime[0]),
        updateTimeSuf : String(typeof this.ruleFormMonth.dataTypeSearchTime[1]==='object' ? this.ruleFormMonth.dataTypeSearchTime[1].getFullYear() : this.ruleFormMonth.dataTypeSearchTime[1]),
        flag : this.dataTypeSearchAnaly
      }).then((res) => {
        const timeNow = parseTime(new Date(), "{y}{m}{d}{h}{i}{s}");
        var blob = new Blob([res], {type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",}); // 以二进制形式存储，并转化为xlsx类型的Excel
        var downloadElement = document.createElement("a");
        var href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = "生存随访随访情况分析按随访有效率统计" + timeNow + ".xlsx"; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      }) :
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
    staffInit(dataX, dataY, dataLegend) {
      this.$nextTick(() => {
        let _this = this;
        let staffChart = document.getElementById("workEchart");
        let staffEcharts = Echarts.init(staffChart);
        let option = {
          color: ["#c257f6", "#6f7de3", "#ffac34", "#50bb51", "#ff583a"],
          grid: {
            bottom: "10%",
            left: '5%',
            right: '5%'
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
              // myTool2: {
              //   show: true,
              //   title: "查询",
              //   icon:
              //     "path://M882.6369 904.308991 730.351542 708.192358c7.884574-6.656607 15.529695-13.647835 22.890336-21.0095 33.348526-33.350572 59.533908-72.194252 77.8296-115.453499 18.948561-44.803415 28.555359-92.378967 28.555359-141.40659 0-49.021483-9.607822-96.593965-28.556383-141.393287-18.295692-43.256176-44.481074-82.09781-77.828576-115.446335S681.053766 113.948215 637.797589 95.652524C592.99929 76.703963 545.429879 67.096141 496.409418 67.096141c-49.021483 0-96.593965 9.607822-141.394311 28.556383-43.256176 18.295692-82.098833 44.482097-115.446335 77.830623-33.348526 33.347502-59.533908 72.189136-77.830623 115.446335-18.948561 44.800345-28.556383 92.371804-28.556383 141.393287 0 49.027623 9.607822 96.603175 28.556383 141.40659 18.295692 43.259246 44.481074 82.10395 77.8296 115.453499 33.347502 33.349549 72.189136 59.536978 115.446335 77.833693 44.800345 18.948561 92.371804 28.556383 141.394311 28.556383 49.019437 0 96.590895-9.608845 141.389194-28.557406 12.920264-5.465478 25.436322-11.649318 37.541011-18.502399l154.415882 198.860117c11.339256 14.603603 31.987528 17.545608 46.119387 6.572696l1.705851-1.325182C891.713626 939.6458 893.977179 918.912593 882.6369 904.308991zM496.409418 732.173538c-166.428473 0-301.82928-135.410016-301.82928-301.851792 0-166.428473 135.399783-301.828256 301.82928-301.828256 166.423357 0 301.818023 135.399783 301.818023 301.828256C798.228465 596.763522 662.832775 732.173538 496.409418 732.173538z",
              //   onclick: function () {
              //     _this.getStaffData(1, _this.staffInit);
              //   },
              // },
              // dataView: {
              //   show: true,
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
            left: '5%',
            right: '5%'
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
            left: '5%',
            right: '5%'
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
    // 随访有效率图表初始化
    dataTypeInit(dataX, dataY){
      this.$nextTick(() => {
        let _this = this;
        let staffChart = document.getElementById("dataTypeEchart");
        let staffEcharts = Echarts.init(staffChart);
        let option = {
          color: ["#c257f6", "#6f7de3", "#ffac34", "#50bb51", "#ff583a"],
          grid: {
            bottom: "10%",
            left: '5%',
            right: '5%'
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
                  _this.downloadChart(4);
                },
              },
            },
            top: 10,
            right: 40,
          },
          tooltip: {
            trigger: "axis",
            formatter: '{b}<br/>{c}%'
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
            max: 100,
            type: 'value',  
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
              show: true,  
              interval: 'auto',  
              formatter: '{value} %'  
            },  
            show: true  
          },
          series: [{
              data: dataY,
              type: 'line',
              smooth: true
          }],
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
      this.getByDiseaseFn();
    },
    // 页数按钮
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getByDiseaseFn();
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
    margin-left: 26px;

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
    left: 28%;
    width: 300px;
    top: 28px;
    & > div {
      width: 100%;
    }
  }
  .analy-staff_select {
    right: 325px;
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
/deep/ .el-tag--mini {
  padding: 0 10px!important;
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
