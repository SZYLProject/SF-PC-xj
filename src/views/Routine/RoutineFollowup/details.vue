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
          :isType="isType"
          ref="PatientsBasicInformation"
          :getPatientDataVal="getPatientDataVal"
        />
      </el-tab-pane>

      <el-tab-pane label="随访信息" name="third" style="position: relative">
        <!-- 数据操作 -->
        <ul class="operationBtn">
          <li>
            <el-button size="mini" type="primary" @click="$router.go(-1)">{{
              $route.query.type !== "1" ? "取消" : "返回"
            }}</el-button>
          </li>
          <li>
            <el-button
              size="mini"
              type="primary"
              v-if="!isView"
              :disabled="isBtnClick"
              @click="saveFollowUp(2)"
              >暂存</el-button
            >
          </li>
          <li>
            <el-button
              size="mini"
              type="primary"
              v-if="!isView"
              :disabled="isBtnClick"
              @click="saveFollowUp(1)"
              >保存</el-button
            >
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
        <ul class="telOrWx" v-if="isfollowType == 1">
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
        <!--打电话 -->
        <ul class="telOrWx" v-if="!isView && isfollowType != 1">
          <li @click="callClick" v-if="isCalling == '0'">
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
          <li @click="smsClick">
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

        <el-tabs v-model="followupActiveName" class="secondTabs">
          <el-tab-pane label="常规随访" v-loading="loadingTab" name="routine">
            <RoutineFollowupTable
              ref="RoutineFollowupTable"
              :formData="formData"
              :formDataDis="formDataDis"
              :timelineList="timelineList"
              :contactNumList="contactNumList"
              :connectTypeList="connectTypeList"
              :isTimeLineItem="isTimeLineItem"
              @clickTimeItem="clickTimeItem"
              @contactNumChangeFn="contactNumChangeFn"
              @signConfirmFn="signConfirmFn"
              :isView="isView"
            />
          </el-tab-pane>
          <el-tab-pane
            label="生存随访"
            name="survival"
            v-if="false"
          ></el-tab-pane>
          <el-tab-pane
            label="专题随访"
            name="special"
            v-if="false"
          ></el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="随访变更日志" name="other" v-if="false">
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
    <el-dialog
      :title="dialogTitle + '随访'"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-input
        type="textarea"
        v-model="wxInfo"
        :rows="8"
        :placeholder="'请输入' + dialogTitle + '内容'"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="wxConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $ from "jquery";

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
import { parseTime } from "@/utils/index.js";
import {
  getBaseInfo,
  getFollowupBeanById,
  getLogList,
  getContentNumList,
  getConnectionOrMeth,
  addFollowup,
  sendWx,
  sendSms,
  getpatientGetBeans,
  postUploadRecord,
  getMobileAddress,
  postUpdateConcat,
} from "@/api/routineFollowup";
import RoutineFollowupTable from "./Components/FollowupTable";
import { Loading } from "element-ui";
let loadingInstance = null;
export default {
  name: "RoutineFollowupDetails",
  components: {
    RoutineFollowupTable,
    PatientsBasicInformation, //  jijw 新增
  },
  data() {
    return {
      getPatientDataVal: {
        id: this.$route.query.id,
        resultId: this.$route.query.resultId,
      },
      audioUrl: "",
      isPlayAudio: false,
      isBtnClick: false,
      isLastBearn: true, //时间轴控制 显示隐藏  当前节点
      formMaxSize: 100, // 上传文件大小
      formFileList: [], // 显示上传文件
      uploadFormFileList: [], // 确定上传文件

      isType: "Routine", //患者详情 常规tpatnoExt
      isCalling: 0, // 0 初始状态
      dialogTitle: "微信",
      isHasWx: true,
      isTimeLineItem: 0, // 时间轴默认第一个
      timelineList: [],
      allDataList: [],
      dialogVisible: false,
      wxInfo: "",
      followupActiveName: "routine",

      id: this.$route.query.id,
      outPid: this.$route.query.outPid,

      // type  0待随访、 1已随访 、2暂存
      isfollowType: this.$route.query.type,
      // 信息修改后返回的id用于查询变更日志
      resultId: this.$route.query.resultId,
      isView: false,
      activeName: this.$route.query.viewFlag || "third",
      contactNumList: [{ value: "" }],
      connectTypeList: [],
      followupInfo: null,
      logTableData: [],
      basicInfo: {},
      relationshipList: [],
      // 分页数据
      currentPage: 1,
      currentPageSize: 100,
      currentPageTotal: 0,
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
        treatother: "",
        treatment: "",
        pipeother: "",
        pipe: "",
        followupStatus: "",
      },
      importApi: "", //上传路径
      loadingTab: false,
    };
  },
  created() {
    this.openDevice(); //打开设备
    this.importApi = this.$ajax.defaults.baseURL + "/api/file/uploadRecord";
    this.getConnectionFn(); // 获取接通状态列表
    this.getpatientGetBeansFn(); // 获取左侧列表+随访信息接口
    this.getIsView(); //获取是否查看
    this.getBaseInfoFn(); // 获取基本信息
    this.getContentNumListFn(); // 获取联系方式列表

    // this.getFollowupBeanByIdFn(); // 获取某个随访信息接口  暂时不用  用时间轴
    // this.getMethFn(); // 获取随访方式 (常规暂时不需要
    // this.getLogListFn();   // 获取日志列表 (常规暂时不需要)
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
      console.log(param, "上传文件");
      let thiz = this;
      let formData = new FormData();
      formData.append("id", thiz.id); // 额外参数
      formData.append("file", param.file);
      formData.append("resultId", thiz.resultId);
      let loading = thiz.$loading({
        lock: true,
        text: "上传中，请稍候...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      postUploadRecord(formData)
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
          this.formFileList = [];
          this.uploadFormFileList = [];
          loading.close();
        });
    },
    // 360视图  patientId =>tpatno
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
    getIsView() {
      this.isView = this.$route.query.isView == "true";
      console.log(this.isView, "获取是否查看", "true == 禁用  不可看");
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
      if (timeLineItem.outPid == this.outPid) {
        this.isLastBearn = true;
        this.isView = false;
      } else {
        this.isLastBearn = false;
        this.isView = true;
      }
      if (this.isfollowType == 1) {
        this.isView = true;
      }

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
        patientId: this.id,
      };
      this.loadingTab = true;
      getpatientGetBeans(getData)
        .then((res) => {
          this.loadingTab = false;
          console.log(" 获取左侧列表+随访信息接口", res.data);
          this.allDataList = res.data;
          this.timelineList = res.data.reduce((arrlist, item, index) => {
            if (item.outPid == this.outPid) {
              this.isTimeLineItem = index;
              this.audioUrl = item.result.recordFilePath;
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
    //保存、暂存
    saveFollowUp(type) {
      this.isBtnClick = true;
      this.loadingTab = true;
      const postData = {
        id: this.resultId, // 保存id
        outPid: this.outPid, // 出院节点id
        patientId: this.id, // 患者id
        mobile: this.formData.contactNum,
        // contcatId: this.contactNumList.filter((x)=>{
        //   x.value ==this.formData.contactNum
        // })[0].id,

        connections: this.formData.formId[0],
        description: this.formData.supplement,
        wechats: this.wxInfo,
        results: this.formData.followupStatus, //结果
        idea: this.formData.advise, //意见
        status: type, //1:完成随访（保存时传1id）2：暂存（暂存时传）
        treatment: this.formData.treatment,
        treatother: this.formData.treatother,
        outhospital: this.formData.outhospital,
        outother: this.formData.outother,
        pipe: this.formData.pipe,
        pipeother: this.formData.pipeother,
      };
      if (type == 1) {
        this.$refs.RoutineFollowupTable.$refs.formData.validate((valid) => {
          if (valid) {
            addFollowup(postData)
              .then((res) => {
                // this.resultId = res.data.resultId;
                this.loadingTab = false;
                this.isBtnClick = false;
                this.$message.success("保存成功");
                this.$router.push({
                  path: "/routine/followup",
                });
              })
              .catch((error) => {
                console.error("addFollowup", error);
              });
          } else {
            this.isBtnClick = false;
            this.loadingTab = false;
            this.$message.error("必填项不能为空");
            return;
          }
        });
      } else {
        addFollowup(postData)
          .then((res) => {
            // this.resultId = res.data.resultId;
            this.loadingTab = false;
            this.isBtnClick = false;
            this.$message.success("保存成功");
            this.$router.push({
              path: "/routine/followup",
            });
          })
          .catch((error) => {
            this.isBtnClick = false;
            this.loadingTab = false;
            console.error("addFollowup", error);
          });
      }
    },
    // FALSE				=0; TRUE				=1;
    // 打开设备
    openDevice() {
      TV_Initialize();
    },
    // 打开MIC
    openMic() {
      TV_EnableMic(0, 1);
    },
    // 关闭MIC 	     FALSE				=0; TRUE				=1;
    closeMic() {
      TV_EnableMic(0, 0);
    },
    // 打开耳机
    openHeadset() {
      TV_EnableLine2Spk(0, 1);
    },
    // 关闭耳机
    closeHeadset() {},
    // 拨号
    callClick() {
      if (this.formData.contactNum.length == 0) {
        this.$message.warning("联系电话为空");
      } else {
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
      TV_HangUpCtrl(0); // 挂机事件
      // TV_EnableMic(0, 0); //mic
      TV_EnableLine2Spk(0, 0); //关闭耳机
      // TV_Disable();
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
    // 编辑
    changeEnd() {
      this.isView = false;
    },
    //微/短信随访
    wxClick() {
      this.wxInfo = "";
      this.dialogTitle = "微信";
      this.dialogVisible = true;
    },
    smsClick() {
      this.wxInfo = "";
      this.dialogTitle = "短信";
      this.dialogVisible = true;
    },
    wxConfirm() {
      loadingInstance = Loading.service();
      const postData = {
        patientId: this.id,
        // wechats: this.wxInfo,
        id: this.resultId ? this.resultId : null,
      };
      if (this.dialogTitle === "微信") {
        postData.wechats = this.wxInfo;
      } else {
        postData.sms = this.wxInfo;
        postData.mobile = this.formData.contactNum.replace(/\D/g, "");
      }
      this.dialogTitle === "微信"
        ? sendWx(postData)
            .then((res) => {
              this.resultId = res.data.resultId;
              this.dialogVisible = false;
              loadingInstance && loadingInstance.close();
              this.$message({
                message: "发送成功",
                type: "success",
              });
            })
            .catch((error) => {
              loadingInstance && loadingInstance.close();
              this.$message.error("发送失败");
              console.error("sendWx", error);
            })
        : sendSms(postData)
            .then((res) => {
              this.resultId = res.data.resultId;
              this.dialogVisible = false;
              loadingInstance && loadingInstance.close();
              this.$message({
                message: "发送成功",
                type: "success",
              });
            })
            .catch((error) => {
              loadingInstance && loadingInstance.close();
              this.$message.error("发送失败");
              console.error("sendWx", error);
            });
    },
    //获取基本信息 患者最新
    getBaseInfoFn() {
      const postData = {
        id: this.id,
        resultId: this.resultId,
      };
      getBaseInfo(postData).then((res) => {
        this.basicInfo = res.data;
      });
    },
    // 获取随访信息 (暂时不需要)
    getFollowupBeanByIdFn() {
      // type  0待随访、 1已随访 、2暂存
      if (this.$route.query.type != 0) {
        const getData = {
          patientId: this.id,
          resultId: this.resultId,
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
      }
    },
    //获取日志列表 (常规暂时不需要)
    getLogListFn() {
      const postData = {
        pageNum: this.currentPage,
        pageSize: this.currentPageSize,
        type: "routine",
        patientId: this.id,
        resultId: this.resultId,
      };
      getLogList(postData)
        .then((res) => {
          this.logTableData = res.data.list;
          this.currentPageTotal = res.data.total;
        })
        .catch((error) => {
          console.error("getLogList", error);
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
          console.log("// 获取随访方式 不用", res);
        })
        .catch((error) => {
          console.error("getMeth", error);
        });
    },

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
.recordBox {
  position: fixed;
  top: 438px;
  right: 49px;
  padding: 10px;
  z-index: 19;
  height: 52px;
  text-align: center;
  background: #fff;
  border-radius: 12px 0 0 12px;
  font-size: 12px;
  box-shadow: 0px 0px 10px 0px rgba(30, 30, 30, 0.2);

  li {
    float: left;
    margin: 0px 10px;
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
.playClas {
  position: fixed;
  top: 338px;
  right: 20px;
  padding: 10px;
  z-index: 20;
  text-align: center;
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
