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
    <div class="header-title margintb24" style="display:none;">分配方式</div>
    <div style="display:none;">
      <el-radio-group v-model="distributionType" @change="typeChange">
        <el-radio :label="'average'">平均分配</el-radio>
        <el-radio :label="'disease'">按病种分配</el-radio>
        <el-radio :label="'department'">按科室分配</el-radio>
      </el-radio-group>
    </div>
    <div class="header-title margintb24">
      <span>随访人员:</span>
      <!-- <span style="padding-left:20px;">{{personName}}</span> -->
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
    <!-- <div class="personnel-list" style="display:none;"> -->
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
                @click="itemSelect('病种选择', item)"
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
                @click="itemSelect('科室选择', item)"
                >选择科室</el-button
              >
            </el-col>
          </el-row>
        </li>
      </ul>
    </div>
    <el-row :gutter="10">
      <el-col :span="24" class="text-center margintb24">
        <el-button type="primary" @click="onBack">上一步</el-button>
        <el-button type="primary" @click="distributionClick">确认分配</el-button>
      </el-col>
    </el-row>
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
                  :disabled="isCheckAllDiseases"
                  v-model="checkAllDiseases"
                  @change="handleCheckAllChangeDiseases"
                >
                  全选
                </el-checkbox>
                <el-checkbox
                  :indeterminate="ischeckboxDiseasesAllOther"
                  :disabled="isCheckboxDiseasesAllOtherDisabled"
                  v-model="checkboxDiseasesAllOther"
                  @change="handCheckboxDiseasesAllOther"
                  v-if="checkedDepartmentOtherDiseases.length != 0"
                >
                  选择剩余
                </el-checkbox>
                <span>
                  (已经选择
                  <span>{{ calculationBzVal.digits }}</span>
                  个病种，共
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
                  :disabled="isCheckAll"
                  v-model="checkAll"
                  @change="handleCheckAllChange"
                >
                  全选
                </el-checkbox>

                <el-checkbox
                  :indeterminate="ischeckboxDepartmentAllOther"
                  :disabled="isCheckboxDepartmentAllOtherDisabled"
                  v-model="checkboxDepartmentAllOther"
                  @change="handCheckboxDepartmentAllOther"
                  v-if="checkedDepartmentOther.length != 0"
                >
                  选择剩余
                </el-checkbox>
                <span>
                  (已经选择
                  <span>{{ getTotalVal.digits }}</span>
                  个科室，共
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
import Bus from "@/utils/bus.js";
import {
  getLiveInfoById,
  getBaseAllUsers,
  getLiveDiseases,
  getLiveDeparts,
  postAddAllocation,
} from "@/api/survivalFollowup";

import {
  getRegistrationLiveInfoById,
  registrationGetAllDiseases,
  registrationGetAllDepartment,
  postRegistrationAddAllocation,
  getRegisterUsers,
} from "@/api/tumor/tumorFollowup";

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
      diseaseList: [], // 所有病种
      checkAllDiseases: false, //全选病种
      isCheckAllDiseases: false, //是否可以全选 样式病种
      checkedDiseases: [], // 所有已经选择的病种
      checkedDepartmentOtherDiseases: [], // 除此员工以外所选病种
      isIndeterminateDiseases: true, // 实现全选的效果 非全选

      ischeckboxDiseasesAllOther: true, // 选择剩余病种 样式
      isCheckboxDiseasesAllOtherDisabled: false, //  禁用选择剩余病种
      checkboxDiseasesAllOther: false, // 选择剩余病种

      changeItemDiseases: {
        checkedDepartment: [],
      }, // 暂存当前人员

      // 科室选择
      departmentList: [], // 科室列表
      checkAll: false, //全选科室
      isCheckAll: false, //是否可以全选科室
      checkedDepartment: [], // 所有已经选择的科室
      checkedDepartmentOther: [], // 除此员工以外所选科室
      isIndeterminate: true, // 实现全选的效果 非全选科室

      ischeckboxDepartmentAllOther: true, // 选择剩余科室 样式
      isCheckboxDepartmentAllOtherDisabled: false, //  禁用选择剩余科室
      checkboxDepartmentAllOther: false, // 选择剩余科室

      changeItem: {
        checkedDepartment: [],
      }, // 暂存当前人员
      // 分页数据
      currentPage: 1,
      currentPageSize: 10,
      currentPageTotal: 30,
      getTotalVal: {},
      calculationBzVal: {},
      // personName: '',
      totelNum: 0,
    };
  },

  created() {
    this.getLiveInfoByIdFn();
    this.getLiveDiseasesFn(); // 病种
    this.getLiveDepartsFn(); // 科室
    this.getBaseAllUsersFn();
  },
  methods: {
    // 返回上一步
    onBack() {
      this.$parent.active--;
      this.$emit("filterClickCountChange");
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
    // 分配更改
    typeChange(val) {
      if (val == "average") {
        this.tableData = Object.assign(
          [],
          this.average(
            this.multipleSelection,
            this.categoryList[0].total,
            this.multipleSelection.length
          )
        );
      } else if (val == "disease") {
        this.tableData.map((item) => {
          item.avgNum = 0;
          item.checkedDepartment = [];
          item.checkedDiseases = [];
        });
        this.tableData = Object.assign([], this.tableData);
        this.checkAllDiseases = false;
        this.isCheckAllDiseases = false;
        this.checkedDiseases = [];
        this.checkedDepartmentOtherDiseases = [];
        this.isIndeterminateDiseases = true;
        this.changeItemDiseases = {
          checkedDepartment: [],
        };
      } else if (val == "department") {
        console.log(this.tableData, "department");
        this.tableData.map((item) => {
          item.avgNum = 0;
          item.checkedDepartment = [];
          item.checkedDiseases = [];
        });
        this.tableData = Object.assign([], this.tableData);
        this.checkAll = false;
        this.isCheckAll = false;
        this.checkedDepartment = [];
        this.checkedDepartmentOther = [];
        this.isIndeterminate = true;
        this.changeItem = {
          checkedDepartment: [],
        };
      }
    },
    // 最终分配
    distributionClick() {
      // 数量判断
      let lastNum = this.tableData.reduce((p, e) => p + Number(e.avgNum), 0);
      if (lastNum != this.categoryList[0].total) {
        this.$message.warning("请检查分配数量");
        return false;
      }
      let result_one = this.tableData.some(function (item) {
        if (item.avgNum == 0) {
          return true;
        }
      });
      if (result_one) {
        this.$message.warning("分配人员下随访人数不能分配为0");
        return false;
      }
      // console.log("上面验证通过");

      let postData = {
        list: [],
      };
      this.tableData.forEach((item) => {
        console.log('item',item)
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

        postData.list.push(obg);
      });
      console.log(postData)
      //更新项目的患者数量等信息接口  确认分配 肿瘤
      postRegistrationAddAllocation(postData)
        .then((res) => {
          this.$message.success("分配成功");
          this.$router.push({
            path: "/tumor/index",
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
    getLiveInfoByIdFn() {
      let dataV = {
        id: this.$route.query.id,
      };
      getRegistrationLiveInfoById(dataV)
        .then((res) => {
          this.categoryListHead = res.data.map((x) => {
            return { name: x.name, property: x.disease };
          });
          let diseaseArr = res.data.map((x) => {
            return x.disease;
          });
          let contArr = res.data.map((x) => {
            return x.count;
          });
          this.totelNum = res.data.filter(_ => _.disease==='total')[0].count;
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
        projectId: this.$route.query.id,
      };
      getRegisterUsers(dataV)
        .then((res) => {
          console.log('getBaseAllUsersFn',res)
          // this.tableData = res.data;
          // this.personName = res.data[0].userName;
          this.tableUserData = res.data;
          // this.tableUserData.forEach((element) => {
          //   element["checkedDepartment"] = [];
          //   element["checkedDiseases"] = [];
          //   element["avgNum"] = 0;
          // });
          // this.total = res.data.total;
        })
        .catch((error) => {
          this.$message.error("获取失败");
        });
      // getBaseAllUsers(dataV)
      //   .then((res) => {
      //     this.tableUserData = res.data;
      //     this.tableUserData.forEach((element) => {
      //       element["checkedDepartment"] = [];
      //       element["checkedDiseases"] = [];
      //       element["avgNum"] = 0;
      //     });
      //   })
      //   .catch((error) => {
      //     this.$message.error("获取失败");
      //   });
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
      registrationGetAllDiseases(dataV)
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
      registrationGetAllDepartment(dataV)
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
    },

    // 人员选择
    handleSelectionChange(val) {
      this.multipleSelection = val; // 随访人员选择
    },

    // 确定
    onConfirm() {
      this.dialogVisible = false;
      if (this.dialogTitle == "随访人员") {
        if (this.distributionType == "average") {
          console.log(555,this.categoryList)
          this.tableData = this.average(
            this.multipleSelection,
            this.categoryList.length===0 ? 0 : this.categoryList[0].total,
            this.multipleSelection.length
          );
          console.log(633,this.tableData)
        } else {
          this.tableData = this.multipleSelection;
          this.tableData.map((item) => {
            item.avgNum = 0;
            item.checkedDepartment = [];
            item.checkedDiseases = [];
          });
          // 重置已经选的的病种/科室
          this.tableData = Object.assign([], this.tableData);
          this.checkAllDiseases = false;
          this.isCheckAllDiseases = false;
          this.checkedDiseases = [];
          this.checkedDepartmentOtherDiseases = [];
          this.isIndeterminateDiseases = true;
          this.checkAll = false;
          this.isCheckAll = false;
          this.checkedDepartment = [];
          this.checkedDepartmentOther = [];
          this.isIndeterminate = true;
          this.changeItemDiseases = {
            checkedDepartment: [],
          };
        }
      } else if (this.dialogTitle == "科室选择") {
        this.changeItem.avgNum = this.getTotalVal.totalNum;
      } else {
        this.changeItem.avgNum = this.calculationBzVal.totalNum;
      }
      // if (this.dialogTitle == "随访人员") {
      //   if (this.distributionType == "average") {
      //     this.tableData = this.average(
      //       this.multipleSelection,
      //       this.categoryList[0].total,
      //       this.multipleSelection.length
      //     );
      //     // 未完善
      //   } else {
      //     this.tableData = this.multipleSelection;
      //   }
      // } else if (this.dialogTitle == "科室选择") {
      //   this.changeItem.avgNum = this.getTotalVal.totalNum;
      // } else {
      //   this.changeItem.avgNum = this.calculationBzVal.totalNum;
      // }
    },

    // input可输入
    inputOnInput(e) {
      this.$forceUpdate();
    },

    // 平均分配删除
    delFitem(item) {
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
      let departmentList_ = Object.assign([], this.departmentList);
      this.checkedDepartment.splice(
        this.checkedDepartment.findIndex((item) => item === tag),
        1
      );
      this.isIndeterminate = true;
      this.departmentList = departmentList_;
      //  回显
      var _proList = this.changeItem.checkedDepartment;
      var total = 0;
      for (var i = _proList.length - 1; i >= 0; i--) {
        total += _proList[i].count;
      }
      this.changeItem.avgNum = total;
      this.getTotalVal.totalNum = total;
      this.getTotalVal.digits = _proList.length;
    },
    // 病种标签 删掉
    handleCloseTagDiseases(tag, item) {
      this.changeItem = item;
      item.checkedDiseases.splice(item.checkedDiseases.indexOf(tag), 1);
      let diseaseList_ = Object.assign([], this.diseaseList);
      this.checkedDiseases.splice(
        this.checkedDiseases.findIndex((item) => item === tag),
        1
      );
      this.diseaseList = diseaseList_;
      this.isIndeterminateDiseases = true;
      //  回显
      var _proList = this.changeItem.checkedDiseases;
      var total = 0;
      for (var i = _proList.length - 1; i >= 0; i--) {
        total += _proList[i].count;
      }
      this.changeItem.avgNum = total;
      this.calculationBzVal.totalNum = total;
      this.calculationBzVal.digits = _proList.length;
    },
    //全选病种
    handleCheckAllChangeDiseases(val) {
      // this.checkedDiseases = val ? JSON.parse(JSON.stringify(this.diseaseList)) : [];
      this.checkedDiseases = val ? this.diseaseList : [];
      this.isIndeterminateDiseases = false;
      let firstList = this.checkedDepartmentOtherDiseases; // 其他
      let secondList = this.checkedDiseases; // 总
      this.changeItem.checkedDiseases = secondList.filter(function (val) {
        return firstList.indexOf(val) === -1;
      });

      this.calculationBzFn();
    },
    //选择剩余病种
    handCheckboxDiseasesAllOther(val) {
      if (val) {
        this.checkedDiseases = val ? this.diseaseList : [];
        this.ischeckboxDiseasesAllOther = false;
        let firstList = this.checkedDepartmentOtherDiseases;
        let secondList = this.checkedDiseases;
        this.changeItem.checkedDiseases = secondList.filter(function (val) {
          return firstList.indexOf(val) === -1;
        });
      } else {
        this.ischeckboxDiseasesAllOther = true;
        console.log(this.changeItem.checkedDiseases, this.checkedDiseases);
        let firstList = JSON.parse(JSON.stringify(this.changeItem.checkedDiseases));
        let secondList = this.checkedDiseases;
        this.checkedDiseases = firstList.filter(function (val) {
          return secondList.indexOf(val) === -1;
        });
        this.changeItem.checkedDiseases = [];
        this.checkedDiseases = this.checkedDepartmentOtherDiseases;
        console.log(this.checkedDiseases, this.changeItem.checkedDiseases);
      }
      this.calculationBzFn();
    },
    //选择剩余科室
    handCheckboxDepartmentAllOther(val) {
      if (val) {
        this.checkedDepartment = val ? this.departmentList : [];
        this.ischeckboxDepartmentAllOther = false;
        let firstList = this.checkedDepartmentOther;
        let secondList = this.checkedDepartment;
        this.changeItem.checkedDepartment = secondList.filter(function (val) {
          return firstList.indexOf(val) === -1;
        });
      } else {
        this.ischeckboxDepartmentAllOther = true;
        let firstList = JSON.parse(JSON.stringify(this.changeItem.checkedDiseases));
        let secondList = this.checkedDepartment;
        this.checkedDepartment = firstList.filter(function (val) {
          return secondList.indexOf(val) === -1;
        });
        this.changeItem.checkedDepartment = [];
        this.checkedDepartment = this.checkedDepartmentOther;
      }
      this.getTotalFn();
    },

    //单个选择 病种
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
      this.calculationBzFn();
    },
    //全选科室
    handleCheckAllChange(val) {
      // this.checkedDepartment = val
      //   ? JSON.parse(JSON.stringify(this.departmentList))
      //   : [];
      this.checkedDepartment = val ? this.departmentList : [];
      this.isIndeterminate = false;
      let firstList = this.checkedDepartmentOther;
      let secondList = this.checkedDepartment;
      this.changeItem.checkedDepartment = secondList.filter(function (val) {
        return firstList.indexOf(val) === -1;
      });
      this.getTotalFn();
    },
    //单个选择 科室
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
      this.getTotalFn();
    },

    // 列表选择科室/病种
    itemSelect(val, item) {
      this.dialogTitle = val;
      this.changeItem = item;
      this.dialogVisible = true;
      if (val == "科室选择") {
        this.getTotalFn();
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
        // 禁用 其他
        if (this.checkedDepartmentOther.length == this.departmentList.length) {
          this.isCheckboxDepartmentAllOtherDisabled = true;
        } else {
          this.isCheckboxDepartmentAllOtherDisabled = false;
        }
        let firstList =
          this.checkedDepartmentOther.length + item.checkedDepartment.length;
        if (firstList == this.departmentList.length) {
          this.checkboxDepartmentAllOther = true;
        } else {
          this.checkboxDepartmentAllOther = false;
        }
      } else {
        this.calculationBzFn();
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
        // 禁用 其他
        if (
          this.checkedDepartmentOtherDiseases.length == this.diseaseList.length
        ) {
          this.isCheckboxDiseasesAllOtherDisabled = true;
        } else {
          this.isCheckboxDiseasesAllOtherDisabled = false;
        }
        let firstList =
          this.checkedDepartmentOtherDiseases.length + item.checkedDiseases.length;
        if (firstList == this.diseaseList.length) {
          this.checkboxDiseasesAllOther = true;
        } else {
          this.checkboxDiseasesAllOther = false;
        }
      }
    },

    handleSizeChange(val) {
      this.currentPageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
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
