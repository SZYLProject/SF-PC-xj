<template>
  <div class="content">
    <div class="page-search">
      <el-form
        :inline="true"
        :model="visitInline"
        class="demo-form-inline searchformFirst"
      >
        <el-form-item>
          <el-input
            size="mini"
            class="lg-input"
            v-model="visitInline.searchName"
            placeholder="请输入随访名称搜索"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            size="mini"
            v-model="visitInline.searchCode"
            placeholder="请选择类型"
            clearable
          >
            <el-option
              v-for="item in visitTypeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-search"
            @click="onCheckFn"
            >查询</el-button
          >
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="onAddFn"
            >新建</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="page-table">
      <el-table
        stripe
        v-loading="tableLoading"
        :data="tableData"
        border
        style="width: 99%"
      >
        <el-table-column
          prop="name"
          align="center"
          label="计划名称"
        ></el-table-column>
        <el-table-column
          prop="typeName"
          align="center"
          label="计划类型"
        ></el-table-column>
        <el-table-column
          prop="departmentName"
          align="center"
          label="所属科室"
        ></el-table-column>
        <el-table-column prop="status" align="center" label="状态">
          <template slot-scope="scope">
            <!-- <div @click.stop> -->
            <div>
              <el-popconfirm
                title="确定要切换状态吗？"
                @confirm="handleChangeStatus(scope.row)"
              >
                <!-- <span slot="reference" style="color:#2476C2;cursor:pointer;">{{scope.row.status===1 ? '启用' : '未启用'}}</span> -->
                <span
                  slot="reference"
                  style="color: #2476c2; cursor: pointer"
                  >{{
                    scope.row.status === 1
                      ? "使用"
                      : scope.row.status === 0
                      ? "未使用"
                      : "草稿"
                  }}</span
                >
              </el-popconfirm>
            </div>
            <!-- <span style="color: #2476c2; cursor: pointer">{{
              scope.row.status === 1
                ? "使用"
                : scope.row.status === 0
                ? "未使用"
                : "草稿"
            }}</span> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="创建时间"
        ></el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <!-- <span v-show="scope.row.status===0" class="operation-btn" @click="checkVisit(scope.row)">查看</span> -->
            <span
              v-show="scope.row.status === 0"
              class="operation-btn"
              @click="editVisit(scope.row)"
              >编辑</span
            >
            <span
              v-show="scope.row.status === 0"
              class="operation-btn"
              @click="designVisit(scope.row)"
              >详情</span
            >
            <span class="operation-btn" @click="copyVisit(scope.row)"
              >复制</span
            >
            <span
              v-show="scope.row.status === 0"
              class="operation-btn"
              @click="deleteVisitFn(scope.row)"
              >删除</span
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pages-modules">
        <el-pagination
          style="float: right"
          :total="currentPageTotal"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          background
        ></el-pagination>
      </div>
    </div>
    <!-- 编辑/新建弹窗 -->
    <el-dialog
      :title="textMap[dialogStatus] + '随访计划模板'"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
      @close="dialogClose"
    >
      <el-row class="inline-row dialog-form">
        <el-form :model="dataVisit" ref="dataVisit" size="mini">
          <el-form-item
            label="计划名称"
            prop="name"
            :rules="RULE.remark_string"
          >
            <el-input
              :disabled="dialogVisitDisabled"
              v-model="dataVisit.name"
              placeholder="请输入访视名称"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="label100"
            label="计划类型"
            prop="typeCode"
            :rules="RULE.remark_string"
          >
            <el-select
              :disabled="dialogVisitDisabled"
              v-model="dataVisit.typeCode"
              placeholder="请选择访视类型"
              clearable
            >
              <el-option
                v-for="item in visitTypeList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="label100"
            label="所属科室"
            prop="department"
            :rules="RULE.remark_string"
          >
            <el-select
              v-model="dataVisit.department"
              placeholder="请选择科室"
              clearable
            >
              <el-option
                v-for="item in departmentList"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-col class="dialog-footer">
          <el-button class="cancel-btn" @click="dialogVisible = false"
            >取 消</el-button
          >
          <el-button
            class="determine-btn marginl24"
            type="primary"
            @click="onConfirm"
            v-show="dialogStatus !== 'check'"
            >确 定</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getVisitList,
  getDepartments,
  getVisitItemInfo,
  getTypeList,
  saveVisit,
  copyVisit,
  deleteVisit,
  updateVisit,
  updateStatusVisit,
} from "../../../api/visitPlanManagement";
export default {
  name: "VisitManagement",
  data() {
    return {
      tableLoading: false,
      visitTypeList: [],
      dataVisit: {
        name: "",
        typeCode: "",
        department: "",
      },
      departmentList: [],
      visitInline: {
        searchName: "",
        searchCode: "",
      },
      activeName: "second",
      value1: "",
      tableData: [],
      // 分页数据
      currentPage: 1,
      currentPageSize: 10,
      currentPageTotal: 0,
      dialogVisitDisabled: false,
      dialogVisible: false, // 是否显示弹窗
      dialogStatus: "create",
      textMap: {
        update: "编辑",
        create: "新建",
        check: "查看",
      },
    };
  },
  created() {
    this.getTypeListFn();
    this.getVisitListFn();
    this.getDepartmentsFn();
  },
  methods: {
    // 获取类型列表
    getTypeListFn() {
      getTypeList()
        .then((res) => {
          console.log("getTypeList", res);
          this.visitTypeList = res.data;
        })
        .catch((error) => {
          console.error("getTypeList", error);
        });
    },
    // 获取科室列表
    getDepartmentsFn() {
      getDepartments()
        .then((res) => {
          console.log("getDepartments", res);
          this.departmentList = res.data.department;
        })
        .catch((error) => {
          console.error("getDepartments", error);
        });
    },

    //获取访视列表
    getVisitListFn() {
      const postData = {
        pageNum: this.currentPage,
        pageSize: this.currentPageSize,
        typeCode: this.visitInline.searchCode,
        name: this.visitInline.searchName,
      };
      this.tableLoading = true;
      getVisitList(postData)
        .then((res) => {
          console.log("getVisitList", res);
          this.tableData = res.data.records;
          this.currentPageTotal = res.data.total;
          this.tableLoading = false;
        })
        .catch((error) => {
          this.tableLoading = false;
          console.error("getVisitList", error);
        });
    },
    // 查看
    checkVisit(row) {
      this.dialogVisitDisabled = true;
      this.dialogStatus = "check";
      this.dataVisit.name = row.name;
      this.dataVisit.department = row.typeCode;
      this.dialogVisible = true;
    },
    // 编辑
    editVisit(row) {
      console.log(row);
      this.dialogStatus = "update";
      this.dataVisit.name = row.name;
      this.dataVisit.typeCode = row.typeCode;
      this.dataVisit.department = row.departmentId;
      // this.$set(this.dataVisit, "department", [
      //   row.hospitalId,
      //   row.departmentId,
      // ]);
      this.dialogVisible = true;
      //存储被编辑访视的id
      this.editVisitId = row.id;
    },
    // 删除
    deleteVisitFn(row) {
      console.log("row", row);
      const postData = {
        id: row.id,
      };
      deleteVisit(postData)
        .then((res) => {
          console.log("deleteVisit", res);
          this.getVisitListFn();
        })
        .catch((error) => {
          console.error("deleteVisit", error);
        });
    },
    //新建
    onAddFn() {
      // this.dataVisit = this.$options.data.call(this).dataVisit;
      this.dialogStatus = "create";
      this.dialogVisible = true;
       this.$nextTick(function () {
        this.$refs.dataVisit.resetFields();
      });
    },
    // 确认新建/编辑
    onConfirm() {
      this.$refs.dataVisit.validate((valid) => {
        if (valid) {
          const postData = {
            name: this.dataVisit.name,
            departmentId: this.dataVisit.department,
            departmentName: this.departmentList.filter(
              (_) => _.deptId === this.dataVisit.department
            )[0].deptName,
            // hospitalId: this.dataVisit.department[0],
            typeCode: this.dataVisit.typeCode,
            typeName: this.visitTypeList.filter(
              (_) => _.code === this.dataVisit.typeCode
            )[0].name,
          };
          console.log(197, postData);
          this.dialogStatus === "update" && (postData.id = this.editVisitId);
          this.dialogStatus === "create"
            ? saveVisit(postData)
                .then((res) => {
                  console.log("saveVisit", res);
                  this.getVisitListFn();
                  this.dialogVisible = false;
                })
                .catch((error) => {
                  console.error("saveVisit", error);
                })
            : updateVisit(postData)
                .then((res) => {
                  console.log("saveVisit", res);
                  this.getVisitListFn();
                  this.dialogVisible = false;
                })
                .catch((error) => {
                  console.error("saveVisit", error);
                });
        } else {
          this.$message.error("必填项不能为空");
        }
      });
    },
    //设计访视入口
    designVisit(row) {
      this.$router.push({
        name: "VisitPlanManagementDetails",
        query: {
          id: row.id,
          name: row.name,
          typeCode: row.typeCode,
        },
      });
    },
    //复制
    copyVisit(row) {
      const postData = {
        id: row.id,
      };
      copyVisit(postData)
        .then((res) => {
          console.log("copyVisit", res);
          this.getVisitListFn();
        })
        .catch((error) => {
          console.error("copyVisit", error);
        });
    },
    // 查询
    onCheckFn() {
      this.getVisitListFn();
    },
    //修改访视状态
    handleChangeStatus(data) {
      console.log(212, data);
      const postData = {
        status: data.status === 1 ? 0 : 1,
        id: data.id,
      };
      updateStatusVisit(postData)
        .then((res) => {
          console.log("updateStatusVisit", res);
          this.getVisitListFn();
          this.dialogVisible = false;
        })
        .catch((error) => {
          console.error("updateStatusVisit", error);
        });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    dialogClose() {
      this.dialogVisitDisabled = false;
    },
    handleClick(tab, event) {
      console.log(tab);
      console.log(event);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPageSize = val;
      this.getVisitListFn();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getVisitListFn();
    },
  },
};
</script>

<style lang="scss">
</style>
