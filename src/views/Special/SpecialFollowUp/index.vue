<template>
  <div class="content">
    <el-row class="num-nav">
      <el-col class="type-box" :span="4">
        <p class="type-title">
          项目总数
        </p>
        <p class="type-num" style="color: #2476c2; ">
          {{ totalAll }}
        </p>
      </el-col>
      <el-col class="type-box" :span="5">
        <p class="type-title">待审批</p>
        <p class="type-num color333333">{{ todoTotal }}</p>
      </el-col>
      <el-col class="type-box" :span="5">
        <p class="type-title">进行中</p>
        <p class="type-num color2476c2">{{ inTotal }}</p>
      </el-col>
      <el-col class="type-box" :span="5">
        <p class="type-title">已完成</p>
        <p class="type-num color46a28b">{{ finishTotal }}</p>
      </el-col>
      <el-col class="type-box" :span="5">
        <p class="type-title">已终止</p>
        <p class="type-num colore43f3f">{{ suspendTotal }}</p>
      </el-col>
    </el-row>
    <!-- <div class="clearfix num-nav">
      <div class="alltotal">
        <p class="type-title colorf5fafe">项目总数</p>
        <p class="type-num colorf5fafe">{{ totalAll }}</p>
      </div>
      <div class="type-box">
        <p class="type-title">未开始</p>
        <p class="type-num color333333">{{ todoTotal }}</p>
      </div>
      <div class="type-box">
        <p class="type-title">进行中</p>
        <p class="type-num color2476c2">{{ inTotal }}</p>
      </div>
      <div class="type-box">
        <p class="type-title">已完成</p>
        <p class="type-num color46a28b">{{ finishTotal }}</p>
      </div>
      <div class="type-box">
        <p class="type-title">已终止</p>
        <p class="type-num colore43f3f">{{ suspendTotal }}</p>
      </div>
    </div> -->
    <el-row>
      <el-col :span="24" class="interval15"></el-col>
    </el-row>
    <div class="page-search searchformFirst">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-input
            class="lg-input"
            size="mini"
            v-model="formInline.keywords"
            placeholder="搜索项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            size="mini"
            v-model="formInline.status"
            clearable
            filterable
            placeholder="项目状态"
          >
            <el-option
              v-for="item in projectStatus"
              :label="item.name"
              :value="item.code"
              :key="item.code"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-search"
            @click="projectFindAllProjectFn"
            >查询</el-button
          >
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="addProdectFn"
            >新增项目</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="page-form border-top">
      <div class="project-list clearfix" v-loading="listLoading">
        <div class="project-item" v-for="item in projectList" :key="item.id">
          <div class="project-state">
            <!-- 待审批   未发布     审批驳回   进行中   已终止       已完成 -->
            <!-- pending  approved  reject     in     suspend      finish -->
            <!-- 4         0         5          1       3             2  -->
            <div
              :class="[
                'tagz',
                'relative',
                item.status === '5' || item.status == '3'
                  ? 'reject'
                  : item.status === '0'
                  ? 'approved'
                  : item.status === '1'
                  ? 'in'
                  : item.status === '4'
                  ? 'pending'
                  : item.status == '2'
                  ? 'finish'
                  : '',
              ]"
            >
              <!-- {{ item.status }} -->
              {{ item.status | getStatus(that_) }}
              <span class="arrow"></span>
            </div>
          </div>
          <h4 class="title-ellipsis">{{ item.name }}</h4>
          <div class="project-content">
            <p>创建人：{{ item.createBy }}</p>
            <p>
              预计完成时间：
              <span>{{ item.planFinishTime }}</span>
            </p>
            <p>执行科室：{{ item.departmentName }}</p>
            <p>备注：</p>
          </div>
          <div class="project-number">
            <div>
              <p>应随访数</p>
              <p class="number">{{ item.patientNum }}</p>
            </div>
            <div>
              <p>随访中</p>
              <p class="number">{{ item.followingCount }}</p>
            </div>
            <div>
              <p>失访数</p>
              <p class="number">{{ item.lostCount }}</p>
            </div>
            <div>
              <p>已终止</p>
              <p class="number colore43f3f">{{ item.terminationCount }}</p>
            </div>
          </div>
          <div class="project-operation">
            <el-row>
              <el-col :span="8" class="operation">
                <div
                  :class="item.status != '1' ? 'disabledDiv' : ''"
                  @click="turnDetails(item)"
                >
                  项目详情
                </div>
              </el-col>
              <el-col :span="8" class="operation">
                <div @click="turnPlan(item)">访视计划</div>
              </el-col>
              <el-col :span="8" class="operation">
                <el-col :span="12" class="left-item" v-if="item.status == '0'">
                  <div @click="turnChange(item, '1')">发布</div>
                </el-col>
                <el-col :span="12" v-if="item.status == '0'">
                  <div @click="turnChangeEnd(item, '3')">终止</div>
                </el-col>
                <el-col :span="24" v-else>
                  <div
                    :class="item.status == '3' ? 'disabledDiv' : ''"
                    @click="turnChangeEnd(item, '3')"
                  >
                    终止
                  </div>
                </el-col>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="pages-modules">
        <el-pagination
          style="float: right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="pagesizes"
          :page-size="pageSize"
          :pager-count="7"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        ></el-pagination>
      </div>
    </div>

    <!-- 新增项目 -->
    <el-dialog
      title="新增项目"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-row>
        <el-form
          :model="dataForm"
          size="mini"
          class="select-tags-dataForm dialog-form"
          ref="dataForm"
        >
          <el-form-item
            prop="name"
            :rules="RULE.remark_string"
            label="项目名称"
          >
            <el-input
              v-model="dataForm.name"
              placeholder="请输入项目名称"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="patientNumber"
            :rules="RULE.remark_string"
            label="拟纳入患者数"
          >
            <el-input
              v-model="dataForm.patientNumber"
              placeholder="请输入拟纳入患者数"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="label100"
            prop="planFinishTime"
            :rules="RULE.remark_string"
            label="预计完成时间"
          >
            <el-date-picker
              v-model="dataForm.planFinishTime"
              type="datetime"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd hh:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            class="label100"
            prop="departmentId"
            :rules="RULE.remark_string"
            label="所属科室"
          >
            <el-select
              :disabled="true"
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

          <el-form-item class="label100" label="项目成员">
            <el-select
              v-model="personnelVal"
              multiple
              filterable
              placeholder="请选择"
              class="select-tags"
              :title="personnelVal"
            >
              <el-option
                v-for="item in personnelValList"
                :key="item.userItcode"
                :label="item.userName"
                :value="item.userItcode"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSumbit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/utils/index.js";
import { getFindAllByTypeCode } from "@/api/user";
import {
  getDepartments,
  getHospitalUsers,
  specialAddProject,
  postProjectAudit,
  projectFindAllProject,
  getProjectCountByDept,
} from "@/api/specialFollowUp";
export default {
  name: "SpecialFollowUp",
  data() {
    return {
      personnelVal: "",
      personnelValList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      that_: this,
      totalAll: 0,
      suspendTotal: 0,
      inTotal: 0,
      finishTotal: 0,
      todoTotal: 0,
      projectStatus: [],
      projectList: [],
      dataForm: {
        name: "",
        patientNumber: "",
        planFinishTime: "",
        departmentId: "",
      },
      formInline: {
        name: "",
        scopes: "",
      },
      departmentList: [],
      // 分页数据
      pageNum: 1, // 分页数据
      pageSize: 8, // 每页展示数量
      pagesizes: [9, 18, 27, 36],
      total: 0,
      dialogVisible: false, // 是否显示弹窗
      listLoading: false,
      screenWidth: document.body.clientWidth,
    };
  },
  filters: {
    getStatus(key, that_) {
      let status = "";
      let statusArr = that_.projectStatus.filter((_) => _.code === key);
      if (statusArr.length > 0) {
        status = statusArr[0].name;
      } else {
        status = "";
      }
      return status;
    },
  },
  watch: {},
  components: {},
  created() {
    this.getCode();
    this.getDepartmentsFn();
    this.getHospitalUsersFn();
    this.getProjectCountByDeptFn();
    if (this.screenWidth > 1600) {
      console.log(this.screenWidth, "> 1600");
      this.pageSize = 8;
      this.pagesizes = [8, 16, 24, 32];
      this.projectFindAllProjectFn();
    } else {
      console.log(this.screenWidth, "< 1600");
      this.pageSize = 9;
      this.pagesizes = [9, 18, 27, 36];
      this.projectFindAllProjectFn();
    }
  },
  mounted() {},
  destroyed() {},
  methods: {
    // 获取码值表 项目状态
    getCode() {
      let data = {
        typeCode: "project",
      };
      getFindAllByTypeCode(data)
        .then((res) => {
          console.log(res);
          this.projectStatus = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 项目统计
    getProjectCountByDeptFn() {
      getProjectCountByDept()
        .then((res) => {
          this.suspendTotal = res.data.suspendTotal;
          this.inTotal = res.data.inTotal;
          this.finishTotal = res.data.finishTotal;
          this.todoTotal = res.data.todoTotal;
          this.totalAll = res.data.total;
        })
        .catch((error) => {
          console.error("getFindPlanByTypesss", error);
        });
    },
    // 获取项目列表
    projectFindAllProjectFn() {
      const getdata = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.formInline.keywords,
        status: this.formInline.status,
      };
      this.listLoading = true;
      projectFindAllProject(getdata)
        .then((res) => {
          this.total = res.data.total;
          this.projectList = res.data.list;
          this.listLoading = false;
        })
        .catch((error) => {
          this.listLoading = false;
          console.error(error);
        });
    },
    // 新增项目
    addProdectFn() {
      this.dialogVisible = true;
      this.$nextTick(function () {
        this.$refs.dataForm.resetFields();
      });
      let userDeptName = JSON.parse(sessionStorage.getItem("userData"))
        .department;
      this.dataForm.departmentId = this.departmentList.filter(
        (_) => _.deptName === userDeptName
      )[0].deptId;
      this.personnelVal = [];
    },
    // 获取项目成员
    getHospitalUsersFn() {
      getHospitalUsers()
        .then((res) => {
          console.log("getHospitalUsers获取项目成员", res);
          this.personnelValList = res.data;
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

          let userDeptName = JSON.parse(sessionStorage.getItem("userData"))
            .department;
          this.departmentList = res.data.department;
          this.dataForm.departmentId = this.departmentList.filter(
            (_) => _.deptName === userDeptName
          )[0].deptId;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    // 确定添加项目
    addSumbit() {
      console.log(this.personnelVal);
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          console.log(this.dataForm.planFinishTime);
          const postData = {
            name: this.dataForm.name,
            departmentId: this.dataForm.departmentId,
            departmentName: this.departmentList.filter(
              (_) => _.deptId === this.dataForm.departmentId
            )[0].deptName,
            patientNumber: this.dataForm.patientNumber,
            planFinishTime: this.dataForm.planFinishTime,
            projectMembers: this.personnelVal.toString(),
          };
          specialAddProject(postData)
            .then((res) => {
              this.$message.success("新增成功");
              this.$router.push({
                name: "AddProject",
                query: {
                  id: res.data.id,
                  status: "新增",
                },
              });
            })
            .catch((error) => {
              this.$message.error("新增失败");
            });
          this.dialogVisible = false;
        } else {
          this.$message.error("必填项不能为空");
        }
      });
    },
    turnDetails(item) {
      if (item.status == "1") {
        this.$router.push({
          name: "SpecialFollowUpDetails",
          query: {
            id: item.id,
            statusName: this.projectStatus.filter(
              (key) => key.code === item.status
            )[0].name,
            status: item.status,
          },
        });
      }
    },
    turnPlan(item) {
      this.$router.push({
        path: "/special/addProject",
        query: {
          id: item.id,
          statusNum: item.status,
          status: this.projectStatus.filter(
            (key) => key.code === item.status
          )[0].name,
        },
      });
    },
    // 操作
    turnChange(item, val) {
      let data = {
        flag: val,
        projectId: item.id,
      };
      if (item.status != "3") {
        postProjectAudit(data)
          .then((res) => {
            console.log(res.data);
            this.$message.success("修改成功");
            this.projectFindAllProjectFn();
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    // 终止
    turnChangeEnd(item, val) {
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
            flag: val,
            projectId: item.id,
          };
          if (item.status != "3") {
            postProjectAudit(data)
              .then((res) => {
                console.log(res.data);
                this.$message.success("修改成功");
                this.projectFindAllProjectFn();
              })
              .catch((error) => {
                console.error(error);
              });
          }
        })
        .catch(() => {});
    },

    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.projectFindAllProjectFn();
    },
    // 页数按钮
    handleCurrentChange(val) {
      this.pageNum = val;
      this.projectFindAllProjectFn();
    },
  },
};
</script>

<style lang="scss" scoped>
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
.num-nav {
  height: 80px;
  background: #ffffff;
  .type-box {
    padding-left: 0;
  }
}

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
  // float: left;
  position: relative;
  text-align: center;
  padding-top: 14px;
  // padding: 14px 100px;
  height: 80px;
  .type-title {
    font-size: 14px;
  }
  .type-num {
    font-size: 24px;
    line-height: 42px;
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
.num-item {
  float: left;
  padding: 10px;
  color: #333333;
  text-align: left;
  margin-right: 50px;
  cursor: pointer;
}
.item-active {
  background: #2476c2;
  color: #f5fafe;
  text-align: center;
}

// 列表
.border-top {
  border-top: 1px solid #e8f1fa;
}
.project-list {
  min-height: 360px;
  padding: 0 20px;
  .project-item {
    float: left;
    width: 23.2%;
    min-width: 320px;
    margin-right: 20px;
    margin-top: 20px;
    padding: 50px 24px;
    position: relative;
    background: #ffffff;
    border: 1px solid #e5e5e5;
    .project-state {
      position: absolute;
      top: 12px;
      right: -8px;
      .tagz {
        width: 88px;
        height: 28px;
        padding-left: 12px;
        background: #2476c2;
        font-size: 14px;
        font-family: PingFang SC Medium, PingFang SC Medium-Medium;
        font-weight: 500;
        text-align: left;
        color: #f5fafe;
        line-height: 28px;
        .arrow {
          width: 0;
          height: 0;
          line-height: 0;
          border-right: 8px solid transparent;
          border-top: 4px solid #155692;
          top: 100%;
          right: 0px;
          position: absolute;
        }
      }
      .reject {
        background: #e43f3f;
        .arrow {
          border-top: 4px solid #9e4242;
        }
      }
      .approved {
        background: #999999;
        .arrow {
          border-top: 4px solid #343434;
        }
      }
      .finish {
        background: #46a28b;
        .arrow {
          border-top: 4px solid #23715e;
        }
      }
    }
    h4 {
      font-size: 16px;
      font-family: PingFang SC Bold, PingFang SC Bold-Bold;
      font-weight: 700;
      text-align: left;
      color: #333333;
      line-height: 24px;
      height: 48px;
    }
  }
  .project-content {
    margin-top: 10px;
    p {
      font-size: 14px;
      font-family: PingFang SC Medium, PingFang SC Medium-Medium;
      font-weight: 500;
      text-align: left;
      color: #666666;
      line-height: 24px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .project-number {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: 10px;
    p {
      font-size: 14px;
      font-family: PingFang SC Medium;
      font-weight: 500;
      color: #333333;
    }
    .number {
      height: 20px;
      color: #2476c2;
    }
  }
  .project-operation {
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 100%;
    height: 40px;
  }
  .operation {
    cursor: pointer;
    height: 40px;
    font-size: 14px;
    font-family: PingFang SC Bold, PingFang SC Bold-Bold;
    font-weight: 700;
    text-align: center;
    color: #333333;
    line-height: 36px;
    border-top: 1px solid #e5e5e5;
    border-right: 1px solid #e5e5e5;
    .left-item {
      height: 100%;
      border-right: 1px solid #e5e5e5;
    }
    .disabledDiv {
      cursor: not-allowed;
    }
  }
  .operation:last-child {
    border-right: none;
  }
  .project-item:hover {
    background: #ffffff;
    border: 1px solid #e5e5e5;
    box-shadow: 0px 0px 10px 0px rgba(30, 30, 30, 0.2);
    .operation {
      color: #2476c2;
    }
  }
}

@media screen and (max-width: 1666px) {
  .project-list .project-item {
    width: 31.2%;
  }
}
</style>
