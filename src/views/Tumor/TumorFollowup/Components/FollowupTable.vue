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
              <div>
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
              </div>
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
          </div>
        </el-col>
        <el-col :span="11" class="relative paddingt24 paddingl24">
          <el-form
            ref="formDataTumor"
            :model="formData"
            label-width="80px"
            size="mini"
            class="information-fu inputBox100"
          >
            <div class="sign-tag marginb16">
              <span>随访结果</span>
            </div>
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
              v-if="formData.followupStatus == 'lost'"
              label="失访原因"
              class="form-subtitle"
              key="lostCause"
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
              <el-date-picker
                :disabled="isView"
                v-model="formData.checkTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
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
              v-if="formData.followupStatus == 'death'"
              label="死亡时间"
              class="form-subtitle"
              key="deathTime"
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
              <el-date-picker
                :disabled="isView"
                v-model="formData.deathTime"
                type="date"
                value-format="yyyy-MM-dd"
                :picker-options="disDeath"
                placeholder="选择日期"
              ></el-date-picker>
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
        <div class="phone-title" >
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
  components: { TemplateSelect },
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
    console.log("formDataDis----", this.formDataDis);
    this.getCode2();
    this.getCode3();
    this.getIsView();
  },
  methods: {
     // 标记
    signClick() {
      this.dialogVisibleTemplate = true;
      this.phoneId = this.contactNumList.filter(
        (_) => _.value === this.formData.contactNum
      )[0].index;
      let contactNumVal =this.formData.contactNum.split(")")
      if(contactNumVal){
        this.signVal =[contactNumVal[2].substr(1)]
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
      }else{
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
      // if (timeLineItem.groupId != this.$route.query.groupId) {
      //   sessionStorage.setItem("saveIsView", "true");
      //   this.isView = sessionStorage.getItem("saveIsView") == "true";
      // } else {
      //   sessionStorage.setItem("saveIsView", "false");
      //   this.isView = sessionStorage.getItem("saveIsView") == "true";
      // }
    },
    // 获取码值表
    getIsView() {
      // this.isView = sessionStorage.getItem("saveIsView") == "true";
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
.lg_select {
  .contact-number {
     width: calc(100% - 160px);
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
  color: #2F7E7D;
}
</style>