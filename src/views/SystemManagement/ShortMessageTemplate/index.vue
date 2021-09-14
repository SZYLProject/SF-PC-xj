<template>
  <div class="content">
    <div class="page-search">
      <el-form
        :inline="true"
        :model="searchForm"
        class="demo-form-inline searchformFirst"
      >
        <el-form-item>
          <el-input
            size="mini"
            v-model="searchForm.title"
            placeholder="搜索短信模板"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            class="marginl24"
            v-model="searchForm.typeCode"
            clearable
            filterable
            size="mini"
            placeholder="选择类型"
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
            class="marginl24"
            type="primary"
            icon="el-icon-search"
            @click="seacherClick"
            >查询</el-button
          >
          <el-button
            size="mini"
            class="marginl24"
            type="primary"
            icon="el-icon-plus"
            @click="openModel"
            >新建</el-button
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
          prop="title"
          label="模板名称"
          width="240"
        ></el-table-column>
        <el-table-column
          prop="depart"
          label="科室名称"
          width="240"
        ></el-table-column>
        <el-table-column
          prop="typeName"
          label="随访类型"
          width="160"
        ></el-table-column>
        <el-table-column prop="content" label="模板内容" show-overflow-tooltip>
          <template slot-scope="scope">
            <div :title="scope.row.content">{{ scope.row.content }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.status === 1 ? "有效" : "无效" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template slot-scope="scope">
            <span
              v-if="scope.row.status === 1"
              class="operation-btn"
              @click="viewModel(scope.row)"
              >查看</span
            >
            <span
              v-if="scope.row.status === 1"
              class="operation-btn marginl24"
              @click="changeModel(scope.row)"
              >编辑</span
            >
            <span
              v-if="scope.row.status === 1"
              class="operation-btn marginl24"
              @click="offline(scope.row)"
              >下线</span
            >
            <span
              v-if="scope.row.status === 0"
              class="operation-btn"
              @click="delRow(scope.row)"
              >删除</span
            >
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
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-row class="inline-row dialog-form">
        <el-form :model="dataForm" ref="dataForm" size="mini">
          <!--   -->
          <el-form-item
            label="短信模板标题"
            prop="title"
            :rules="RULE.remark_string"
          >
            <el-input
              :disabled="dialogState"
              v-model="dataForm.title"
              placeholder="请输入模板标题"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="label100"
            label="随访方式"
            prop="typeCode"
            :rules="RULE.remark_string"
          >
            <el-select
              :disabled="dialogState"
              v-model="dataForm.typeCode"
              clearable
              filterable
              placeholder="请选择随访方式"
            >
              <el-option
                v-for="item in followUpType"
                :label="item.name"
                :value="item.code"
                :key="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="科室名称"
            class="label100"
            prop="depart"
            :rules="RULE.remark_string"
          >
            <!-- <el-input
              :disabled="dialogState"
              v-model="dataForm.depart"
              placeholder="请输入科室名称"
            ></el-input> -->
            <el-select
              v-model="dataForm.depart"
              :disabled="dialogState"
              placeholder="请输入科室名称"
            >
              <el-option
                v-for="item in departmentList"
                :key="item.deptName"
                :label="item.deptName"
                :value="item.deptName"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="短信内容"
            prop="content"
            :rules="RULE.remark_string"
          >
            <el-input
              :disabled="dialogState"
              type="textarea"
              v-model="dataForm.content"
              placeholder="请输入短信内容"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="label100"
            label="是否有效"
            prop="status"
            :rules="RULE.remark_Num"
          >
            <el-radio-group v-model="dataForm.status" :disabled="dialogState">
              <el-radio :label="1">有效</el-radio>
              <el-radio :label="0">无效</el-radio>
            </el-radio-group>
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
            @click="determine"
            >确 定</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getFindAllByTypeCode } from "@/api/user";
import { getUserDeptDic } from "@/api/survivalFollowup";
import {
  smsTemplateGetAll,
  smsTemplateAdd,
  smsTemplateUpdate,
  smsTemplateDel,
} from "@/api/shortMessageTemplate";
export default {
  name: "ShortMessageTemplate",
  data() {
    return {
      dialogState: false, // false 弹框可编辑 true 弹框不可编辑
      dialogTitle: "新建短信模板",
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
        status: 1,
      },
      followUpType: [],
      departmentList: [],
      tableData: [],
      loading: false,
      pageNum: 1, // 分页数据
      pageSize: 10, // 每页展示数量
      total: 0, // 总数
      dialogVisible: false, // 是否显示弹窗
    };
  },
  watch: {},
  created() {
    this.getCode();
    this.seacherClick();
    this.getProjectDeptDicFn(); // 科室
  },
  mounted() {},
  methods: {
    // 获取科室(暂定)
    getProjectDeptDicFn() {
      let dataV = {
        id: this.$route.query.id,
      };
      getUserDeptDic(dataV)
        .then((res) => {
          console.log(res, "科室");
          this.departmentList = res.data.department;
        })
        .catch((error) => {
          this.$message.error("获取失败");
        });
    },
    // 获取码值表
    getCode() {
      let data = {
        typeCode: "type",
      };
      getFindAllByTypeCode(data)
        .then((res) => {
          this.followUpType = res.data;
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
        title: this.searchForm.title,
        typeCode: this.searchForm.typeCode,
      };
      this.loading = true;
      console.log(params);
      smsTemplateGetAll(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.list;
          this.total = res.data.total;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 新增
    openModel() {
      this.dialogVisible = true;
      this.dialogState = false;
      this.dialogTitle = "新建短信模板";
      this.$nextTick(function () {
        (this.dataForm = {
          title: "",
          depart: "",
          typeCode: "",
          typeName: "",
          content: "",
          status: 1,
        }),
          this.$refs.dataForm.resetFields();
      });
    },
    // 查看
    viewModel(val) {
      this.dialogVisible = true;
      this.dialogState = true;
      this.dataForm = val;
      this.dialogTitle = "短信模板";
    },
    // 编辑
    changeModel(val) {
      this.dialogVisible = true;
      this.dialogState = false;
      this.dataForm = Object.assign({}, val);
      this.dialogTitle = "编辑短信模板";
    },
    //确定
    determine() {
      console.log(this.dataForm);
      // 新增
      if (this.dialogTitle === "新建短信模板") {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            smsTemplateAdd(this.dataForm)
              .then((res) => {
                this.$message.success("新增成功");
                this.seacherClick();
              })
              .catch((error) => {
                this.$message.error("新增失败");
              });
            this.dialogVisible = false;
          } else {
            this.$message.error("必填项不能为空");
          }
        });
      } else if (this.dialogTitle === "编辑短信模板") {
        smsTemplateUpdate(this.dataForm)
          .then((res) => {
            this.$message.success("更新成功");
            this.seacherClick();
            this.dialogVisible = false;
          })
          .catch((error) => {
            console.error(error);
            this.$message.error("更新失败");
          });
      } else {
        this.dialogVisible = false;
      }
    },
    // 下线
    offline(val) {
      let data = JSON.parse(JSON.stringify(val));
      data.status = 0;
      smsTemplateUpdate(data)
        .then((res) => {
          this.$message.success("下线成功");
          this.seacherClick();
        })
        .catch((error) => {
          console.error(error);
          this.$message.error("下线失败");
        });
    },
    // 删除
    delRow(val) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "delConfirm",
      })
        .then(() => {
          smsTemplateDel(val)
            .then((res) => {
              this.$message.success("删除成功");
              this.seacherClick();
            })
            .catch((error) => {
              console.error(error);
              this.$message.error("删除失败");
            });
        })
        .catch(() => {});
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
