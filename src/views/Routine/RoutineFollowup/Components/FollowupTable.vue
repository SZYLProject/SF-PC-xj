<template>
  <div class="sec-main relative">
    <div class="mainContent">
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
                <el-row :gutter="10">
                  <el-col :span="8"
                    ><el-form-item label="姓名" class="inline_form-item">
                      <span>{{ formDataDis.name }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="性别" class="inline_form-item">
                      <span v-if="formDataDis.sex == 1">男</span>
                      <span v-else-if="formDataDis.sex == 2">女</span>
                      <span v-else>未知</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="年龄" class="inline_form-item">
                      <span>{{ formDataDis.age }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- <el-form-item label="科室" class="inline_form-item">
                    <span>{{ formDataDis.departmentName }}</span>
                  </el-form-item>
                  <el-form-item label="床号" class="inline_form-item">
                    <span>{{ formDataDis.p231 }}</span>
                  </el-form-item> -->
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item label="住院号" class="inline_form-item">
                      <span>{{ formDataDis.visitId }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="住院天数" class="inline_form-item">
                      <span>{{ formDataDis.p27 }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="治疗结果" class="inline_form-item">
                      <span>{{ formDataDis.p323 }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item label="入院时间" class="inline_form-item">
                      <span>{{ formDataDis.firstConfirmDate }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item label="入院科室" class="inline_form-item">
                      <span>{{ formDataDis.p23 }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item label="出院时间" class="inline_form-item">
                      <span>{{ formDataDis.dcDate }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item label="出院科室" class="inline_form-item">
                      <span>{{ formDataDis.departmentName }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div>
                  <el-form-item label="入院诊断" class="inline_form-item">
                    <span>{{ formDataDis.p322 }}</span>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item label="出院诊断" class="inline_form-item">
                    <span>{{ formDataDis.icd10NAME1 }}</span>
                  </el-form-item>
                </div>

                <!-- <el-form-item label="出院时间" class="inline_form-item">
                  <span>{{ formDataDis.dcDate }}</span>
                </el-form-item> -->
                <!-- <el-form-item label="治疗方式" class="inline_form-item">
                     <span>{{formDataDis.treatType}}</span>
                </el-form-item>-->
                <!-- <el-form-item label="出院状况" class="inline_form-item">
                     <span>{{formDataDis.dcCondition}}</span>
                </el-form-item>
                <el-form-item label="导管" class="inline_form-item">
                     <span>{{formDataDis.pil}}</span>
                </el-form-item>-->
                <!-- <el-form-item label="证件号" class="inline_form-item">
                  <span>3781645481211445</span>
                </el-form-item>
                <el-form-item label="病案号" class="inline_form-item">
                  <span>5454654546565</span>
                </el-form-item>
                <el-form-item label="病种" class="inline_form-item">
                  <span>肺癌</span>
                </el-form-item>
                <el-form-item label="初治诊断" class="inline_form-item">
                  <span>作废转移癌</span>
                </el-form-item>
                <el-form-item label="初治确诊时间" class="inline_form-item">
                  <span>2018-02-30</span>
                </el-form-item>-->
              </el-form>
              <el-form ref="form" :model="formData" class="information-fu">
                <el-form-item label="联系电话" class="lg_select">
                  <el-select
                    size="mini"
                    :disabled="isView"
                    class="contact-number"
                    v-model="formData.contactNum"
                    placeholder="请选择"
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
                    v-model="formData.supplement"
                  ></el-input>
                </el-form-item>
                <!-- <el-form-item label-width="66px" label="医嘱" class="yizhu_textarea">
                  <el-input type="textarea" v-model="formData.supplement"></el-input>
                </el-form-item>-->
              </el-form>
              <el-form ref="form" :model="formDataDis" class="">
                <div class="sign-tag marginb16">
                  <span>出院记录</span>
                </div>
                <el-form-item label="出院医嘱" class="lg_textarea">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2 }"
                    disabled
                    v-model="formDataDis.dischargeOrder"
                  ></el-input>
                </el-form-item>
                <el-form-item label="入院情况" class="lg_textarea">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2 }"
                    disabled
                    v-model="formDataDis.copStatus"
                  ></el-input>
                </el-form-item>
                <!-- 暂无 -->
                <el-form-item label="治疗经过" class="lg_textarea">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2 }"
                    disabled
                    v-model="formDataDis.tzlProcess"
                  ></el-input>
                </el-form-item>
                <el-form-item label="出院情况" class="lg_textarea">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2 }"
                    disabled
                    v-model="formDataDis.dischargeStatus"
                  ></el-input>
                </el-form-item>

                <!-- <el-form-item class="label100 form-subtitle"></el-form-item> -->
              </el-form>
            </div>
          </el-col>
          <el-col :span="11" class="relative paddingt24 paddingl24">
            <el-form
              ref="formData"
              :model="formData"
              label-width="100px"
              class="information-fu elect100"
            >
              <div class="sign-tag marginb16">
                <span>随访结果</span>
              </div>

              <el-form-item
                label="治疗方式"
                class="form-subtitle"
                prop="treatment"
                :rules="RULE.remark_string"
              >
                <el-select
                  size="mini"
                  :disabled="isView"
                  v-model="formData.treatment"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in treatmentList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                key="treatother"
                v-if="formData.treatment == 'tqt'"
                prop="treatother"
                :rules="RULE.remark_string"
              >
                <el-input
                  size="mini"
                  :disabled="isView"
                  v-model="formData.treatother"
                  placeholder="请输入其他治疗方式"
                  clearable
                ></el-input>
              </el-form-item>
              <!-- <el-form-item label="出院状况" class="form-subtitle">
                <el-select
                  size="mini"
                  :disabled="isView"
                  v-model="formData.outhospital"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in outhospitalList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item
                key="outother"
                v-if="formData.outhospital == 'oqt'"
                prop="outother"
                :rules="RULE.remark_string"
              >
                <el-input
                  size="mini"
                  :disabled="isView"
                  v-model="formData.outother"
                  placeholder="请输入其他出院状况"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item
                label="有无导管"
                class="form-subtitle"
                prop="pipe"
                :rules="RULE.remark_string"
              >
                <el-select
                  size="mini"
                  :disabled="isView"
                  v-model="formData.pipe"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in pipeList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                key="pipeother"
                v-if="formData.pipe == 'yes'"
                prop="pipeother"
                :rules="RULE.remark_string"
              >
                <el-input
                  size="mini"
                  :disabled="isView"
                  v-model="formData.pipeother"
                  placeholder="请输入导管名称"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item
                label="随访情况"
                class="form-subtitle"
                prop="followupStatus"
                :rules="RULE.remark_string"
              >
                <el-input
                  type="textarea"
                  :disabled="isView"
                  v-model="formData.followupStatus"
                ></el-input>
              </el-form-item>
              <el-form-item label="意见建议" class="form-subtitle">
                <el-input
                  type="textarea"
                  :disabled="isView"
                  v-model="formData.advise"
                ></el-input>
              </el-form-item>
              <el-form-item label="接通情况" v-if="false">
                <TemplateSelect
                  :tempList="connectTypeList"
                  width="100px"
                  :checkArr="formData.formId"
                  :options="{ label: 'name', id: 'code' }"
                  :isView="isView"
                  style="margin-left: 0"
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
  </div>
</template>

<script>
import { getFindAllByTypeCode } from "@/api/specialFollowUp";
import TemplateSelect from "@/components/TemplateSelect";
export default {
  name: "RoutineFollowupTable",
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
      treatmentList: [],
      outhospitalList: [],
      pipeList: [],
      dialogVisibleTemplate: false,
      signVal: [],
      phoneId: "",
    };
  },
  created() {
    this.getCode2();
    this.getCode3();
    this.getCode4();
  },
  methods: {
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
    // treatment   治疗方式
    getCode2() {
      let data = {
        typeCode: "treatment",
      };
      getFindAllByTypeCode(data)
        .then((res) => {
          this.treatmentList = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // outhospital 出院状况
    getCode3() {
      let data = {
        typeCode: "outhospital",
      };
      getFindAllByTypeCode(data)
        .then((res) => {
          this.outhospitalList = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // pipe 导管
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
.mainContent {
  display: flex;
  .left-time {
    width: 216px;
    border-right: 16px solid #e8f1fa;
  }
  .right-content {
    flex: 1;
  }
}
.sec-main {
  // min-height: calc(100% - 80px);
  // height: 704px;
  min-height: calc(100vh - 230px);
  .sec-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
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
<style lang="scss">
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
<style lang="scss">
.lg_textarea {
  .el-textarea {
    // width: 430px;
    width: calc(100% - 80px);
  }
}

.timeLineItem {
  cursor: pointer;
}
.timeLineItemActive {
  color: #2F7E7D;
}
</style>
