<template>
  <div class="patientsBasicInformationContent content">
    <el-row :gutter="10" class="relative">
      <el-col :span="8">
        <ul>
          <li>
            <span class="label-name">病案号</span>
            <span v-if="isType == 'Routine'">{{ basicInfo.tpatnoExt }}</span>
            <span v-else>{{ basicInfo.tpatno }}</span>
          </li>
          <li>
            <span class="label-name">出生日期</span>
            <span>{{ basicInfo.birthday | dateFilters }}</span>
          </li>
          <li>
            <span class="label-name">出生地</span>
            <span :title="basicInfo.address">{{ basicInfo.address }}</span>
          </li>

          <li>
            <span class="label-name">身份证号</span>
            <span :title="basicInfo.idNum">{{ basicInfo.idNum }}</span>
          </li>
          <li>
            <span class="label-name">婚姻</span>
            <span>{{ basicInfo.maritalStatus }}</span>
          </li>
          <li>
            <span class="label-name">现住址</span>
            <span :title="basicInfo.address">{{ basicInfo.address }}</span>
          </li>

          <li>
            <span class="label-name">工作单位及地址</span>
            <span :title="basicInfo.p14">{{ basicInfo.p14 }}</span>
          </li>

          <li>
            <span class="label-name">是否失访</span>
            <span>{{ basicInfo.lostFlag }}</span>
          </li>
        </ul>
      </el-col>
      <el-col :span="8">
        <ul>
          <li>
            <span class="label-name">姓名</span>
            <span>{{ basicInfo.patientName }}</span>
          </li>
          <li>
            <span class="label-name">年龄</span>
            <span>{{ basicInfo.age }}</span>
          </li>
          <!-- <li>
								<span class="label-name">新生儿出生体重</span>
								<span></span>
							</li> -->
          <li>
            <span class="label-name">籍贯</span>
            <span>{{ basicInfo.p17 }}</span>
          </li>
          <li>
            <span class="label-name">护照号码</span>
            <span>{{ basicInfo.passport }}</span>
          </li>
          <li>
            <span class="label-name">户口地址</span>
            <span :title="basicInfo.p17">{{ basicInfo.p17 }}</span>
          </li>

          <li>
            <span class="label-name">电话</span>
            <span>{{ basicInfo.mobile }}</span>
          </li>

          <li>
            <span class="label-name">单位电话</span>
            <span></span>
          </li>

          <!-- v-if="basicInfo.status == 1" -->
          <li>
            <span class="label-name">生存状态</span>
            <!-- <span>{{ basicInfo.status === 1 ? "正常" : "刪除" }}</span> -->
            <span>{{ basicInfo.lastFollowResult }}</span>
          </li>
        </ul>
      </el-col>
      <el-col :span="8">
        <ul>
          <li>
            <span class="label-name">性别</span>
            <!-- <span>{{ basicInfo.sex === "1" ? "男" : "女" }}</span> -->
            <span v-if="basicInfo.sex == 1">男</span>
            <span v-else-if="basicInfo.sex == 2">女</span>
            <span v-else>未知</span>
          </li>
          <li>
            <span class="label-name">国籍</span>
            <span>{{ basicInfo.p12 }}</span>
          </li>
          <!-- <li>
								<span class="label-name">新生儿出生体重</span>
								<span></span>
							</li> -->
          <li>
            <span class="label-name">民族</span>
            <span>{{ basicInfo.ethnicity }}</span>
          </li>
          <li>
            <span class="label-name">职业</span>
            <span>{{ basicInfo.p9 }}</span>
          </li>
          <li>
            <span class="label-name">邮编</span>
            <span>{{ basicInfo.p171 }}</span>
          </li>
          <li>
            <span class="label-name">邮编</span>
            <span>{{ basicInfo.p803 }}</span>
          </li>
          <li>
            <span class="label-name">邮编</span>
            <span>{{ basicInfo.p16 }}</span>
          </li>
        </ul>
      </el-col>
      <!-- <el-button
        size="mini"
        type="primary"
        class="btn360"
        @click.stop="to360view"
      >
        360视图
      </el-button> -->
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <span>联系人信息</span>
        <el-form
          :model="myModel"
          ref="myForm"
          size="small"
          class="liaison_form"
        >
          <el-table
            stripe
            :data="myModel.liaisonData"
            class="paddingt12"
            style="width: 99%"
            size="mini"
          >
            <el-table-column prop="contact1Rela" align="center" label="关系">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'liaisonData.' + scope.$index + '.contact1Rela'"
                  :rules="[
                    {
                      required: true,
                      message: '请选择关系',
                      trigger: ['change', 'blur'],
                    },
                  ]"
                >
                  <el-select
                    v-model="scope.row.contact1Rela"
                    placeholder="请选择"
                    size="mini"
                  >
                    <el-option
                      v-for="item in relationshipList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="contact1Name"
              align="center"
              label="联系人姓名"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="'liaisonData.' + scope.$index + '.contact1Name'"
                  :rules="[
                    {
                      required: true,
                      message: '请输入姓名',
                      trigger: ['change', 'blur'],
                    },
                  ]"
                >
                  <el-input
                    v-model="scope.row.contact1Name"
                    placeholder="请输入姓名"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="contact1"
              align="center"
              label="联系电话"
              class="lxdd"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="'liaisonData.' + scope.$index + '.contact1'"
                  :rules="[
                    {
                      required: true,
                      message: '请输入电话',
                      trigger: ['change', 'blur'],
                    },
                  ]"
                >
                  <el-input
                    v-model="scope.row.contact1"
                    placeholder="请输入电话"
                    size="mini"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" label="接通情况">
              <template slot-scope="scope">
                <span>{{ scope.row.connections }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" align="center" label="是否有效">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'liaisonData.' + scope.$index + '.status'"
                  :rules="[
                    {
                      required: true,
                      message: '请选择关系',
                      trigger: ['change', 'blur'],
                    },
                  ]"
                >
                  <el-select
                    v-model="scope.row.status"
                    placeholder="请选择"
                    size="mini"
                  >
                    <el-option label="有效" value="1"></el-option>
                    <el-option label="无效" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="useStatus" align="center" label="是否默认">
              <template slot-scope="scope">
                <el-form-item>
                  <el-select
                    v-model="scope.row.useStatus"
                    placeholder="请选择"
                    size="mini"
                  >
                    <el-option label="是" value="是"></el-option>
                    <el-option label="否" value="否"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-col>
    </el-row>
    <el-button
      type="primary"
      class="detail-basic-info_addLiaison"
      size="mini"
      @click="addLiaison"
      >新增联系人</el-button
    >
    <el-button
      type="primary"
      class="detail-basic-info_addLiaison"
      size="mini"
      @click="saveLiaison('myForm')"
      v-if="myModel.liaisonData.length > 0"
      >保存联系人</el-button
    >
  </div>
</template>

<script>
import {
  getBaseInfo,
  getRelationship,
  updateBaseInfo,
  deleteBeanById,
} from "@/api/routineFollowup";
export default {
  name: "PatientsBasicInformation",

  props: {
    //  常规病案号
    isType: {
      type: String,
      default() {
        return "no";
      },
    },
    getPatientDataVal: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      loading: false,
      dataForm: {},
      myModel: {
        liaisonData: [],
      },
      relationshipList: [],
      basicInfo: {},
      // basicInfo: this.$parent.$parent.$parent.basicInfo, // 获取父组件的患者信息
      id: this.$parent.$parent.$parent.id, // 获取父组件的患者信息
    };
  },

  created() {
    this.getRelationshipFn(); // 联系人关系列表
    this.getBaseInfoFn();
  },
  methods: {
    to360view() {
      window.open(
        // this.VIEW360 + "/#/360View/" + this.basicInfo.tpatno + "/visit"
        this.VIEW360 +
          "/vinci-web/api/forEdc/getPersonOverviewByIdCard?idCardNo=" +
          this.basicInfo.idNum
      );
    },
    //获取基本信息
    getBaseInfoFn() {
      getBaseInfo(this.getPatientDataVal).then((res) => {
        this.basicInfo = res.data;
        this.myModel.liaisonData = res.data.contcats || [];
      });
    },
    //新增联系人
    addLiaison() {
      this.myModel.liaisonData.push({
        contact1Rela: "self",
        contact1Name: "",
        contact1: "",
        status: "1",
        useStatus: "否",
        connections: "未知",
        patientId: Number(this.id),
      });
    },
    // 保存联系人
    saveLiaison(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.myModel.liaisonData, " this.myModel.liaisonData");
          let isUseStatus = this.myModel.liaisonData.filter((x) => {
            if (x.useStatus == "是") {
              return x;
            }
          });
          if (isUseStatus.length > 1) {
            this.$message.error("最多只有一个默认电话，请确定默认电话");
          } else {
            updateBaseInfo(this.myModel.liaisonData)
              .then((res) => {
                this.$message.success("保存成功");
                this.getBaseInfoFn();
              })
              .catch((error) => {
                console.error("updateBaseInfo", error);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //基本信息联系人删除
    handleDelete(index, row) {
      if (row.id) {
        let delData = {
          id: row.id,
        };
        deleteBeanById(delData)
          .then((res) => {
            this.$message.success("删除成功");
            this.getBaseInfoFn();
          })
          .catch((err) => {
            console.log("updateBaseInfo", error);
          });
      } else {
        this.myModel.liaisonData.splice(index, 1);
      }
    },
    //联系人关系列表
    getRelationshipFn() {
      getRelationship({
        typeCode: "relationship",
      }).then((res) => {
        this.relationshipList = res.data;
      });
    },
  },
};
</script>

<style lang="scss">
.patientsBasicInformationContent {
  margin: 10px 16px 0px;
  ul {
    width: 100%;
    height: auto;
    margin-bottom: 12px;
    li {
      height: 36px;
      line-height: 36px;
      overflow: hidden;

      span:first-child {
        margin: 10px 12px 10px 0px;
        font-size: 14px;
        color: #606266;
        font-weight: 700;
      }

      span:last-child {
        font-size: 14px;
        color: #2c3e50;
      }
    }
  }

  .detail-basic-info_addLiaison {
    margin: 16px 10px;
  }
}
.btn360 {
  position: absolute;
  top: 0px;
  right: 0px;
}
//
.liaison_form .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
</style>
