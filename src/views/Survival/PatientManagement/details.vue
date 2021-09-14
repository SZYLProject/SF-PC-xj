<template>
  <div class="content">
    <div class="page-table relative">
      <el-tabs v-model="activeName" @tab-click="handleClick" :before-leave="to360">
        <el-tab-pane label="基本信息" name="first">
          <PatientsBasicInformation
            ref="PatientsBasicInformation"
            :getPatientDataVal="getPatientDataVal"
          />
        </el-tab-pane>
        <el-tab-pane label="360视图" name="to360" v-if="false"></el-tab-pane>
        <!-- <el-tab-pane label="全景病历" name="second">全景病历</el-tab-pane>
        <el-tab-pane label="随访信息" name="third">随访信息</el-tab-pane>
        <el-tab-pane label="信息变更日志" name="fourth"
          >信息变更日志</el-tab-pane
        > -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import PatientsBasicInformation from "@/components/PatientsBasicInformation"; // 患者详请 基本信息  jijw 新增
import { getFindAllByTypeCode } from "@/api/user";
import { patientGetOneById, patientUpdate } from "@/api/patientManagement";
import { getBaseInfo } from "@/api/routineFollowup";
export default {
  name: "SurvivalPatientManagementDetails",
  components: {
    PatientsBasicInformation, // jijw 新增
  },
  data() {
    return {
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
      getPatientDataVal:{
        id: this.$route.query.id,
        diseaseId: this.$route.query.diseaseId,
      },
    };
  },
  watch: {},
  created() {
    this.idVal = this.$route.query.id;
    this.nameVal = this.$route.query.name;
    this.seacherClick();
    this.getCode();
    this.getBaseInfoFn(); // 获取基本信息 jijw 新增
  },
  mounted() {},
  methods: {
    // to360
    to360(activeName) {
      if (activeName == "to360") {
        window.open(
          this.VIEW360 + "/vinci-web/api/forEdc/getPersonOverviewByIdCard?idCardNo=" + this.basicInfo.idNum
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
    //获取基本信息  jijw 新增
    getBaseInfoFn() {
      const postData = {
        id: this.id,
        diseaseId: this.$route.query.diseaseId,
      };
      getBaseInfo(postData).then((res) => {
        this.basicInfo = res.data;
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
</style>
