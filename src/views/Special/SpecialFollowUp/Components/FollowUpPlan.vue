<template>
  <div class style="height: calc(100% - 36px); background-color: #ffffff">
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
              <i class="el-icon-setting iconColor" v-if="index === current"></i>
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
              <el-radio label="registration">登记后开始</el-radio>
              <!-- <el-radio label="manual">手动选择</el-radio> -->
              <!-- <el-radio label="surgery">手术后开始</el-radio> -->
              <!-- <el-radio label="discharge">出院后开始</el-radio> -->
            </el-radio-group>
            <br />
            <!-- <el-date-picker
              v-show="formData.startMethodCode === 'manual'"
              v-model="formData.startDate"
              type="datetime"
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
                </el-select>次 -->
              </div>
              <div>
                循环终点
                <el-radio-group class="paddingl24" v-model="formData.isEnd">
                  <el-radio :label="2">
                    <el-input
                      type="number"
                      size="mini"
                      min="1"
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
          <el-form-item class="form-title">
            <span>随访表单</span>
          </el-form-item>
          <el-form-item>
            <TemplateSelect
              :options="{ label: 'name', id: 'pkId' }"
              :tempList="formList"
              multiple
              width="20%"
              :checkArr="formData.formId"
              :isFollowForm="false"
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
                @click="templateSelectClick('wechat')"
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
                @click="templateSelectClick('sms')"
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
          </div>
        </el-form>
      </div>
      <div class="text-center margintb24">
        <el-button type="primary" @click="turnBack">返回</el-button>
        <el-button type="primary" @click="saveActive">存为模板</el-button>
        <el-button type="primary" @click="saveStage">保存当前计划</el-button>
        <el-button type="primary" @click="turnActive">下一步</el-button>
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
          :options="{ label: 'title', id: 'id' }"
          :tempList="templateList"
          width="30%"
          :checkArr="templateVal"
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleTemplate = false">取 消</el-button>
          <el-button type="primary" @click="tempSelConfirm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 新增随访计划模板 -->
      <el-dialog
        title="新增专题随访计划模板"
        :visible.sync="dialogVisibleAddPlan"
        width="40%"
        :before-close="handleClose"
      >
        <el-form :model="dataVisit" ref="dataVisit">
          <el-form-item
            class="label100"
            label="模板名称"
            prop="name"
            :rules="RULE.remark_string"
          >
            <el-input
              v-model="dataVisit.name"
              placeholder="请输入访视名称"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="label100"
            label="所属科室"
            prop="departmentId"
            :rules="RULE.remark_string"
          >
            <el-select
              v-model="dataVisit.departmentId"
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
          <el-row>
            <el-col class="dialog-footer">
              <el-button
                class="cancel-btn"
                @click="dialogVisibleAddPlan = false"
                >取 消</el-button
              >
              <el-button
                class="determine-btn marginl24"
                type="primary"
                @click="onConfirm"
                >确 定</el-button
              >
            </el-col>
          </el-row>
        </el-form>
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
  bindProjectPlan,
  getWeChatList,
  getSmsList,
  getTemplateListByDepartment,
  addPlan,
  updatePlan,
  updatePlanName,
  deletePlan,
} from "@/api/visitPlanManagementDetail";

import {
  getDepartments,
  specialAddPlanNode,
  specialSaveFollowupPlan,
  specialVisitPlan,
} from "@/api/specialFollowUp";

import TemplateSelect from "@/components/TemplateSelect";
export default {
  name: "FollowUpPlan",
  components: { TemplateSelect },
  props: {
    projectId: {
      type: String,
      default() {
        return "";
      },
    },
    planId: {
      type: Number,
      default() {
        return -1;
      },
    },
    planName: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      nodeId: -1, // 阶段id
      //   planName: "44",
      backNodeId: "",
      backPlanId: "",
      dialogVisible: false,
      dialogVisibleTemplate: false,
      dialogVisibleAddPlan: false,
      departmentList: [],
      dataVisit: {
        name: "",
        departmentId: "",
      },
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
      opjectPlanId:"",
      formData: {
        startMethodCode: "registration",
        followupMethodCode: [],
        startDate: +new Date(),
        frequencyCode: "uniform",
        isBaseTimes: 0,
        cycleFrequency: "3",
        isEnd: 2,
        endTime: 1,
        endBaseTimes: 0,
        cycleFrequency: 3,

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
          value: 30,
          label: "不限",
        },
      ],
      morenList: [],
      searchConditionValData:""
    };
  },
  created() {
    // if (this.$route.query.status != "新增") {
    // this.getPlanListFn(); // 获取阶段详情
    // }
    this.getPlanListFn(); // 获取阶段详情
    this.getWeChatListFn();
    this.getSmsListFn();
    this.getTemplateListByDepartmentFn();
    this.getDepartmentsFn();
  },
  methods: {
    // 获取模板详情 (选择模板添加 引用模板)
    getPlanIdFn(planId) {
      const postData = {
        planId: planId,
      };

      getPlanList(postData)
        .then((res) => {
          if (res.data.length === 0) {
            this.leftGradation.push({ nodeName: "第1阶段" });
            // 访视计划模板无计划
          } else {
            res.data.forEach((item) => {
              item.followupMethodCode = item.followupMethodCode
                ? item.followupMethodCode.split(",")
                : [];
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
            this.leftGradation = Object.assign(res.data, []);

            this.leftGradation.forEach((item, index) => {
              item["old_id"] = item["id"];
              item["old_planId"] = item["planId"];
              item["id"] = "";
              item["planId"] = "";
            });
            // console.log(
            //   this.formData,
            //   this.leftGradation,
            //   "最后展示的阶段数据",
            //   this.leftGradation
            // );
            res.data &&
              res.data.length > 0 &&
              Object.assign(this.formData, res.data[0]);

            if (this.formData.formId.length == 0) {
              this.formData.formId = [this.morenList[0]["pkId"]];
            }
          }
        })
        .catch((error) => {
          console.error("getPlanList", error);
        });
    },

    bindProjectPlan(dataVal) {
      bindProjectPlan(dataVal)
        .then((res) => {
          let dataBack = res.data.manageNodeList;
          dataBack.length === 0
            ? this.leftGradation.push({ nodeName: "第1阶段" })
            : dataBack.forEach((item) => {
                item.followupMethodCode = item.followupMethodCode
                  ? item.followupMethodCode.split(",")
                  : [];
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

          this.leftGradation = Object.assign(this.leftGradation, dataBack);
          dataBack &&
            dataBack.length > 0 &&
            Object.assign(this.formData, dataBack[this.current]);
        })
        .catch((error) => {
          console.error("getPlanList", error);
        });
    },

    // 获取计划列表数据 根据项目id查
    getPlanListFn() {
      const postData = {
        projectId: this.$route.query.id,
      };
      specialVisitPlan(postData)
        .then((res) => {
          let dataBack = res.data.manageNodeList;
          dataBack.length === 0
            ? this.leftGradation.push({ nodeName: "第1阶段" })
            : dataBack.forEach((item) => {
                item.followupMethodCode = item.followupMethodCode
                  ? item.followupMethodCode.split(",")
                  : [];
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

          this.leftGradation = Object.assign(this.leftGradation, dataBack);
          dataBack &&
            dataBack.length > 0 &&
            Object.assign(this.formData, dataBack[this.current]);

          // this.searchConditionValData = res.data.project.searchCondition

          localStorage.setItem("searchConditionSpecial", res.data.project.searchCondition);
        })
        .catch((error) => {
          console.error("getPlanList", error);
        });
    },
    // 获取科室列表
    getDepartmentsFn() {
      getDepartments()
        .then((res) => {
          this.departmentList = res.data.department;
        })
        .catch((error) => {
          console.error("getDepartments", error);
        });
    },
    // turnActive下一步
    turnActive() {
      this.saveStage("next");
    },
    // 返回
    turnBack() {
      this.$emit("turnBack", 2);
    },
    // 存为模板触发
    saveActive() {
      let planIsSace = true;
      this.leftGradation.forEach(function (item) {
        if (item.planId == undefined || item.planId == null) {
          planIsSace = false;
        }
      });
      if (!planIsSace) {
        this.$message({
          showClose: true,
          message: "请先保存阶段再存为模板",
          type: "warning",
        });
      } else {
        this.dialogVisibleAddPlan = true;
        // this.dataVisit={}
        this.$nextTick(function () {
        this.$refs.dataVisit.resetFields();
      });
      }
    },
    // 确定操作??
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    //模板选择
    templateSelectClick(type) {
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
    // 阶段数据
    planFormData() {
      const postData = {
        nodeName: this.formData.nodeName,
        // nodeDesc: this.formData.nodeDesc || '',
        frontDays: this.formData.frontDays || 0,
        afterDays: this.formData.afterDays || 0,
        cycleFrequency: this.formData.cycleFrequency,
        cycleRegular: this.formData.cycleRegular || 3,
        cycleFrequency: this.formData.cycleFrequency || 3,
        isEnd: this.formData.isEnd,
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

      return postData;
    },
    // 新建计划模板
    onConfirm() {
      this.$refs.dataVisit.validate((valid) => {
        if (valid) {
          const postData = {
            projectId: this.$route.query.id,
            name: this.dataVisit.name,
            departmentId: this.dataVisit.departmentId,
            departmentName: this.departmentList.filter(
              (_) => _.deptId === this.dataVisit.departmentId
            )[0].deptName,
            typeCode: "special",
            id:this.leftGradation[0].planId
          };
          specialSaveFollowupPlan(postData)
            .then((res) => {
              this.$message.success("保存成功");
              this.dialogVisibleAddPlan = false;
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          this.$message.error("必填项不能为空");
        }
      });
    },
    // 阶段新增与编辑
    saveStage(val) {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          let postData = this.planFormData();
          postData.projectId = this.projectId;
          postData.nodeId = this.leftGradation[this.current]["id"];
          postData.planId = this.leftGradation[0]["planId"];
          postData.nodeName = this.leftGradation[this.current]["nodeName"]; //阶段name

          if (val == "next") {
            let allPlan = this.leftGradation.filter((item, index, arr) => {
              return item.id;
            });
            if (
              this.leftGradation.length != allPlan.length &&
              this.leftGradation[this.current]["id"]
            ) {
              return this.$message.error("阶段暂未全部保存");
            }
          }
          specialAddPlanNode(postData)
            .then((res) => {
              this.$message({
                showClose: true,
                message: "阶段保存成功",
                type: "success",
              });
              if (val == "next") {
                this.$emit("childFn", 2);
              }
              // this.backNodeId = res.data.nodeId;
              // this.backPlanId = res.data.planId;
              // this.leftGradation[this.current]["id"]= res.data.nodeId;
              // this.leftGradation[this.current]["planId"]= res.data.planId;

              this.opjectPlanId= res.data.planId
              this.$nextTick(() => {
                this.getPlanListFn();
              });
            })
            .catch((error) => {
              console.error("addPlan", error);
            });
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
        this.currentTab(this.leftGradation.length - 1);
        this.formData.formId = [this.formList[0]["pkId"]];
      }
    },
    //中侧计划列表操作
    handleCommand(command) {
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
        id: this.id,
      };
      updatePlanName(postData)
        .then((res) => {
          this.leftGradation[this.index].nodeName = this.nodeName;
          this.dialogVisible = false;
        })
        .catch((error) => {
          console.error("updatePlanName", error);
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
          this.smsList = res.data;
        })
        .catch((error) => {
          console.error("getSmsList", error);
        });
    },
    //获取表单模板
    getTemplateListByDepartmentFn() {
      let userDeptName = JSON.parse(sessionStorage.getItem("userData"))
        .department;
      let val = {
        departmentName: userDeptName,
        typeCode: "special",
      };
      getTemplateListByDepartment(val)
        .then((res) => {
          this.formList = res.data.dataList;
          // this.formData.formId = [this.formList[0]["pkId"]];
          this.morenList = res.data.dataList.reduce((total, item, index) => {
            if (item.typeCode == "survival") {
              total.push(item);
            }
            return total;
          }, []);
          // this.formData.formId = [this.morenList[0]["pkId"]];
          if (this.formData.formId.length == 0) {
            this.formData.formId = [this.morenList[0]["pkId"]];
          }
        })
        .catch((error) => {
          console.error("getTemplateListByDepartment", error);
        });
    },
    // 切换阶段
    currentTab(index) {
      // this.current = index;
      // this.formData = this.leftGradation[index]
      //   ? Object.assign(
      //       this.$options.data.call(this).formData,
      //       this.leftGradation[index]
      //     )
      //   : this.$options.data.call(this).formData;

      // if (this.formData.formId.length == 0) {
      //   this.formData.formId = [this.morenList[0]["pkId"]];
      // }
      var result = Compare(this.leftGradation[this.current], this.formData);
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
  padding: 16px;
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

//通用
//
.el-form-item {
  padding-left: 20px;
  margin-bottom: 16px;
}
//
.el-form-item__label {
  height: 30px;
  line-height: 30px;
}
// 分割线上下间距过大
.el-divider--horizontal {
  margin: 10px 0 20px;
}
// checkBox  换行后 首个 多缩进
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 0;
}
</style>