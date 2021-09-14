<template>
  <div class="sec-main relative">
    <div v-if="this.isNoData" class="nofollowData">暂无常规随访数据</div>
    <div v-if="!this.isNoData" class="mainContent">
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
              ref="form"
              :model="formData"
              label-width="100px"
              class="information-fu elect100"
            >
              <div class="sign-tag marginb16">
                <span>随访结果</span>
              </div>

              <el-form-item label="治疗方式" class="form-subtitle">
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
              <el-form-item v-if="formData.treatment == 'tqt'">
                <el-input
                  size="mini"
                  :disabled="isView"
                  v-model="formData.treatother"
                  placeholder="请输入其他治疗方式"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="出院状况" class="form-subtitle">
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
              </el-form-item>
              <el-form-item v-if="formData.outhospital == 'oqt'">
                <el-input
                  size="mini"
                  :disabled="isView"
                  v-model="formData.outother"
                  placeholder="请输入其他出院状况"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="导管" class="form-subtitle">
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
              <el-form-item v-if="formData.pipe == 'yes'">
                <el-input
                  size="mini"
                  :disabled="isView"
                  v-model="formData.pipeother"
                  placeholder="请输入导管名称"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="随访情况" class="form-subtitle">
                <el-input
                  type="textarea"
                  :disabled="isView"
                  v-model="formData.followupStatus"
                ></el-input>
              </el-form-item>
              <el-form-item label="意见及建议" class="form-subtitle">
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
                    :selectType="isNotClick"
                    :options="{ label: 'name', id: 'code' }"
                    style="margin-left: 0px"
                  />
               </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getFindAllByTypeCode } from "@/api/specialFollowUp";
import { parseTime } from "@/utils/index.js";
import {
  getBaseInfo,
  getFollowupBeanById,
  updateBaseInfo,
  getLogList,
  getContentNumList,
  getConnectionOrMeth,
  addFollowup,
  sendWx,
  sendSms,
  getpatientGetBeans,
} from "@/api/routineFollowup";
import TemplateSelect from "@/components/TemplateSelect";
export default {
  name: "OnlnRoutineFollowupTable",
  props: {
    patientId: {
      type: String,
      default() {
        return "";
      },
    },
    diseaseId: {
      type: String,
      default() {
        return "";
      },
    },
  },
  components: { TemplateSelect },

  data() {
    return {
      treatmentList: [],
      outhospitalList: [],
      pipeList: [],
      // new
      id: this.$route.query.id,
      isTimeLineItem: 0, // 时间轴默认第一个
      timelineList: [],
      contactNumList: [{ value: "" }],
      connectTypeList: [],
      formDataDis: {},
      formData: {
        contactNum: "",
        supplement: "",
        name: "",
        sex: "",
        age: "",
        mainDiagnose: "",
        treatType: "",
        dcDate: "",
        dcCondition: "",
        pil: "",
        dischargeOrder: "",
        followupStatus: "",
        advise: "",
        formId: [],
      },
      isView: true,
      isNotClick: "isNotClick", // 接通情况不可点击
      isNoData: false,
    };
  },
  created() {
    this.getCodeTreatment(); // treatment   治疗方式
    this.getCodeOuthospital(); // outhospital 出院状况
    this.getCodePipe(); // pipe 导管
    // this.getFollowupBeanByIdFn(); // 获取某个随访信息接口 (已经填写的数据)
    this.getpatientGetBeansFn(); // 获取左侧列表+随访信息接口
    this.getConnectionFn(); // 获取接通状态列表
    this.getContentNumListFn(); // 获取联系方式列表
  },
  methods: {
    // 时间轴点击
    cklickTimeLine(timeLineItem, index) {
      this.clickTimeItem(timeLineItem, index);
    },
    //时间轴点击
    clickTimeItem(timeLineItem, vvisTimeLineItem) {
      this.isTimeLineItem = vvisTimeLineItem;
      this.allDataList.forEach((item) => {
        if (item.outPid == timeLineItem.outPid) {
          this.formDataDis = {
            name: item.result.name,
            sex: item.result.sex,
            age: item.result.age,
            departmentName: item.result.departmentName,
            p231: item.result.p231,
            visitId: item.result.visitId,
            firstConfirmDate: item.result.firstConfirmDate,
            dcDate: item.result.dcDate,
            p322: item.result.p322,
            icd10NAME1: item.result.icd10NAME1,
            departmentName: item.result.departmentName,
            p26: item.result.p26,
            p23: item.result.p23,
            p27: item.result.p27,
            p323: item.result.p323,

            mainDiagnose: item.result.mainDiagnose,
            treatType: item.result.treatType,
            dcDate: item.result.dcDate,
            dcCondition: item.result.dcCondition,
            pil: item.result.pil,

            dischargeOrder: item.result.dischargeOrder
              ? item.result.dischargeOrder
              : "暂无数据",
            copStatus: item.result.copStatus
              ? item.result.copStatus
              : "暂无数据",
            dischargeStatus: item.result.dischargeStatus
              ? item.result.dischargeStatus
              : "暂无数据",
            tzlProcess: item.result.tzlProcess
              ? item.result.tzlProcess
              : "暂无数据",
          };
          let phoneNumval = this.contactNumList.length
            ? this.contactNumList[0].value
            : "";
          this.formData = {
            contactNum: item.result.mobile ? item.result.mobile : phoneNumval,
            formId: [item.result.connections],
            supplement: item.result.description,
            followupStatus: item.result.results,
            advise: item.result.idea,
            treatment: item.result.treatment,
            treatother: item.result.treatother,
            outhospital: item.result.outhospital,
            outother: item.result.outother,
            pipe: item.result.pipe,
            pipeother: item.result.pipeother,
          };
        }
      });
    },
    // 获取左侧列表+随访信息接口
    getpatientGetBeansFn() {
      const getData = {
        patientId: this.patientId,
      };
      getpatientGetBeans(getData)
        .then((res) => {
          this.allDataList = res.data;
          if (this.allDataList.length > 0) {
            this.isNoData = false;
          } else {
            this.isNoData = true;
          }
          this.timelineList = res.data.reduce((arrlist, item, index) => {
            //  默认展示第1个
            if (item.outPid == res.data[0].outPid) {
              this.isTimeLineItem = index;
              this.formDataDis = {
                name: item.result.name,
                sex: item.result.sex,
                age: item.result.age,

                departmentName: item.result.departmentName,
                p231: item.result.p231,
                visitId: item.result.visitId,
                firstConfirmDate: item.result.firstConfirmDate,
                dcDate: item.result.dcDate,
                p322: item.result.p322,
                icd10NAME1: item.result.icd10NAME1,
                departmentName: item.result.departmentName,
                p26: item.result.p26,
                p23: item.result.p23,
                p27: item.result.p27,
                p323: item.result.p323,

                mainDiagnose: item.result.mainDiagnose,
                treatType: item.result.treatType,
                dcDate: item.result.dcDate,
                dcCondition: item.result.dcCondition,
                pil: item.result.pil,

                dischargeOrder: item.result.dischargeOrder
                  ? item.result.dischargeOrder
                  : "暂无数据",
                copStatus: item.result.copStatus
                  ? item.result.copStatus
                  : "暂无数据",
                dischargeStatus: item.result.dischargeStatus
                  ? item.result.dischargeStatus
                  : "暂无数据",
                tzlProcess: item.result.tzlProcess
                  ? item.result.tzlProcess
                  : "暂无数据",
              };
              let phoneNumval = this.contactNumList.length
                ? this.contactNumList[0].value
                : "";
              this.formData = {
                contactNum: item.result.mobile
                  ? item.result.mobile
                  : phoneNumval,
                formId: [item.result.connections],
                supplement: item.result.description,
                followupStatus: item.result.results,
                advise: item.result.idea,
                treatment: item.result.treatment,
                treatother: item.result.treatother,
                outhospital: item.result.outhospital,
                outother: item.result.outother,
                pipe: item.result.pipe,
                pipeother: item.result.pipeother,
              };
              arrlist.push({
                outPid: item.outPid,
                content: item.dcName,
                timestamp: parseTime(item.result.createTime, "{y}-{m}-{d}"),
                size: "large",
                type: "primary",
                icon: "el-icon-more",
              });
            } else {
              arrlist.push({
                outPid: item.outPid,
                content: item.dcName,
                timestamp: parseTime(item.result.createTime, "{y}-{m}-{d}"),
                size: "large",
              });
            }

            return arrlist;
          }, []);
        })
        .catch((error) => {
          console.error("sendWx", error);
        });
    },
    // 获取某个随访信息接口 (已经填写的数据)
    getFollowupBeanByIdFn() {
      const getData = {
        patientId: this.patientId,
        diseaseId: this.diseaseId,
      };
      getFollowupBeanById(getData)
        .then((res) => {
          let phoneNumval = this.contactNumList.length
            ? this.contactNumList[0].value
            : "";
          this.formData = {
            contactNum: res.data.mobile ? res.data.mobile : phoneNumval,
            formId: [res.data.connections],
            supplement: res.data.description,
            followupStatus: res.data.results,
            advise: res.data.idea,
            treatment: res.data.treatment,
            treatother: res.data.treatother,
            outhospital: res.data.outhospital,
            outother: res.data.outother,
            pipe: res.data.pipe,
            pipeother: res.data.pipeother,
          };
        })
        .catch((error) => {
          console.error("getFollowupBeanById", error);
        });
    },
    //获取联系方式列表
    getContentNumListFn() {
      const postData = {
        patientId: this.patientId,
      };
      getContentNumList(postData)
        .then((res) => {
          this.contactNumList = res.data.reduce((total, item, index) => {
            total.push({
                value: item.name,
              index: item.id,
            });
            return total;
          }, []);
         if (!this.formData.contactNum) {
            this.formData.contactNum = this.contactNumList.length
              ? this.contactNumList[0].value
              : "";
          }
        })
        .catch((error) => {
          console.error("获取联系方式列表", error);
        });
    },
    // 获取接通状态列表
    getConnectionFn() {
      const postData = {
        typeCode: "connection",
      };
      getConnectionOrMeth(postData)
        .then((res) => {
          this.connectTypeList = res.data;
        })
        .catch((error) => {
          console.error("getConnection", error);
        });
    },
    // treatment   治疗方式
    getCodeTreatment() {
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
    getCodeOuthospital() {
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
    getCodePipe() {
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
.elect100 {
  .el-select.el-select--mini {
    width: 100%;
  }
}
.timeLineItem {
  cursor: pointer;
}
.timeLineItemActive {
  color: #2F7E7D;
}
.nofollowData{
  margin: 20px;
}
</style>
