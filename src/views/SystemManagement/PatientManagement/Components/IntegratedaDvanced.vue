<!--
 * @Description: 高级搜索
 * @Author: benmo(caoky@dchealth.com)
 * @Date: 2020-07-15 11:27:11
 * @LastEditors: zhangran(b742774335@163.com)
 * @LastEditTime: 2020-08-07 15:33:55
-->
<template>
  <section class="module-advanced">
    <!-- <el-radio-group v-model="searchForm.tableName">
      <section class="patient">
        <el-radio label="t_data_patient">
          <span>患者维度</span>
          <span class="introduce">某一患者的全院病历共同满足搜索条件，则该病人被检索出</span>
        </el-radio>
      </section>
      <section class="seek">
        <el-radio label="t_data_patient_diagnose">
          <span>就诊维度</span>
          <span class="introduce">患者在单次就诊病历中满足全部搜索条件，则该病人被检索出</span>
        </el-radio>
      </section>
    </el-radio-group> -->
    <section class="condition">
      <ul>
        <li>
          <ol class="senior_ol">
            <li>逻辑关系</li>
            <li>搜索主题</li>
            <li>搜索条件</li>
            <li>值域范围</li>
            <li>条件操作</li>
          </ol>
        </li>
        <li v-for="(item, index) in searchForm.conditionItemList" :key="index">
          <ol>
            <li>
              <el-select
                v-model="item.logicVal"
                placeholder="请选择逻辑关系"
                :disabled="notSearch"
                v-if="index !== 0"
              >
                <el-option
                  v-for="item in item.logicList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </li>
            <li>
              <el-autocomplete
                v-model="item.topicVal"
                :fetch-suggestions="querySearch"
                :disabled="notSearch"
                placeholder="搜索项"
                @select="querySelectClick($event, index)"
              >
                <i
                  @click="openDialogMenu(index, '1')"
                  class="el-input__icon el-icon-plus"
                  slot="suffix"
                ></i>
                <template slot-scope="{ item }">
                  <div class="name">{{ item.value }}</div>
                </template>
              </el-autocomplete>
            </li>
            <li>
              <el-select
                v-model="item.conditionVal"
                :disabled="notSearch"
                placeholder="关系"
              >
                <el-option
                  v-for="conditionItem in item.conditionList"
                  :key="conditionItem.value"
                  :label="conditionItem.label"
                  :value="conditionItem.value"
                ></el-option>
              </el-select>
            </li>
            <li>
              <el-select
                v-model="item.value"
                :disabled="notSearch"
                v-if="item.esType == 'select'"
                placeholder="请选择"
              >
                <el-option
                  v-for="ele in item.options"
                  :key="ele.value"
                  :label="ele.label"
                  :value="ele.value"
                >
                </el-option>
              </el-select>

              <el-date-picker
                v-if="item.esType == 'date'"
                v-model="item.value"
                :disabled="notSearch"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>

              <!-- <el-date-picker
                v-if="item.conditionVal != '' && item.esType == 'date'"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker> -->
              <el-input
                v-if="item.esType == 'text' || !item.esType"
                v-model="item.value"
                :disabled="notSearch"
                placeholder="对比值"
              ></el-input>
            </li>
            <li v-if="!notSearch">
              <span
                class="el-icon-s-operation"
                @click="handleAddFilterCon(index)"
              ></span>
              <span
                class="el-icon-circle-plus-outline"
                @click="handleAddConItem()"
              ></span>
              <span
                class="el-icon-circle-close"
                @click="handleDeleteConItem(index)"
              ></span>
            </li>
          </ol>
          <ol>
            <li
              v-for="(filterItem, filterIndex) in item.filterList"
              :key="filterIndex"
            >
              <dl>
                <dd></dd>
                <dd>
                  <el-autocomplete
                    popper-class="my-autocomplete "
                    :disabled="notSearch"
                    v-model="filterItem.topicVal"
                    :title="filterItem.topicVal"
                    :fetch-suggestions="querySearchChild"
                    placeholder="搜索项"
                    @select="querySelectClickChild($event, index, filterIndex)"
                  >
                    <!-- <i class="el-input__icon el-icon-plus" slot="suffix"></i> -->
                    <!-- 子节点 -->

                    <i
                      @click="openDialogMenu(index, '2', filterIndex)"
                      class="el-input__icon el-icon-plus"
                      slot="suffix"
                    ></i>
                    <template slot-scope="{ item }">
                      <div class="name" :title="item.value">
                        {{ item.value }}
                      </div>
                    </template>
                  </el-autocomplete>
                </dd>
                <dd>
                  <el-select
                    class="child-range-select"
                    v-model="filterItem.conditionVal"
                    :disabled="notSearch"
                    placeholder="关系"
                  >
                    <el-option
                      v-for="conditionItem in filterItem.conditionList"
                      :key="conditionItem.value"
                      :label="conditionItem.label"
                      :value="conditionItem.value"
                    ></el-option>
                  </el-select>
                </dd>
                <dd>
                  <el-select
                    v-model="filterItem.range"
                    :disabled="notSearch"
                    v-if="filterItem.esType == 'select'"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="ele in filterItem.options"
                      :key="ele.value"
                      :label="ele.label"
                      :value="ele.value"
                    >
                    </el-option>
                  </el-select>

                  <el-date-picker
                    v-if="filterItem.esType == 'date'"
                    :disabled="notSearch"
                    v-model="filterItem.range"
                    type="date"
                    placeholder="选择日期"
                  >
                  </el-date-picker>

                  <!-- <el-date-picker
                v-if="item.conditionVal != '' && item.esType == 'date'"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker> -->
                  <el-input
                    v-if="filterItem.esType == 'text' || !filterItem.esType"
                    v-model="filterItem.range"
                    :disabled="notSearch"
                    placeholder="对比值"
                  ></el-input>
                </dd>
                <dd>
                  <span
                    class="el-icon-circle-close"
                    v-if="!notSearch"
                    @click="handleDeleteFilterItem(index, filterIndex)"
                  ></span>
                </dd>
              </dl>
            </li>
          </ol>
        </li>
      </ul>
    </section>
    <footer v-if="false">
      <ul>
        <li></li>
        <li></li>
        <li @click="resetSearch">
          <span class="el-icon-delete"></span>
          <span>清空条件</span>
        </li>
        <li>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch"
            >搜索</el-button
          >
        </li>
      </ul>
    </footer>
    <section>
      <el-dialog
        title="条件菜单"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose"
        class="selectTopicDialog"
      >
        <section class="tabs-content-wrapper" v-loading="menuLoading">
          <section class="scroll-left">
            <el-tabs :tab-position="tabPosition" @tab-click="handleClick">
              <el-tab-pane
                v-for="(menuItem, index) in menuAllList"
                :key="index"
                :label="menuItem.tableName"
              ></el-tab-pane>
            </el-tabs>
          </section>
          <section class="scroll-right" id="rightScroll">
            <section class="module-search-item scroll-item">
              <ul class="mix-field">
                <li v-for="(liItem, indexLi) in menuAllList" :key="indexLi">
                  <section class="mix-field-two">
                    <h3>{{ liItem.tableName }}</h3>
                    <ol>
                      <li
                        class="li-field"
                        v-for="(
                          liItemDetailsMap, indexDetailsLiMap
                        ) in liItem.map"
                        :key="indexDetailsLiMap"
                      >
                        <h4 class="secondary_title">
                          {{ liItemDetailsMap.tableName }}
                        </h4>
                        <span
                          v-for="(
                            liItemDetails, indexDetailsLi
                          ) in liItemDetailsMap.list"
                          :key="indexDetailsLi"
                          @click="
                            liFieldClick(
                              liItemDetails,
                              indexDetailsLi,
                              indexDetailsLiMap,
                              indexLi
                            )
                          "
                          >{{ liItemDetails.columnDesc }}</span
                        >
                      </li>
                    </ol>
                  </section>
                </li>
              </ul>
            </section>
          </section>
        </section>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </section>
  </section>
</template>

<script>
import {
  getPatientFindTableAndColumn,
  getPatientFindColumns,
  gitPatientFindTabl,
} from "@/api/specialFollowUp";

export default {
  name: "IntegratedaDvanced",
  props: {
    notSearch: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      newAllselect: [{ value: "患者基本信息/常用信息/姓名" }],
      childrenSelect: [{ value: "患者基本信息/常用信息/姓名" }],
      searchCondition: {},
      menuAllList: [],
      treeNodeIndex: 0,
      scrollTopNum: 0,
      searchForm: {
        // tableName: "t_data_patient",
        // projectId: "",
        conditionItemList: [
          {
            esType: "", //类型
            logicVal: "",
            logicList: [
              {
                label: "并且",
                value: "0",
              },
              {
                label: "或者",
                value: "3",
              },
            ],
            topicVal: "",
            conditionVal: "",
            conditionList: [],
            range: "",
            filterList: [],
          },
        ],
      },
      activeName: "first",
      dialogVisible: false,
      tabPosition: "left",
      allSelectArr: [],
      menuType: "",
      openDialogMenuIndex: "",
      filterIndex: "",
      menuLoading: false,
    };
  },

  created() {
    // let oldSearchVal =JSON.parse(JSON.stringify(this.advancedSearch))
    // this.searchForm = oldSearchVal

    // let searchConditionVal = localStorage.getItem("searchCondition");
    // if (searchConditionVal !== "undefined") {
    //   this.searchCondition = localStorage.getItem("searchCondition")
    //     ? JSON.parse(localStorage.getItem("searchCondition"))
    //     : null;
    // }

    // if (this.searchCondition) {

    //   if (this.searchCondition.conditionItemList) {
    //     this.searchForm.conditionItemList = this.searchCondition.conditionItemList;
    //   }
    // }

    this.projectId = this.$route.query.id;
    this.getPatientFindTableAndColumnFn();
    // this.gitPatientFindTablFn();
  },
  methods: {
    // 打开模态框
    openDialogMenu(index, type, filterIndex) {
      //  type   1父节点  2 子节点
      this.menuType = type;
    
      this.treeNodeIndex = index;
      this.dialogVisible = true;
      if (this.menuType == "1") {
        this.openDialogMenuIndex = index;
      } else {
        this.filterIndex = filterIndex;
        this.openDialogMenuIndex = 0;
      }
      this.gitPatientFindTablFn(index, this.menuType);
    },
    // 获取模态框层级
    gitPatientFindTablFn(index, type) {
      let postObj = {};

      if (type == "2") {
        let nameArr =
          this.searchForm.conditionItemList[index].topicVal.split("/");
        if (nameArr.length == 1) {
          postObj.name = this.allSelectArr[this.openDialogMenuIndex];
        } else {
          postObj.name = this.searchForm.conditionItemList[index].topicVal;
        }
      }
      this.menuLoading = true;
      gitPatientFindTabl(postObj)
        .then((res) => {
          this.menuLoading = false;
          this.menuAllList = res.data.list;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    // 模态框某字段点击
    liFieldClick(item, indexDetailsLi, indexDetailsLiMap, indexLi) {
   
      if (this.menuType == "2") {
        this.dialogVisible = false;
        this.searchForm.conditionItemList[this.treeNodeIndex].filterList[
          this.filterIndex
        ].topicVal = item.columnDesc;

        let stringVal = item.columnParent + "/" + item.columnDesc;

        let arr = this.newAllselect.filter((item, index) => {
          if (item.value == stringVal) {
            return item;
          }
        });

        this.searchForm.conditionItemList[this.treeNodeIndex].filterList[
          this.filterIndex
        ].conditionList = arr[0].conditions;
        this.searchForm.conditionItemList[this.treeNodeIndex].filterList[
          this.filterIndex
        ].esType = arr[0].esType;
        this.searchForm.conditionItemList[this.treeNodeIndex].filterList[
          this.filterIndex
        ].options = arr[0].options;

      } else {
        this.allSelectArr[this.openDialogMenuIndex] =
          item.columnParent + "/" + item.columnDesc;

        this.dialogVisible = false;
        this.searchForm.conditionItemList[this.treeNodeIndex].topicVal =
          item.columnDesc;

        var restaurants = this.newAllselect;

        var results = item.columnDesc
          ? restaurants.filter(this.createFilter(item.columnDesc))
          : restaurants;

        if (results.length) {
          this.searchForm.conditionItemList[this.treeNodeIndex].esType =
            results[0].esType;
          this.searchForm.conditionItemList[this.treeNodeIndex].conditionList =
            results[0].conditions;
          if (results[0].esType == "select") {
            this.searchForm.conditionItemList[this.treeNodeIndex].options =
              results[0].options;
          }
        }
      }
    },

    // 楼层跳转的方法index
    jump(index) {
      this.num = index;
      // 获取所有的楼层
      var inner = document.getElementsByClassName("mix-field-two");
      let targetY = inner[index].offsetTop - inner[index].offsetHeight;
      targetY = index == 0 ? 0 : targetY - 26;
      this.scrollAnimation(0, targetY);
    },
    // 楼层跳转动画
    scrollAnimation(currentY, targetY) {
      // 获取当前位置方法
      var rightScroll = document.getElementById("rightScroll");
      // 计算需要移动的距离
      let needScrollTop = targetY - currentY;
      let _currentY = currentY;
      setTimeout(() => {
        // 一次调用滑动帧数，每次调用会不一样
        const dist = Math.ceil(needScrollTop / 10);
        _currentY += dist;
        rightScroll.scrollTo(_currentY, currentY);
        // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
        if (needScrollTop > 10 || needScrollTop < -10) {
          this.scrollAnimation(_currentY, targetY);
        } else {
          rightScroll.scrollTo(_currentY, targetY);
        }
      }, 1);
    },
    handleClick(tab, event) {
      // console.log(tab, event, tab.index);
      this.jump(tab.index);
    },

    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    handleRouter() {
      this.$router.push({
        name: "IntegratedAdvanced",
      });
    },
    // 获取第一层筛选条件
    getPatientFindTableAndColumnFn() {
      let params = {
        // tableName: "t_data_patient",
      };
      getPatientFindTableAndColumn(params)
        .then((res) => {
          this.newAllselect = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 获取第二层筛选条件
    getPatientFindColumnsFn(val) {
      let params = {
        name: val,
      };
      getPatientFindColumns(params)
        .then((res) => {
          this.childrenSelect = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 搜索主题 搜索项里点击
    querySelectClick(item, index, secondaryIndex) {
      console.log(item, "querySelectClick", index, secondaryIndex);
      // esType
      if (!secondaryIndex) {
        this.searchForm.conditionItemList[index].topicVal = item.value;
        this.searchForm.conditionItemList[index].esType = item.esType;
        this.searchForm.conditionItemList[index].conditionList =
          item.conditions;
        if (item.esType == "select") {
          this.searchForm.conditionItemList[index].options = item.options;
        }
      }
    },
    querySelectClickChild(item, index, secondaryIndex) {
      // item, index, secondaryIndex
      this.searchForm.conditionItemList[index].filterList[
        secondaryIndex
      ].topicVal = item.value;
      this.searchForm.conditionItemList[index].filterList[
        secondaryIndex
      ].esType = item.esType;
      this.searchForm.conditionItemList[index].filterList[
        secondaryIndex
      ].conditionList = item.conditions;
      if (item.esType == "select") {
        this.searchForm.conditionItemList[index].filterList[
          secondaryIndex
        ].options = item.options;
      }
    },
    // 实时筛选
    querySearch(queryString, cb) {
      this.searchForm.conditionItemList.forEach((item) => {
        var restaurants = this.newAllselect;
        var results = queryString
          ? restaurants.filter(this.createFilter(queryString))
          : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      });
    },
    // 实时筛选
    querySearchChild(queryString, cb) {
      this.searchForm.conditionItemList.forEach((item) => {
        var restaurants = this.childrenSelect;
        var results = queryString
          ? restaurants.filter(this.createFilter(queryString))
          : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      });
    },
    // 过滤判断
    createFilter(queryString) {
      return (restaurant) => {
        return (
          // restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !=
          -1
        );
      };
    },
    //添加过滤条件  二级
    handleAddFilterCon(index) {
      console.log(this.searchForm.conditionItemList[index]);
      let superiorVal = this.searchForm.conditionItemList[index].topicVal;
      if (superiorVal) {
        this.getPatientFindColumnsFn(superiorVal);
        this.searchForm.conditionItemList[index].filterList.push({
          topicVal: "",
          conditionVal: "",
          conditionList: [],
        });
      } else {
        this.$message({
          type: "error",
          showClose: true,
          message: "请先选择父节点",
          center: true,
        });
      }
    },
    //添加条件项
    handleAddConItem() {
      this.searchForm.conditionItemList.push({
        logicVal: "0",
        logicList: [
          {
            label: "并且",
            value: "0",
          },
          {
            label: "或者",
            value: "3",
          },
        ],
        topicVal: "",
        conditionVal: "",
        conditionList: [],
        range: "",
        filterList: [],
      });
    },
    //删除条件项
    handleDeleteConItem(index) {
      if (index === 0) return;
      this.searchForm.conditionItemList.splice(index, 1);
    },
    //删除过滤条件
    handleDeleteFilterItem(index, filterIndex) {
      this.searchForm.conditionItemList[index].filterList.splice(
        filterIndex,
        1
      );
    },
    // 重置()
    resetSearch() {
      Object.assign(this.$data.searchForm, this.$options.data().searchForm); // 部分重置
    },
    //搜索
    handleSearch() {
      return this.searchForm;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/variables.scss";
.module-advanced {
  // min-height: 300px;
  // padding: 15px;
  box-sizing: border-box;
  background: $module-bg-color;
  position: relative;
  h3 {
    padding-bottom: 10px;
    // border-bottom: 1px solid $rgba-black-15;
    font-size: $font-size-14;
    font-weight: 700;
  }
  .post-link {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 16px;
    color: $color-primary;
  }
  .el-radio-group {
    width: 100%;
    padding-bottom: 20px;
    border-bottom: 1px solid $rgba-black-15;
    .patient,
    .seek {
      margin-top: 15px;
      .introduce {
        margin-left: 30px;
        color: $text-normal;
      }
    }
  }
  .condition {
    padding: 10px 0px 20px;
    // border-bottom: 1px solid $rgba-black-15;
    ol {
      &:nth-child(1) {
        padding: 0px;
        display: flex;
        & > li {
          width: 25%;
          margin: 18px 5px 0;
          white-space: nowrap;
          ::v-deep .el-autocomplete,
          ::v-deep .el-select {
            width: 100%;
            .el-input {
              width: 100%;
            }
          }
          &:nth-child(1) {
            width: 10%;
            padding-left: 1%;
            font-size: 14px;
            color: #606266;
            font-weight: 700;
          }
          &:nth-child(3) {
            width: 10%;
          }
          &:nth-child(5) {
            span {
              margin-right: 8px;
              padding: 6px;
              font-size: $font-size-18;
              color: $module-bg-color;
              &:nth-child(1) {
                background: $text-hover;
                border-radius: 50%;
              }
              &:nth-child(2) {
                background: $auxiliary-orange-active;
                border-radius: 50%;
              }
              &:nth-child(3) {
                background: $panel-bg-disable;
                border-radius: 50%;
              }
              &:hover {
                cursor: pointer;
              }
            }
          }
        }
      }
      &:nth-child(2) {
        padding: 0px;
        & > li {
          position: relative;
          &:last-child {
            &::after {
              content: "";
              position: absolute;
              bottom: 0;
              left: 20%;
              top: 31px;
              width: 30px;
              background: $module-bg-color;
            }
          }
        }
      }
    }
    dl {
      display: flex;
      position: relative;
      margin: 0px;

      dd {
        width: 14.3%;
        margin: 0 5px 0;
        padding-top: 15px;
        ::v-deep .el-input {
          width: 100%;
        }
        &:nth-child(1) {
          width: 20.65%;
        }
        &:nth-child(2) {
          position: relative;
          padding-left: 32px;
          border-left: 2px solid $border-hover;
          &::before {
            content: "";
            width: 20%;
            height: 2px;
            background: $border-hover;
            position: absolute;
            top: 29px;
            left: -1px;
          }
        }
        &:nth-child(3) {
          width: 10%;
        }
        &:nth-child(4) {
          width: 25%;
        }
        &:nth-child(5) {
          span {
            // margin-left: 8px;
            padding: 6px;
            font-size: $font-size-18;
            color: $module-bg-color;
            &:nth-child(1) {
              background: $panel-bg-disable;
              border-radius: 50%;
            }
            &:hover {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  footer {
    margin-top: 20px;
    ul {
      display: flex;
      align-items: center;
      li {
        &:nth-child(1),
        &:nth-child(2) {
          margin-right: 20px;
          span {
            &:nth-child(1) {
              color: $text-normal;
            }
            &:nth-child(2) {
              padding-left: 5px;
              color: $auxiliary-orange-active;
            }
          }
        }
        &:nth-child(3) {
          margin-left: auto;
          margin-right: 20px;
          color: $text-normal;
          cursor: pointer;
          span {
            &:nth-child(2) {
              margin-left: 5px;
            }
          }
        }
      }
    }
  }
}

.li-field {
  cursor: pointer;
  span {
    margin-right: 16px;
    margin-bottom: 6px;
  }
  .secondary_title {
    margin-bottom: 12px;
  }
}
</style>

<style lang="scss">
.module-advanced {
  .el-input__icon {
    line-height: 30px;
  }
}
.child-range-select {
  width: 100% !important;
}
.el-autocomplete-suggestion.el-popper.my-autocomplete {
  width: auto !important;
}
.tabs-content-wrapper {
  min-height: 160px;
}
</style>