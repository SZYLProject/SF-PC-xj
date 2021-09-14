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
      <el-radio-group v-model="distributionType" @change="typeChange">
        <el-radio :label="'average'">平均分配</el-radio>
        <el-radio :label="'disease'">按病种分配</el-radio>
        <el-radio :label="'department'">按科室分配</el-radio>
        <el-radio :label="'nation'">按民族分配</el-radio>
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
    <!-- 随访人员列表 -->
    <div class="personnel-list">
      <ul>
        <li class="relative" v-for="(item, index) in tableData" :key="index">
          <el-row :gutter="10">
            <el-col :span="2" class="text-center">
              <span class="personnel-name">{{ item.userName }}</span>
            </el-col>
            <el-col :span="3">
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
            <!-- 平均删除 -->
            <el-col
              :span="18"
              class="personnel-tags"
              v-if="distributionType == 'average'"
            >
              <el-button
                class="del-phone"
                size="mini"
                type="primary"
                @click="delFitem(item, index)"
                >删除</el-button
              >
            </el-col>
            <!-- 选择病种 -->
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
            <!-- 选择科室 -->
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
            <!-- 选择民族 -->
            <el-col
              :span="18"
              class="personnel-tags"
              v-if="distributionType == 'nation'"
            >
              <!-- @close="handleCloseTagNation(tag, item)" -->

              <el-tag
                :key="tagIndex"
                v-for="(tag, tagIndex) in item.checkedNation"
                size="medium"
                :disable-transitions="false"
                >{{ tag.ethnicity }} | {{ tag.currentCount }}
              </el-tag>
              <el-button
                class="add-phone"
                size="mini"
                type="primary"
                @click="itemSelect('民族选择', item)"
                >选择民族</el-button
              >
            </el-col>
          </el-row>
        </li>
      </ul>
    </div>
    <el-row :gutter="10">
      <el-col :span="24" class="text-center margintb24">
        <el-button type="primary" @click="handelBack">上一步</el-button>
        <el-button type="primary" @click="distributionClick"
          >确认分配</el-button
        >
      </el-col>
    </el-row>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <div v-if="dialogTitle == '随访人员'">
        <el-table
          stripe
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
      <div v-if="dialogTitle == '民族选择'">
        <div>
          <el-row :gutter="10">
            <el-col :span="6" class="marginb12">选择民族</el-col>
            <el-col :span="18">
              <div class="marginb12">
                <el-checkbox
                  :indeterminate="isIndeterminateNation"
                  :disabled="isCheckAllNation"
                  v-model="checkAllNation"
                  @change="handleCheckAllChangeNation"
                >
                  全选
                </el-checkbox>
                <el-checkbox
                  :indeterminate="ischeckboxNationAllOther"
                  :disabled="isCheckboxNationAllOtherDisabled"
                  v-model="checkboxNationAllOther"
                  v-if="checkedNationOther.length != 0"
                  @change="handCheckboxNationAllOther"
                >
                  选择剩余
                </el-checkbox>
                <span>
                  (已经选择
                  <span>{{ calculationBzVal.digits }}</span>
                  个民族，共
                  <span>{{ calculationBzVal.totalNum }}</span>
                  病人)
                </span>
              </div>
              <div v-loading="loadingNation">
                <el-checkbox-group
                  v-model="checkedNation"
                  @change="handlecheckedDepartmentChangeNation"
                >
                  <!-- :disabled="checkedNationOther.includes(nationItem)" 
                    :disabled="nationItem.oldOvserCount == 0"
                  -->
                  <el-checkbox
                    v-for="(nationItem, index) in nationList"
                    :label="nationItem"
                    :disabled="nationItem.checkType == 3"
                    :key="index"
                    class="marginb12"
                  >
                    <div>
                      <span class="marginr6">{{ nationItem.ethnicity }}</span>
                      <!-- <span class="marginl16">{{ nationItem.count }}</span> -->
                      <el-input
                        class="cont_num"
                        v-model="nationItem.currentCount"
                        :min="0"
                        :disabled="nationItem.checkType == 3"
                        :max="nationItem.canChoiceCount"
                        @change="calNationFn"
                        type="number"
                        size="mini"
                        placeholder=""
                      ></el-input>
                      /
                      {{ nationItem.ovserCount }}
                      <!-- {{ nationItem.canChoiceCount - nationItem.currentCount }} -->
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
  getLiveInfoById,
  getBaseAllUsers,
  getLiveDiseases,
  getLiveNations,
  getLiveDeparts,
  posAddUserByNation,
  postAddAllocation,
  postAddAll,
  postAddByNation,
} from "@/api/survivalFollowup";
import { getFindAllByTypeCode } from "@/api/user";
export default {
  name: "TaskDistribution",
  components: {},
  data() {
    return {
      loadingNation:false,
      userMenu: [],
      dialogTitle: "科室选择",
      dialogVisible: false, // 是否显示弹窗
      categoryList: [], // 分类列表
      categoryListHead: [], // 分类列表
      distributionType: "average",
      tableData: [],
      tableUserData: [],
      // 已选随访人员
      multipleSelection: [], //列表使用
      multipleSelectionVal: [], // 复选框

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
      calculationBzVal: {}, //展示几个病人几个病种
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
      getTotalVal: {}, //展示几个病人几个科室
      changeItem: {
        checkedDepartment: [],
      }, // 暂存当前人员

      // 民族选择
      nationList: [], // 民族列表
      checkAllNation: false, //全选民族
      isCheckAllNation: false, //是否可以全选民族
      checkedNation: [], // 所有已经选择的民族
      checkedNationOther: [], // 除此员工以外所选民族
      isIndeterminateNation: true, // 实现全选的效果 非全选民族
      ischeckboxNationAllOther: true, // 选择剩余民族 样式
      isCheckboxNationAllOtherDisabled: false, //  禁用选择剩余民族
      checkboxNationAllOther: false, // 选择剩余民族
      getTotalValNation: {}, //展示几个病人几个民族
      changeItemNation: {
        checkedNation: [],
      }, // 暂存当前人员
      clickFollowUserId: "", // 选择民族id

      // 分页数据
      currentPage: 1,
      currentPageSize: 10,
      currentPageTotal: 30,
    };
  },

  created() {
    this.getLiveInfoByIdFn(); // 更新项目的患者
    this.getLiveDiseasesFn(); // 病种
    this.getLiveDepartsFn(); // 科室

    this.getBaseAllUsersFn(); //随访人员
    // this.getCode();
  },
  methods: {
    handelBack() {
      this.$parent.active = 2;
      this.$emit("filterClickCountChange");
    },
    // 实时计算科室
    getTotalFn: function () {
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
    calculationBzFn: function () {
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
    // 实时计算民族
    calNationFn: function () {
      // var _proList = this.changeItem.checkedNation;
      this.changeItem.checkedNation = this.checkedNation; // +- 计算
      var _proList = this.checkedNation;
      var total = 0;
      for (var i = _proList.length - 1; i >= 0; i--) {
        total += Number(_proList[i].currentCount);
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
      } else if (val == "nation") {
        this.tableData = [];
        // this.tableData.map((item) => {
        //   item.avgNum = 0;
        //   item.checkedDepartment = [];
        //   item.checkedNation = [];
        // });
        // this.tableData = Object.assign([], this.tableData);
        // this.checkAllNation = false;
        // this.isCheckAllNation = false;
        // this.checkedNation = [];
        // this.checkedNationOther = [];
        // this.isIndeterminateNation = true;
        // this.changeItemNation = {
        //   checkedNation: [],
        // };
      }
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
    // 触发模态框    随访人员
    backOn(val) {
      this.dialogTitle = val;
      this.dialogVisible = true;

      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 人员选择
    handleSelectionChange(val) {
      // console.log('人员选择 弹框会默认触发一次')
      this.multipleSelectionVal = val; // 随访人员选择
      this.multipleSelection = JSON.parse(JSON.stringify(val));
    },
    // 模态框确定  请
    onConfirm() {
      if (this.dialogTitle == "随访人员") {
        this.dialogVisible = false;
        if (this.distributionType == "average") {
          this.tableData = this.average(
            this.multipleSelection,
            this.categoryList[0].total,
            this.multipleSelection.length
          );
        } else {
          this.tableData = this.multipleSelection;
          this.tableData.map((item) => {
            item.avgNum = 0;
            item.checkedDepartment = [];
            item.checkedDiseases = [];
            item.checkedNation = [];
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

          this.checkAllNation = false;
          this.isCheckAllNation = false;
          this.checkedNation = [];
          this.checkedNationOther = [];
          this.isIndeterminateNation = true;

          if (this.distributionType == "nation") {
            // 民族 选择随访人员确定
            this.tableData.map((item) => {
              item.projectId = Number(this.$route.query.id);
              item.type = "nation";
              item.avgNum = 0;
              item.checkedNation = [];
            });
            let postUserData = {
              list: this.tableData,
            };

            posAddUserByNation(postUserData)
              .then((res) => {
                // this.$message.success("分配成功");
                // this.$router.push({
                //   path: "/survival/index",
                // });
                res.data.map((item) => {
                  item.projectId = item.projectId;
                  item.userCode = item.userCode;
                  item.userName = item.userName;
                  item.avgNum = item.avgNum;
                  item.id = item.id;
                  item.checkedNation = [];
                });
                this.tableData = res.data;
              })
              .catch((error) => {
                console.error(error);
              });
          }
          // this.changeItemDiseases = {
          //   checkedDepartment: [],
          // };
        }
      } else if (
        this.dialogTitle == "科室选择" ||
        this.dialogTitle == "病种选择"
      ) {
        this.changeItem.avgNum = this.getTotalVal.totalNum;
        this.dialogVisible = false;
      } else {
        // 民族模态框点击确定  确定随访民族  123456
        if (this.checkedNation.some((e) => e.currentCount == 0)) {
          this.$message.warning("分配人员下随访人数不能分配为0");
          return false;
        }
        this.dialogVisible = false;

        this.changeItem.avgNum = this.calculationBzVal.totalNum;
        let postData = this.postDataFn();
        postAddByNation(postData.nationsItem)
          .then((res) => {
            // this.$message.success("分配成功");
            // this.$router.push({
            //   path: "/survival/index",
            // });

            this.checkAllNation = false;
            this.isCheckAllNation = false;
            this.checkedNation = [];
            this.checkedNationOther = [];
            this.isIndeterminateNation = true;
            this.changeItemNation = {
              checkedNation: [],
            };
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },

    // 平均分配删除
    delFitem(item, index) {
      this.tableData.splice(this.tableData.indexOf(item), 1);
      // this.$refs.multipleTable.toggleRowSelection(this.multipleSelectionVal[index],false);
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
    // 民族标签 删掉
    handleCloseTagNation(tag, item) {
      this.changeItem = item;
      item.checkedNation.splice(item.checkedNation.indexOf(tag), 1);
      let nationList_ = Object.assign([], this.nationList);
      this.checkedNation.splice(
        this.checkedNation.findIndex((item) => item === tag),
        1
      );
      this.nationList = nationList_;
      this.isIndeterminateNation = true;
      //  回显
      var _proList = this.changeItem.checkedNation;
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
    //全选民族
    handleCheckAllChangeNation(val) {
      this.checkedNation = val ? this.nationList : [];
      this.isIndeterminateNation = false;
      let firstList = this.checkedNationOther; // 其他
      let secondList = this.checkedNation; // 总
      this.changeItem.checkedNation = secondList.filter(function (val) {
        return firstList.indexOf(val) === -1;
      });

      this.calNationFn();
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
        let firstList = JSON.parse(
          JSON.stringify(this.changeItem.checkedDiseases)
        );
        let secondList = this.checkedDiseases;
        this.checkedDiseases = firstList.filter(function (val) {
          return secondList.indexOf(val) === -1;
        });
        this.changeItem.checkedDiseases = [];
        this.checkedDiseases = this.checkedDepartmentOtherDiseases;
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
        let firstList = JSON.parse(
          JSON.stringify(this.changeItem.checkedDiseases)
        );
        let secondList = this.checkedDepartment;
        this.checkedDepartment = firstList.filter(function (val) {
          return secondList.indexOf(val) === -1;
        });
        this.changeItem.checkedDepartment = [];
        this.checkedDepartment = this.checkedDepartmentOther;
      }
      this.getTotalFn();
    },
    //选择剩余民族
    handCheckboxNationAllOther(val) {
      if (val) {
        let checkTrueList = this.nationList.filter(
          (item) => item.checkType != 3
        );
        this.checkedNation = val ? checkTrueList : [];
        this.ischeckboxNationAllOther = false;
        let firstList = this.checkedNationOther;
        let secondList = this.checkedNation;
        this.changeItem.checkedNation = secondList.filter(function (val) {
          return firstList.indexOf(val) === -1;
        });
      } else {
        this.ischeckboxNationAllOther = true;

        // let firstList = JSON.parse(
        //   JSON.stringify(this.changeItem.checkedNation)
        // );
        // let secondList = this.checkedNation;
        // this.checkedNation = firstList.filter(function (val) {
        //   return secondList.indexOf(val) === -1;
        // });
        this.changeItem.checkedNation = [];
        this.checkedNation = [];
      }
      this.calNationFn();
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
    //单个选择 民族
    handlecheckedDepartmentChangeNation(value) {
      let checkedCount = value.length;
      this.checkAllNation = checkedCount === this.nationList.length;
      this.isIndeterminateNation =
        checkedCount > 0 && checkedCount < this.nationList.length;

      let firstList = this.checkedNationOther;
      let secondList = this.checkedNation;
      this.changeItem.checkedNation = [];
      this.changeItem.checkedNation = secondList.filter(function (val) {
        return firstList.indexOf(val) === -1;
      });

      this.calNationFn();
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
    // 列表选择科室/病种  打开模态框
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
      } else if (val == "病种选择") {
        this.calculationBzFn();
        this.checkedDepartmentOtherDiseases = this.checkedDiseases.filter(
          function (val) {
            return item.checkedDiseases.indexOf(val) === -1;
          }
        );

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
          this.checkedDepartmentOtherDiseases.length +
          item.checkedDiseases.length;
        if (firstList == this.diseaseList.length) {
          this.checkboxDiseasesAllOther = true;
        } else {
          this.checkboxDiseasesAllOther = false;
        }
      } else if (val == "民族选择") {
        this.clickFollowUserId = item.id;
        this.getLiveNationFn(item.id);

        // this.checkedNationOther = this.checkedNation.filter(function (
        //   val
        // ) {
        //   return item.checkedNation.indexOf(val) === -1;
        // });

        // if (this.checkedNationOther.length > 0) {
        //   this.isCheckAllNation = true;
        // } else {
        //   this.isCheckAllNation = false;
        // }
        // // 禁用 其他
        // if (
        //   this.checkedNationOther.length == this.nationList.length
        // ) {
        //   this.isCheckboxNationAllOtherDisabled = true;
        // } else {
        //   this.isCheckboxNationAllOtherDisabled = false;
        // }
        // let firstList =
        //   this.checkedNationOther.length + item.checkedNation.length;
        // if (firstList == this.nationList.length) {
        //   this.checkboxNationAllOther = true;
        // } else {
        //   this.checkboxNationAllOther = false;
        // }
      }
    },
    postDataFn() {
      // 数量判断
      // if (this.distributionType != "nation") {
      //   let lastNum = this.tableData.reduce((p, e) => p + Number(e.avgNum), 0);
      //   if (lastNum != this.categoryList[0].total) {
      //     this.$message.warning("请检查分配数量");
      //     return false;
      //   }
      //   let result_one = this.tableData.some(function (item) {
      //     if (item.avgNum == 0) {
      //       return true;
      //     }
      //   });
      //   if (result_one) {
      //     this.$message.warning("分配人员下随访人数不能分配为0");
      //     return false;
      //   }
      // }
      let postData = {
        list: [],
      };
      this.tableData.forEach((item) => {
        let obg = {
          projectId: Number(this.$route.query.id),
          type: this.distributionType,
          userCode: item.userCode,
          userName: item.userName,
          avgNum: item.avgNum,
          diseases: "",
          departments: "",
          nations: "",
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
        if (
          this.distributionType == "nation" &&
          this.clickFollowUserId == item.id
        ) {
          obg.id = this.clickFollowUserId;

          let nationStr = item.checkedNation.map((x) => {
            return x.ethnicity;
          });

          obg.nations = nationStr.join();
          obg.checkedNation = item.checkedNation;
          postData.nationsItem = obg;
        }
        postData.list.push(obg);
      });

      return postData;
    },
    // 最终分配
    distributionClick() {
      let postData = this.postDataFn();
      console.log(postData, "postData");
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
      if (this.distributionType == "nation") {
        let obj = {
          id: Number(this.$route.query.id),
        };

        postAddAll(obj)
          .then((res) => {
            this.$message.success("分配成功");
            this.$router.push({
              path: "/survival/index",
            });
            console.log(res, "最终提交");
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
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
      }
    },
    // 获取民族
    getLiveNationFn(valId) {
      let dataV = {
        id: this.$route.query.id,
        allocId: valId,
      };
      this.loadingNation =true
      getLiveNations(dataV)
        .then((res) => {
          this.checkedNation = [];
          this.checkedNationOther = [];
          res.data.forEach((element) => {
            element["oldOvserCount"] = element.ovserCount; //剩余可选人数
            element["currentCount"] = element.currentCount || 0; //已选择人数
            if (element.currentCount > 0) {
              // 当前选择的列表
              this.checkedNation.push(element);
            }
            if (element["currentCount"] == 0) {
              element["currentCount"] = element.ovserCount;
            }
            element["canChoiceCount"] = element.currentCount; // 当前可以选择人数
            element["checkType"] = 1;

            if (element.currentCount == 0 && element.ovserCount == 0) {
              this.isCheckboxNationAllOtherDisabled = false;
              this.checkedNationOther.push(element);
              // this.checkedNationOther.push(element)
              // checkType 1 未选择
              // checkType 2 已选择
              // checkType 3 禁止选择  该民族已被其他人分配
              element["checkType"] = 3;
            }
          });
          this.loadingNation =false
          this.nationList = res.data;
          //  已经有被选空的民族
          if (this.nationList.some((e) => e.checkType === 3)) {
            this.isCheckAllNation = true;
          }
          this.calNationFn();
        })
        .catch((error) => {
          this.$message.error("获取失败");
        });
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

    // 更新项目的患者   表格统计接口
    getLiveInfoByIdFn() {
      let dataV = {
        id: this.$route.query.id,
      };
      getLiveInfoById(dataV)
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
    // input可输入
    inputOnInput(e) {
      this.$forceUpdate();
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
        // line-height: 28px;
      }
      .personnel-num {
        border: 1px solid #ddd;
        padding: 7px 15px;
        font-size: 12px;
      }
      .personnel-tags {
        .el-tag {
          margin-left: 12px;
          display: inline-block;
          margin-bottom: 6px;
        }
      }
      .del-phone {
        margin-left: 24px;
      }
    }
  }
}
.cont_num {
  width: 80px;
}
</style>
