<template>
  <div class="lostpatientscontent content">
    <div class="page-search">
      <el-form
        :inline="true"
        :model="searchForm"
        class="demo-form-inline searchformFirst"
      >
        <el-form-item>
          <el-input
            class="lg-input"
            size="mini"
            v-model="searchForm.keyword"
            placeholder="搜索患者姓名、手机号、病案号、主要诊断"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            class="marginl24_qx"
            v-model="searchForm.hospitalName"
            clearable
            filterable
            size="mini"
            placeholder="选择医院"
          >
            <el-option
              v-for="(item, index) in hospitalList"
              :label="item.hospitalName"
              :value="item.hospitalName"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            size="mini"
            v-model="searchForm.daterange"
            type="daterange"
            unlink-panels
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            size="mini"
            class="marginl24_qx"
            type="primary"
            icon="el-icon-search"
            @click="seacherClick"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="page-table">
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
          width="100"
        ></el-table-column>
        <el-table-column
          prop="patientName"
          align="center"
          label="姓名"
          width="80"
        ></el-table-column>
        <el-table-column prop="sex" align="center" label="性别" width="50">
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
          width="50"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          align="center"
          label="手机号"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="diseaseName"
          align="center"
          label="病种"
          min-width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" width="110" label="确诊日期">
          <template slot-scope="scope">
            <span>{{ scope.row.firstConfirmDate | dateFilters }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="icd10Name1"
          align="center"
          label="主要诊断"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <!-- <el-table-column prop="description" align="center" label="病理诊断"></el-table-column> -->
        
        <el-table-column align="center" width="110" label="最后接触时间">
          <template slot-scope="scope">
            <span>{{ scope.row.lastContactTime | dateFilters }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastContactType"
          align="center"
          width="110"
          label="最后接触类型"
        ></el-table-column>
        <el-table-column
          prop="lastContactResult"
          align="center"
          width="110"
          label="最后接触结果"
        ></el-table-column>
        <el-table-column align="center" label="最近随访时间" width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.lastFollowTime | dateFilters }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastFollowResult"
          align="center"
          label="最近随访结局"
          width="110"
        >
          <!-- <template slot-scope="scope">
            {{ followResult[scope.row.lastFollowResult] }}
          </template> -->
        </el-table-column>
        <el-table-column
          prop="hospitalName"
          align="center"
          label="来源医院"
          min-width="170"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="80" fixed="right" align="center">
          <template slot-scope="scope">
            <span class="operation-btn" @click="turnTab(scope.row)">查看</span>
            <!-- <span class="operation-btn" @click="revoke(scope.row)">撤销</span> -->
          </template>
        </el-table-column>
      </el-table>
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

    <!-- 编辑/新建弹窗 -->
    <el-dialog
      title="撤销失访"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
      @close="dialogClose"
    >
      <el-form :model="dataForm">
        <el-form-item class="label100" label="最近一次生存随访时间">
          <el-date-picker
            v-model="dataForm.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item class="label100" label="最近随访结局">
          <el-select
            v-model="dataForm.typeCode"
            placeholder="请选择最后随访结局"
            clearable
          >
            <el-option
              v-for="item in followUpType"
              :label="item.name"
              :value="item.code"
              :key="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onConfirm">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/utils/index.js";
import { getFindAllByTypeCode } from "@/api/user";
import { getPatientByRegister } from "@/api/patientManagement";
import { updatePatient } from "@/api/survivalFollowup";
import { registrationAllHospital } from "@/api/tumor/tumorFollowup";
export default {
  name: "TumorLostPatients",
  data() {
    return {
      patientsTotal: 0,
      searchForm: {
        keyword: "",
        followResult: "lost", //类型固定  lost
      },
      followResult: {},
      followUpType: [],
      tableData: [],
      loading: false,
      pageNum: 1, // 分页数据
      pageSize: 10, // 每页展示数量
      total: 0, // 总数

      dialogVisible: false, // 是否显示弹窗
      dataForm: {},
       hospitalList: [], // 医院列表 option
    };
  },
  watch: {},
  created() {
    this.getCode();
    this.seacherClick();
    this.registrationAllHospitalFn();
  },
  mounted() {},
  methods: {
      // 获取医院列表
    registrationAllHospitalFn() {
      registrationAllHospital()
        .then((res) => {
          this.hospitalList = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 上传成功
    handleSuccess(val) {
      this.$message.success(val.data);
      this.$refs.upload.clearFiles();
      this.seacherClick();
    },
    // 获取码值表
    getCode() {
      getFindAllByTypeCode({
        typeCode: "followResult",
      })
        .then((res) => {
          this.followUpType = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
      getFindAllByTypeCode({
        typeCode: "finish",
      })
        .then((res) => {
          this.followResult = res.data.reduce((t, e) => {
            t[e.code] = e.name;
            return t;
          }, {});
        })
        .catch((error) => {
          console.error(error);
        });
    },
    dateFormat(fmt, date) {
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString(), // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
          );
        }
      }
      return fmt;
    },
    // 查询
    seacherClick() {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        keyword: this.searchForm.keyword,
        followResult: this.searchForm.followResult, //类型固定  lost
        hospitalName: this.searchForm.hospitalName,
      };
      let sdate;
      let edate;
      if (this.searchForm.daterange && this.searchForm.daterange.length > 0) {
        sdate = this.dateFormat("YYYY-mm-dd", this.searchForm.daterange[0]);
        edate = this.dateFormat("YYYY-mm-dd", this.searchForm.daterange[1]);
      }
      if (sdate && edate) {
        params.updateTimePre = sdate;
        params.updateTimeSuf = edate;
      }
      this.loading = true;
      console.log(params, this.searchForm);
      getPatientByRegister(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.list;
          this.total = res.data.total;
          this.patientsTotal = res.data.total;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    //查看详情  jijw 新增
    turnTab(val) {
      this.$router.push({
        path: "/survival/patient/details",
        query: {
          id: val.id,
          name: val.name,
          diseaseId: val.diseaseID,
        },
      });
    },
    // 撤销
    revoke(row) {
      console.log(row);
      // this.dialogVisible = true;
      updatePatient({ patientId: row.id.toString() }).then((res) => {
        console.log("撤销", res);
        this.seacherClick();
      });
    },
    // 撤销确认
    onConfirm() {
      this.dialogVisible = false;
    },
    // 撤销提示框关闭
    dialogClose() {
      this.dialogVisible = false;
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.seacherClick();
    },
    // 页数按钮
    handleCurrentChange(val) {
      this.pageNum = val;
      console.log(`当前页: ${val}`);
      this.seacherClick();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
};
</script>

<style>
.lostpatientscontent .el-date-editor .el-range-separator {
  width: 10%;
}
</style>

<style lang="scss">
</style>
