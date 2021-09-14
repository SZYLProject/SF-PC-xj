<template>
  <div class="sec-main">
    <div class="left-time">
      <div class="time-axis">
        <!-- <div class="time-axis-title">随访时间轴</div> -->
        <el-timeline>
          <el-timeline-item
            v-for="(timeLineItem, index) in timelineList"
            :key="index"
            :icon="timeLineItem.icon"
            :type="timeLineItem.type"
            :color="timeLineItem.color"
            :size="timeLineItem.size"
            :timestamp="timeLineItem.timestamp"
          >
            <div
              class="timeLineItem"
              :class="[
                'timeLineItem',
                isTimeLineItem === index ? 'timeLineItemActive' : '',
              ]"
              @click="cklickTimeLine(timeLineItem, index)"
            >
              {{ timeLineItem.content }}
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <div class="right-content">
      <el-row>
        <el-col :span="13" class="relative paddingt24 paddingl24">
          <div class="lr-divider">
            <el-form :inline="true" ref="form" :model="formDataDis" class="">
              <div class="sign-tag marginb16">
                <span>随访信息</span>
              </div>
              <el-row :gutter="10" class="marginb10">
                <el-col :span="24" class="paddingl25">
                  <span class="label-title">姓名</span>
                  <span class="title-text">{{ formDataDis.name }}</span>
                </el-col>
                <el-col :span="8" class="paddingl25">
                  <span class="label-title">性别</span>
                  <span class="title-text" v-if="formDataDis.sex == 1">男</span>
                  <span class="title-text" v-else-if="formDataDis.sex == 2"
                    >女</span
                  >
                  <span class="title-text" v-else>未知</span>
                </el-col>
                <el-col :span="8">
                  <span class="label-title">年龄</span>
                  <span class="title-text">{{ formDataDis.age }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="10" class="marginb10">
                <el-col :span="8" class="paddingl25">
                  <span class="label-title">病案号</span>
                  <span class="title-text">{{ formDataDis.tpatno }}</span>
                </el-col>
                <el-col :span="16">
                  <span class="label-title">病种</span>
                  <span class="title-text">{{ formDataDis.diseaseName }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="24" class="paddingl25 marginb10">
                  <span class="label-title">现住址</span>
                  <span class="title-text">{{ formDataDis.address }}</span>
                </el-col>
                <el-col :span="24" class="paddingl25 marginb10">
                  <span class="label-title">原发/初治诊断</span>
                  <span class="title-text">{{ formDataDis.mainDiagnose }}</span>
                </el-col>
                <el-col :span="24" class="paddingl25 marginb10">
                  <span class="label-title">原发/初治诊断时间</span>
                  <span class="title-text">{{ formDataDis.confirmDate }}</span>
                </el-col>
                <el-col :span="24" class="paddingl25 marginb12">
                  <span class="label-title">项目信息</span>
                  <span class="title-text">{{
                    formDataDis.projectPlanName
                  }}</span>
                </el-col>
              </el-row>

              <!-- <div>
                <el-form-item label="姓名" class="inline_form-item">
                  <span>{{ formDataDis.name }}</span>
                </el-form-item>
                <el-form-item label="性别" class="inline_form-item">
                  <span v-if="formDataDis.sex == 1">男</span>
                  <span v-else-if="formDataDis.sex == 2">女</span>
                  <span v-else>未知</span>
                </el-form-item>
                <el-form-item label="年龄" class="inline_form-item">
                  <span>{{ formDataDis.age }}</span>
                </el-form-item>
                <el-form-item label="病案号" class="inline_form-item">
                  <span>{{ formDataDis.tpatno }}</span>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="现住址" class="inline_form-item">
                  <span>{{ formDataDis.address }}</span>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="病种" class="inline_form-item">
                  <span>{{ formDataDis.diseaseName }}</span>
                </el-form-item>
                <el-form-item label="原发/初治诊断" class="inline_form-item">
                  <span>{{ formDataDis.mainDiagnose }}</span>
                </el-form-item>
                <el-form-item
                  label="原发/初治诊断时间"
                  class="inline_form-item"
                >
                  <span>{{ formDataDis.confirmDate }}</span>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="项目信息" class="inline_form-item">
                  <span v-if="formDataDis.projectPlanName == null">无</span>
                  <span v-else>{{ formDataDis.projectPlanName }}</span>
                </el-form-item>
              </div> -->
            </el-form>

            <el-form
              ref="form"
              :model="formData"
              size="mini"
              class="information-fu"
            >
              <el-form-item label="联系电话" class="lg_select">
                <el-select
                  :disabled="isView"
                  v-model="formData.contactNum"
                  placeholder="请选择"
                  class="contact-number"
                >
                  <el-option
                    v-for="item in contactNumList"
                    :key="item.index"
                    :label="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-button
                  size="mini"
                  type="primary"
                  class="marginl24"
                  :disabled="isView"
                  @click="signClick"
                  >标记</el-button
                >
              </el-form-item>

              <el-form-item label="补充说明" class="lg_textarea">
                <el-input
                  type="textarea"
                  :disabled="isView"
                  autosize
                  v-model="formData.description"
                ></el-input>
              </el-form-item>
            </el-form>
            <!-- <el-form ref="form" :model="formDataDis" class="">
                <div class="sign-tag marginb10">
                  <span>医嘱</span>
                </div>
                <el-form-item label="医嘱说明" class="lg_textarea">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2}"
                    disabled
                    v-model="formDataDis.discharge"
                  ></el-input>
                </el-form-item>
                <el-form-item class="label100 form-subtitle"></el-form-item>
            </el-form>-->
          </div>
        </el-col>
        <el-col :span="11" class="relative paddingt24 paddingl24">
          <el-form
            ref="formData"
            :model="formData"
            label-width="80px"
            size="mini"
            class="information-fu inputBox100"
          >
            <el-form-item
              label="随访结果"
              class="form-subtitle"
              prop="followupStatus"
              :rules="RULE.remark_string"
            >
              <el-select
                :disabled="isView"
                v-model="formData.followupStatus"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in followupStatusList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              key="lostCause"
              v-if="formData.followupStatus == 'lost'"
              label="失访原因"
              class="form-subtitle"
              prop="lostCause"
              :rules="RULE.remark_string"
            >
              <el-select
                :disabled="isView"
                v-model="formData.lostCause"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in sfyyList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="
                formData.followupStatus == 'relapse' ||
                formData.followupStatus == 'transfer'
              "
              label="检查时间"
              class="form-subtitle"
            >
               <div class="j_dateo_picker">
                <j-date-picker
                  v-model="formData.checkTime"
                  :placeholder="placeholder"
                  :picker-options="disDeath"
                  :rangeSeparator="rangeSeparator"
                  @change="onDateChange"
                  :disabled="isView"
                  :showLunarClass="showLunarClass"
                  :showLunarControl="showLunarControl"
                  :type="type"
                  :showBackYears="showBackYears"
                  :showLunarIcon="showLunarIcon"
                  :format="format"
                >
                </j-date-picker>
              </div>




            </el-form-item>
            <el-form-item
              v-if="formData.followupStatus == 'relapse'"
              label="复发部位"
              class="form-subtitle"
            >
              <el-input
                class
                :disabled="isView"
                v-model="formData.reviewSite"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="formData.followupStatus == 'transfer'"
              label="转移部位"
              class="form-subtitle"
            >
              <el-input
                class
                :disabled="isView"
                v-model="formData.transferSite"
              ></el-input>
            </el-form-item>

            <el-form-item
              key="deathTime"
              v-if="formData.followupStatus == 'death'"
              label="死亡时间"
              class="form-subtitle"
              prop="deathTime"
              :rules="[
                {
                  type: 'string',
                  required: true,
                  message: '请选择日期',
                  trigger: 'change',
                },
              ]"
            >
              <!-- <el-date-picker
                :disabled="isView"
                v-model="formData.deathTime"
                type="date"
                value-format="yyyy-MM-dd"
                :picker-options="disDeath"
                placeholder="选择日期"
              ></el-date-picker> -->
              <div class="j_dateo_picker">
                <j-date-picker
                  v-model="formData.deathTime"
                  :placeholder="placeholder"
                  :picker-options="disDeath"
                  :rangeSeparator="rangeSeparator"
                  @change="onDateChange"
                  :disabled="isView"
                  :showLunarClass="showLunarClass"
                  :showLunarControl="showLunarControl"
                  :type="type"
                  :showBackYears="showBackYears"
                  :showLunarIcon="showLunarIcon"
                  :format="format"
                >
                </j-date-picker>
              </div>
            </el-form-item>
            <el-form-item
              v-if="formData.followupStatus == 'death'"
              label="是否在院死亡"
              class="form-subtitle"
              label-width="100px"
            >
              <el-radio-group :disabled="isView" v-model="formData.ifHospital">
                <el-radio :label="0">在院死亡</el-radio>
                <el-radio :label="1">非在院死亡</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="formData.followupStatus == 'death'"
              label="是否肿瘤死亡"
              class="form-subtitle"
              label-width="100px"
            >
              <el-radio-group :disabled="isView" v-model="formData.ifDeath">
                <el-radio :label="0">肿瘤死亡</el-radio>
                <el-radio :label="1">非肿瘤死亡</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备　　注" class="form-subtitle">
              <el-input
                :disabled="isView"
                size="textarea"
                :rows="2"
                class
                v-model="formData.remarks"
              ></el-input>
            </el-form-item>
            <el-form-item label="接通情况" v-if="false">
              <TemplateSelect
                :tempList="connectTypeList"
                width="100px"
                :checkArr="formData.formId"
                :options="{ label: 'name', id: 'code' }"
                :isView="isView"
                style="margin-left: 0px"
              />
            </el-form-item>
            <div class="wx-title" v-if="formData.followupType == 'wechat'">
              随访结果来自微信
            </div>
          </el-form>
        </el-col>
      </el-row>
      <!-- 选择模板弹窗 -->
      <el-dialog
        title="接通情况"
        :visible.sync="dialogVisibleTemplate"
        width="560px"
      >
        <TemplateSelect
          :tempList="connectTypeList"
          width="100px"
          :options="{ label: 'name', id: 'name' }"
          :isView="isView"
          style="margin-left: 0px"
          :checkArr="signVal"
        />
        <div class="phone-title">
          针对当前电话号码接通情况进行标记，空号/号码错误该号码将标记为无效。
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleTemplate = false">取 消</el-button>
          <el-button
            :disable="signVal.length"
            type="primary"
            @click="signConfirmFn"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getFindAllByTypeCode } from "@/api/specialFollowUp";
import JDatePicker from "vue-jlunar-datepicker";
// import {
//   postUpdateConcat,
// } from "@/api/routineFollowup";
import TemplateSelect from "@/components/TemplateSelect";
export default {
  name: "FollowupTable",
  props: {
    contactNumList: {
      type: Array,
      default() {
        return [];
      },
    },
    connectTypeList: {
      type: Array,
      default() {
        return [];
      },
    },
    formData: {
      type: Object,
      default() {
        return {};
      },
    },
    formDataDis: {
      type: Object,
      default() {
        return {};
      },
    },
    timelineList: {
      type: Array,
      default() {
        return [];
      },
    },
    isTimeLineItem: {
      type: Number,
      default() {
        return 0;
      },
    },
    isView: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  components: { TemplateSelect, JDatePicker },
  computed: {
    contactNumChange() {
      return this.formData.contactNum;
    },
  },
  watch: {
    contactNumChange(now, old) {
      if (now.slice(0, 11) != old.slice(0, 11)) {
        this.contactNumChangeFn();
      }
    },
  },
  data() {
    return {
      type: "DATE",
      showLunarClass: "MIX", //农历日期的显示类型；不区分大小写； FULLLUNAR/LUNAR/NUMBER/MIX
      showBackYears: 0, // 可选年份
      showLunarIcon: false, // 农历图标
      showLunarControl: false, // 农历显示开关
      width1: "100%",
      format: "YYYY-MM-DD",
      placeholder: "请选择日期",
      rangeSeparator: "-",
      disabled: false,
      editable: true,
      clearable: true,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },

      // 时间
      dialogVisibleTemplate: false,
      signVal: [],
      phoneId: "",
      treatmentList: [],
      outhospitalList: [],
      pipeList: [],
      followupStatusList: [],
      sfyyList: [],

      disDeath: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.formDataDis.confirmDate);
        },
      },
    };
  },
  created() {
    this.getCode2();
    this.getCode3();
  },
  methods: {
    // 时间change
    onDateChange(val) {
      console.log(val, "onDateChange");
    },
    // 标记
    signClick() {
      this.dialogVisibleTemplate = true;
      this.phoneId = this.contactNumList.filter(
        (_) => _.value === this.formData.contactNum
      )[0].index;
      let contactNumVal = this.formData.contactNum.split(")");
      if (contactNumVal) {
        this.signVal = [contactNumVal[2].substr(1)];
      }
    },
    // 标记确定
    signConfirmFn() {
      if (this.signVal.length > 0) {
        this.dialogVisibleTemplate = false;
        let postData = {
          idStr: this.phoneId,
          connections: this.signVal[0],
        };
        this.$emit("signConfirmFn", postData);
      } else {
        this.$message.warning("请选择接通情况");
      }
    },
    // 电话改变
    contactNumChangeFn() {
      this.$emit("contactNumChangeFn");
    },
    // 时间轴点击
    cklickTimeLine(timeLineItem, index) {
      this.$emit("clickTimeItem", timeLineItem, index);
    },
    // lostCause  获取失访原因下拉
    getCode2() {
      let data = {
        typeCode: "lostCause",
      };
      getFindAllByTypeCode(data)
        .then((res) => {
          this.sfyyList = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 获取随访结果下拉
    getCode3() {
      let data = {
        typeCode: "finish",
      };
      getFindAllByTypeCode(data)
        .then((res) => {
          this.followupStatusList = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getCode4() {
      let data = {
        typeCode: "pipe",
      };
      getFindAllByTypeCode(data)
        .then((res) => {
          this.pipeList = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.sec-main {
  display: flex;
  .left-time {
    width: 216px;
    min-height: calc(100vh - 220px);
    border-right: 16px solid #e8f1fa;
  }
  .right-content {
    flex: 1;
    padding-bottom: 36px;
  }
}

.time-axis {
  padding-top: 24px;
  padding-left: 10%;
  margin: 0 auto;
  .time-axis-title {
    color: #999999;
    font-size: 14px;
    margin-bottom: 20px;
  }
}

.lr-divider:before {
  content: "";
  position: absolute;
  width: 1px;
  height: 80%;
  background: #cccccc;
  top: 13%;
  right: 0;
}
.isuse {
  display: inline-block;
  color: #2476c2;
  margin-right: 20px;
}
</style>
<style lang="scss" >
.inline_form-item {
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
}
.label-no .el-form-item__content {
  margin-left: 0px !important;
}
.information-fu {
  // padding-top: 20px;
  .form-title {
    height: 20px;
    padding-left: 0;
    font-weight: bold;
    .el-form-item__content {
      line-height: 20px;
      margin-left: 0px !important;
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
      background: #2476c2;
      color: #fff;
      span {
        border: none;
        padding: 0;
      }
    }
  }
  .title-form {
    padding-left: 16px;
    line-height: 30px;
    .label-span {
      font-size: 14px;
      color: #606266;
      font-weight: 700;
    }
  }
}
</style>
<style lang="scss" >
.lg_textarea {
  .el-textarea {
    width: calc(100% - 80px);
  }
}
.inputBox100 {
  .el-select,
  .el-date-editor {
    width: 100%;
  }
}
.timeLineItem {
  cursor: pointer;
}
.timeLineItemActive {
  color: #2f7e7d;
}
.label-title {
  height: 36px;
  line-height: 36px;
  overflow: hidden;
  font-size: 14px;
  color: #606266;
  font-weight: 700;
}
.title-text {
  height: 36px;
  line-height: 36px;
  margin-left: 12px;
  overflow: hidden;
  font-size: 14px;
  color: #2c3e50;
}
.paddingl25 {
  padding-left: 25px !important;
}
.marginb10 {
  // margin-bottom: 10px;
}
.marginb12 {
  margin-bottom: 12px;
}
.wx-title {
  color: #999999;
  font-size: 14px;
  padding-left: 36px;
}
.j_dateo_picker {
  width: 100%;
  .full-jcalendar__main {
    // width: 420px;
    .full-jcalendar-header {
      height: 38px;
      p.prev-mont {
        left: 14px;
        top: 6px;
      }
      p.next-month {
        right: 12px;
        top: 6px;
      }
    }
    .full-jcalendar__body {
      min-height: 350px;
      p {
        margin: -4px;
      }
      // p {
      //   display: block;
      //   margin-block-start: 0em;
      //   margin-block-end: 0em;
      //   margin-inline-start: 0px;
      //   margin-inline-end: 0px;
      // }
    }
  }
}
</style>