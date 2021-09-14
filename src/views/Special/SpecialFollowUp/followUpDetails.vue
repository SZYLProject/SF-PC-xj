<template>
  <!-- style="height: calc(100% - 32px);background:#fff;" -->
  <div class="content bgfff"  v-loading="followUpLoading">
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
      <el-tab-pane label="随访信息" name="third" style="position: relative" >
        <ul class="operationBtn">
          <li>
            <el-button size="mini" type="primary" @click="$router.go(-1)">
              返回
            </el-button>
          </li>
          <li>
            <el-button
              size="mini"
              type="primary"
              v-if="!isView"
              @click="saveFollowUp(2)"
              >暂存</el-button
            >
          </li>
          <li>
            <el-button
              size="mini"
              type="primary"
              v-if="!isView"
              @click="saveFollowUp(1)"
              >保存</el-button
            >
          </li>
        </ul>
      
        <!-- 打电话 -->
        <ul class="telOrWx" v-if="!isView && statusNum != 1&&!followUpLoading">
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
        <ul class="telOrWx" v-if="statusNum == 1 && isLastBearn">
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
        <!-- 动态列表 -->
        <div class="openFromList" v-show="!followUpLoading" @click="drawer = true">
          <div class="relative">
            <div class="fix-list-icon">
              <i class="el-icon-d-arrow-left"></i>
            </div>
            <div class="fix-list-title">动态列表</div>
          </div>
        </div>
        <el-drawer
          :visible.sync="drawer"
          size="90%"
          :direction="direction"
          custom-class="drawer_by"
          @opened="drawerOpen"
        >
          <el-row class="drawer_menu" style="padding: 0 20px">
            <el-col :span="8">
              <el-menu
                :default-active="questionnaireTitleCode"
                @select="formSelect"
              >
                <el-submenu
                  v-for="(item, index) in formList"
                  :index="'\'' + index + '\''"
                  :key="item.formId+index"
                >
                  <template slot="title">
                    <span>{{ item.nodeName }}</span>
                  </template>
                  <el-menu-item
                    v-for="(subItem, itemIndex) in item.titleList"
                    :key="subItem.code"
                    :index="subItem.code+ '-'+ index+'-'+itemIndex"
                    :title="subItem.name"
                    >{{ subItem.name }}</el-menu-item
                  >
                </el-submenu>
              </el-menu>
            </el-col>
            <el-col :span="16">
              <div class="form-main">
                <el-collapse
                  v-for="(collapse, index) in form.getData"
                  :key="index"
                  v-model="collapse.groupCode + index + index"
                >
                  <el-collapse-item
                    v-for="(groupItem, gKey) in collapse.ddList"
                    :key="gKey"
                    :name="collapse.groupCode + index + gKey"
                  >
                    <template slot="title">
                      {{ collapse.groupName }}
                      <i
                        v-show="collapse.isCopy"
                        class="el-icon-document-copy op"
                        title="复制"
                        @click.stop="groupChange(index, gKey, groupItem)"
                      ></i>
                      <i
                        v-show="collapse.ddList.length > 1"
                        class="el-icon-delete op"
                        title="删除"
                        @click.stop="groupChange(index, gKey)"
                      ></i>
                    </template>
                    <el-form ref="getData" :model="groupItem" size="mini">
                      <!-- <div v-for="item in groupItem.ddOrder" :key="item" style="max-width:500px;"> -->
                      <div v-for="item in groupItem.ddOrder" :key="item">
                        <!-- 单文本 -->
                        <el-form-item
                          v-if="groupItem.copyData[item].controlType === 'TB'"
                          class="label100"
                          :label="groupItem.copyData[item].ddName"
                          v-show="groupItem.copyData[item].visible"
                          :prop="'copyData.' + item + '.value'"
                          :rules="
                            groupItem.copyData[item].isNeed
                              ? [
                                  {
                                    required: true,
                                    message:
                                      '请填写' +
                                      groupItem.copyData[item].ddName,
                                  },
                                ]
                              : null
                          "
                        >
                          <el-input
                            type="input"
                            :disabled="!!groupItem.copyData[item].readOnly"
                            v-model="groupItem.copyData[item].value"
                          >
                            <template
                              slot="append"
                              v-if="groupItem.copyData[item].unitOfMeasure"
                            >
                              {{ groupItem.copyData[item].unitOfMeasure }}
                            </template>
                          </el-input>
                        </el-form-item>
                        <!-- 单选 -->
                        <el-form-item
                          v-if="groupItem.copyData[item].controlType === 'RB'"
                          class="label100"
                          :label="groupItem.copyData[item].ddName"
                          v-show="groupItem.copyData[item].visible"
                          :prop="'copyData.' + item + '.value'"
                          :rules="
                            groupItem.copyData[item].isNeed
                              ? [
                                  {
                                    required: true,
                                    message:
                                      '请选择' +
                                      groupItem.copyData[item].ddName,
                                  },
                                ]
                              : null
                          "
                        >
                          <template>
                            <el-radio-group
                              :disabled="!!groupItem.copyData[item].readOnly"
                              v-model="groupItem.copyData[item].value"
                            >
                              <el-radio
                                v-for="(listItem, index) in groupItem.copyData[
                                  item
                                ].optionList"
                                :key="index"
                                :label="listItem.value"
                                @click.native.prevent="
                                  cancelChecked(
                                    groupItem.copyData[item],
                                    listItem.value
                                  )
                                "
                              >
                                {{ listItem.displayName }}
                              </el-radio>
                            </el-radio-group>
                          </template>
                        </el-form-item>
                        <!-- 多选 -->
                        <el-form-item
                          v-if="groupItem.copyData[item].controlType === 'CB'"
                          class="label100"
                          :label="groupItem.copyData[item].ddName"
                          v-show="groupItem.copyData[item].visible"
                          :prop="'copyData.' + item + '.value'"
                          :rules="
                            groupItem.copyData[item].isNeed
                              ? [
                                  {
                                    required: true,
                                    message:
                                      '请选择' +
                                      groupItem.copyData[item].ddName,
                                  },
                                ]
                              : null
                          "
                        >
                          <template>
                            <el-checkbox-group
                              :disabled="!!groupItem.copyData[item].readOnly"
                              v-model="groupItem.copyData[item].value"
                            >
                              <el-checkbox
                                v-for="(listItem, index) in groupItem.copyData[
                                  item
                                ].optionList"
                                :key="index"
                                :label="listItem.value"
                              >
                                {{ listItem.displayName }}
                              </el-checkbox>
                            </el-checkbox-group>
                          </template>
                        </el-form-item>
                        <!-- 下拉单选 -->
                        <el-form-item
                          v-if="
                            groupItem.copyData[item].controlType === 'SEL_SIG'
                          "
                          class="label100"
                          :label="groupItem.copyData[item].ddName"
                          v-show="groupItem.copyData[item].visible"
                          :prop="'copyData.' + item + '.value'"
                          :rules="
                            groupItem.copyData[item].isNeed
                              ? [
                                  {
                                    required: true,
                                    message:
                                      '请选择' +
                                      groupItem.copyData[item].ddName,
                                  },
                                ]
                              : null
                          "
                        >
                          <template>
                            <el-select
                              :disabled="!!groupItem.copyData[item].readOnly"
                              v-model="groupItem.copyData[item].value"
                              filterable
                              collapse-tags
                              placeholder="请选择"
                            >
                              <el-option
                                v-for="listItem in groupItem.copyData[item]
                                  .optionList"
                                :key="listItem.displayName"
                                :label="listItem.displayName"
                                :value="listItem.value"
                              ></el-option>
                            </el-select>
                          </template>
                        </el-form-item>
                        <!-- 日期选择 -->
                        <el-form-item
                          v-if="groupItem.copyData[item].controlType === 'DP'"
                          class="label100"
                          :label="groupItem.copyData[item].ddName"
                          v-show="groupItem.copyData[item].visible"
                          :prop="'copyData.' + item + '.value'"
                          :rules="
                            groupItem.copyData[item].isNeed
                              ? [
                                  {
                                    required: true,
                                    message:
                                      '请选择' +
                                      groupItem.copyData[item].ddName,
                                  },
                                ]
                              : null
                          "
                        >
                          <template>
                            <el-date-picker
                              :disabled="!!groupItem.copyData[item].readOnly"
                              value-format="yyyy-MM-dd"
                              v-model="groupItem.copyData[item].value"
                              type="date"
                              placeholder="选择日期"
                            ></el-date-picker>
                          </template>
                        </el-form-item>
                        <!-- 时间选择 -->
                        <el-form-item
                          v-if="groupItem.copyData[item].controlType === 'TP'"
                          class="label100"
                          :label="groupItem.copyData[item].ddName"
                          v-show="groupItem.copyData[item].visible"
                          :prop="'copyData.' + item + '.value'"
                          :rules="
                            groupItem.copyData[item].isNeed
                              ? [
                                  {
                                    required: true,
                                    message:
                                      '请选择' +
                                      groupItem.copyData[item].ddName,
                                  },
                                ]
                              : null
                          "
                        >
                          <template>
                            <el-time-select
                              :disabled="!!groupItem.copyData[item].readOnly"
                              v-model="item.value"
                              placeholder="选择时间"
                              :picker-options="{
                                start: '00:00',
                                step: '00:15',
                                end: '23:59',
                              }"
                            ></el-time-select>
                          </template>
                        </el-form-item>
                        <!-- 时间日期选择 -->
                        <el-form-item
                          v-if="groupItem.copyData[item].controlType === 'DTP'"
                          class="label100"
                          :label="groupItem.copyData[item].ddName"
                          v-show="groupItem.copyData[item].visible"
                          :prop="'copyData.' + item + '.value'"
                          :rules="
                            groupItem.copyData[item].isNeed
                              ? [
                                  {
                                    required: true,
                                    message:
                                      '请选择' +
                                      groupItem.copyData[item].ddName,
                                  },
                                ]
                              : null
                          "
                        >
                          <template>
                            <el-date-picker
                              :disabled="!!groupItem.copyData[item].readOnly"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              v-model="groupItem.copyData[item].value"
                              type="datetime"
                              placeholder="选择日期时间"
                            ></el-date-picker>
                          </template>
                        </el-form-item>
                        <!-- 数字 -->
                        <el-form-item
                          v-if="groupItem.copyData[item].controlType === 'NTX'"
                          class="label100"
                          :label="groupItem.copyData[item].ddName"
                          v-show="groupItem.copyData[item].visible"
                          :prop="'copyData.' + item + '.value'"
                          :rules="
                            groupItem.copyData[item].isNeed
                              ? [
                                  {
                                    required: true,
                                    message:
                                      '请填写' +
                                      groupItem.copyData[item].ddName,
                                  },
                                ]
                              : null
                          "
                        >
                          <template>
                            <el-input
                              type="number"
                              :disabled="!!groupItem.copyData[item].readOnly"
                              v-model="groupItem.copyData[item].value"
                            >
                              <template
                                slot="append"
                                v-if="groupItem.copyData[item].unitOfMeasure"
                              >
                                {{ groupItem.copyData[item].unitOfMeasure }}
                              </template>
                            </el-input>
                          </template>
                        </el-form-item>
                        <!-- 总分 -->
                        <el-form-item
                          v-if="
                            groupItem.copyData[item].controlType === 'TOTAL'
                          "
                          class="label100"
                          :label="groupItem.copyData[item].ddName"
                          v-show="groupItem.copyData[item].visible"
                        >
                          <template>
                            <el-input
                              type="number"
                              disabled
                              v-model="groupItem.copyData[item].value"
                            ></el-input>
                          </template>
                        </el-form-item>
                        <!-- 多行文本 -->
                        <el-form-item
                          v-if="groupItem.copyData[item].controlType === 'TA'"
                          class="label100"
                          :label="groupItem.copyData[item].ddName"
                          v-show="groupItem.copyData[item].visible"
                          :prop="'copyData.' + item + '.value'"
                          :rules="
                            groupItem.copyData[item].isNeed
                              ? [
                                  {
                                    required: true,
                                    message:
                                      '请填写' +
                                      groupItem.copyData[item].ddName,
                                  },
                                ]
                              : null
                          "
                        >
                          <template>
                            <el-input
                              type="textarea"
                              :disabled="!!groupItem.copyData[item].readOnly"
                              v-model="groupItem.copyData[item].value"
                              rows="1"
                            ></el-input>
                          </template>
                        </el-form-item>
                        <!-- LABEL -->
                        <el-form-item
                          v-if="
                            groupItem.copyData[item].controlType === 'LABEL'
                          "
                          class="label100"
                          :label="groupItem.copyData[item].ddName"
                          v-show="groupItem.copyData[item].visible"
                        >
                          <template>
                            <el-input
                              type="textarea"
                              v-model="groupItem.copyData[item].value"
                              :style="{ visibility: 'hidden' }"
                            ></el-input>
                          </template>
                        </el-form-item>
                        <!-- 文件上传 -->
                        <el-form-item
                          v-if="groupItem.copyData[item].controlType === 'SUF'"
                          class="label100"
                          :label="groupItem.copyData[item].ddName"
                          v-show="groupItem.copyData[item].visible"
                          :prop="'copyData.' + item + '.value'"
                          :rules="
                            groupItem.copyData[item].isNeed
                              ? [
                                  {
                                    required: true,
                                    message:
                                      '请选择' +
                                      groupItem.copyData[item].ddName,
                                  },
                                ]
                              : null
                          "
                        >
                          <el-upload
                            action="/api/followupTemplateValue/uploadFile"
                            ref="uploadPic"
                            list-type="picture-card"
                            name="files"
                            multiple
                            :before-upload="beforeUpload"
                            :file-list="picList"
                          >
                            <i slot="default" class="el-icon-plus"></i>
                            <div slot="file" slot-scope="{ file }">
                              <img
                                class="el-upload-list__item-thumbnail"
                                :src="file.url"
                                alt=""
                              />
                              <span class="el-upload-list__item-actions">
                                <span
                                  class="el-upload-list__item-preview"
                                  @click="handlePictureCardPreview(file)"
                                >
                                  <i class="el-icon-zoom-in"></i>
                                </span>
                                <!-- <span v-if="!disabledImage" class="el-upload-list__item-delete" @click="handleDownload(file)">
                                      <i class="el-icon-download"></i>
                                    </span> -->
                                <span
                                  v-if="!disabledImage"
                                  class="el-upload-list__item-delete"
                                  @click="handleRemove(file)"
                                >
                                  <i class="el-icon-delete"></i>
                                </span>
                              </span>
                            </div>
                          </el-upload>
                        </el-form-item>
                        <!-- 地址选择 -->
                        <el-form-item
                          v-if="
                            groupItem.copyData[item].controlType === 'ADSEL'
                          "
                          class="label100"
                          :label="groupItem.copyData[item].ddName"
                          v-show="groupItem.copyData[item].visible"
                          :prop="'copyData.' + item + '.value'"
                          :rules="
                            groupItem.copyData[item].isNeed
                              ? [
                                  {
                                    required: true,
                                    message:
                                      '请选择' +
                                      groupItem.copyData[item].ddName,
                                  },
                                ]
                              : null
                          "
                        >
                          <el-cascader
                            :disabled="!!groupItem.copyData[item].readOnly"
                            size="mini"
                            style="width: 99%"
                            :options="ADoptions"
                            v-model="groupItem.copyData[item].value"
                          ></el-cascader>
                        </el-form-item>
                        <!-- 文本标题 -->
                        <el-form-item
                          v-if="groupItem.copyData[item].controlType === 'LB'"
                          class="label100"
                          :label="groupItem.copyData[item].ddName"
                          v-show="groupItem.copyData[item].visible"
                        ></el-form-item>
                      </div>
                    </el-form>
                  </el-collapse-item>
                </el-collapse>
                <el-button
                  type="primary"
                  size="mini"
                  @click="formSave"
                  style="float: right; margin-top: 20px"
                  >保存</el-button
                >
              </div>
            </el-col>
          </el-row>
        </el-drawer>
        <el-tabs v-model="followupActiveName" class="secondTabs">
          <el-tab-pane label="专题随访" name="special" >
            <FollowupTable
              ref="FollowupTable"
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
          <el-tab-pane label="生存随访" name="routine" v-if="false">
          </el-tab-pane>
          <el-tab-pane label="常规随访" name="survival"></el-tab-pane>
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
    <!-- 表单缩略图预览 -->
    <el-dialog :visible.sync="dialogImageVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
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

import {
  getBaseInfo,
  getRelationship,
  updateBaseInfo,
  getContentNumList,
  getConnectionOrMeth,
  postUploadRecordLive,
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
  getFormDetails,
  saveFormDetails,
  getFormList,
} from "@/api/projectAudit";

import {
  getSpecialBeansByPro,
  postPatientFillForm,
  sendSpcialWx,
  sendSpcialSms,
} from "@/api/specialFollowUp";
import { parseTime, isArray } from "@/utils/index.js";
import { regionDataPlus } from "element-china-area-data";
import FollowupTable from "./Components/FollowupTable";
import { Loading } from "element-ui";
let loadingInstance = null;
export default {
  name: "SpecialFollowUPdetailFU",
  components: {
    FollowupTable,
    PatientsBasicInformation, //  jijw 新增
  },
  data() {
    // let {
    //   name,
    //   sex,
    //   age,
    //   mainDiagnose,
    //   treatType,
    //   dcDate,
    //   dcCondition,
    //   pil,
    //   discharge,
    // } = this.$route.query;
    return {
      /*---表单录入---*/
      form: {
        getData: [],
        list: {},
      },
      formList: [],
      nodeId: "",
      questionnaireTitleCode: "",
      ADoptions: regionDataPlus,
      //存储所有watcher,增删组时需全部清除
      formWatchers: [],
      //图片上传预览
      dialogImageUrl: "",
      dialogImageVisible: false,
      disabledImage: false,
      picList: [],
      //
      drawer: false,
      direction: "rtl",
      // 电话
      isCalling: 0, // 0 初始状态
      isPlayAudio: false,
      isBtnClick: false,

      formMaxSize: 100, // 上传文件大小
      formFileList: [], // 显示上传文件
      uploadFormFileList: [], // 确定上传文件

      audioUrl: "", //录音文件路径
      isLastBearn: true, //时间轴控制 显示隐藏  当前节点
      // 该项目随访方式
      isFollowPhone: true,
      isFollowWx: true,
      isFollowSms: true,

      //old
      id: this.$route.query.id,
      projectId: this.$route.query.projectId,
      resultId: this.$route.query.resultId,
      statusNum: this.$route.query.statusNum,
      groupId: this.$route.query.groupId,
      isTimeLineItem: 0,
      timelineList: [],
      allDataList: [],
      dialogVisible: false,
      wxInfo: "",
      followupActiveName: "special",
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
        discharge: "",
        followupStatus: "",
        advise: "",
        formId: [],
      },
      //信息修改后返回的id用于查询变更日志
      isView: false,
      followUpLoading:false,
      getPatientDataVal:{
        id: this.$route.query.id,
        diseaseId: this.$route.query.diseaseId,
      },
    };
  },
  created() {
    this.openDevice(); //打开设备
    // this.openMic(); //打开mic
    // this.openHeadset(); //打开耳机

    this.getConnectionFn(); // 获取接通状态列表
    this.getfindLogByReviewFn(); // 获取日志列表
    this.getFormListFn(); // 获取动态表单

    this.getSpecialBeansByProFn(); // 获取左侧列表+随访信息接口
    this.getContentNumListFn(); // 获取联系方式列表
    this.getIsView(); //获取是否查看
    this.getBaseInfoFn(); // 获取基本信息

    // this.getMethFn(); // 获取随访方式 (常规暂时不需要
    // this.getLiveBeansFn(); // 获取左侧列表+随访信息接口
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
    // 360视图
    to360(activeName) {
      if (activeName == "to360") {
        window.open(
          this.VIEW360 + "/vinci-web/api/forEdc/getPersonOverviewByIdCard?idCardNo=" + this.basicInfo.idNum
        );
        return false;
      }
    },
    //获取动态表单列表
    getFormListFn() {
      getFormList({ projectId: this.projectId }).then((res) => {
        //  不展示默认表单
         res.data.forEach(element => {
          element.formId = element.formId.substr(element.formId.indexOf(',')+1)
          element.titleList.splice(0,1);
        });

        this.questionnaireTitleCode = res.data[0].titleList[0]
          ? res.data[0].titleList[0].code +'-0-0'
          : "";
        this.nodeId = res.data[0].nodeId;
        this.formList = res.data;

        console.log( this.formList ,'获取动态表单列表')
        this.getDataFn();
      });
    },
    //点击表单
    formSelect(index, indexPath) {
      loadingInstance = Loading.service();
      this.questionnaireTitleCode = index;
      this.nodeId = this.formList[indexPath[0].replace(/[^0-9]/gi, "")].nodeId;
      this.getDataFn();
    },
    //表单保存
    formSave() {
      let validateResult = false;
      try {
        this.$refs["getData"].forEach(function (item, index) {
          item.validate((valid) => {
            if (valid) {
              validateResult = true;
            } else {
              validateResult = false;
              throw new Error("Data not filled in!!!");
            }
          });
        });
      } catch (e) {
        if (e.message === "Data not filled in!!!") {
          validateResult = false;
        }
      } finally {
        let data = JSON.parse(JSON.stringify(this.form.getData));
        data.forEach((collapse) => {
          collapse.ddList.forEach((item, i) => {
            item.caseId = i + 1;
            Object.keys(item.copyData).forEach((key) => {
              // let el = item.copyData[key];
              // if (el.controlType === "CB" || el.controlType === "ADSEL") {
              //   isArray(el.value) && (el.value = el.value.join(","));
              // }
              // if (el.controlType === "SUF") {
              //   el.value = this.picList.reduce((t, e) => {
              //     return (t += JSON.stringify(e) + "&&&");
              //   }, "");
              // }

              item.copyData[key] = item.copyData[key].value;
            });
          });
        });
        const postData = {
          questionnaireTitleCode: this.form.getData[0].questionnaireTitleCode.split("-")[0],
          groupList: data,
          projectId: this.$route.query.projectId,
          patientId: this.$route.query.patientId,
          nodeId: this.nodeId,
          groupId: this.$route.query.followUpId,
        };
        validateResult
          ? saveFormDetails(postData).then((res) => {
              this.getDataFn();
            })
          : this.$message({
              message: "请检查是否有必填字段未填写",
              type: "warning",
            });
      }
    },
    // 表单录入获取表单详情
    getDataFn() {
      const postData = {
        questionnaireTitleCode: this.questionnaireTitleCode.split("-")[0],
        projectId: this.$route.query.projectId,
        patientId: this.$route.query.patientId,
        nodeId: this.nodeId,
        groupId: this.$route.query.groupId,
      };
      getFormDetails(postData).then((res) => {
        //重组---被分离的复制组
        let result = [];
        let map = {};
        let groups = res.data.groups;
        for (let k = 0; k < groups.length; k++) {
          if (!map[groups[k].groupCode] || groups[k].groupCode === "default") {
            result.push({ ...groups[k] });
            map[groups[k].groupCode] = groups[k];
          } else {
            for (let j = 0; j < result.length; j++) {
              if (
                result[j].groupCode === groups[k].groupCode &&
                groups[k].groupCode !== "default"
              ) {
                result[j].ddList = result[j].ddList.concat(groups[k].ddList);
                break;
              }
            }
          }
        }
        //组件数据类型转化
        res.data.groups.forEach((item) => {
          item.ddList.forEach((gItem, gIndex) => {
            Object.keys(gItem.copyData).forEach((gKey) => {
              let el = gItem.copyData[gKey];
              if (el.controlType === "CB" || el.controlType === "ADSEL") {
                el.value = !!el.value ? el.value.split(",") : [];
              }
              if (el.controlType === "SLD") {
                el.value = Number(el.value);
              }
              if (el.controlType === "SUF") {
                el.value.split("&&&").forEach((pic, ind) => {
                  if (!!pic) this.$set(this.picList, ind, JSON.parse(pic));
                });
              }
            });
          });
        });
        res.data.list = res.data.list.reduce((t, e, i) => {
          t[e.ddCode] = e;
          return t;
        }, {});
        this.$set(this.form, "getData", result);
        this.$set(this.form, "list", res.data.list);
        this.formWatchers.forEach((_) => _());
        this.addComOrResRules();
        this.drawerOpen();
        loadingInstance && loadingInstance.close();
      });
    },
    //隐藏折叠标题为未分组的头
    drawerOpen() {
      this.$nextTick(() => {
        let panel = document.querySelectorAll(
          ".el-collapse-item .el-collapse-item__header"
        );
        Array.from(panel).forEach((e) => {
          e.innerText === "未分组"
            ? (e.style.display = "none")
            : (e.style.display = "");
        });
      });
    },
    //增删组
    groupChange(index, gIndex, copyData) {
      //清空所有watcher
      this.formWatchers.forEach((_) => _());
      !!copyData
        ? this.form.getData[index].ddList.push(
            JSON.parse(JSON.stringify(copyData))
          )
        : this.form.getData[index].ddList.splice(gIndex, 1);
      this.addComOrResRules();
    },
    //添加计算与约束规则
    addComOrResRules() {
      // console.log('come in addComOrResRulesFn',this.form.getData)
      //动态添加监听--数据结构与计算规则需前后端统一制定再进行代码调整
      let _this = this;
      _this.form.getData.forEach((_, index) => {
        _.ddList.forEach((__, gIndex) => {
          Object.keys(__.copyData).forEach((___) => {
            __.copyData[___].calculations &&
              __.copyData[___].calculations.indexOf("=") > -1 &&
              _this.formWatchers.push(
                _this.$watch(
                  "form.getData." +
                    index +
                    ".ddList." +
                    gIndex +
                    ".copyData." +
                    ___,
                  (n, o) => {
                    let res = n.calculations
                      .split("=")[0]
                      .replace(/[0-9A-Za-z]{16}/gim, (key) => {
                        let el = __.copyData[key];
                        if (el.controlType === "CB") {
                          return isArray(el.value)
                            ? el.value.reduce((total, item) => {
                                return (total += Number(item));
                              }, 0)
                            : el.value;
                        } else {
                          if (el.controlType === "RB") {
                            isNaN(el.value) &&
                              (el.value = el.optionList.filter(
                                (op) => op.displayName === el.value
                              )[0].value);
                          }
                          return Number(el.value);
                        }
                      });
                    __.copyData[n.calculations.split("=")[1]].value =
                      eval(res).toString().indexOf("Infinity") > -1
                        ? "error"
                        : eval(res);
                  },
                  { deep: true, immediate: true }
                )
              );
            __.copyData[___].binds &&
              __.copyData[___].binds.replace(/[0-9A-Za-z]{16}/gim, (key) => {
                _this.formWatchers.push(
                  _this.$watch(
                    "form.getData." +
                      index +
                      ".ddList." +
                      gIndex +
                      ".copyData." +
                      key,
                    (n, o) => {
                      let res = __.copyData[___].binds.replace(
                        /[0-9A-Za-z]{16}/gim,
                        (item) => {
                          if (
                            __.copyData[item].controlType === "DTP" ||
                            __.copyData[item].controlType === "DP"
                          ) {
                            return +new Date(__.copyData[item].value);
                          } else
                            return !!__.copyData[item].value
                              ? isArray(__.copyData[item].value)
                                ? __.copyData[item].value
                                    .join(",")
                                    .replace(/[^,]+/g, (str) => {
                                      return isNaN(str) ? '"' + str + '"' : str;
                                    })
                                : '"' + __.copyData[item].value + '"'
                              : null;
                        }
                      );
                      __.copyData[___].visible = eval(res) ? 0 : 1;
                    },
                    { deep: true, immediate: true }
                  )
                );
              });
          });
        });
      });
    },
    //缩略图预览、下载、删除
    handlePictureCardPreview(file) {
      //协调将后台thumUrl存为实际图，url为缩略图。
      this.dialogImageUrl = file.thumUrl || file.response.data.thumUrl;
      this.dialogImageVisible = true;
    },
    handleDownload(file) {},
    handleRemove(file) {
      deletePic({ path: file.thumUrl }).then((res) => {
        this.picList = this.picList.filter((_) => _.name !== file.name);
      });
    },
    //上传前可做处理-限制格式、大小等
    beforeUpload(file) {
      let check_message = this.file_info_check(file);
      if (check_message) {
        this.$message(check_message);
        this.imageUrl = "";
        return false;
      }
      this.upload(file);
    },
    //定义上传
    upload(file) {
      this.formPicsData = new FormData();
      this.formPicsData.append("files", file);
      const postData = {
        files: this.formPicsData,
      };
      uploadImage(this.formPicsData).then((res) => {
        this.picList.push(res.data[0]);
      });
    },
    // 前端校验文件上传是否符合条件
    file_info_check(file) {
      var ret = "";
      if (file === void 0) {
        ret = "";
      }
      var max_file_size = 1024 * 1024 * 10;
      if (file.size > max_file_size) {
        ret = "图片不能大于10Mb";
      }
      var allow_type = "image/jpeg|image/png";
      if (allow_type.indexOf(file.type) == -1) {
        ret = "图片格式要求是jpg或png";
      }
      return ret;
    },
    //获取是否查看
    getIsView() {
      this.isView = this.$route.query.isView == "true";
    },
    //单选反选清空
    cancelChecked(item, value) {
      item.value = value == item.value ? "" : value;
    },
    // 第一级点击
    handleClick(tab, event) {
      if (tab.name == "third") {
        this.getContentNumListFn(); // 获取联系方式列表
      }else if (tab.name == "first") {
        this.$refs.PatientsBasicInformation.getBaseInfoFn();
      }
    },
    //时间轴点击
    clickTimeItem(timeLineItem, vvisTimeLineItem) {
      this.isTimeLineItem = vvisTimeLineItem;
      console.log(
        this.allDataList,
        "时间轴点击",
        this.groupId,
        timeLineItem.groupId
      );

      if (timeLineItem.groupId == this.groupId) {
        this.isLastBearn = true;
        this.isView = false;
      } else {
        this.isLastBearn = false;
        this.isView = true;
      }
      if (this.statusNum == 1) {
        this.isView = true;
      }

      this.allDataList.forEach((item) => {
        if (item.groupId == timeLineItem.groupId) {
          item.result = Object.assign({}, item.result);
          this.formDataDis = {
            patientName: item.result.patientName,
            projectPlanName: item.result.projectPlanName,
            sex: item.result.sex,
            age: item.result.age,
            idNum: item.result.idNum,
            medicalNumber: item.result.medicalNumber,
            disease: item.result.disease,
            address: item.result.address,
            tpatno: item.result.tpatno,
            diseaseName: item.result.diseaseName,
            mainDiagnose: item.result.mainDiagnose,
            treatType: item.result.treatType,
            dcDate: item.result.dcDate,
            dcCondition: item.result.dcCondition,
            pil: item.result.pil,
            discharge: item.result.discharge
              ? item.result.discharge
              : "暂无医嘱",
          };
          let phoneNumval = this.contactNumList.length
            ? this.contactNumList[0].value
            : "";
          this.formData = {
            deathTime:
              item.result.deathTime == undefined
                ? ""
                : new Date(item.result.deathTime),
            checkTime:
              item.result.checkTime == undefined
                ? ""
                : new Date(item.result.checkTime),
            description: item.result.description,
            followupStatus: item.result.followupEnd,
            confirmDate: item.result.confirmDate,
            contactNum: item.result.mobile ? item.result.mobile : phoneNumval,
            formId: [item.result.contactSituation],
            remarks: item.result.remarks,
            ifHospital: item.result.ifHospital,
            ifDeath: item.result.ifDeath,
            lostCause: item.result.lostCause,
            reviewSite: item.result.reviewSite,
            transferSite: item.result.transferSite,
          };
        }
      });
    },
    // 获取左侧列表+随访信息接口
    getSpecialBeansByProFn() {
      // | patientId | 患者id | t        |
      // | projectId | 项目id | t        |
      const getData = {
        patientId: this.id,
        projectId: this.projectId,
      };
      this.followUpLoading =true
      getSpecialBeansByPro(getData)
        .then((res) => {
          this.followUpLoading =false
          console.log(" 获取左侧列表+随访信息接口", res.data);
          this.allDataList = res.data;
          this.timelineList = res.data.reduce((arrlist, item, index) => {
            if (item.groupId == this.$route.query.groupId) {
              this.isTimeLineItem = index;
              item.result = Object.assign({}, item.result);
              this.formDataDis = {
                patientName: item.result.patientName,
                projectPlanName: item.result.projectPlanName,
                sex: item.result.sex,
                age: item.result.age,
                idNum: item.result.idNum,
                medicalNumber: item.result.medicalNumber,
                disease: item.result.disease,
                confirmDate: item.result.confirmDate,
                address: item.result.address,
                tpatno: item.result.tpatno,
                diseaseName: item.result.diseaseName,
                mainDiagnose: item.result.mainDiagnose,
                treatType: item.result.treatType,
                dcDate: item.result.dcDate,
                dcCondition: item.result.dcCondition,
                pil: item.result.pil,
                discharge: item.result.discharge
                  ? item.result.discharge
                  : "暂无医嘱",
              };
              let phoneNumval = this.contactNumList.length
                ? this.contactNumList[0].value
                : "";
              this.formData = {
                deathTime:
                  item.result.deathTime == undefined
                    ? ""
                    : new Date(item.result.deathTime),
                checkTime:
                  item.result.resultTime == undefined
                    ? ""
                    : new Date(item.result.resultTime),
                description: item.result.description,
                followupStatus: item.result.followupEnd,

                contactNum: item.result.mobile
                  ? item.result.mobile
                  : phoneNumval,
                formId: [item.result.contactSituation],
                remarks: item.result.remarks,
                ifHospital: item.result.ifHospital,
                ifDeath: item.result.ifDeath,
                lostCause: item.result.lostCause,
                transferSite:
                  item.result.followupEnd == "transfer"
                    ? item.result.bodySite
                    : "", //转移或复发部位
                reviewSite:
                  item.result.followupEnd == "relapse"
                    ? item.result.bodySite
                    : "", //转移或复发部位
                smsContent: item.smsContent,
                wechatContent: item.wechatContent,
              };
              console.log(item.smsContent, "smsContent", item.wechatContent);
              arrlist.push({
                groupId: item.groupId,
                diseaseId: item.diseaseId,
                content: item.name,
                timestamp: item.followupTime,
                size: "large",
                type: "primary",
                icon: "el-icon-more",
              });
            } else {
              arrlist.push({
                groupId: item.groupId,
                diseaseId: item.diseaseId,
                // content: item.result.treatType,
                content: item.name,
                timestamp: item.followupTime,
                size: "large",
              });
            }

            return arrlist;
          }, []);
        })
        .catch((error) => {
          this.followUpLoading =false
          console.error("获取左侧列表+随访信息接口", error);
        });
    },
    //保存、暂存
    saveFollowUp(type) {
      // old 专题
      let subData = {
        groupId: this.$route.query.groupId,
        contactPhone: this.formData.contactNum, // 电话
        // contcatId: this.contactNumList.filter((x)=>{
        //   x.value ==this.formData.contactNum
        // })[0].id,
        
        resultType: this.formData.followupStatus, //随访结局
        resultTime: parseTime(
          this.formData.checkTime,
          "{y}-{m}-{d} {h}:{i}:{s}"
        ), //转移或复发部位时间
        deathTime: parseTime(
          this.formData.deathTime,
          "{y}-{m}-{d} {h}:{i}:{s}"
        ), //时间
        ifHospital: this.formData.ifHospital, //是否医院死亡
        ifDeath: this.formData.ifDeath, //是否肿瘤死亡
        remarks: this.formData.remarks, //备注
        description: this.formData.description, //补充说明
        lostCause: this.formData.lostCause, //失访原因
        bodySite:
          this.formData.followupStatus == "transfer"
            ? this.formData.transferSite
            : this.formData.reviewSite, //转移或复发部位
        contactSituation: this.formData.formId[0], //接通情况

        
        wechats: "",
        status: type, //1:完成随访（保存时传1id）2：暂存（暂存时传）
        // // recordFilePath
        patientId: this.id,
        id: this.resultId,
      };


      console.log(type,'type','subData',subData)
      if (type == 1) {
        this.$refs.FollowupTable.$refs.formData.validate((valid) => {
          if (valid) {
            postPatientFillForm(subData)
              .then((res) => {
                this.$message.success("新增成功");
                this.$router.go(-1);
              })
              .catch((error) => {
                this.$message.error("新增失败");
              });
          } else {
            this.$message.error("必填项不能为空");
            return;
          }
        });
      } else {
        postPatientFillForm(subData)
          .then((res) => {
            this.$message.success("暂存成功");
            this.$router.go(-1);
          })
          .catch((error) => {
            this.$message.error("暂存失败");
          });
      }
    },
    // 编辑
    changeEnd() {
      this.isView = false;
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
    contactNumChangeFn(){
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
    //微信随访
    wxClick() {
      this.wxInfo = this.formData.wechatContent;
      this.dialogVisible = true;
    },
    // 短信点击
    smsClick() {
      this.wxInfo = this.formData.smsContent;
      this.dialogTitle = "短信";
      this.dialogVisible = true;
    },
    wxConfirm() {
      loadingInstance = Loading.service();
      console.log("in !", this.resultId);
      const postData = {
        patientId: this.id,
        id: this.resultId ? this.resultId : null,
      };
      if (this.dialogTitle === "微信") {
        postData.wechats = this.wxInfo;
      } else {
        postData.sms = this.wxInfo;
        postData.mobile = this.formData.contactNum.replace(/\D/g, "");
      }
      console.log(postData);
      this.dialogTitle === "微信"
        ? sendSpcialWx(postData)
            .then((res) => {
              console.log("sendSpcialWx", res);
              this.resultId = res.data.resultId;
              console.log("out !", this.resultId);
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
              console.error("sendSpcialWx", error);
            })
        : sendSpcialSms(postData)
            .then((res) => {
              console.log("sendSpcialWx", res);
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
              console.error("sendSpcialWx", error);
            });
    },

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
        // // 联系人信息处理
        // contcats = contcats[0] || [];
        // if (contcats.contact1Name != undefined) {
        //   if (contcats.contact1Name.indexOf(",") != -1) {
        //     let contcatsResult = [],
        //       sL;
        //     Object.keys(contcats).forEach((_, ind) => {
        //       let s = contcats[_];
        //       contcatsResult[ind] = {};
        //       if (
        //         toString.call(s) === "[object String]" &&
        //         s.indexOf(",") > -1
        //       ) {
        //         s = s.split(",");
        //         sL = s.length;
        //         s.forEach((__, i) => {
        //           contcatsResult[i][_] = __;
        //         });
        //       }
        //     });
        //     this.liaisonData = contcatsResult.splice(0, sL);
        //   } else {
        //     this.liaisonData.push(contcats);
        //   }
        // }
      });
    },
    //获取日志列表
    getfindLogByReviewFn() {
      const postData = {
        pageNum: this.currentPage,
        pageSize: this.currentPageSize,
        type: "survival",
        patientId: this.id,
        resultId: this.resultId,
      };
      getfindLogByReview(postData)
        .then((res) => {
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
        .then((res) => {})
        .catch((error) => {
          console.error("getMeth", error);
        });
    },

    handleSizeChange(val) {
      this.currentPageSize = val;
      this.getListFn();
    },
    handleCurrentChange(val) {
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
.openFromList {
  position: fixed;
  top: 300px;
  right: 0px;
  z-index: 20;
  cursor: pointer;
  width: 52px;
  height: 100px;
  background: #2476c2;
  border-radius: 12px 0 0 12px;
  font-size: 12px;
  box-shadow: 0px 0px 10px 0px rgba(30, 30, 30, 0.2);
  .fix-list-icon {
    position: absolute;
    top: 40px;
    left: 8px;
    width: 12px;
    font-size: 14px;
    color: #fff;
  }
  .fix-list-title {
    position: absolute;
    top: 16px;
    left: 30px;
    width: 12px;
    font-size: 12px;
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
.form-main .el-collapse {
  border-top: none;
  &:first-of-type .el-collapse-item > div:first-of-type {
    border-top: none !important;
  }
  .el-collapse-item__header {
    background: #eef4fa;
    color: #2476c2;
    height: 36px;
    line-height: 36px;
    padding-left: 20px;
    position: relative;
    i.op {
      position: absolute;
      right: 30px;
      cursor: pointer;
      &:nth-of-type(1) {
        right: 50px;
      }
    }
  }
  // 反选清空单选样式影响处理
  .el-radio:focus:not(.is-focus):not(:active):not(.is-disabled)
    .el-radio__inner {
    -webkit-box-shadow: none;
    box-shadow: none;
  }
}
.drawer_menu .el-submenu .el-menu-item {
  min-width: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
.drawer_by section {
  height: calc(100vh - 100px);
  .drawer_menu,
  .el-col {
    height: 100%;
    overflow-y: auto;
  }
}
</style>
