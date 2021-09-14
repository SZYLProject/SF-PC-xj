<template>
  <!-- style="height: calc(100% - 32px);background:#fff;" -->
  <div class="content bgfff">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      :before-leave="to360"
      style="padding: 0 20px"
      class="firstTabs"
    >
      <el-tab-pane label="基本信息" name="first" class="paddingb24">
        <PatientsBasicInformation
          ref="PatientsBasicInformation"
          :getPatientDataVal="getPatientDataVal"
        />
      </el-tab-pane>
      <!-- <el-tab-pane label="全景病例" name="second">
                全景病例
      </el-tab-pane>-->
      <el-tab-pane label="随访信息" name="third" style="position: relative">
        <ul class="operationBtn">
          <li>
            <el-button size="mini" type="primary" @click="$router.go(-1)"
              >返回</el-button
            >
          </li>
          <li>
            <el-button
              size="mini"
              type="primary"
              v-if="!isView && isLastBearn"
              @click="savePatientStatus(2)"
              :loading="savePatientStatusLoading"
              >暂存</el-button
            >
          </li>
          <li>
            <el-button
              size="mini"
              type="primary"
              v-if="!isView && isLastBearn"
              @click="savePatientStatus(1)"
              :loading="savePatientStatusLoading"
              >保存</el-button
            >
          </li>
        </ul>
        <ul
          class="telOrWx"
          v-if="
            followupActiveName == 'routine' &&
            isLastBearn &&
            !isView &&
            isfollowType != 1
          "
        >
          <li @click="callClick" v-if="isCalling == '0' && isFollowPhone">
            <el-tooltip
              class="item"
              effect="dark"
              content="拨打电话"
              placement="top"
            >
              <i class="iconfont icondianhua iconBlue"></i>
            </el-tooltip>
          </li>
          <li @click="downClick" v-if="isCalling == '2'">
            <el-tooltip
              class="item"
              effect="dark"
              content="挂断电话"
              placement="top"
            >
              <i class="iconfont icondianhua iconRed"></i>
            </el-tooltip>
          </li>
          <li v-if="isCalling == '3'">
            <el-upload
              class="upload-demo"
              action
              :limit="1"
              :file-list="formFileList"
              :http-request="handleUploadForm"
              :on-exceed="formHandleExceed"
              :on-remove="formHandleRemove"
              :before-upload="beforeUploadForm"
              accept=".wav"
            >
              <el-tooltip
                class="item"
                effect="dark"
                content="上传录音"
                placement="top"
              >
                <i class="iconfont iconupload iconGreen"></i>
              </el-tooltip>
            </el-upload>
          </li>
          <li
            @click="wxClick"
            v-if="isFollowWx"
            :style="{ 'pointer-events': !basicInfo.patientId ? 'none' : '' }"
          >
            <el-tooltip
              class="item"
              effect="dark"
              content="发送微信"
              placement="top"
            >
              <i
                class="iconfont iconweixinPro-copy iconGreen"
                :style="{
                  background: !basicInfo.patientId ? '#ccc' : '#2f7e7d',
                }"
              ></i>
            </el-tooltip>
          </li>
          <li @click="smsClick" v-if="isFollowSms">
            <el-tooltip
              class="item"
              effect="dark"
              content="发送短信"
              placement="top"
            >
              <i class="iconfont iconjianzhuanquan- iconBlue"></i>
            </el-tooltip>
          </li>
        </ul>
        <!-- 开始录音 -->
        <ul class="recordBox" v-if="isCalling != '0' && false">
          <li @click="recordClick" v-if="isCalling == '1'">
            <el-tooltip
              class="item"
              effect="dark"
              content="开始录音"
              placement="top"
            >
              <i
                class="iconfont iconicon_kaishi iconGreen iconfontStartRecprd"
              ></i>
            </el-tooltip>
          </li>
          <li @click="endRecordClick" v-if="isCalling == '1'">
            <el-tooltip
              class="item"
              effect="dark"
              content="结束录音"
              placement="top"
            >
              <i class="iconfont iconicon_jieshu iconRed iconfontEndRecprd"></i>
            </el-tooltip>
          </li>
          <li v-if="isCalling == '2'">
            <el-upload
              class="upload-demo"
              action
              :limit="1"
              :file-list="formFileList"
              :http-request="handleUploadForm"
              :on-exceed="formHandleExceed"
              :on-remove="formHandleRemove"
              :before-upload="beforeUploadForm"
              accept=".wav"
            >
              <el-tooltip
                class="item"
                effect="dark"
                content="上传录音"
                placement="top"
              >
                <i class="iconfont iconupload iconGreen"></i>
              </el-tooltip>
            </el-upload>
          </li>
        </ul>
        <!-- 播放录音 -->
        <ul
          class="telOrWx"
          v-if="(isfollowType == 1 || isfollowType == 3) && isLastBearn"
        >
          <li @click="playRecord" v-if="audioUrl">
            <el-tooltip
              class="item"
              effect="dark"
              :content="isPlayAudio ? '暂停录音' : '播放录音'"
              placement="top"
            >
              <i
                class="iconfont iconGreen iconfontStartRecprd"
                :class="isPlayAudio ? 'iconicon_jieshu' : 'iconicon_zanting'"
              ></i>
            </el-tooltip>
          </li>
          <!-- 常规不用 v-if="false" -->
          <li @click="changeEnd">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <i class="iconfont iconziyuan1 iconRed iconfontEndRecprd"></i>
            </el-tooltip>
          </li>
        </ul>
        <ul class="playClas" v-show="isPlayAudio">
          <audio ref="audio" :src="audioUrl" controls="controls">
            您的浏览器暂不支持播放插件
          </audio>
        </ul>
        <el-tabs v-model="followupActiveName" class="secondTabs">
          <el-tab-pane label="生存随访" name="routine">
            <FollowupTable
              ref="FollowupTableTumor"
              v-if="Object.keys(formDataDis)"
              :isView="isView"
              :formData="formData"
              :formDataDis="formDataDis"
              :timelineList="timelineList"
              :contactNumList="contactNumList"
              :connectTypeList="connectTypeList"
              :isTimeLineItem="isTimeLineItem"
              @clickTimeItem="clickTimeItem"
              @contactNumChangeFn="contactNumChangeFn"
              @signConfirmFn="signConfirmFn"
            />
          </el-tab-pane>
          <!-- <el-tab-pane label="常规随访" name="survival"></el-tab-pane>
          <el-tab-pane label="专题随访" name="special"></el-tab-pane> -->
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="随访变更日志" name="other">
        <el-table stripe :data="logTableData" style="width: 99%">
          <el-table-column
            prop="followupTime"
            label="随访时间"
          ></el-table-column>
          <el-table-column prop="followupBy" label="随访人员"></el-table-column>
          <el-table-column prop="createTime" label="修改时间"></el-table-column>
          <el-table-column prop="createBy" label="修改人员"></el-table-column>
          <el-table-column
            prop="description"
            label="修改内容"
          ></el-table-column>
        </el-table>
        <div class="pages-modules">
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
      </el-tab-pane>
      <el-tab-pane label="360视图" name="to360" v-if="false"></el-tab-pane>
    </el-tabs>
    <el-dialog title="微信随访" :visible.sync="dialogVisible" width="50%">
      <el-input
        type="textarea"
        v-model="wxInfo"
        :rows="8"
        placeholder="请输入微信内容"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="wxConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  TV_Disable,
  TV_Initialize,
  TV_EnableMic,
  TV_EnableLine2Spk,
  TV_StartDial,
  TV_HangUpCtrl,
  TV_StartRecordFile,
  TV_StopRecordFile,
} from "./../../../static/utils/qnvfunc.js";
import PatientsBasicInformation from "@/components/PatientsBasicInformation"; // 患者详请 基本信息  jijw 新增

import {
  getBaseInfo,
  getRelationship,
  updateBaseInfo,
  getContentNumList,
  getConnectionOrMeth,
  sendWx,
  getMobileAddress,
  postUpdateConcat,
} from "@/api/routineFollowup";

import {
  getLiveBeans,
  postLiveResultAdd,
  getLiveBeanByMulId,
  getfindLogByReview,
} from "@/api/survivalFollowup";

import {
  getRegistrationBeansByPro, // 时间轴
  postLiveRegistrationResultAdd, // 保存随访信息
} from "@/api/tumor/tumorFollowup";

import { parseTime, debounce } from "@/utils/index.js";
import FollowupTable from "./Components/FollowupTable";
import { Loading } from "element-ui";
let loadingInstance = null;
export default {
  name: "SurvivalFollowUPdetailFU",
  components: {
    FollowupTable,
    PatientsBasicInformation, //  jijw 新增
  },
  data() {
    let {
      name,
      sex,
      age,
      mainDiagnose,
      treatType,
      dcDate,
      dcCondition,
      pil,
      discharge,
    } = this.$route.query;
    return {
      savePatientStatusLoading: false,
      isTimeLineItem: 0,
      timelineList: [],
      allDataList: [],
      dialogVisible: false,
      wxInfo: "",
      followupActiveName: "routine",

      isView: true,
      id: this.$route.query.id,
      diseaseId: this.$route.query.diseaseId,
      resultId: this.$route.query.resultId,
      projectId: this.$route.query.projectId,
      groupId: this.$route.query.groupId,
      prePatientId: this.$route.query.prePatientId,
      sufPatientId: this.$route.query.sufPatientId,
      statusCode_old: this.$route.query.statusCode_old,
      statusName_old: this.$route.query.statusName_old,
      followType_old: this.$route.query.followType_old, // 随访类型
      isReviewsave: false,

      getPatientDataVal: {
        id: this.$route.query.id,
        diseaseId: this.$route.query.diseaseId,
      },
      activeName: "third",
      contactNumList: [{ value: "" }],
      connectTypeList: [],
      followupInfo: null,
      logTableData: [],
      basicInfo: {},
      relationshipList: [],
      liaisonData: [],
      // 分页数据
      currentPage: 1,
      currentPageSize: 10,
      currentPageTotal: 0,
      formDataDis: {},
      formData: {
        deathTime: "",
        contactNum: "",
        supplement: "",
        name: name,
        sex: sex,
        age: age,
        mainDiagnose: mainDiagnose,
        treatType: treatType,
        dcDate: dcDate,
        dcCondition: dcCondition,
        pil: pil,
        discharge: discharge,
        followupStatus: "",
        lostCause: "",
        advise: "",
        formId: [],
      },

      isfollowType: this.$route.query.type,
      //信息修改后返回的id用于查询变更日志
      isLastBearn: true, //时间轴控制 显示隐藏  当前节点
      resultId: this.$route.query.resultId ? this.$route.query.resultId : "",
      isView: false,

      // 该项目随访方式
      isFollowPhone: true,
      isFollowWx: true,
      isFollowSms: true,
      // 电话
      isCalling: 0, // 0 初始状态
      isPlayAudio: false,
      isBtnClick: false,

      formMaxSize: 100, // 上传文件大小
      formFileList: [], // 显示上传文件
      uploadFormFileList: [], // 确定上传文件

      audioUrl: "", //录音文件路径
    };
  },
  created() {
    // this.getLiveBeanByMulIdFn(); // 获取某个随访信息接口   暂时不用
    this.getContentNumListFn(); // 获取联系方式列表
    this.getConnectionFn(); // 获取接通状态列表
    this.getIsView(); //获取是否查看
    this.getBaseInfoFn(); // 获取基本信息

    this.getfindLogByReviewFn(); // 获取日志列表
    this.getLiveBeansFn(); // 获取左侧列表+随访信息接口
    window.addEventListener("beforeunload", (e) => this.beforeunloadHandler(e));
  },
  destroyed() {
    window.removeEventListener("beforeunload", (e) =>
      this.beforeunloadHandler(e)
    );
  },
  methods: {
    beforeunloadHandler() {
      TV_HangUpCtrl(0); // 挂机事件
    },
    //标记
    signConfirmFn(val) {
      postUpdateConcat(val)
        .then((res) => {
          this.$message.success("数据修改成功");
          this.formData.contactNum = res.data.name;
          this.getContentNumListFn();
        })
        .catch((error) => {
          console.error("postUpdateConcat", error);
        });
    },
    // 360
    to360(activeName) {
      if (activeName == "to360") {
        window.open(
          this.VIEW360 +
            "/vinci-web/api/forEdc/getPersonOverviewByIdCard?idCardNo=" +
            this.basicInfo.idNum
        );
        return false;
      }
    },
    //获取是否查看
    // getIsView() {
    //   // this.isView = sessionStorage.getItem("saveIsView") == "true";
    //   this.isView = this.$route.query.isView == "true";
    //   console.log("this.isView", this.isView);
    // },
    // //获取是否查看
    getIsView() {
      this.isReviewsave = this.$route.query.isReviewsave == "true";
      this.isView = this.$route.query.isView == "true";
      if (this.statusName_old != "进行中") {
        this.isView = true;
      }

      if (this.isReviewsave) {
        this.isView = true;
      }
    },
    // 第一级点击
    handleClick(tab, event) {
      if (tab.name == "third") {
        this.getContentNumListFn();
      } else if (tab.name == "first") {
        this.$refs.PatientsBasicInformation.getBaseInfoFn();
      }
    },
    //时间轴点击
    clickTimeItem(timeLineItem, vvisTimeLineItem) {
      this.isTimeLineItem = vvisTimeLineItem;

      if (this.isfollowType == 1) {
        this.isView = true;
      }
      if (this.$route.query.statusName_old != "进行中") {
        this.isView = true;
      }

      if (timeLineItem.groupId == this.groupId) {
        this.isLastBearn = true;
        this.isView = false;
      } else {
        this.isLastBearn = false;
        this.isView = true;
      }
      this.allDataList.forEach((item) => {
        if (item.groupId == timeLineItem.groupId) {
          item.result = Object.assign({}, item.result);
          let obj = {
            ...item.result,
            name: item.result.patientName,
            discharge: item.result.discharge
              ? item.result.discharge
              : "暂无医嘱",
          };
          let phoneNumval = this.contactNumList.length
            ? this.contactNumList[0].value
            : "";
          this.formDataDis = Object.assign({}, obj);
          this.formData = {
            ...item.result,
            deathTime:
              item.result.deathTime == undefined
                ? ""
                : new Date(item.result.deathTime),
            checkTime:
              item.result.checkTime == undefined
                ? ""
                : new Date(item.result.checkTime),
            followupStatus: item.result.followupEnd,
            contactNum: item.result.mobile ? item.result.mobile : phoneNumval,
            formId: [item.result.connections],
          };
        }
      });
    },
    // 获取左侧列表+随访信息接口
    getLiveBeansFn() {
      // if (this.$route.query.isView) {
      //   sessionStorage.setItem("saveIsView", this.$route.query.isView);
      // }

      // @parent {String} patientId  患者ID
      // @parent {String} projectId  项目ID
      const getData = {
        patientId: this.id,
        projectId: this.projectId,
      };

      // 对患者随访信息的回显
      getRegistrationBeansByPro(getData)
        .then((res) => {
          this.allDataList = res.data;
          console.log(this.allDataList);
          this.timelineList = res.data.reduce((arrlist, item, index) => {
            if (item.groupId == this.$route.query.groupId) {
              this.isTimeLineItem = index;
              item.result = Object.assign({}, item.result);

              this.audioUrl = item.result.recordFilePath;
              // 判断项目随访方式
              item.followupMethodCode ? item.followupMethodCode : "";
              this.isFollowPhone =
                item.followupMethodCode.includes("telephone");
              this.isFollowWx = item.followupMethodCode.includes("wechat");
              this.isFollowSms = item.followupMethodCode.includes("sms");
              let phoneNumval = this.contactNumList.length
                ? this.contactNumList[0].value
                : "";
              this.formDataDis = {
                ...item.result,
                name: item.result.patientName,
                discharge: item.result.discharge
                  ? item.result.discharge
                  : "暂无医嘱",
                contactNum: item.result.mobile
                  ? item.result.mobile
                  : phoneNumval,
                followupStatus: item.result.followupEnd,
                formId: [item.result.connections],
              };

              arrlist.push({
                groupId: item.groupId,
                diseaseId: item.diseaseId,
                content: item.name,
                timestamp: item.followupTime,
                size: "large",
                type: "primary",
                icon: "el-icon-more",
              });

              // 对返回的 患者生存随访信息 formDataDis 里的值进行过滤
              Object.keys(this.formDataDis).map((item) => {
                if (!this.formDataDis[item] && this.formDataDis[item] !== 0) {
                  this.formDataDis[item] = "";
                }
              });

              this.formData = this.formDataDis;
              console.log(this.formData, this.formDataDis);
            } else {
              arrlist.push({
                groupId: item.groupId,
                diseaseId: item.diseaseId,
                content: item.name,
                timestamp: item.followupTime,
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
    //新增联系人
    addLiaison() {
      this.liaisonData.push({
        contact1Rela: "self",
        contact1Name: "",
        contact1: "",
        status: "1",
      });
    },

    saveLiaison() {
      let postLiaison = {};
      this.liaisonData.forEach((item) => {
        Object.keys(item).forEach((_, i) => {
          !postLiaison[_] && (postLiaison[_] = "");
          postLiaison[_] += item[_] + ",";
        });
      });
      Object.keys(postLiaison).forEach((_) => {
        postLiaison[_] = postLiaison[_].replace(/,$/gim, "");
      });
      console.log("result----------", postLiaison);
      const postData = {
        patientId: Number(this.id),
      };
      updateBaseInfo(Object.assign(postData, postLiaison))
        .then((res) => {
          this.$message.success("新增成功");
        })
        .catch((error) => {
          console.error("updateBaseInfo", error);
        });
    },

    //基本信息联系人删除
    handleDelete(index, row) {
      this.liaisonData.splice(index, 1);
    },

    //联系人关系列表
    getRelationshipFn() {
      getRelationship({ typeCode: "relationship" }).then((res) => {
        this.relationshipList = res.data;
      });
    },

    //微信随访
    wxClick() {
      this.wxInfo = this.formData.wechatContent;
      this.dialogTitle = "微信";
      this.dialogVisible = true;
    },
    smsClick() {
      this.wxInfo = this.formData.smsContent;
      this.dialogTitle = "短信";
      this.dialogVisible = true;
    },
    wxConfirm() {
      loadingInstance = Loading.service();
      const postData = {
        groupId: this.groupId,
        patientId: this.id,
        // wechats: this.wxInfo,
      };
      if (this.dialogTitle === "微信") {
        postData.wechatContent = this.wxInfo;
      } else {
        postData.smsContent = this.wxInfo;
        postData.phoneNo = this.formData.contactNum.replace(/\D/g, "");
      }

      this.dialogTitle === "微信"
        ? sendWx(postData)
            .then((res) => {
              console.log("sendWx", res);
              this.resultId = res.data.resultId;
              loadingInstance && loadingInstance.close();
              this.dialogVisible = false;
            })
            .catch((error) => {
              loadingInstance && loadingInstance.close();
              console.error("sendWx", error);
            })
        : sendSms(postData)
            .then((res) => {
              console.log("sendSms", res);
              this.resultId = res.data.resultId;
              loadingInstance && loadingInstance.close();
              this.dialogVisible = false;
            })
            .catch((error) => {
              loadingInstance && loadingInstance.close();
              console.error("sendSms", error);
            });
    },
    //保存、暂存
    savePatientStatus: debounce(function (type) {
      this.savePatientStatusLoading = true;
      const postData = {
        id: this.$route.query.resultId,
        patientId: this.id,
        groupId: this.$route.query.groupId,
        deathTime: parseTime(this.formData.deathTime, "{y}-{m}-{d}"),
        followupEnd: this.formData.followupStatus,
        mobile: this.formData.contactNum,
        // contcatId: this.contactNumList.filter((x)=>{
        //   x.value ==this.formData.contactNum
        // })[0].id,
        connections: this.formData.formId[0],
        description: this.formData.description,
        remarks: this.formData.remarks,
        ifHospital: this.formData.ifHospital,
        ifDeath: this.formData.ifDeath,
        status: type, //1:完成随访（保存时传1id）2：暂存（暂存时传）
        lostCause: this.formData.lostCause,
        reviewSite: this.formData.reviewSite,
        checkTime: parseTime(this.formData.checkTime, "{y}-{m}-{d}"),
        transferSite: this.formData.transferSite,
      };
      console.log(postData, "保存成功信息");
      if (type == 1) {
        console.log(
          "validvalidvalidvalidvalid",
          this.$refs.FollowupTableTumor.$refs.formDataTumor
        );
        this.$refs.FollowupTableTumor.$refs.formDataTumor.validate((valid) => {
          console.log("validvalidvalidvalidvalid", valid);
          if (valid) {
            postLiveRegistrationResultAdd(postData)
              .then((res) => {
                this.savePatientStatusLoading = false;
                this.$message.success("保存成功");
                this.$router.go(-1);
              })
              .catch((error) => {
                this.savePatientStatusLoading = false;
                console.error("postLiveResultAdd", error);
              });
          } else {
            this.savePatientStatusLoading = false;
            this.$message.error("必填项不能为空");
            return;
          }
        });
      } else {
        postLiveRegistrationResultAdd(postData)
          .then((res) => {
            this.savePatientStatusLoading = false;
            this.$message.success("保存成功");
            this.$router.go(-1);
          })
          .catch((error) => {
            this.savePatientStatusLoading = false;
            console.error("postLiveResultAdd", error);
          });
      }
    }),
    //获取基本信息
    getBaseInfoFn() {
      const postData = {
        id: this.id,
        diseaseId: this.$route.query.diseaseId,
      };

      getBaseInfo(postData).then((res) => {
        let {
          discharge,
          pil,
          name,
          age,
          patientId,
          sex,
          birthday,
          idType,
          idNum,
          contcats,
        } = res.data;
        this.formData.discharge = discharge;
        this.formData.pil = pil;
        this.basicInfo = res.data;

        Object.assign(this.basicInfo, {
          name,
          age,
          patientId,
          sex,
          birthday,
          idType,
          idNum,
        });
      });
    },
    //获取已存的随访信息
    getLiveBeanByMulIdFn() {
      if (this.$route.query.type != 0) {
        const getData = {
          ppId: this.$route.query.ppId, //项目计划id
          patientId: this.id, //患者id
          groupId: this.$route.query.groupId, //入组id
        };
        getLiveBeanByMulId(getData)
          .then((res) => {
            console.log(res, "获取已存的随访信息");
            this.formData = {
              deathTime:
                res.data.deathTime == undefined
                  ? ""
                  : new Date(res.data.deathTime),
              checkTime:
                res.data.checkTime == undefined
                  ? ""
                  : new Date(res.data.checkTime),
              description: res.data.description,
              followupStatus: res.data.followupEnd,
              mobile: res.data.mobile,
              formId: [res.data.connections],
              remarks: res.data.remarks,
              ifHospital: res.data.ifHospital,
              ifDeath: res.data.ifDeath,
              lostCause: res.data.lostCause,
              reviewSite: res.data.reviewSite,
              transferSite: res.data.transferSite,
            };
          })
          .catch((error) => {
            console.error("getLiveBeanByMulId", error);
          });
      }
    },
    //获取日志列表
    getfindLogByReviewFn() {
      const postData = {
        pageNum: this.currentPage,
        pageSize: this.currentPageSize,
        type: "register_prospect",
        patientId: this.id,
        resultId: this.$route.query.resultId,
      };

      getfindLogByReview(postData)
        .then((res) => {
          console.log("getfindLogByReviewFn获取日志列表", res);
          this.logTableData = res.data.list;
          this.currentPageTotal = res.data.total;
        })
        .catch((error) => {
          console.error("getfindLogByReview", error);
        });
    },
    //获取联系方式列表
    getContentNumListFn() {
      const postData = {
        patientId: this.id,
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
    // 获取随访方式
    getMethFn() {
      const postData = {
        typeCode: "meth",
      };
      getConnectionOrMeth(postData)
        .then((res) => {
          console.log("// 获取随访方式", res);
        })
        .catch((error) => {
          console.error("getMeth", error);
        });
    },

    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPageSize = val;
      this.getListFn();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getListFn();
    },
    // 打开设备
    openDevice() {
      TV_Initialize();
    },
    // 打开MIC
    openMic() {
      TV_EnableMic(0, 1);
    },
    // 关闭MIC
    closeMic() {},
    // 打开耳机
    openHeadset() {
      TV_EnableLine2Spk(0, 1);
    },
    // 关闭耳机
    closeHeadset() {},
    // 拨号
    callClick() {
      console.log(this.formData.contactNum, "formData.contactNum");
      if (this.formData.contactNum.length == 0) {
        this.$message.warning("联系电话为空");
      } else {
        // this.isCalling = 1;
        this.isCalling = 2; // 1开始录音-结束录音  2 上传文件
        let phoneNum = this.formData.contactNum.slice(0, 11);
        const getData = {
          phoneNumber: phoneNum,
        };
        getMobileAddress(getData)
          .then((res) => {
            if (res.data.includes("新疆")) {
              phoneNum = "" + phoneNum;
            } else {
              phoneNum = "0" + phoneNum;
            }
            TV_StartDial(0, phoneNum, this.formDataDis.name); //打电话
            TV_EnableMic(0, 1); //mic
            TV_EnableLine2Spk(0, 1); //打开耳机
          })
          .catch((error) => {
            console.error("获取联系方式列表", error);
          });
      }
    },
    // 开始录音
    recordClick() {
      TV_StartRecordFile(0, 0);
    },
    // 结束录音
    endRecordClick() {
      TV_StopRecordFile(0);
    },
    // 挂机
    downClick() {
      // this.isCalling = 2;
      this.isCalling = 3;
      TV_HangUpCtrl(0);
      TV_Disable();
    },
    // 电话更改
    contactNumChangeFn() {
      TV_HangUpCtrl(0); // 挂机事件
      this.isCalling = 0;
    },
    // 播放录音
    playRecord() {
      if (!this.isPlayAudio) {
        this.$refs.audio.play();
        this.isPlayAudio = true;
      } else {
        this.$refs.audio.pause();
        this.isPlayAudio = false;
      }
    },
    // 开始上传前验证
    beforeUploadForm(file) {
      // 验证文件大小
      if (file.size / 1024 / 1024 > this.formMaxSize) {
        this.$message({
          message: `上传文件大小不能超过${this.formMaxSize}M!`,
          type: "warning",
        });
        return false;
      }
      // 中文乱码处理
      if (file.raw) {
        let reader = new FileReader(); // 读取文件内容
        reader.readAsText(file.raw, "gb2312"); // 防止中文乱码问题，不加reader.onload方法都不会触发
        reader.onload = function (e) {
          this.contentHtml = e.target.result; // txt文本内容，接下来就可以对其进行校验处理了
        };
      }
      // 验证文件类型
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "wav";
      if (!extension) {
        this.$message({
          message: "上传文件只能是wav格式!",
          type: "warning",
        });
      }
      return extension;
    },
    // 移除上传列表中文件
    formHandleRemove(file, formFileList) {
      let thiz = this;
      for (let i = 0; i < thiz.uploadFormFileList.length; i++) {
        if (thiz.uploadFormFileList[i].pname === file.name) {
          thiz.uploadFormFileList.splice(i, 1);
          break;
        }
      }
    },
    // 允许上传文件个数验证
    formHandleExceed(files, formFileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + formFileList.length
        } 个文件`
      );
    },
    // 上传文件
    handleUploadForm(param) {
      let thiz = this;
      let formData = new FormData();
      formData.append("id", thiz.id); // 额外参数
      formData.append("file", param.file);
      formData.append("groupId", this.groupId ? this.groupId : null);
      formData.append("resultId", this.resultId ? this.resultId : null);
      console.log(param, "上传文件A", formData, this.groupId, "2");
      let loading = thiz.$loading({
        lock: true,
        text: "上传中，请稍候...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      postUploadRecordLive(formData)
        .then((res) => {
          this.$message({
            message: "上传文件成功",
            type: "success",
          });
          thiz.resultId = res.data.id;
          thiz.formFileList = [];
          thiz.uploadFormFileList = [];
          loading.close();
        })
        .catch((error) => {
          this.$message.error("发送失败");
          loading.close();
          this.formFileList = [];
          this.uploadFormFileList = [];
        });
    },
    // 编辑
    changeEnd() {
      this.isView = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.detail-basic-info {
  padding-top: 18px;
  li {
    span {
      display: inline-block;
      &:last-child {
        color: #000;
      }
      &:first-child {
        color: #666;
        margin: 10px 20px;
        width: 80px;
      }
    }
    &:last-child {
      padding-left: 20px;
      span {
        margin: 10px 0;
      }
    }
  }
}
.detail-basic-info_addLiaison {
  margin: 10px 20px;
}
.operationBtn {
  position: absolute;
  right: 6px;
  top: 6px;
  z-index: 10;
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
.telOrWx {
  position: fixed;
  top: 420px;
  right: 0px;
  padding: 10px;
  z-index: 20;
  width: 52px;
  text-align: center;
  background: #fff;
  border-radius: 12px 0 0 12px;
  font-size: 12px;
  box-shadow: 0px 0px 10px 0px rgba(30, 30, 30, 0.2);
  li {
    margin: 20px 0;
    cursor: pointer;
    color: #fff;
  }
  i {
    display: block;
    margin: 0 auto;
    font-size: 20px;
    width: 32px;
    height: 32px;
    padding: 4px 3px 3px 4px;
    border: 1px solid #ccc;
    border-radius: 50%;
    color: #fff;
  }
}
</style>
<style lang="scss">
.firstTabs {
  .el-tabs__header {
    margin: 0;
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
  }
}
.secondTabs {
  .el-tabs__header {
    background: #f1f8fe;
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
  }
}
.lxdd {
  .el-select {
    width: 430px;
  }
}
</style>
