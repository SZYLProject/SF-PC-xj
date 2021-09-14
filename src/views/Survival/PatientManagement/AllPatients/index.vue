<template>
  <div class="content">
    <el-row class="nav-column">
      <el-col :span="4">
        <p>患者总数</p>
        <h5>{{ totalCount }}</h5>
      </el-col>
      <el-col :span="4">
        <p>待随访数</p>
        <h5>{{ toFollowCount }}</h5>
      </el-col>
      <el-col :span="4">
        <p>稳定患者</p>
        <h5>{{ stableCount }}</h5>
      </el-col>
      <!-- <el-col :span="4">
        <p>复发患者</p>
        <h5>{{ relapseCount }}</h5>
      </el-col> -->
      <el-col :span="4">
        <p>复发/转移</p>
        <h5>{{ relapseCount }}</h5>
      </el-col>
      <el-col :span="4">
        <p>失访患者</p>
        <h5>{{ lostCount }}</h5>
      </el-col>
      <el-col :span="4">
        <p>死亡患者</p>
        <h5>{{ deathCount }}</h5>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24" class="interval15"></el-col>
    </el-row>
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
            v-model="searchForm.followResult"
            clearable
            filterable
            size="mini"
            placeholder="选择随访结局"
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
          <el-button
            size="mini"
            class="marginl24_qx"
            type="primary"
            icon="el-icon-search"
            @click="seacherClick"
            >查询</el-button
          >
        </el-form-item>
        <!-- <el-form-item>
          <el-upload
            class="upload-demo marginl24_qx"
            :action="importApi"
            :on-success="handleSuccess"
            ref="upload"
            multiple
            :show-file-list="false"
            :limit="1"
          >
            <el-button size="mini" icon="el-icon-plus" type="primary">
              批量导入
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item class="vertical-bot">
          <a
            class="down-template marginl24_qx"
            :href="downloadExcel"
            download="模板下载.xlsx"
            title="下载"
          >
            模板下载
          </a>
        </el-form-item> -->
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
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="sex" align="center" label="性别" width="80">
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
          width="80"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          align="center"
          label="手机号"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="diseaseName"
          align="center"
          label="病种"
          min-width="140"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" width="120" label="确诊日期"
          ><template slot-scope="scope">
            <span>{{ scope.row.firstConfirmDate | dateFilters }}</span>
          </template></el-table-column
        >
        <el-table-column
          prop="icd10Name1"
          align="center"
          label="主要诊断"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <!-- <el-table-column prop="description" align="center" label="病理诊断"></el-table-column> -->
        <!-- <el-table-column
          prop="hospitalName"
          align="center"
          min-width="170"
          show-overflow-tooltip
          label="来源医院"
        ></el-table-column> -->
        <el-table-column align="center" width="120" label="最后接触时间">
          <template slot-scope="scope">
            <span>{{ scope.row.lastContactTime | dateFilters }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastContactType"
          align="center"
          width="120"
          label="最后接触类型"
        ></el-table-column>
        <el-table-column
          prop="lastContactResult"
          align="center"
          width="120"
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
          width="120"
        >
          <!-- <template slot-scope="scope">
            {{ followResult[scope.row.lastFollowResult] }}
          </template> -->
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right" align="center">
          <template slot-scope="scope">
            <span class="operation-btn" @click="turnTab(scope.row)">查看</span>
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
  </div>
</template>

<script>
import { getFindAllByTypeCode } from "@/api/user";
import {
  getPatientByClassify,
  getPatientAnalysis,
} from "@/api/patientManagement";
export default {
  name: "SurvivalAllPatients",
  data() {
    return {
      importApi: "",
      downloadExcel: "",
      patientsTotal: 0,
      searchForm: {
        keyword: "",
        followResult: "",
      },
      followResult: {},
      followUpType: [],
      tableData: [],
      loading: false,
      pageNum: 1, // 分页数据
      pageSize: 10, // 每页展示数量
      total: 0, // 总数
      deathCount: 0,
      lostCount: 0,
      relapseCount: 0,
      toFollowCount: 0,
      stableCount: 0,
      totalCount: 0,
      transferCount: 0,
    };
  },
  watch: {},
  created() {
    this.importApi = this.$ajax.defaults.baseURL + "/api/patient/import";
    this.downloadExcel =
      this.$ajax.defaults.baseURL + "/api/patient/downloadExcel";
    this.getCode();
    this.seacherClick();
    this.getStaticByClassifyFn();
  },
  mounted() {},
  methods: {
    getStaticByClassifyFn() {
      getPatientAnalysis()
        .then((res) => {
          console.log(res, "getPatientAnalysis");
          this.deathCount = res.data[0].death;
          this.lostCount = res.data[0].lost;
          this.relapseCount = res.data[0].relapse;
          this.toFollowCount = res.data[0].wait;
          this.stableCount = res.data[0].stable;
          this.totalCount = res.data[0].total;
          // this.transferCount = res.data.transferCount;  复发转移合并
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
    // 查询
    seacherClick() {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        keyword: this.searchForm.keyword,
        followResult: this.searchForm.followResult,
      };
      this.loading = true;
      console.log(params);
      getPatientByClassify(params)
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

    // 审批跳转
    turnTab(val) {
      this.$router.push({
        path: "/survival/patient/details",
        query: {
          id: val.id,
          name: val.name,
          diseaseId: val.diseaseID, // jijw 新增
        },
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

<style lang="scss">
</style>
