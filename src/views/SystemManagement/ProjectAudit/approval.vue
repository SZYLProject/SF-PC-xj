<template>
  <div class="content">
    <el-row class="nav-column paddingt0">
      <el-col :span="24" class="text-left column-titlte">
        <span>项目名称：</span>
        <span>{{ nameVal }}</span>
      </el-col>
      <el-col :span="24" class="interval15"></el-col>
    </el-row>
    <div class="page-table relative">
      <el-row class="approcal-btn">
        <el-col v-if="$route.query.status == '4'">
          <el-button @click="rejectClick" size="mini">
            <i class="iconfont iconguanbi"></i>
            审核驳回
          </el-button>
          <el-button type="primary" @click="adoptClick" size="mini">
            <i class="iconfont iconwancheng colorfff"></i>
            审核通过
          </el-button>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="`应随访患者 (${total})`" name="first">
          <el-table
            stripe
            :data="tableDataFirst"
            v-loading="loadingFirst"
            border
            style="width: 99%"
          >
            <el-table-column
              prop="tpatno"
              align="center"
              label="病案号"
            ></el-table-column>
            <el-table-column
              prop="patientName"
              align="center"
              label="姓名"
              width="80"
            ></el-table-column>
            <el-table-column prop="sex" align="center" label="性别" width="50">
              <template slot-scope="scope">
                <span v-if="scope.row.sex == 1">男</span>
                <span v-else-if="scope.row.sex == 2">女</span>
                <span v-else>未知</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="age"
              align="center"
              label="年龄"
              width="50"
            ></el-table-column>
            <el-table-column
              prop="mobile"
              align="center"
              label="手机号"
              width="110"
            ></el-table-column>
            <el-table-column
              prop="diseaseName"
              align="center"
              label="病种"
              min-width="140"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="firstConfirmDate"
              align="center"
              label="确诊日期"
              width="100"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.firstConfirmDate | dateFilters }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="mainDiagnosis"
              align="center"
              label="主要诊断"
              min-width="140"
              show-overflow-tooltip
            ></el-table-column>
            <!-- <el-table-column
            prop="description"
            align="center"
            label="病理诊断"
            ></el-table-column> -->

            <el-table-column align="center" width="120" label="最后接触时间">
              <template slot-scope="scope">
                <span>{{ scope.row.lastContactTime | dateFilters }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="lastContactType"
              align="center"
              width="120"
              label="最后接触类型"
            ></el-table-column>
            <el-table-column
              prop="lastContactResult"
              align="center"
              width="120"
              label="最后接触结果"
            ></el-table-column>
            <el-table-column
              align="center"
              label="最近随访时间"
              width="120"
              prop="lastFollowTime"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.lastFollowTime | dateFilters }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="lastFollowResult"
              align="center"
              width="120"
              label="最近随访结局"
            ></el-table-column>

            <el-table-column
              prop="hospitalName"
              align="center"
              label="来源医院"
              min-width="180"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="操作" fixed="right" align="center" v-if="false">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="360视图"
                  placement="top"
                >
                  <i
                    @click="toFollow360(scope.row)"
                    class="iconfont icon360shitu iconfontColor list-operating"
                  ></i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <div class="pages-modules">
            <el-pagination
              style="float: right"
              @size-change="handleSizeChangeFirst"
              @current-change="handleCurrentChangeFirst"
              :current-page="currentPageFirst"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSizeFirst"
              :pager-count="7"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              background
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="随访表单" name="third">
          <div class="form-content">
            <div class="form-list">
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
                    <!-- <i class="el-icon-location"></i> -->
                    <span>{{ item.nodeName }}</span>
                  </template>
                  <el-menu-item
                    :title="subItem.name"
                    class="form-list-ellipsis"
                    v-for="(subItem, itemIndex) in item.titleList"
                    :key="subItem.code"
                    :index="subItem.code+ '-'+ index+'-'+itemIndex"
                    >{{ subItem.name }}</el-menu-item
                  >
                </el-submenu>
              </el-menu>
            </div>
            <PreviewForm :code="questionnaireTitleCode" />
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- 驳回 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <el-row class="inline-row">
          <el-form :model="dataForm" ref="dataForm">
            <el-form-item label="驳回原因" v-if="dialogTitle == '驳回'">
              <el-input
                type="textarea"
                v-model="dataForm.reject_reason"
                placeholder="请输入驳回原因"
              ></el-input>
            </el-form-item>
            <el-form-item v-else>
              <!-- <h3>已通过审核</h3> -->
              <h3>是否通过审核</h3>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-col class="dialog-footer">
            <el-button class="cancel-btn" @click="dialogVisible = false"
              >取 消</el-button
            >
            <el-button
              class="determine-btn marginl24"
              type="primary"
              @click="determine"
              >确 定</el-button
            >
          </el-col>
        </el-row>
      </el-dialog>
      <!-- 表单缩略图预览 -->
      <el-dialog :visible.sync="dialogImageVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import PreviewForm from "@/components/previewForm.vue";
import {
  projectFindPatientByProjectId,
  projectFindOtherPatientByProjectId,
  projectApprovePass,
  postProjectAudit,
  getFormList,
  getFormDetails,
  saveFormDetails,
  deletePic,
  uploadImage,
} from "@/api/projectAudit";
import { isArray } from "@/utils/index";
import { regionDataPlus } from "element-china-area-data";
import { getProjectFindPatient } from "@/api/specialFollowUp";
export default {
  name: "Approval",
  components: { PreviewForm },
  data() {
    return {
      dataForm: {},
      activeName: "first",
      loadingFirst: false,
      loadingSecond: false,
      tableDataFirst: [
        {
          specialddList: [],
        },
      ],
      tableDataSecond: [],
      formList: [],
      activeClass: 0,
      // 分页数据
      currentPageFirst: 1,
      pageSizeFirst: 10,
      total: 1,
      totalSecond: 1,
      idVal: "",
      nameVal: "",
      dialogTitle: "驳回",
      dialogVisible: false, // 是否显示弹窗
      //表单录入
      form: {
        getData: [],
      },
      questionnaireTitleCode: "",
      //图片上传预览
      dialogImageUrl: "",
      dialogImageVisible: false,
      disabledImage: false,
      ADoptions: regionDataPlus,
      picList: [],
      //存储所有watcher,增删组时需全部清除
      formWatchers: [],
    };
  },
  watch: {},
  created() {
    this.idVal = this.$route.query.id;
    this.nameVal = this.$route.query.name;
    this.getFormListFn(this.idVal);
    this.seacherClick();
    // this.getDataFn();
  },
  destroyed() {},
  methods: {
    // 360视图
    toFollow360(row) {
      window.open(
        this.VIEW360 + "/vinci-web/api/forEdc/getPersonOverviewByIdCard?idCardNo=" + row.idNum
      );
    },
    //获取表单列表
    getFormListFn(id) {
      getFormList({ projectId: id }).then((res) => {
        //  不展示默认表单
        res.data.forEach((element) => {
          element.formId = element.formId.substr(
            element.formId.indexOf(",") + 1
          );
          element.titleList.splice(0, 1);
        });
        this.questionnaireTitleCode = res.data[0].titleList[0].code +'-0-0';
        this.formList = res.data;
        // this.getDataFn()
      });
    },
    //点击表单
    formSelect(indexVal) {
      console.log(indexVal);
      this.questionnaireTitleCode = indexVal;
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
        this.form.getData.forEach((collapse) => {
          collapse.ddList.forEach((item, i) => {
            item.caseId = i + 1;
            Object.keys(item.copyData).forEach((key) => {
              let el = item.copyData[key];
              if (el.controlType === "CB" || el.controlType === "ADSEL") {
                isArray(el.value) && (el.value = el.value.join(","));
              }
              if (el.controlType === "SUF") {
                el.value = this.picList.reduce((t, e) => {
                  return (t += JSON.stringify(e) + "&&&");
                }, "");
              }
            });
          });
        });
        console.log("哈哈哈哈", validateResult);
        console.log(this.form.getData);
        const postData = {
          questionnaireTitleCode: this.form.getData[0].questionnaireTitleCode.split("-")[0],
          groupList: this.form.getData,
        };
        console.log("postDatapostDatapostData", postData);
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
        // questionnaireTitleCode: 'h3x87atx3v41nlm0'
        // questionnaireTitleCode: 'f404q23q7p9bppbu'
        // questionnaireTitleCode: "dg72e0612vonl6dv"
        questionnaireTitleCode: this.questionnaireTitleCode.split("-")[0],
      };
      getFormDetails(postData).then((res) => {
        console.log("getFormDetails", res);
        let getData = res.data;
        getData.forEach((item) => {
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
        // console.log(getData);
        this.$set(this.form, "getData", getData);
        this.formWatchers.forEach((_) => _());
        this.addComOrResRules();
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
        console.log(555, res);
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
    //单选反选清空
    cancelChecked(item, value) {
      item.value = value == item.value ? "" : value;
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
      this.form.getData.forEach((_, index) => {
        _.ddList.forEach((__, gIndex) => {
          Object.keys(__.copyData).forEach((___) => {
            //计算
            __.copyData[___].calculations &&
              __.copyData[___].calculations.indexOf("=") > -1 &&
              this.formWatchers.push(
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
                        if (!el) return true;
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
                    // console.log('------calculations------',res)
                    __.copyData[n.calculations.split("=")[1]].value =
                      eval(res).toString().indexOf("Infinity") > -1
                        ? "error"
                        : eval(res);
                  },
                  { deep: true, immediate: true }
                )
              );
            //约束
            __.copyData[___].binds &&
              __.copyData[___].binds.replace(/[0-9A-Za-z]{16}/gim, (key) => {
                this.formWatchers.push(
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
                          let el = __.copyData[item];
                          if (!el) return true;
                          if (
                            el.controlType === "DTP" ||
                            el.controlType === "DP"
                          ) {
                            return +new Date(el.value);
                          } else
                            return !!el.value
                              ? isArray(el.value)
                                ? el.value
                                : '"' + el.value + '"'
                              : null;
                        }
                      );
                      // console.log('-----binds-------',res)
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
    // 驳回
    rejectClick() {
      this.dialogVisible = true;
      this.dialogTitle = "驳回";
    },
    // 模态框确定
    determine() {
      // 驳回
      if (this.dialogTitle === "驳回") {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            let data = {
              // flag: "reject",
              flag: "5",
              projectId: this.idVal,
              rejectReason: this.dataForm.reject_reason,
            };
            postProjectAudit(data)
              .then((res) => {
                this.$message.success("已驳回");
                this.dialogVisible = false;
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            this.$message.error("必填项不能为空");
          }
        });
      } else if (this.dialogTitle === "通过") {
        let data = {
          flag: "0",
          projectId: this.idVal,
        };
        postProjectAudit(data)
          .then((res) => {
            this.dialogVisible = false;
            this.$router.push({
              path: "/manage/project",
            });
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    // 通过
    adoptClick() {
      this.dialogVisible = true;
      this.dialogTitle = "通过";
    },
    // 查询审核中病人列表
    seacherClick() {
      let params = {
        pageNum: this.currentPageFirst,
        pageSize: this.pageSizeFirst,
        projectId: this.$route.query.id,
      };
      this.loadingFirst = true;
      getProjectFindPatient(params)
        .then((res) => {
          this.loadingFirst = false;
          this.tableDataFirst = res.data.list;
          this.total = res.data.total;
          console.log(res);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getItem(key) {
      this.activeClass = key;
    },
    //缩略图预览、下载、删除
    handlePictureCardPreview(file) {
      //协调将后台thumUrl存为实际图，url为缩略图。
      this.dialogImageUrl = file.thumUrl || file.response.data.thumUrl;
      this.dialogImageVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    handleRemove(file) {
      deletePic({ path: file.thumUrl }).then((res) => {
        console.log(600, res);
        this.picList = this.picList.filter((_) => _.name !== file.name);
      });
    },
    // 删除
    deleteFun(val) {
      console.log(val);
      this.$confirm("确认删除吗？, 此操作无法撤销。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // tab标签切换
    handleClick(tab, event) {
      if (tab.name == "first") {
        this.seacherClick();
      } else {
      }
    },
    handleSizeChangeFirst(val) {
      this.pageSizeFirst = val;
      this.seacherClick();
    },
    handleCurrentChangeFirst(val) {
      this.currentPageFirst = val;
      this.seacherClick();
    },
  },
};
</script>

<style lang="scss" scoped>
.approcal-btn {
  position: absolute;
  top: -10px;
  right: 24px;
  z-index: 999;
}
.zancun {
  padding: 0 20px;
}
.column-titlte {
  padding-top: 20px;
  padding-left: 20px;
  padding-bottom: 20px;
}
.form-content {
  display: flex;
  padding: 5px 0px 20px;
  .form-list {
    width: 200px;
    background: #eef4fa;
    .form-list-ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    ul {
      padding: 20px;
      li {
        font-size: 14px;
        margin: 10px 20px;
        cursor: pointer;
      }
      li.active {
        color: #2476c2;
      }
    }
  }
  .form-main {
    flex: 1;
    padding: 0 20px;
  }
}
</style>
<style lang="scss">
.form-content .form-list ul {
  padding: 0 !important;
  li {
    margin: 0 !important;
    .el-submenu__title {
      padding-left: 10px !important;
    }
    .el-menu-item {
      padding-left: 20px !important;
    }
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
</style>
