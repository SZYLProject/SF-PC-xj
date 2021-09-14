<!--
 * @Description: 高级搜索
 * @Author: benmo(caoky@dchealth.com)
 * @Date: 2020-07-15 11:27:11
 * @LastEditors: zhangran(b742774335@163.com)
 * @LastEditTime: 2020-08-07 15:33:55
-->
<template>
  <section class="module-advanced">
    <h3>高级搜索</h3>
    <section class="post-link" @click="handleRouter">
      <i class="el-icon-rank"></i>
    </section>
    <el-radio-group v-model="searchForm.searchDimension">
      <section class="patient">
        <el-radio label="0">
          <span>患者维度</span>
          <span class="introduce">某一患者的全院病历共同满足搜索条件，则该病人被检索出</span>
        </el-radio>
      </section>
      <section class="seek">
        <el-radio label="1">
          <span>就诊维度</span>
          <span class="introduce">患者在单次就诊病历中满足全部搜索条件，则该病人被检索出</span>
        </el-radio>
      </section>
    </el-radio-group>
    <section class="condition">
      <ul>
        <li>
          <ol>
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
              <el-select v-model="item.logicVal" placeholder="请选择逻辑关系" v-if="index !== 0">
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
                placeholder="搜索项"
              >
                <i class="el-input__icon el-icon-plus" slot="suffix"></i>
                <template slot-scope="{ item }">
                  <div class="name">{{ item.value }}</div>
                </template>
              </el-autocomplete>
            </li>
            <li>
              <el-select v-model="item.conditionVal" placeholder="关系">
                <el-option
                  v-for="conditionItem in item.conditionList"
                  :key="conditionItem.value"
                  :label="conditionItem.label"
                  :value="conditionItem.value"
                ></el-option>
              </el-select>
            </li>
            <li>
              <el-autocomplete
                v-model="item.range"
                :fetch-suggestions="querySearch"
                placeholder="对比值"
              >
                <i slot="suffix"></i>
                <template slot-scope="{ item }">
                  <div class="name">{{ item.value }}</div>
                </template>
              </el-autocomplete>
            </li>
            <li>
              <span class="el-icon-s-operation" @click="handleAddFilterCon(index)"></span>
              <span class="el-icon-circle-plus-outline" @click="handleAddConItem()"></span>
              <span class="el-icon-circle-close" @click="handleDeleteConItem(index)"></span>
            </li>
          </ol>
          <ol>
            <li v-for="(filterItem, filterIndex) in item.filterList" :key="filterIndex">
              <dl>
                <dd></dd>
                <dd>
                  <el-autocomplete
                    popper-class="my-autocomplete"
                    v-model="filterItem.topicVal"
                    :fetch-suggestions="querySearch"
                    placeholder="搜索项"
                  >
                    <i class="el-input__icon el-icon-plus" slot="suffix"></i>
                    <template slot-scope="{ item }">
                      <div class="name">{{ item.value }}</div>
                    </template>
                  </el-autocomplete>
                </dd>
                <dd>
                  <el-select v-model="filterItem.conditionVal" placeholder="关系">
                    <el-option
                      v-for="conditionItem in filterItem.conditionList"
                      :key="conditionItem.value"
                      :label="conditionItem.label"
                      :value="conditionItem.value"
                    ></el-option>
                  </el-select>
                </dd>
                <dd>
                  <el-autocomplete
                    class="inline-input"
                    v-model="filterItem.range"
                    :fetch-suggestions="querySearch"
                    placeholder="对比值"
                  >
                    <i slot="suffix"></i>
                    <template slot-scope="{ item }">
                      <div class="name">{{ item.value }}</div>
                    </template>
                  </el-autocomplete>
                </dd>
                <dd>
                  <span
                    class="el-icon-circle-close"
                    @click="handleDeleteFilterItem(index, filterIndex)"
                  ></span>
                </dd>
              </dl>
            </li>
          </ol>
        </li>
      </ul>
    </section>
    <footer>
      <ul>
        <li>
          <span>筛出患者</span>
          <span>0</span>
        </li>
        <li>
          <span>病历</span>
          <span>0</span>
        </li>
        <li>
          <span class="el-icon-delete"></span>
          <span>清空条件</span>
        </li>
        <li>
          <el-button type="primary" icon="el-icon-search">搜索</el-button>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        </li>
      </ul>
    </footer>
  </section>
</template>

<script>
export default {
  name: "integrateda-dvanced",
  data() {
    return {
      searchForm: {
        searchDimension: "0",
        conditionItemList: [
          {
            logicVal: "0",
            logicList: [
              {
                label: "并且",
                value: "0",
              },
              {
                label: "排除",
                value: "1",
              },
              {
                label: "或者",
                value: "3",
              },
            ],
            topicVal: "",
            restaurants: [
              { value: "医嘱/医嘱结束时间" },
              { value: "患者/既往史/有无过敏史" },
              { value: "医嘱/医嘱停止时间" },
              { value: "医嘱/下医嘱科室" },
              { value: "病历/出院记录" },
            ],
            conditionVal: "",
            conditionList: [
              {
                label: "包含",
                value: "0",
              },
              {
                label: "不包含",
                value: "1",
              },
              {
                label: "等于",
                value: "2",
              },
              {
                label: "不等于",
                value: "3",
              },
              {
                label: "任意值",
                value: "4",
              },
            ],
            range: "",
            filterList: [],
          },
        ],
      },
    };
  },
  methods: {
    handleRouter() {
      this.$router.push({
        name: "IntegratedAdvanced",
      });
    },
    querySearch(queryString, cb) {
      this.searchForm.conditionItemList.forEach((item) => {
        var restaurants = item.restaurants;
        var results = queryString
          ? restaurants.filter(this.createFilter(queryString))
          : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      });
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    //添加过滤条件
    handleAddFilterCon(index) {
      this.searchForm.conditionItemList[index].filterList.push({
        topicVal: "",
        restaurants: [
          { value: "医嘱/医嘱结束时间" },
          { value: "患者/既往史/有无过敏史" },
          { value: "医嘱/医嘱停止时间" },
          { value: "医嘱/下医嘱科室" },
          { value: "病历/出院记录" },
        ],
        conditionVal: "",
        conditionList: [
          {
            label: "包含",
            value: "0",
          },
          {
            label: "不包含",
            value: "1",
          },
          {
            label: "等于",
            value: "2",
          },
          {
            label: "不等于",
            value: "3",
          },
          {
            label: "任意值",
            value: "4",
          },
        ],
      });
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
            label: "排除",
            value: "1",
          },
          {
            label: "或者",
            value: "3",
          },
        ],
        topicVal: "",
        restaurants: [
          { value: "医嘱/医嘱结束时间" },
          { value: "患者/既往史/有无过敏史" },
          { value: "医嘱/医嘱停止时间" },
          { value: "医嘱/下医嘱科室" },
          { value: "病历/出院记录" },
        ],
        conditionVal: "",
        conditionList: [
          {
            label: "包含",
            value: "0",
          },
          {
            label: "不包含",
            value: "1",
          },
          {
            label: "等于",
            value: "2",
          },
          {
            label: "不等于",
            value: "3",
          },
          {
            label: "任意值",
            value: "4",
          },
        ],
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
    //搜索
    handleSearch() {
      console.log(this.searchForm.conditionItemList);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/variables.scss";
.module-advanced {
  margin-top: 10px;
  min-height: 350px;
  padding: 15px;
  box-sizing: border-box;
  background: $module-bg-color;
  position: relative;
  h3 {
    padding-bottom: 10px;
    border-bottom: 1px solid $rgba-black-15;
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
    margin: 25px 0 0 10px;
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
    border-bottom: 1px solid $rgba-black-15;
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
        width: 16.5%;
        margin: 0 5px 0;
        padding-top: 15px;
        ::v-deep .el-input {
          width: 100%;
        }
        &:nth-child(1) {
          width: 20%;
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
        &:nth-child(5) {
          span {
            margin-left: 8px;
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
</style>
