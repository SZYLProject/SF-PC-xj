<template>
  <div class="distribution-box">
    <div class="header-title">患者信息</div>
     <el-table stripe style="width: 99%" border :data="categoryList">
      <template v-for="(item, index) in categoryListHead">
        <el-table-column
          align="center"
          :prop="item.property"
          :label="item.name"
          :key="index"
        ></el-table-column>
      </template>
    </el-table>
    <div class="header-title margintb24">分配方式</div>
    <div>
      <el-radio-group v-model="distributionType">
        <el-radio :label="'average'">平均分配</el-radio>
        <el-radio :label="'disease'">按病种分配</el-radio>
        <el-radio :label="'department'">按科室分配</el-radio>
      </el-radio-group>
    </div>
    <div class="header-title margintb24">
      <span>随访人员</span>
      <el-button
        class="add-phone"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="backOn('随访人员')"
        >添加随访人员</el-button
      >
    </div>
    <div class="personnel-list">
      <ul>
        <li class="relative" v-for="(item, index) in tableData" :key="index">
          <el-row :gutter="10">
            <el-col :span="2" class="text-center">
              <span class="personnel-name">{{ item.userName }}</span>
            </el-col>
            <el-col :span="4">
              <div class v-if="distributionType == 'average'">
                <el-input
                  size="mini"
                  placeholder="请输入患者数量"
                  v-model="item.avgNum"
                  @input="inputOnInput($event)"
                ></el-input>
              </div>
              <div class v-else>
                <span>{{ item.avgNum }}</span>
              </div>
            </el-col>
            <el-col
              :span="18"
              class="personnel-tags"
              v-if="distributionType == 'average'"
            >
              <el-button
                class="del-phone"
                size="mini"
                type="primary"
                @click="delFitem(item)"
                >删除</el-button
              >
            </el-col>
            <el-col
              :span="18"
              class="personnel-tags"
              v-if="distributionType == 'disease'"
            >
              <el-tag
                :key="tagIndex"
                v-for="(tag, tagIndex) in item.checkedDiseases"
                closable
                size="medium"
                :disable-transitions="false"
                @close="handleCloseTagDiseases(tag, item)"
                >{{ tag.name }}</el-tag
              >
              <el-button
                class="add-phone"
                size="mini"
                type="primary"
                @click="chonse1('病种选择', item)"
                >选择病种</el-button
              >
            </el-col>
            <el-col
              :span="18"
              class="personnel-tags"
              v-if="distributionType == 'department'"
            >
              <el-tag
                :key="tagIndex"
                v-for="(tag, tagIndex) in item.checkedDepartment"
                closable
                size="medium"
                :disable-transitions="false"
                @close="handleCloseTag(tag, item)"
                >{{ tag.depart }}</el-tag
              >
              <el-button
                class="add-phone"
                size="mini"
                type="primary"
                @click="chonse1('科室选择', item)"
                >选择科室</el-button
              >
            </el-col>
          </el-row>
        </li>
      </ul>
    </div>
    <!-- <el-row :gutter="10">
      <el-col :span="24" class="text-center margintb24">
        <el-button type="primary" @click="handelBack">上一步</el-button>
        <el-button type="primary" @click="distributionClick">确认分配</el-button>
      </el-col>
    </el-row> -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <div v-if="dialogTitle == '随访人员'">
        <el-table stripe
           ref="multipleTable"
          :data="tableUserData"
          tooltip-effect="dark"
          style="width: 99%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="70"></el-table-column>
          <el-table-column prop="userName" label="姓名"></el-table-column>
        </el-table>

        <div class="pages-modules" v-if="false">
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
      <div v-if="dialogTitle == '病种选择'">
        <div>
          <el-row :gutter="10">
            <el-col :span="6">选择病种</el-col>
            <el-col :span="18">
              <div>
                <el-checkbox
                  :indeterminate="isIndeterminateDiseases"
                  v-model="checkAllDiseases"
                  :disabled="isCheckAllDiseases"
                  @change="handleCheckAllChangeDiseases"
                  >全选</el-checkbox
                >
                <span>
                  (已经选择
                  <span>{{ calculationBzVal.digits }}</span
                  >个科室，共
                  <span>{{ calculationBzVal.totalNum }}</span>
                  病人)
                </span>
              </div>
              <div>
                <el-checkbox-group
                  v-model="checkedDiseases"
                  @change="handlecheckedDepartmentChangeDiseases"
                >
                  <el-checkbox
                    v-for="(diseaseItem, index) in diseaseList"
                    :label="diseaseItem"
                    :disabled="
                      checkedDepartmentOtherDiseases.includes(diseaseItem)
                    "
                    :key="index"
                  >
                    <div>
                      <span>{{ diseaseItem.name }}</span>
                      <span class="marginl16">{{ diseaseItem.count }}</span>
                    </div>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-if="dialogTitle == '科室选择'">
        <div>
          <el-row :gutter="10">
            <el-col :span="6">选择科室</el-col>
            <el-col :span="18">
              <div>
                <el-checkbox
                  :indeterminate="isIndeterminate"
                  v-model="checkAll"
                  :disabled="isCheckAll"
                  @change="handleCheckAllChange"
                  >全选</el-checkbox
                >
                <span>
                  (已经选择
                  <span>{{ getTotalVal.digits }}</span
                  >个科室，共
                  <span>{{ getTotalVal.totalNum }}</span>
                  病人)
                </span>
              </div>
              <div>
                <el-checkbox-group
                  v-model="checkedDepartment"
                  @change="handlecheckedDepartmentChange"
                >
                  <el-checkbox
                    v-for="(departmentItem, index) in departmentList"
                    :label="departmentItem"
                    :disabled="checkedDepartmentOther.includes(departmentItem)"
                    :key="index"
                  >
                    <div>
                      <span>{{ departmentItem.depart }}</span>
                      <span class="marginl16">{{ departmentItem.count }}</span>
                    </div>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <el-row :gutter="10" class="margintb24 text-center">
        <el-col :span="24">
          <el-button size="mini" @click="dialogVisible = false">取消</el-button>
          <el-button size="mini" type="primary" @click="onConfirm"
            >确定</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBaseAllUsers,
  getLiveDiseases,
  getLiveDeparts,
  postAddAllocation,
} from "@/api/survivalFollowup";

import { getProjectDiseaseCount } from "@/api/specialFollowUp";
import { getFindAllByTypeCode } from "@/api/user";
export default {
  name: "TaskDistribution",
  components: {},
  data() {
    return {
      userMenu: [],
      dialogTitle: "科室选择",
      dialogVisible: false, // 是否显示弹窗
      categoryList: [], // 分类列表
      categoryListHead: [], // 分类列表
      distributionType: "average",
      tableData: [],
      tableUserData: [],
      // 已选随访人员
      multipleSelection: [],
      // 病种选择
      diseaseList: [], // 科室列表

      checkAllDiseases: false, //全选
      isCheckAllDiseases: false, //是否可以全选
      checkedDiseases: [], // 所有已经选择的病种
      checkedDepartmentOtherDiseases: [], // 除此员工以外所选科室
      isIndeterminateDiseases: true, // 实现全选的效果 非全选
      changeItemDiseases: {
        checkedDepartment: [],
      }, // 暂存当前人员
      // 科室选择
      departmentList: [], // 科室列表
      checkAll: false, //全选
      isCheckAll: false, //是否可以全选
      checkedDepartment: [], // 所有已经选择的科室
      checkedDepartmentOther: [], // 除此员工以外所选科室
      isIndeterminate: true, // 实现全选的效果 非全选
      changeItem: {
        checkedDepartment: [],
      }, // 暂存当前人员
      // 分页数据
      currentPage: 1,
      currentPageSize: 10,
      currentPageTotal: 30,
      getTotalVal: {},
      calculationBzVal: {},
    };
  },

  created() {
    this.getProjectDiseaseCountFn(); // 患者信息按病种
    this.getLiveDiseasesFn(); // 病种
    this.getLiveDepartsFn(); // 科室
    this.getBaseAllUsersFn();
    // this.getCode();
  },
  methods: {
    handelBack() {
      this.$parent.active = 2;
    },
    // 实时计算科室
    getTotal: function () {
      var _proList = this.changeItem.checkedDepartment;
      var total = 0;
      for (var i = _proList.length - 1; i >= 0; i--) {
        total += _proList[i].count;
      }

      this.getTotalVal = {
        digits: _proList.length,
        totalNum: total,
      };
    },
    // 实时计算病种
    calculationBz: function () {
      var _proList = this.changeItem.checkedDiseases;
      var total = 0;
      for (var i = _proList.length - 1; i >= 0; i--) {
        total += _proList[i].count;
      }
      this.calculationBzVal = {
        digits: _proList.length,
        totalNum: total,
      };
    },
    // 最终分配
    distributionClick() {
      let postData = {
        list: [],
      };
      this.tableData.forEach((item) => {
         if (item.avgNum != 0) {
        let obg = {
          projectId: this.$route.query.id,
          type: this.distributionType,
          userCode: item.userItcode,
          userName: item.userName,
          avgNum: item.avgNum,
          diseases: "",
          departments: "",
        };
        if (this.distributionType == "disease") {
          let diseaseStr = item.checkedDiseases.map((x) => {
            return x.disease;
          });
          obg.diseases = diseaseStr.join();
        }
        if (this.distributionType == "department") {
          let departmentsStr = item.checkedDepartment.map((x) => {
            return x.depart;
          });
          obg.departments = departmentsStr.join();
        }
        // let obg = {
        //   projectId: this.$route.query.id,
        //   type: this.distributionType,
        //   userCode: item.userItcode,
        //   userName: item.userName,
        //   avgNum: item.avgNum,
        //   diseases:
        //     this.distributionType == "disease"
        //       ? item.checkedDepartment.join()
        //       : "",
        //   departments:
        //     this.distributionType == "department"
        //       ? item.checkedDepartment.join()
        //       : "",
        // };
        postData.list.push(obg);}
      });
      console.log(this.tableData, "this.tableData", postData);
      postAddAllocation(postData)
        .then((res) => {
          this.$message.success("分配成功");
          this.$router.push({
            path: "/survival/index",
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 获取码值表
    getCode() {
      let data = {
        typeCode: "mode",
      };
      getFindAllByTypeCode(data)
        .then((res) => {
          console.log(res, "分配方式");
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 更新项目的患者   表格统计接口
    getProjectDiseaseCountFn() {
      let dataV = {
        projectId: this.$route.query.id,
      };
      getProjectDiseaseCount(dataV)
        .then((res) => {
          // this.categoryList = res.data.map(x => {
          //   let aa = x.disease.toString();
          //   return { aa: x.count };
          // });
          this.categoryListHead = res.data.map((x) => {
            return { name: x.name, property: x.disease };
          });
          let diseaseArr = res.data.map((x) => {
            return x.disease;
          });
          let contArr = res.data.map((x) => {
            return x.count;
          });

          var obj = {};
          for (var i = 0; i < diseaseArr.length; i++) {
            obj[diseaseArr[i]] = contArr[i];
          }

          this.categoryList.push(obj);
        })
        .catch((error) => {
          this.$message.error("获取失败");
        });
    },
    // 获取随访人员
    getBaseAllUsersFn() {
      let dataV = {
        id: this.$route.query.id,
      };
      getBaseAllUsers(dataV)
        .then((res) => {
          this.tableUserData = res.data;
          this.tableUserData.forEach((element) => {
            element["checkedDepartment"] = [];
            element["checkedDiseases"] = [];
            element["avgNum"] = 0;
          });
          this.total = res.data.total;
        })
        .catch((error) => {
          this.$message.error("获取失败");
        });
    },
    // 平均分配
    average(list, total, num) {
      let a = (total / num) | 0;
      let b = total % num;
      let i = -1;

      while (++i < num) {
        list[i]["avgNum"] = +(i < b) + a;
      }
      return list;
    },
    // 获取病种
    getLiveDiseasesFn() {
      let dataV = {
        id: this.$route.query.id,
      };
      getLiveDiseases(dataV)
        .then((res) => {
          console.log(res, "病种");
          this.diseaseList = res.data;
        })
        .catch((error) => {
          this.$message.error("获取失败");
        });
    },
    // 获取科室
    getLiveDepartsFn() {
      let dataV = {
        id: this.$route.query.id,
      };
      getLiveDeparts(dataV)
        .then((res) => {
          console.log(res, "科室");
          this.departmentList = res.data;
        })
        .catch((error) => {
          this.$message.error("获取失败");
        });
    },
    // 触发模态框    随访人员
    backOn(val) {
      this.dialogTitle = val;
      this.dialogVisible = true;
      this.multipleSelection = this.tableData;
      // this.multipleSelection = Object.assign([], this.tableData);
      // this.multipleSelection = JSON.parse(JSON.stringify(this.tableData));
      console.log("this.tableData", this.tableData);
      console.log("this.multipleSelection", this.multipleSelection);
    },
    // 人员选择
    handleSelectionChange(val) {
      console.log(this.multipleSelection);
      this.multipleSelection = val; // 随访人员选择
    },

    // 确定
    onConfirm() {
      this.dialogVisible = false;
      if (this.dialogTitle == "随访人员") {
        this.tableData = this.average(
          this.multipleSelection,
          this.categoryList[0].total,
          this.multipleSelection.length
        );
      } else if (this.dialogTitle == "科室选择") {
        this.changeItem.avgNum = this.getTotalVal.totalNum;
      } else {
        this.changeItem.avgNum = this.calculationBzVal.totalNum;
      }
    },
    // input可输入
    inputOnInput(e) {
      this.$forceUpdate();
    },
    // 平均分配删除
    delFitem(item) {
      console.log(this.tableData, "this.tableData", item);
      this.tableData.splice(this.tableData.indexOf(item), 1);
      this.tableData = this.average(
        this.multipleSelection,
        this.categoryList[0].total,
        this.multipleSelection.length
      );
    },
    //  科室标签 删掉
    handleCloseTag(tag, item) {
      this.changeItem = item;
      item.checkedDepartment.splice(item.checkedDepartment.indexOf(tag), 1);
      this.checkedDepartment.splice(
        this.checkedDepartment.findIndex((item) => item === tag),
        1
      );
      this.isIndeterminate = true;
      //  回显
      var _proList = this.changeItem.checkedDepartment;
      var total = 0;
      for (var i = _proList.length - 1; i >= 0; i--) {
        total += _proList[i].count;
      }
      this.changeItem.avgNum = total;
      this.getTotalVal.totalNum = total;
      this.getTotalVal.digits = _proList.length;
      // this.getTotal();
      // this.changeItem.avgNum = this.getTotalVal.totalNum;
    },
    // 病种标签 删掉
    handleCloseTagDiseases(tag, item) {
      this.changeItem = item;
      item.checkedDiseases.splice(item.checkedDiseases.indexOf(tag), 1);
      this.checkedDiseases.splice(
        this.checkedDiseases.findIndex((item) => item === tag),
        1
      );
      this.isIndeterminateDiseases = true;
      // this.calculationBz();
      // this.changeItem.avgNum = this.calculationBzVal.totalNum;
      var _proList = this.changeItem.checkedDiseases;
      var total = 0;
      for (var i = _proList.length - 1; i >= 0; i--) {
        total += _proList[i].count;
      }
      this.changeItem.avgNum = total;
      this.calculationBzVal.totalNum = total;
      this.calculationBzVal.digits = _proList.length;
    },
    //全选
    handleCheckAllChangeDiseases(val) {
      this.checkedDiseases = val ? JSON.parse(JSON.stringify(this.diseaseList)) : [];
      this.isIndeterminateDiseases = false;
      let firstList = this.checkedDepartmentOtherDiseases;
      let secondList = this.checkedDiseases;
      this.changeItem.checkedDiseases = secondList.filter(function (val) {
        return firstList.indexOf(val) === -1;
      });
    },
    //全选
    handleCheckAllChange(val) {
      this.checkedDepartment = val
        ? JSON.parse(JSON.stringify(this.departmentList))
        : [];
      this.isIndeterminate = false;
      let firstList = this.checkedDepartmentOther;
      let secondList = this.checkedDepartment;
      this.changeItem.checkedDepartment = secondList.filter(function (val) {
        return firstList.indexOf(val) === -1;
      });
    },
    //单个选择
    handlecheckedDepartmentChangeDiseases(value) {
      let checkedCount = value.length;
      this.checkAllDiseases = checkedCount === this.diseaseList.length;
      this.isIndeterminateDiseases =
        checkedCount > 0 && checkedCount < this.diseaseList.length;
      let firstList = this.checkedDepartmentOtherDiseases;
      let secondList = this.checkedDiseases;
      this.changeItem.checkedDiseases = secondList.filter(function (val) {
        return firstList.indexOf(val) === -1;
      });
      this.calculationBz();
    },
    //单个选择
    handlecheckedDepartmentChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.departmentList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.departmentList.length;
      let firstList = this.checkedDepartmentOther;
      let secondList = this.checkedDepartment;
      this.changeItem.checkedDepartment = secondList.filter(function (val) {
        return firstList.indexOf(val) === -1;
      });
      this.getTotal();
    },
    // 列表选择科室/病种
    chonse1(val, item) {
      this.dialogTitle = val;
      this.changeItem = item;
      this.dialogVisible = true;
      if (val == "科室选择") {
        this.checkedDepartmentOther = this.checkedDepartment.filter(function (
          val
        ) {
          return item.checkedDepartment.indexOf(val) === -1;
        });

        if (this.checkedDepartmentOther.length > 0) {
          this.isCheckAll = true;
        } else {
          this.isCheckAll = false;
        }
      } else {
        this.checkedDepartmentOtherDiseases = this.checkedDiseases.filter(function (
          val
        ) {
          return item.checkedDiseases.indexOf(val) === -1;
        });

        if (this.checkedDepartmentOtherDiseases.length > 0) {
          this.isCheckAllDiseases = true;
        } else {
          this.isCheckAllDiseases = false;
        }
      }
    },

    handleSizeChange(val) {
      this.currentPageSize = val;
      this.getBaseAllUsersFn();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getBaseAllUsersFn();
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
<style lang="scss" scoped>
.distribution-box {
  background: #ffffff;
  padding: 20px;
  .header-title {
    border-left: 3px solid #2476c2;
    padding-left: 16px;
    margin-bottom: 20px;
  }
  .add-phone {
    margin-left: 40px;
  }
  .personnel-list {
    padding: 0 24px;
    ul li {
      margin: 10px 0;
      .personnel-name {
        font-size: 14px;
        line-height: 28px;
      }
      .personnel-num {
        border: 1px solid #ddd;
        padding: 7px 15px;
        font-size: 12px;
      }
      .personnel-tags {
        .el-tag {
          margin-left: 12px;
        }
      }
      .del-phone {
        margin-left: 24px;
      }
    }
  }
}
</style>
