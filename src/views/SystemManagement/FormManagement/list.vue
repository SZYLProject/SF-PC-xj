<template>
  <div class="content">
    <div class="page-search">
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline searchformFirst"
      >
        <el-form-item>
          <el-input
            size="mini"
            class="lg-input"
            v-model="formInline.searchName"
            placeholder="请输入表单名称搜索"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            size="mini"
            v-model="formInline.searchCode"
            placeholder="请选择表单类型"
            clearable
          >
            <el-option
              v-for="item in formTypeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            size="mini"
            v-model="formInline.departmentName"
            placeholder="请选择所属科室"
            clearable
          >
            <el-option
              v-for="item in departmentList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
        :data="tableData"
        v-loading="listLoading"
        border
        style="width: 99%"
      >
        <el-table-column
          prop="name"
          align="center"
          label="表单名称"
        ></el-table-column>
        <el-table-column
          prop="createBy"
          align="center"
          label="创建人"
        ></el-table-column>
        <el-table-column
          prop="typeName"
          align="center"
          label="类型"
        ></el-table-column>
        <el-table-column
          prop="departmentName"
          align="center"
          label="所属科室"
        ></el-table-column>
        <el-table-column prop="status" align="center" label="状态">
          <template slot-scope="scope">
            <el-popconfirm
              title="确定要切换状态吗？"
              @confirm="handleChangeStatus(scope.row)"
            >
              <span slot="reference" style="color: #2476c2; cursor: pointer">{{
                scope.row.status === 1 ? "已使用" : "未使用"
              }}</span>
            </el-popconfirm>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="创建时间"
        ></el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <!-- <span v-show="scope.row.status===1" class="operation-btn" @click="checkForm(scope.row)">查看</span> -->
            <span
              v-show="scope.row.status === 1"
              class="operation-btn"
              @click="previewForm(scope.row)"
              >预览</span
            >
            <span
              v-show="scope.row.status === 0"
              class="operation-btn"
              @click="editForm(scope.row)"
              >编辑</span
            >
            <span
              v-show="scope.row.status === 0"
              class="operation-btn"
              @click="designForm(scope.row)"
              >设计</span
            >
            <span class="operation-btn" @click="copyForm(scope.row)">复制</span>
            <span
              v-show="scope.row.status === 0"
              class="operation-btn"
              @click="deleteFormFn(scope.row)"
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
    <div></div>
    <!-- 编辑/新建弹窗 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
      @close="dialogClose"
    >
      <el-form :model="dataForm" ref="dataForm" size="mini">
        <el-form-item
          class="label100"
          label="表单名称"
          prop="name"
          :rules="RULE.remark_string"
        >
          <el-input
            :disabled="dialogFormDisabled"
            v-model="dataForm.name"
            placeholder="请输入表单名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          class="label100"
          label="所属科室"
          prop="departmentName"
          :rules="RULE.remark_string"
        >
          <el-select
            v-model="dataForm.departmentName"
            placeholder="请选择所属科室"
            clearable
          >
            <el-option
              v-for="item in departmentList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          class="label100"
          label="表单类型"
          prop="typeCode"
          :rules="RULE.remark_string"
        >
          <el-select
            :disabled="true"
            v-model="dataForm.typeCode"
            placeholder="请选择表单类型"
            clearable
          >
            <el-option
              v-for="item in formTypeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
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
      </el-form>
    </el-dialog>
    <!-- 表单详情预览 -->
    <el-dialog
      :visible.sync="preDialogVisible"
      v-if="preDialogVisible"
      width="60%"
    >
      <div slot="title" style="text-align: center">{{ name }}</div>
      <PreviewForm :code="code" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="preDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PreviewForm from "@/components/previewForm.vue";
import { getProjectDeptDic } from "@/api/survivalFollowup";
import {
  getFormList,
  getFormItemInfo,
  getTypeList,
  saveForm,
  copyForm,
  deleteForm,
  updateForm,
  updateStatusForm,
} from "@/api/formManagement";
export default {
  name: "FormManagement",
  components: { PreviewForm },
  data() {
    return {
      listLoading: false,
      code: "",
      // 默认专题
      formTypeList: [
        {
          code: "special",
          id: 3,
          name: "专题随访",
          order: 3,
          status: 1,
          typeCode: "type",
          typeName: "随访类型",
        },
      ],
      departmentList: [],
      dataForm: {
        typeCode: "special",
      },
      formInline: {
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
      dialogFormDisabled: false,
      dialogVisible: false, // 是否显示弹窗
      preDialogVisible: false, //预览弹窗
      dialogStatus: "create",
      textMap: {
        update: "编辑表单",
        create: "新建表单",
        check: "查看表单",
      },
    };
  },
  watch: {},
  created() {
    this.getTypeListFn();
    this.getFormListFn();
    this.getProjectDeptDicFn();
  },
  mounted() {},
  destroyed() {},
  methods: {
    // 获取科室(暂定)
    getProjectDeptDicFn() {
      getProjectDeptDic()
        .then((res) => {
          console.log(res, "科室");
          this.departmentList = res.data;
        })
        .catch((error) => {
          this.$message.error("获取失败");
        });
    },
    // 获取类型列表
    getTypeListFn() {
      getTypeList()
        .then((res) => {
          console.log("getTypeList", res);
          this.formTypeList = res.data;

          this.dataForm.typeCode = "special";
        })
        .catch((error) => {
          console.error("getTypeList", error);
        });
    },
    //获取表单列表
    getFormListFn() {
      const postData = {
        pageNum: this.currentPage,
        pageSize: this.currentPageSize,
        typeCode: this.formInline.searchCode,
        name: this.formInline.searchName,
        departmentName: this.formInline.departmentName,
      };
      this.listLoading = true;
      getFormList(postData)
        .then((res) => {
          this.listLoading = false;
          console.log("getFormList", res);
          this.tableData = res.data.records;
          this.currentPageTotal = res.data.total;
        })
        .catch((error) => {
          console.error("getFormList", error);
        });
    },
    // 查看
    checkForm(row) {
      this.dialogFormDisabled = true;
      this.dialogStatus = "check";
      // this.dataForm.name = row.name;
      // this.dataForm.typeCode = row.typeCode;
      this.dataForm = row;
      this.dialogVisible = true;
    },
    //预览
    previewForm(row) {
      this.code = row.code;
      this.name = row.name;
      this.preDialogVisible = true;
    },
    // 编辑
    editForm(row) {
      this.dialogStatus = "update";
      // this.dataForm.name = row.name;
      // this.dataForm.typeCode = row.typeCode;
      this.dataForm = row;
      this.dialogVisible = true;
      //存储被编辑表单的id
      this.editFormId = row.pkId;
    },
    //复制
    copyForm(row) {
      console.log(row);
      copyForm({ id: row.pkId }).then((res) => {
        console.log("复制", res);
        this.getFormListFn();
      });
    },
    // 删除
    deleteFormFn(row) {
      console.log("row", row);
      const postData = {
        id: row.pkId,
      };
      deleteForm(postData)
        .then((res) => {
          console.log("deleteForm", res);
          this.getFormListFn();
        })
        .catch((error) => {
          console.error("deleteForm", error);
        });
    },
    //新建
    onAddFn() {
      this.dataVisit = this.$options.data.call(this).dataVisit;
      this.dataForm = Object.assign({}, {});
      this.dataForm.typeCode = "special";
      this.dialogStatus = "create";
      this.dialogVisible = true;
    },
    // 确认新建/编辑
    onConfirm() {
      const postData = {
        name: this.dataForm.name,
        departmentName: this.dataForm.departmentName,
        typeCode: this.dataForm.typeCode,
        typeName: this.formTypeList.filter(
          (_) => _.code === this.dataForm.typeCode
        )[0].name,
      };
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.dialogStatus === "update" && (postData.pkId = this.editFormId);
          this.dialogStatus === "create"
            ? saveForm(postData)
                .then((res) => {
                  console.log("saveForm", res);
                  this.getFormListFn();
                  this.dialogVisible = false;
                })
                .catch((error) => {
                  console.error("saveForm", error);
                })
            : updateForm(postData)
                .then((res) => {
                  console.log("saveForm", res);
                  this.getFormListFn();
                  this.dialogVisible = false;
                })
                .catch((error) => {
                  console.error("saveForm", error);
                });
        } else {
          this.$message.error("必填项不能为空");
        }
      });
    },
    //设计表单入口
    designForm(row) {
      this.$router.push({
        name: "FormManagementDesign",
        query: {
          code: row.code,
          name: row.name,
        },
      });
    },
    // 查询
    onCheckFn() {
      this.getFormListFn();
    },
    delData(car) {
      console.log(car);
    },
    cancelData(car) {
      console.log(car);
    },
    //修改表单状态
    handleChangeStatus(data) {
      console.log(212, data);

      const postData = {
        code: data.code,
        status: data.status === 1 ? 0 : 1,
        pkId: data.pkId,
      };
      updateStatusForm(postData)
        .then((res) => {
          console.log("saveForm", res);
          this.getFormListFn();
          this.dialogVisible = false;
        })
        .catch((error) => {
          console.error("saveForm", error);
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
      this.dialogFormDisabled = false;
    },
    handleClick(tab, event) {
      console.log(tab);
      console.log(event);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPageSize = val;
      this.getFormListFn();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getFormListFn();
    },
  },
};
</script>

<style lang="scss">
</style>
