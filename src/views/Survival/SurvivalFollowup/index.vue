<template>
  <div class="content">
    <el-row class="num-nav">
      <el-col :span="3" class="type-box">
        <p class="type-title" >项目总数</p>
        <p class="type-num color333333" style="color:#2476c2;">{{ totalNum }}</p>
      </el-col>
      <el-col :span="3" class="type-box">
        <p class="type-title">回顾性随访</p>
        <p class="type-num color333333" style="color:#5e43c1;">{{ afNum }}</p>
      </el-col>
      <el-col :span="3" class="type-box">
        <p class="type-title">前瞻性随访</p>
        <p class="type-num color333333" style="color:#5e43c1;">{{ beNum }}</p>
      </el-col>
      <el-col :span="3" class="type-box">
        <p class="type-title">未开始</p>
        <p class="type-num color333333">{{ nostartNum }}</p>
      </el-col>
      <el-col :span="3" class="type-box">
        <p class="type-title">进行中</p>
        <p class="type-num color2476c2">{{ startedNum }}</p>
      </el-col>
      <el-col :span="3" class="type-box">
        <p class="type-title">已完成</p>
        <p class="type-num color46a28b">{{ endingNum }}</p>
      </el-col>
      <el-col :span="3" class="type-box">
        <p class="type-title">已终止</p>
        <p class="type-num colore43f3f">{{  endNum}}</p>
      </el-col>
    </el-row>
    <div class="page-search">
      <el-form
        :inline="true"
        :model="searchForm"
        class="demo-form-inline searchformFirst"
      >
        <el-form-item>
          <el-input
            size="mini"
            v-model="searchForm.name"
            placeholder="搜索项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            size="mini"
            v-model="searchForm.status"
            clearable
            filterable
            placeholder="选择状态"
          >
            <el-option
              v-for="item in statusList"
              :label="item.name"
              :value="item.code"
              :key="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            size="mini"
            v-model="searchForm.type"
            clearable
            filterable
            placeholder="选择随访类型"
          >
            <el-option
              v-for="item in typeList"
              :label="item.name"
              :value="item.code"
              :key="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            class="marginl24"
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="liveFindAllProjectFn"
            >查询</el-button
          >
          <el-button
            class="marginl24"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            v-show="operation===0"
            @click="openModel"
            >新建</el-button
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
          align="center"
          prop="name"
          show-overflow-tooltip
          label="项目名称"
        ></el-table-column>
        <el-table-column align="center" prop="depart" label="项目类型">
          <template slot-scope="scope">
            <span>{{ scope.row.type === "review" ? "回顾" : "前瞻" }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="wait" label="项目状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">未开始</span>
            <span v-if="scope.row.status == 1">进行中</span>
            <span v-if="scope.row.status == 2">已完成</span>
            <span v-if="scope.row.status == 3">已终止</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="percent"
          label="完成度"
          width="240"
        >
          <template slot-scope="scope">
            <el-progress v-if="scope.row.type === 'review' && scope.row.status !== '0'" :percentage="scope.row.percent"></el-progress>
            <span v-else>- -</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="patientNum"
          label="应随访人数"
        >
          <template slot-scope="scope">
            {{scope.row.status === '0' ? '-' : scope.row.patientNum}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="wait"
          label="待随访人数"
        >
          <template slot-scope="scope">
            {{scope.row.status === '0'||scope.row.type !== "review" ? '-' : scope.row.wait}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="finish"
          label="已随访人数"
        >
          <template slot-scope="scope">
            {{scope.row.status === '0'||scope.row.type !== "review" ? '-' : scope.row.finish}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="temp"
          label="暂存人数"
        >
          <template slot-scope="scope">
            {{scope.row.status === '0'||scope.row.type !== "review" ? '-' : scope.row.temp}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="temp"
          label="有效随访率"
        >
          <template slot-scope="scope">
            {{scope.row.validpercent }}%
          </template>
        </el-table-column>

        
        <el-table-column align="center" label="操作" fixed="right"  width="200">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="项目详情"
              placement="top"
            >
              <i
                class="iconfont iconicon_xiangqing icon-custom list-item"
                @click.stop="viewDetails(scope.row)"
              ></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="随访方案"
              placement="top"
              v-show="operation===0&&scope.row.status!=2&&scope.row.status!=3"
            >
              <i
                class="iconfont iconicon_fangan icon-custom list-item"
                @click.stop="toPlanSetUp(scope.row)"
              ></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="终止项目"
              placement="top"
              v-show="operation===0&&scope.row.status!=3&&scope.row.status!=2"
            >
              <i
                class="iconfont iconicon_zhongzhi icon-custom list-item"
                @click.stop="turnChangeEnd(scope.row)"
              ></i>
            </el-tooltip>
            <!-- <el-tooltip
              class="item"
              effect="dark"
              content="数据导出"
              placement="top"
              v-show="operation===0"
            >
              <i
                class="iconfont icondownload icon-custom list-item"
                @click.stop="viewModel(scope.row)"
              ></i>
            </el-tooltip> -->
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
      <el-row class="inline-row">
        <el-form :model="dataForm" size="mini" class="dialog-form" ref="dataForm">
          <el-form-item
            label="项目名称"
            prop="name"
            :rules="RULE.remark_string"
          >
            <el-input
              v-model="dataForm.name"
              placeholder="请输入项目名称"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="label100"
            label="项目类型"
            prop="type"
            :rules="RULE.remark_string"
          >
            <el-select
              v-model="dataForm.type"
              clearable
              filterable
              placeholder="请选择项目类型"
            >
              <el-option
                v-for="item in typeList"
                :label="item.name"
                :value="item.code"
                :key="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="label100" v-if="false" label="所属科室">
            <el-select
              v-model="dataForm.departmentId"
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
            @click="determine"
            >确 定</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  liveFindByType,
  liveFindByStatus,
  liveFindAllProject,
  getDepartments,
  liveAddProject,
  liveUpdateStatus,
} from "@/api/survivalFollowup";

export default {
  name: "SurvivalFollowup",
  data() {
    return {
      afNum: 0,
      beNum: 0,
      totalNum: 0,
      endNum: 0,
      endingNum: 0,
      nostartNum: 0,
      startedNum: 0,
      departmentList: [],
      dialogState: false, // false 弹框可编辑 true 弹框不可编辑
      dialogTitle: "新建生存随访",
      searchForm: {},
      dataForm: {
        title: "",
        depart: "",
        typeCode: "",
        typeName: "",
        content: "",
        status: "",
      },
      operation: 0,
      followUpType: [],
      typeList: [
        {
          name: "前瞻",
          code: "prospect",
        },
        {
          name: "回顾",
          code: "review",
        },
      ],
      statusList: [
        {
          name: "未开始",
          code: "0",
        },
        {
          name: "进行中",
          code: "1",
        },
        {
          name: "已完成",
          code: "2",
        },
        {
          name: "已终止",
          code: "3",
        },
      ],
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
    this.liveFindByTypeFn();
    this.liveFindByStatusFn();
    this.liveFindAllProjectFn();
    this.getDepartmentsFn();
  },
  mounted() {},
  methods: {
    // 项目详情
    viewDetails(row) {
      // /survival/followup/details
      this.$router.push({
        path: "/survival/followup/details",
        query: { id: row.id, type: row.type, statusCode: row.status,statusName: row.statusName },
      });
    },
    // 随访方案
    toPlanSetUp(row) {
      console.log(row, "rowrowrow");
      localStorage.getItem('searchCondition') && localStorage.removeItem('searchCondition');
      this.$router.push({
        path: "/survival/planSetUp",
        query: { id: row.id, type: row.type, projectStatus:row.status },
      });
    },
    // 终止
    turnChangeEnd(row) {
      const confirmText = [
        "您确认是否需要终止本项目？",
        "已保存的随访结果不会受到影响，",
        "暂存结果的患者将释放随访状态,",
        "结果不会进行记录。",
      ];
      const newDatas = [];
      const h = this.$createElement;
      for (const i in confirmText) {
        newDatas.push(h("p", null, confirmText[i]));
      }
      this.$confirm("提示", {
        title: "提示",
        message: h("div", null, newDatas),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            status: "3",
            id: row.id,
          };
          liveUpdateStatus(data)
            .then((res) => {
              console.log(res.data);
              this.$message.success("终止成功");
              this.liveFindAllProjectFn();
              this.liveFindByStatusFn();
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch(() => {});
    },
    viewModel(row) {},
    //查询项目
    liveFindAllProjectFn() {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.searchForm.name,
        type: this.searchForm.type,
        status: this.searchForm.status,
      };
      this.loading = true;
      liveFindAllProject(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.list;
          this.total = res.data.total;
          this.operation = res.data.operation;
          console.log(res);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 项目随访类型数据
    liveFindByTypeFn() {
      liveFindByType()
        .then((res) => {
          this.afNum = res.data.af?res.data.af:0;
          this.beNum = res.data.be?res.data.be:0;
          this.totalNum = res.data.total?res.data.total:0;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 项目状态数据
    liveFindByStatusFn() {
      liveFindByStatus()
        .then((res) => {
          console.log('项目状态数据',res)
          this.endNum = res.data.end?res.data.end:0;
          this.endingNum = res.data.ending?res.data.ending:0;
          this.nostartNum = res.data.nostart?res.data.nostart:0;
          this.startedNum = res.data.started?res.data.started:0;
          console.log(res);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 获取科室列表
    getDepartmentsFn() {
      getDepartments()
        .then((res) => {
          console.log("getDepartments", res);
          // this.departmentList = res.data.department;
          this.departmentList = res.data.department;
        })
        .catch((error) => {
          console.error("getDepartments", error);
        });
    },
    // 新增
    openModel() {
      this.$refs['dataForm'] && this.$refs['dataForm'].resetFields();
      this.dialogVisible = true;
      this.dialogTitle = "新建生存随访";
      this.dataForm = {
        // title: "",
        // depart: "",
        // typeCode: "",
        // typeName: "",
        // content: "",
        // status: "",
      };
      localStorage.getItem('searchCondition') && localStorage.removeItem('searchCondition');
    },

    //确定
    determine() {
      // 新增
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const postData = {
            name: this.dataForm.name,
            type: this.dataForm.type,
            // departmentId: this.dataForm.departmentId,
            // departmentName: this.departmentList.filter(
            //   (_) => _.deptId === this.dataForm.departmentId
            // )[0].deptName,
          };
          liveAddProject(postData)
            .then((res) => {
              this.$message.success("新增成功");
              this.$router.push({
                path: "/survival/planSetUp",
                query: { id: res.data.id, type: res.data.type },
              });
            })
            .catch((error) => {
              this.$message.error("新增失败");
            });
          this.dialogVisible = false;
          // }
        } else {
          this.$message.error("必填项不能为空");
        }
      });
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.liveFindAllProjectFn();
    },
    // 页数按钮
    handleCurrentChange(val) {
      this.pageNum = val;
      console.log(`当前页: ${val}`);
      this.liveFindAllProjectFn();
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
.el-progress {
  width: 100%;
}
.colorf5fafe {
  color: #f5fafe;
}
.color333333 {
  color: #333333;
}
.color2476c2 {
  color: #2476c2;
}
.color46a28b {
  color: #46a28b;
}
.colore43f3f {
  color: #e43f3f;
}
.el-col-3 {
  width: 14%!important;
}
.num-nav {
  height: 80px;
  margin-bottom: 16px;
  background: #ffffff;
  .alltotal {
    // width: 80px;
    height: 80px;
    text-align: center;
    // background: #2476c2;
    background: #2F7E7D; // 主题修改yuwen
    float: left;
    font-family: PingFang SC Bold, PingFang SC Bold-Bold;
    font-weight: 700;
    padding-top: 12px;
    .type-title {
      font-size: 14px;
    }
    .type-num {
      font-size: 24px;
      line-height: 42px;
    }
  }
  .type-box {
    float: left;
    position: relative;
    padding: 14px 0px 14px 0px;
    height: 80px;
    .type-title {
      font-size: 14px;
      text-align: center;
    }
    .type-num {
      font-size: 24px;
      line-height: 42px;
      text-align: center;
    }
  }
  .type-box:after {
    content: "";
    position: absolute;
    width: 1px;
    height: 40px;
    background: #e5e5e5;
    top: 22px;
    right: 0;
  }
  .type-box:last-child:after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
  }
}
.list-item {
  font-size: 24px;
  color: #2F7E7D;
  margin: 0 10px;
  cursor: pointer;
}
// .list-item:hover {
//   color: #2476c2;
// }
.el-progress {
  .el-progress-bar {
    width: calc(100% - 50px);
  }
  .el-progress__text {
    // width:20%;
    width: 50px;
  }
}
</style>
