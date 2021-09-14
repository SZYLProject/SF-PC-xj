<template>
  <div class="lostpatientscontent content">
    <div class="page-search">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline searchformFirst">
        <el-form-item>
          <el-input class="lg-input" size="mini" v-model="searchForm.keyword" placeholder="搜索患者姓名、手机号、病案号、主要诊断"></el-input>
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
                 end-placeholder="结束日期">
               </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" class="marginl24_qx" type="primary" icon="el-icon-search" @click="seacherClick">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="page-table">
       <el-table stripe v-loading="loading" :data="tableData" border style="width: 99%;">
        <el-table-column prop="tpatno" align="center" label="病案号" width="100"></el-table-column>
        <el-table-column prop="patientName" align="center" label="姓名" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sex" align="center" label="性别" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.sex == 1">男</span>
            <span v-else-if="scope.row.sex == 2">女</span>
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column prop="age" align="center" label="年龄" width="80"></el-table-column>
        <el-table-column prop="mobile" align="center" label="手机号" width="120"></el-table-column>
        <el-table-column prop="diseaseName" align="center" label="病种"
            min-width="150"
            show-overflow-tooltip></el-table-column>
        <el-table-column align="center" width="120" label="确诊日期">
          <template slot-scope="scope">
                 <span>{{ scope.row.firstConfirmDate| dateFilters}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="icd10Name1" align="center" label="主要诊断" min-width="120" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="description" align="center" label="病理诊断"></el-table-column> -->
        <!-- <el-table-column prop="hospitalName" align="center" label="来源医院"
            min-width="170"
            show-overflow-tooltip></el-table-column> -->
        <el-table-column align="center" label="最后接触时间" width="120">
           <template slot-scope="scope">
            <span>{{ scope.row.lastContactTime | dateFilters }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastContactType" align="center" label="最后接触类型" width="120"></el-table-column>
        <el-table-column prop="lastContactResult" align="center" label="最后接触结果" width="120"></el-table-column>
        <el-table-column align="center" label="最近随访时间" width="120">
           <template slot-scope="scope">
            <span>{{ scope.row.lastFollowTime | dateFilters }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastFollowResult" align="center" label="最近随访结局" width="120">
        
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="80">
          <template slot-scope="scope">
            <span class="operation-btn" @click="turnTab(scope.row)">查看</span>
            <!-- <span class="operation-btn" @click="revoke(scope.row)">撤销</span> -->
          </template>
        </el-table-column>
      </el-table>
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
	
	<!-- 编辑/新建弹窗 -->
	<el-dialog title="撤销失访" :visible.sync="dialogVisible" width="40%" :before-close="handleClose" @close="dialogClose">
	  <el-form :model="dataForm">
	    <el-form-item class="label100" label="最近一次生存随访时间">
			<el-date-picker
				v-model="dataForm.date"
				type="date"
        value-format="yyyy-MM-dd"
				placeholder="选择时间">
			</el-date-picker>
	    </el-form-item>
	    <el-form-item class="label100" label="最近随访结局">
	      <el-select  v-model="dataForm.typeCode" placeholder="请选择最后随访结局" clearable>
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
import {getPatientByClassify } from "@/api/patientManagement";
import { updatePatient } from "@/api/survivalFollowup";
export default {
  name: "SurvivalLostpatients",
  data() {
    return {
      patientsTotal: 0,
      searchForm: {
        keyword: "",
        followResult: "lost",  //类型固定  lost
      },
      followResult: {},
      followUpType: [],
      tableData: [],
      loading: false,
      pageNum: 1, // 分页数据
      pageSize: 10, // 每页展示数量
      total: 0, // 总数
	  
	  dialogVisible: false, // 是否显示弹窗
	  dataForm:{},
    };
  },
  watch: {},
  created() {
    this.getCode();
    this.seacherClick();
  },
  mounted() {},
  methods: {
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
          this.followResult = res.data.reduce((t,e) => {
            t[e.code] = e.name
            return t
          },{});
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
        followResult: this.searchForm.followResult,//类型固定  lost
      };
      this.loading = true;
      console.log(params,this.searchForm);
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
	revoke(row){ 
    console.log(row)
    // this.dialogVisible = true;
    updatePatient({ patientId: row.id.toString() }).then((res) => {
      console.log("撤销", res);
      this.seacherClick();
    });
	},
	// 撤销确认
	onConfirm(){
		this.dialogVisible = false;
	},
	// 撤销提示框关闭
	dialogClose(){
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
	.lostpatientscontent .el-date-editor .el-range-separator{
		width: 10%;
	} 
</style>

<style lang="scss">

</style>
