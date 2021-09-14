<template>
  <div class="content">
    <div class="page-search">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline searchformFirst">
        <el-form-item>
          <el-input
            size="mini"
            v-model="searchForm.name"
            placeholder="搜索项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            class="marginl24_qx"
            v-model="searchForm.status"
            clearable
            filterable
            size="mini"
            placeholder="选择项目状态"
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
      </el-form>
    </div>
    <div class="page-table">
      <el-table stripe
         v-loading="loading"
        :data="tableData"
        border
        style="width: 99%"
      >
        <el-table-column
          prop="name"
          align="center"
          label="项目名称"
        ></el-table-column>
        <el-table-column
          prop="createBy"
          align="center"
          label="创建人"
        ></el-table-column>
        <el-table-column
          prop="departmentName"
          align="center"
          label="科室"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="创建时间"
        ></el-table-column>
        <el-table-column
          prop="patientNum"
          align="center"
          label="纳入患者数"
        ></el-table-column>
        <!-- <el-table-column prop="status" align="center" label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status | getStatus(this) }}</span>
          </template>
        </el-table-column> -->
          <el-table-column
          prop="statusName"
          align="center"
          label="状态"
        ></el-table-column>
        <el-table-column label="操作" fixed="right"  width="200"  align="center">
          <template slot-scope="scope">
            <span class="operation-btn" @click="turnDetails(scope.row)">详情</span>
            <span class="operation-btn" v-if="scope.row.status =='pending'" @click="turnTab(scope.row)">审批</span>
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
import { projectFindAllProject } from "@/api/projectAudit";
export default {
  name: "ProjectAudit",
  data() {
    return {
      searchForm: {
        title: "",
        typeCode: "",
      },
      dataForm: {
        title: "",
        depart: "",
        typeCode: "",
        typeName: "",
        content: "",
        status: "",
      },
      followUpType: [],
      tableData: [],
      loading: false,
      pageNum: 1, // 分页数据
      pageSize: 10, // 每页展示数量
      total: 0, // 总数
      dialogVisible: false, // 是否显示弹窗
    };
  },
  filters: {
    getStatus(key, that_) {
      let status = "";
      let followUpType = [
        {
          name: "待审批",
          code: "pending",
        },
        {
          name: "未发布",
          code: "approved",
        },
        {
          name: "审批驳回",
          code: "reject",
        },
        {
          name: "进行中",
          code: "in",
        },
        {
          name: "已终止",
          code: "suspend",
        },
        {
          name: "已完成",
          code: "finish",
        },
      ];
      let statusArr = followUpType.filter((_) => _.code === key);
      if (statusArr.length > 0) {
        status = statusArr[0].name;
      } else {
        status = "";
      }
      return status;
    },
  },
  watch: {},
  created() {
    this.getCode();
    this.seacherClick();
  },
  mounted() {},
  methods: {
    // 获取码值表
    getCode() {
      let data = {
        typeCode: "project",
      };
      getFindAllByTypeCode(data)
        .then((res) => {
          this.followUpType = res.data;
          console.log(this.followUpType);
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
        name: this.searchForm.name,
        status: this.searchForm.status,
      };
      this.loading = true;
      console.log(params);
      projectFindAllProject(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.list;
          this.total = res.data.total;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 审批跳转
    turnTab(val) {
      this.$router.push({
        path: "/manage/projectApproval",
        query: {
          id: val.id,
          name: val.name,
          status: val.status,
        },
      });
    },
    // 详情跳转
    turnDetails(val){
      this.$router.push({
        path: "/manage/projectApproval",
        query: {
          id: val.id,
          name: val.name,
          status: val.status,
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
