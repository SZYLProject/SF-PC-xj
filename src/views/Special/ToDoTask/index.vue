<template>
  <div class="content">
    <div class="content-mainA">
      <div class="nav-herder marginb16">
        <div class="header-left">
          <div class="calendar-box">
            <el-calendar v-model="calendarvalue" :first-day-of-week="7">
              <template slot="dateCell" slot-scope="{ date, data }">
                <p
                  @click="pickClick2(data, date)"
                  :class="data.isSelected ? 'is-selected' : ''"
                >
                  <span v-if="data == calendarvalue"></span>
                  {{ data.day.split("-")[2] }}
                </p>
              </template>
            </el-calendar>
          </div>
          <el-row class="calendar-tags" :gutter="16">
            <el-col :span="12">
              <div class="tag tag1">
                <div class="tag1-num">38</div>
                <div>待随访提醒</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="tag tag2">
                <div class="tag2-num">0</div>
                <div>失访提醒</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="tag tag3">
                <div class="tag3-num">0</div>
                <div>自动结束随访提醒</div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="header-right">
          <div class="search-form">
            <div class="sign-tag">
              <span>专题随访待处理任务</span>
            </div>
            <div class="page-search searchformFirst">
              <el-form
                :inline="true"
                :model="searchForm"
                class="demo-form-inline"
                size="mini"
              >
                <el-form-item>
                  <el-input
                    class="lg-input2"
                    v-model="searchForm.name"
                    placeholder="请输入姓名、卡号或证件号码"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-select
                    v-model="searchForm.followUser"
                    clearable
                    filterable
                    placeholder="选择人员"
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
                    type="primary"
                    icon="el-icon-search"
                    @click="seacherClick"
                    >查询</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="search-list">
            <div class="page-table">
              <el-table stripe
                 v-loading="loading"
                :data="tableData"
                :default-sort="{ prop: 'date', order: 'descending' }"
                border
                style="width: 99%"
              >
                <el-table-column
                  prop="patientName"
                  align="center"
                  label="姓名"
                ></el-table-column>
                <el-table-column
                  prop="depart"
                  align="center"
                  label="随访人员"
                ></el-table-column>
                <el-table-column
                  prop="typeName"
                  align="center"
                  width="120"
                  label="最近随访时间"
                ></el-table-column>
                <el-table-column
                  prop="content"
                  align="center"
                  width="120"
                  label="下次随访时间"
                  show-overflow-tooltip
                ></el-table-column>
                <!-- <el-table-column prop="typeName"  align="center"  label="随访方式">
                  <template slot-scope="scope">
                    <span>
                      {{
                      scope.row.status === 1 ? "有效" : "无效"
                      }}
                    </span>
                  </template>
                </el-table-column>-->
                <el-table-column
                  prop="date"
                  sortable
                  align="center"
                  width="200"
                  label="距离下次随访截止时间"
                ></el-table-column>
                <el-table-column prop="status" align="center" label="操作" fixed="right" >
                  <template slot-scope="scope">
                    <span class="operation-btn" @click="toFollowUp(scope.row)">
                      去随访
                    </span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pages-modules right-pege">
                <el-pagination
                  style="float: right"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="pageNum"
                  :page-sizes="[5]"
                  :page-size="pageSize"
                  :pager-count="7"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                  background
                ></el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-table paddingtb24">
      <div class="sign-tag">
        <span>项目审核</span>
      </div>
      <el-table stripe
         class="margint24"
        v-loading="loading2"
        :data="tableData2"
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
        <el-table-column prop="status" align="center" label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status | getStatus(this) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="200">
          <template slot-scope="scope">
            <span class="operation-btn" @click="turnTab(scope.row)">审批</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages-modules">
        <el-pagination
          style="float: right"
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
          :current-page="pageNum2"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize2"
          :pager-count="7"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total2"
          background
        ></el-pagination>
      </div>
    </div>
    <!-- 编辑/新建弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { projectFindAllProject } from "@/api/projectAudit";
import { getFollowTaskByDate, getPatientTofollow } from "@/api/speciaToDoTask";
export default {
  name: "ToDoTask",
  data() {
    return {
      value1: "",
      toFollowTotal: "",
      lostTotal: "",
      calendarvalue: new Date(),
      searchForm: {
        title: "",
        typeCode: "",
      },
      followUpType: [],
      tableData: [],
      loading: false,
      // 分页数据
      pageNum: 1, // 分页数据
      pageSize: 5, // 每页展示数量
      total: 0, // 总数
      tableData2: [],
      loading2: false,
      // 分页数据
      pageNum2: 1, // 分页数据
      pageSize2: 5, // 每页展示数量
      total2: 0, // 总数
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
  created() {
    this.today();
    this.pendingSeacher();
    this.seacherClick();
  },
  methods: {
    // 去随访
    toFollowUp() {
      this.$router.push({
        name: "SpecialFollowUPdetailFU",
        query: {},
      });
    },
    // 代办患者随访查询
    seacherClick() {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.searchForm.name,
        followUser: this.searchForm.followUser,
      };
      getPatientTofollow(params)
        .then((res) => {
          this.tableData = res.data.list;
          this.total = res.data.total;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 待审核 审核
    pendingSeacher() {
      let params = {
        pageNum: this.pageNum2,
        pageSize: this.pageSize2,
        status: "pending",
      };
      // this.loading2 = true;
      projectFindAllProject(params)
        .then((res) => {
          this.tableData2 = res.data.list;
          this.total2 = res.data.total;
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
    pick(data) {
    },
    change(data) {
      console.log(data, "22");
    },
    pickClick(data) {
      console.log(data);
    },
    pickClick1(data) {
      console.log(data);
    },
    today() {
      let params = {
        dateTime: new Date(),
      };
      getFollowTaskByDate(params)
        .then((res) => {
          console.log(res);
          this.toFollowTotal = res.data.toFollowTotal;
          this.lostTotal = res.data.lostTotal;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    pickClick2(data, val) {
      console.log(data, val, this.calendarvalue);
      let params = {
        dateTime: this.calendarvalue,
      };

      getFollowTaskByDate(params)
        .then((res) => {
          console.log(res);
          this.toFollowTotal = res.data.toFollowTotal;
          this.lostTotal = res.data.lostTotal;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    handleClick(tab, event) {
      console.log(tab);
      console.log(event);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.seacherClick();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.seacherClick();
    },
    handleSizeChange2(val) {
      this.pageSize2 = val;
      this.pendingSeacher();
    },
    handleCurrentChange2(val) {
      this.pageNum2 = val;
      this.pendingSeacher();
      console.log(`当前页: ${val}`);
    },
  },
};
</script>

<style lang="scss">
.nav-herder {
  display: flex;
}
.header-left {
  width: 420px;
  padding: 0 16px 16px;
  background-color: #ffffff;
  .calendar-box {
    height: 342px;
    padding: 20px 0 0;
    .el-calendar-table {
      background: #e9f1f9;
    }
    .el-calendar-table td.is-selected {
      background-color: #e9f1f9;
    }
    .is-today .el-calendar-day p {
      height: 24px;
      width: 24px;
      color: white;
      border-radius: 15px;
      line-height: 26px;
      margin: 0 auto;
      margin-top: -6px;
      background-image: linear-gradient(to right, #2160dc, #4880f0);
    }
    .is-selected .el-calendar-day p {
      height: 24px;
      width: 24px;
      color: white;
      border-radius: 15px;
      line-height: 26px;
      margin: 0 auto;
      margin-top: -6px;
      background-image: linear-gradient(to right, #2160dc, #4880f0);
    }
    .el-calendar-table .el-calendar-day {
      height: 32px;
      text-align: center;
    }
    .el-calendar-table td {
      border: none;
    }
  }
}
.header-right {
  flex: 1;
  margin-left: 16px;
  background-color: #ffffff;
  .search-form {
    padding: 20px 20px 0;
    margin-bottom: 1px;
  }
  .search-list {
    padding: 20px 0 0;
    .right-pege {
      padding: 10px 20px 40px;
    }
  }
}

.calendar-tags {
  margin-bottom: 10px;
  .tag {
    margin-top: 16px;
    height: 40px;
    text-align: left;
    padding-left: 20px;
    font-size: 14px;
    font-family: PingFang SC Medium, PingFang SC Medium-Medium;
    font-weight: 500;
    div {
      display: inline-block;
    }
  }
  .tag1 {
    background: rgba(36, 118, 194, 0.2);
    border: 1px solid #2476c2;
    color: #2476c2;
    .tag1-num {
      text-align: center;
      width: 24px;
      height: 24px;
      background: #2476c2;
      color: #ffffff;
      font-size: 12px;
      margin-top: 7px;
      line-height: 23px;
      margin-right: 10px;
      border-radius: 50%;
    }
  }
  .tag2 {
    background: #ffffff;
    border: 1px solid #f06b00;
    color: #f06b00;
    .tag2-num {
      text-align: center;
      width: 24px;
      height: 24px;
      background: #f06b00;
      color: #ffffff;
      font-size: 12px;
      margin-top: 7px;
      line-height: 23px;
      margin-right: 10px;
      border-radius: 50%;
    }
  }
  .tag3 {
    background: #ffffff;
    border: 1px solid #999999;
    color: #999999;
    .tag3-num {
      text-align: center;
      width: 24px;
      height: 24px;
      background: #999999;
      color: #ffffff;
      font-size: 12px;
      margin-top: 7px;
      line-height: 23px;
      margin-right: 10px;
      border-radius: 50%;
    }
  }
}
</style>
