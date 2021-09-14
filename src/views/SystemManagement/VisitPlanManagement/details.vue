<template>
  <div
    class="content"
    style="height: calc(100% - 36px)"
    v-loading="planLoading"
  >
    <div class="clearfix relative">
      <!-- <span class="crumb-last fl">访视计划管理>{{ planName }}</span> -->
      <ul class="operationBtn fr">
        <!-- <li><el-button size="mini" type="primary">删除</el-button></li> -->
        <li>
          <el-button size="mini" type="primary" @click="$router.go(-1)"
            >取消</el-button
          >
        </li>
        <li>
          <el-button size="mini" type="primary" @click="saveFn">保存</el-button>
        </li>
      </ul>
    </div>
    <div id="visitPlan">
      <!-- 中侧随访计划列表 -->
      <ul class="plan-gradation">
        <li v-for="(item, index) in leftGradation" :key="index">
          <!-- <i
            class="el-icon-full-screen iconColor"
            v-show="index === current"
          ></i> -->
          <span
            :class="{ active: index === current, 'over-elli': true }"
            @click="currentTab(index)"
          >
            {{ item.nodeName }}
          </span>
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              <i
                class="el-icon-setting iconColor"
                v-show="index === current"
              ></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :command="{ item: item, type: 'edit', index: index }"
                >编辑</el-dropdown-item
              >
              <el-dropdown-item
                :command="{ item: item, type: 'delete', index: index }"
                >删除</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li class="addBtn">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="addStage"
            >添加阶段</el-button
          >
        </li>
      </ul>
      <!-- 右随访计划详情 -->
      <div class="plan-content">
        <el-form :model="formData" ref="formData">
          <el-form-item class="form-title">
            <span class="afterBadge">随访方式</span>
          </el-form-item>
          <el-form-item prop="followupMethodCode" :rules="RULE.remark_Arr">
            <el-checkbox-group v-model="formData.followupMethodCode">
              <el-checkbox label="telephone">电话随访</el-checkbox>
              <el-checkbox label="wechat">微信随访</el-checkbox>
              <!-- <el-checkbox label="app">app随访</el-checkbox> -->
              <el-checkbox label="sms">短信随访</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item class="form-title">
            <span>随访频次</span>
          </el-form-item>
          <el-form-item label="开始时间" class="label100 form-subtitle">
            <el-radio-group v-model="formData.startMethodCode">
              <!-- 专题随访 只有手动和登记后 -->
              <!--生存随访/肿瘤随访 只有出院后开始 -->
              <el-radio v-if="typeCode == 'special'" label="registration"
                >登记后开始</el-radio
              >
              <!-- <el-radio v-if="typeCode == 'special'" label="manual"
                >手动选择</el-radio
              >
              <el-radio label="surgery">手术后开始</el-radio> -->
              <el-radio v-if="typeCode != 'special'" label="discharge"
                >出院后开始</el-radio
              >
            </el-radio-group>
            <br />
            <!-- <el-date-picker
              v-show="formData.startMethodCode === 'manual'"
              v-model="formData.startDate"
              type="date"
              size="mini"
              placeholder="请手动选择日期"
            ></el-date-picker> -->
          </el-form-item>
          <el-form-item label="随访频率" class="label100 form-subtitle">
            <el-radio-group v-model="formData.frequencyCode">
              <el-radio label="uniform">均匀随访</el-radio>
              <el-radio label="regular">定期随访</el-radio>
              <!-- <el-radio label="unlimited">不限制</el-radio> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <div
              class="paddingl24"
              v-show="formData.frequencyCode === 'uniform'"
            >
              <div class="paddingb12">
                循环起点距离开始时间
                <el-input
                  type="number"
                  min="0"
                  size="mini"
                  class="inputDay"
                  v-model="formData.isBaseTimes"
                ></el-input
                >天
              </div>
              <div class="paddingb12">
                每
                <el-input
                  type="number"
                  min="0"
                  size="mini"
                  class="inputDay"
                  v-model="formData.cycleFrequency"
                ></el-input
                >天随访一次
                <!-- 随访次数
                  <el-select
                    size="mini"
                    class="inputDay"
                    v-model="formData.cycleFrequency"
                    filterable
                    allow-create
                    default-first-option
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                </el-select>次-->
              </div>
              <div>
                循环终点
                <el-radio-group class="paddingl24" v-model="formData.isEnd">
                  <el-radio :label="2">
                    <el-input
                      type="number"
                      min="1"
                      size="mini"
                      class="inputDay"
                      v-model="formData.endTime"
                    ></el-input
                    >次
                  </el-radio>
                  <el-radio :label="1">
                    距离开始时间
                    <el-input
                      type="number"
                      min="0"
                      size="mini"
                      class="inputDay"
                      v-model="formData.endBaseTimes"
                    ></el-input
                    >天
                  </el-radio>
                  <el-radio :label="0">无限期</el-radio>
                </el-radio-group>
              </div>
            </div>
            <div
              class="paddingl24"
              v-show="formData.frequencyCode === 'regular'"
            >
              <ul>
                <li v-for="(item, index) in formData.cycleRegular" :key="index">
                  <span>第{{ item.index }}次</span>
                  开始时间后第
                  <el-input
                    type="number"
                    min="0"
                    size="mini"
                    class="inputDay"
                    v-model="item.value"
                  ></el-input
                  >天
                  <i
                    v-if="formData.cycleRegular.length === item.index"
                    class="el-icon-circle-plus"
                    @click="hz2Add(index)"
                  ></i>
                  <i
                    v-if="
                      formData.cycleRegular.length === item.index &&
                      formData.cycleRegular.length > 1
                    "
                    class="el-icon-remove"
                    @click="hz2Delete(index)"
                  ></i>
                </li>
              </ul>
            </div>
          </el-form-item>
          <!-- <el-form-item label="失访时间">
            超过随访点<el-input type="number" min="0" size="mini" v-model="formData.cycleFrequency" style="width:60px;"></el-input>天
          </el-form-item>-->
          <el-form-item label="偏差时间" class="form-subtitle">
            允许在随访点之前
            <el-input
              type="number"
              min="0"
              size="mini"
              class="inputDay"
              v-model="formData.frontDays"
            ></el-input
            >天，之后
            <el-input
              type="number"
              min="0"
              size="mini"
              class="inputDay"
              v-model="formData.afterDays"
            ></el-input
            >天当次随访
          </el-form-item>
          <el-divider></el-divider>
          <el-divider></el-divider>
          <el-form-item class="form-title">
            <span>随访表单</span>
          </el-form-item>
          <el-form-item>
            <TemplateSelect
              :options="{ label: 'name', id: 'pkId' }"
              :isFollowForm="false"
              :tempList="formList"
              multiple
              width="20%"
              :checkArr="formData.formId"
              :selectType="'formSelect'"
            />
          </el-form-item>
          <el-divider></el-divider>
          <div v-show="formData.followupMethodCode.includes('wechat')">
            <el-form-item class="form-title">
              <span>微信内容</span>
              <el-button
                size="mini"
                class="fr"
                icon="el-icon-plus"
                @click="templateSelect('wechat')"
                >选择模板</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-input
                type="textarea"
                size="mini"
                v-model="formData.wechatContent"
                maxlength="240"
              ></el-input>
            </el-form-item>
            <el-divider></el-divider>
          </div>
          <div v-show="formData.followupMethodCode.includes('sms')">
            <el-form-item class="form-title">
              <span>短信内容</span>
              <el-button
                size="mini"
                class="fr"
                icon="el-icon-plus"
                @click="templateSelect('sms')"
                >选择模板</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-input
                type="textarea"
                size="mini"
                v-model="formData.smsContent"
                maxlength="240"
              ></el-input>
            </el-form-item>
            <!-- <el-divider></el-divider> -->
          </div>
          <!-- <div class="wrapper-container" :style="{height : showMore ? 'auto': '0'}">
            <el-form-item class="form-title"><span>异常数据提醒</span></el-form-item>  
            <el-form-item>
                异常数据提醒
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item class="form-title"><span>自动结束随访</span></el-form-item>
            <el-form-item>
                自动结束随访
            </el-form-item>
        </div>
        <div class="control">
            <el-button type="text" @click="toggleShowMore">{{ showMore ? '收起高级设置' : '显示高级设置'}}</el-button>
          </div>-->
        </el-form>
      </div>
      <!-- 编辑中侧计划名称 -->
      <el-dialog title="修改阶段名称" :visible.sync="dialogVisible" width="30%">
        <el-input size="mini" v-model="nodeName"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="planNameChange">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 选择模板弹窗 -->
      <el-dialog
        title="模板选择"
        :visible.sync="dialogVisibleTemplate"
        width="70%"
      >
        <TemplateSelect
          :tempList="templateList"
          width="30%"
          :checkArr="templateVal"
          :options="{ label: 'title', id: 'id' }"
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleTemplate = false">取 消</el-button>
          <el-button type="primary" @click="tempSelConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  parseTime,
  isArray,
  isObj,
  getLength,
  Compare,
} from "@/utils/index.js";
import {
  getPlanList,
  getWeChatList,
  getSmsList,
  getFormList,
  addPlan,
  updatePlan,
  updatePlanName,
  deletePlan,
  
getTemplateListByDepartment
} from "../../../api/visitPlanManagementDetail";
import TemplateSelect from "@/components/TemplateSelect";
export default {
  name: "VisitPlanManagementDetails",
  components: { TemplateSelect },
  data() {
    return {
      planLoading: false,
      planId: this.$route.query.id, //当前计划id
      planName: this.$route.query.name,
      typeCode: this.$route.query.typeCode,
      dialogVisible: false,
      dialogVisibleTemplate: false,
      nodeName: "",
      current: 0,
      leftGradation: [],
      templateType: "",
      templateVal: [],
      templateList: [],
      formList: [],
      wechatList: [],
      smsList: [],
      showMore: false,
      formData: {
        startMethodCode: "discharge",
        followupMethodCode: [],
        startDate: +new Date(),
        frequencyCode: "uniform",
        isBaseTimes: 0,
        cycleFrequency: "3",
        isEnd: 2,
        endTime: 1,
        endBaseTimes: 0,
        cycleFrequency: 1,
        formId: [],
        wechatContent: "",
        smsContent: "",
        frontDays: 0,
        afterDays: 0,
        cycleRegular: [
          { value: 20, index: 1 },
          { value: 40, index: 2 },
        ],
      },
      options: [
        {
          value: 3,
          label: "3",
        },
        {
          value: 6,
          label: "6",
        },
        {
          value: 9,
          label: "9",
        },
        {
          value: 9999,
          label: "不限",
        },
      ],
    };
  },
  created() {
    //  startMethodCode: "discharge",
    if (this.$route.query.typeCode == "special") {
      this.formData.startMethodCode = "registration";
    }
    this.getPlanListFn();
    this.getWeChatListFn();
    this.getSmsListFn();
    this.getFormListFn();
  },
  methods: {
    //模板选择
    templateSelect(type) {
      this.templateVal = [];
      this.templateType = type;
      if (type === "wechat") this.templateList = this.wechatList;
      else this.templateList = this.smsList;
      this.dialogVisibleTemplate = true;
    },
    //模板选择确认
    tempSelConfirm() {
      let content = this.templateList.filter(
        (_) => _.id === this.templateVal[0]
      )[0].content;
      if (this.templateType === "wechat") this.formData.wechatContent = content;
      else this.formData.smsContent = content;
      this.dialogVisibleTemplate = false;
    },
    // 模板新增与编辑
    saveFn() {
      this.planLoading = true;
      const postData = {
        // nodeName: this.formData.nodeName,
        // nodeDesc: this.formData.nodeDesc || '',
        frontDays: this.formData.frontDays || 0,
        afterDays: this.formData.afterDays || 0,
        cycleFrequency: this.formData.cycleFrequency,
        cycleRegular: this.formData.cycleRegular || 3,
        cycleFrequency: this.formData.cycleFrequency || 3,
        isEnd: this.formData.isEnd || 0,
        endBaseTimes: this.formData.endBaseTimes || 0,
        endTime: this.formData.endTime,
        isBaseTimes: Number(this.formData.isBaseTimes) || 0,
        followupMethodCode: this.formData.followupMethodCode,
        // followupMethodName: this.formData.followupMethodName,
        startMethodCode: this.formData.startMethodCode,
        // startMethodName: this.formData.startMethodName,
        startDate: parseTime(this.formData.startDate),
        formId: this.formData.formId,
        // formName: this.formData.formName,
        // templateId: this.formData.templateId,
        // templateTitle: this.formData.templateTitle,
        wechatContent: this.formData.wechatContent,
        smsContent: this.formData.smsContent,
        frequencyCode: this.formData.frequencyCode,
        exceptions: this.formData.exceptions || [],
        ends: this.formData.ends || [],
      };
      postData.followupMethodCode = postData.followupMethodCode.join(",");
      postData.formId = postData.formId.join(",");
      postData.cycleRegular = postData.cycleRegular
        .reduce((total, item) => {
          return (total += item.value + ",");
        }, "")
        .replace(/,$/gi, "");

      postData.nodeName = this.leftGradation[this.current]["nodeName"]; //阶段name

      console.log(
        "postData",
        postData,
        "当前：，",
        this.formData,
        "左侧",
        this.leftGradation
      );

      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.formData.id) {
            postData.id = this.formData.id;
            updatePlan(postData)
              .then((res) => {
                console.log("updatePlan", res);
                this.$message({
                  showClose: true,
                  message: res.data,
                  type: "success",
                });
                this.planLoading = false;
                this.getPlanListFn();
              })
              .catch((error) => {
                this.planLoading = false;
                console.error("updatePlan", error);
              });
          } else {
            postData.planId = this.planId;
            addPlan(postData)
              .then((res) => {
                console.log("addPlan", res);
                this.$message({
                  showClose: true,
                  message: res.data,
                  type: "success",
                });
                this.planLoading = false;
                this.getPlanListFn();
              })
              .catch((error) => {
                this.planLoading = false;
                console.error("addPlan", error);
              });
          }
        } else {
          this.$message.error("必填项不能为空");
        }
      });
    },
    //中侧计划列表添加阶段
    addStage() {
      let nextAddList = [];
      this.leftGradation.forEach((element) => {
        if (element.id == undefined) {
          nextAddList.push(element);
        }
      });
      if (nextAddList.length == 1) {
        this.$message({
          showClose: true,
          message: "请先保存阶段再添加新阶段",
          type: "warning",
        });
      } else {
        this.leftGradation.push({
          nodeName: "第" + (this.leftGradation.length + 1) + "阶段",
        });
        this.formData.formId = [this.formList[0]["pkId"]];
      }
    },
    //中侧计划列表操作
    handleCommand(command) {
      console.log(command);
      if (command.type === "edit") {
        this.nodeName = command.item.nodeName;
        this.id = command.item.id;
        this.index = command.index;
        this.dialogVisible = true;
      } else {
        if (command.item.id) {
          const postData = {
            id: command.item.id,
          };
          deletePlan(postData)
            .then((res) => {
              console.log("deletePlan", res);
              this.current = 0;
              this.getPlanListFn();
              this.dialogVisible = false;
            })
            .catch((error) => {
              console.error("deletePlan", error);
            });
        } else {
          this.leftGradation.splice(command.index, 1);
          this.current = 0;
        }
      }
    },
    //中侧计划名称编辑
    planNameChange() {
      const postData = {
        nodeName: this.nodeName,
        id: this.id, // 计划id
      };
      updatePlanName(postData)
        .then((res) => {
          console.log("updatePlanName", res);
          this.leftGradation[this.index].nodeName = this.nodeName;
          this.dialogVisible = false;
        })
        .catch((error) => {
          console.error("updatePlanName", error);
        });
    },
    //获取计划列表数据
    getPlanListFn() {
      const postData = {
        planId: this.planId,
      };
      this.planLoading = true;
      getPlanList(postData)
        .then((res) => {
          this.planLoading = false;
          console.log("getPlanList", res);
          if (res.data.length === 0) {
            this.leftGradation.push({ nodeName: "第1阶段" });
          } else {
            res.data.forEach((item) => {
              item.followupMethodCode = item.followupMethodCode.split(",");
              item.formId = item.formId.split(",").map(Number);
              item.cycleRegular = item.cycleRegular
                .split(",")
                .reduce((total, _, index) => {
                  total.push({
                    value: _,
                    index: index + 1,
                  });
                  return total;
                }, []);
              this.tempFormLoaded = true;
            });
            this.leftGradation = {};
            this.leftGradation = Object.assign(res.data, this.leftGradation);
            res.data &&
              res.data.length > 0 &&
              Object.assign(this.formData, res.data[this.current]);
          }
        })
        .catch((error) => {
          console.error("getPlanList", error);
        });
    },
    //获取微信模板
    getWeChatListFn() {
      let userDeptName = JSON.parse(sessionStorage.getItem("userData"))
        .department;
      let getData = {
        typeCode: "special",
        depart: userDeptName,
      };
      getWeChatList(getData)
        .then((res) => {
          console.log("getWeChatList", res);
          this.wechatList = res.data;
        })
        .catch((error) => {
          console.error("getWeChatList", error);
        });
    },
    //获取短信模板
    getSmsListFn() {
      let userDeptName = JSON.parse(sessionStorage.getItem("userData"))
        .department;
      let getData = {
        typeCode: "special",
        depart: userDeptName,
      };
      getSmsList(getData)
        .then((res) => {
          console.log("getSmsList", res);
          this.smsList = res.data;
        })
        .catch((error) => {
          console.error("getSmsList", error);
        });
    },
    //获取表单模板
    getFormListFn() {
      let userDeptName = JSON.parse(sessionStorage.getItem("userData"))
        .department;
      let val = {
        departmentName: userDeptName,
        typeCode: this.typeCode,
      };
      getTemplateListByDepartment(val)
        .then((res) => {
          // this.formData.formId = [this.formList[0]["pkId"]];
          if (this.typeCode == "special") {
            this.formList = res.data.dataList
            let morenList = res.data.dataList.reduce((total, item, index) => {
              if (item.typeCode == "survival") {
                total.push(item);
              }
              return total;
            }, []);
            if (this.formData.formId.length == 0) {
              this.formData.formId = [morenList[0]["pkId"]];
            }
          } else {
            this.formList = res.data.dataList.reduce((total, item, index) => {
              if (item.typeCode == "survival") {
                total.push(item);
              }
              return total;
            }, []);

            if (this.formData.formId.length == 0) {
              this.formData.formId = [this.formList[0]["pkId"]];
            }
          }
          console.log("获取表单模板", this.formList, this.formData.formId);
        })
        .catch((error) => {
          console.error("getFormList", error);
        });
    },
    // 阶段列表点击
    currentTab(index) {
      var result = Compare(this.leftGradation[this.current], this.formData);
      console.log(result);
      let state = !this.leftGradation[this.current]?.planId;
      if (
        state ||
        (!result && this.leftGradation[this.current].id != this.formData.id)
      ) {
        this.$confirm("本阶段信息尚未保存，是否确认切换？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.current = index;
          this.formData = this.leftGradation[index]
            ? Object.assign(
                this.$options.data.call(this).formData,
                this.leftGradation[index]
              )
            : this.$options.data.call(this).formData;
          if (this.formData.formId.length == 0) {
            this.formData.formId = [this.formList[0]["pkId"]];
          }
        });
      } else {
        this.current = index;
        this.formData = this.leftGradation[index]
          ? Object.assign(
              this.$options.data.call(this).formData,
              this.leftGradation[index]
            )
          : this.$options.data.call(this).formData;
        if (this.formData.formId.length == 0) {
          this.formData.formId = [this.formList[0]["pkId"]];
        }
      }
    },
    toggleShowMore() {
      this.showMore = !this.showMore;
    },
    hz2Add(index) {
      this.formData.cycleRegular.push({
        value: this.formData.cycleRegular[0].value * (index + 2),
        index: index + 2,
      });
    },
    hz2Delete(index) {
      this.formData.cycleRegular.splice(index, 1);
    },
  },
};
</script>

<style lang="scss">
.operationBtn {
  position: absolute;
  right: 20px;
  top: -42px;
  display: inline-block;
  text-align: right;
  li {
    display: inline-block;
    margin-right: 20px;
    button {
      background: #2f7e7d;
      border-radius: 2px;
      color: #fff;
    }

    &:last-child button {
      background: #2f7e7d;
      color: #fff;
    }
  }
}
#visitPlan {
  // height: 100%;
  margin-bottom: 16px;
  padding: 16px;
  background: #fff;
  .plan-gradation {
    display: inline-block;
    width: 150px;
    height: calc(100% - 35px);
    background: #eef4fa;
    border: 1px solid #eef4fa;
    li {
      margin: 10px 0;
      text-align: center;
    }
    .iconColor {
      color: #2476c2;
    }
    .over-elli {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: inline-block;
      vertical-align: sub;
      width: 70%;
      text-align: center;
    }
    .addBtn {
      text-align: center;
    }
  }
  .plan-content {
    vertical-align: top;
    display: inline-block;
    width: calc(100% - 150px);
    padding: 10px 20px;
    border: 1px solid #eef4fa;
  }
  .active {
    color: #2476c2;
  }
  .wrapper-container {
    position: relative;
    padding-bottom: 0;
    overflow: hidden;
  }
  .control {
    // position: absolute;
    // bottom: 0;
    width: 100%;
    padding-top: 40px;
    text-align: center;
    // background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, #000 70%);
    background: #fff;
  }
  .form-title {
    height: 20px;
    padding-left: 0;
    font-weight: bold;
    .el-form-item__content {
      line-height: 20px;
      color: #333333;
      span {
        display: inline-block;
        border-left: 3px solid #2476c2;
        padding-left: 16px;
      }
      .afterBadge:after {
        content: "*";
        color: #f56c6c;
        margin-left: 4px;
        font-size: 16px;
      }
    }
    .el-button {
      background: #2f7e7d;
      color: #fff;
      span {
        border: none;
        padding: 0;
      }
    }
  }
  .inputDay {
    width: 80px;
    margin: 0 10px;
  }
  .form-subtitle .el-form-item__label {
    color: #999999;
  }
}
</style>