<template>
  <div class="content">
    <div class="page-table relative">
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
        :before-leave="to360"
      >
        <el-tab-pane label="基本信息" name="first">
          <PatientsBasicInformation
            ref="PatientsBasicInformation"
            :getPatientDataVal="getPatientDataVal"
            :basicInfo="basicInfo"
            v-if="Object.keys(basicInfo).length"
          />
        </el-tab-pane>
        <el-tab-pane label="360视图" name="to360" v-if="false"></el-tab-pane>
        <!-- <el-tab-pane label="全景病历" name="second">全景病历</el-tab-pane>
        <el-tab-pane label="随访信息" name="third" style="position:relative;">
        	<ul class="operationBtn">
        		<li>
        			<el-button size="mini" type="primary" @click="$router.go(-1)">取消</el-button>
        		</li>
        		<li>
        			<el-button size="mini" type="primary" v-if="!isView" @click="save(2)">暂存</el-button>
        		</li>
        		<li>
        			<el-button size="mini" type="primary" v-if="!isView" @click="save(1)">保存</el-button>
        		</li>
        	</ul>
        	<ul class="telOrWx">
        		<li @click="telClick">
        			<i class="iconfont icondianhua"></i>
        		</li>
        		<li @click="wxClick">
        			<i class="iconfont iconweixin"></i>
        		</li>
        	</ul>
        	<el-tabs v-model="followupActiveName" class="">
        		<el-tab-pane label="常规随访" name="routine">
        			<FollowupTable :formData="formData" :formDataDis="formDataDis" :timelineList="timelineList" :contactNumList="contactNumList"
        			 :connectTypeList="connectTypeList" :isTimeLineItem="isTimeLineItem" @clickTimeItem="clickTimeItem" />
        		</el-tab-pane>
        		<el-tab-pane label="生存随访" name="survival" v-if="false"></el-tab-pane>
        		<el-tab-pane label="专题随访" name="special" v-if="false"></el-tab-pane>
        	</el-tabs>
        </el-tab-pane>
        <el-tab-pane label="信息变更日志" name="fourth">
					<el-table stripe
 						:data="logChangeTableData"
						style="width: 99%">
						<el-table-column
							prop="date"
							label="随访时间"
							width="180">
						</el-table-column>
						<el-table-column
							prop="name"
							label="随访人员"
							width="180">
						</el-table-column>
						<el-table-column
							prop="address"
							label="修改时间">
						</el-table-column>
						<el-table-column
							prop="address"
							label="修改内容">
						</el-table-column>
					</el-table>
				</el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import PatientsBasicInformation from "@/components/PatientsBasicInformation"; // 患者详请 基本信息
import { getFindAllByTypeCode } from "@/api/user";
import { patientGetOneById, patientUpdate } from "@/api/patientManagement";
import { getBaseInfo } from "@/api/routineFollowup"; // 患者详请Api  基本信息

import FollowupTable from "../TumorFollowup/Components/FollowupTable";

export default {
  name: "TumorPatientManagementDetails",
  components: {
    PatientsBasicInformation,
    FollowupTable,
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
      getPatientDataVal: {
        id: this.$route.query.id,
        diseaseId: this.$route.query.diseaseId,
      },
      activeName: "first",
      dataForm: {
        name: "",
        mobile: "",
        sex: 1,
      },
      followUpType: [],
      loading: false,
      idVal: "",
      nameVal: "",
      basicInfo: {}, // 基本信息数据
      id: this.$route.query.id, // 基本信息ID
      // 分页数据
      currentPage: 1,
      currentPageSize: 10,
      currentPageTotal: 0,
      formDataDis: {},
      followupActiveName: "routine",
      formData: {
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
        advise: "",
        formId: [],
      },
      timelineList: [],
      contactNumList: [{ value: "" }],
      connectTypeList: [],
      isTimeLineItem: 0,
      //信息修改后返回的id用于查询变更日志
      resultId: this.$route.query.resultId,
      isView: false,
      logChangeTableData: [],
    };
  },
  watch: {},
  created() {
    this.idVal = this.$route.query.id;
    this.nameVal = this.$route.query.name;
    this.seacherClick();
    this.getCode();
    this.getBaseInfoFn(); // 获取基本信息
  },
  mounted() {},
  methods: {
    // to360
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
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 获取码值表
    getCode() {
      let data = {
        typeCode: "type",
      };
      getFindAllByTypeCode(data)
        .then((res) => {
          this.followUpType = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 查询
    seacherClick() {
      let params = {
        id: this.idVal,
      };
      this.loading = true;
      patientGetOneById(params)
        .then((res) => {
          this.loading = false;
          console.log(res.data.data);
          this.dataForm = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updateForm() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          patientUpdate(this.dataForm)
            .then((res) => {
              this.$message.success("修改成功");
              this.seacherClick();
            })
            .catch((error) => {
              this.$message.error("修改失败");
            });
          this.dialogVisible = false;
        } else {
          this.$message.error("必填项不能为空");
        }
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    //获取基本信息
    getBaseInfoFn() {
      const postData = {
        id: this.id,
        diseaseId: this.$route.query.diseaseId,
      };
      getBaseInfo(postData).then((res) => {
        this.basicInfo = res.data;
      });
    },
    //拨打电话
    telClick() {
      // this.dialogVisible = true;
    },
    //微信随访
    wxClick() {
      this.dialogVisible = true;
    },
    wxConfirm() {
      const postData = {
        patientId: this.id,
        wechats: this.wxInfo,
      };
      sendWx(postData)
        .then((res) => {
          console.log("sendWx", res);
          this.dialogVisible = false;
        })
        .catch((error) => {
          console.error("sendWx", error);
        });
    },
    //时间轴点击
    clickTimeItem(timeLineItem, vvisTimeLineItem) {
      this.isTimeLineItem = vvisTimeLineItem;
      this.allDataList.forEach((item) => {
        if (item.diseaseId == timeLineItem.diseaseId) {
          this.formDataDis = {
            name: item.result.name,
            sex: item.result.sex,
            age: item.result.age,
            mainDiagnose: item.result.mainDiagnose,
            treatType: item.result.treatType,
            dcDate: item.result.dcDate,
            dcCondition: item.result.dcCondition,
            pil: item.result.pil,
            discharge: item.result.discharge
              ? item.result.discharge
              : "暂无医嘱",
          };
          this.formData = {
            contactNum: item.result.mobile
              ? item.result.mobile
              : this.contactNumList[0].value,
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
  },
};
</script>

<style lang="scss">
.data-form {
  width: 90%;
  padding: 20px;
  margin: 0 auto;
}
.change-form {
  position: absolute;
  top: 12px;
  right: 24px;
  z-index: 9999999;
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
      background: #d6eafd;
      border-radius: 2px;
      color: #2476c2;
    }

    &:last-child button {
      background: #2476c2;
      color: #fff;
    }
  }
}

.telOrWx {
  position: fixed;
  top: 60%;
  right: 0px;
  padding: 10px;
  z-index: 20;
  width: 52px;
  height: 144px;
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

  .icondianhua {
    background: #2476c2;
  }

  .iconweixin {
    background: #12bf1d;
  }
}
</style>
