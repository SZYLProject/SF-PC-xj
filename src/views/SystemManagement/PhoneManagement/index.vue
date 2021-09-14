<template>
  <div class="content">
    <div class="page-search paddingtb24">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form ref="dataForm" :model="dataForm" label-width="80px">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item
                  label="测试内容"
                  prop="content"
                  :rules="RULE.remark_string"
                >
                  <el-input
                    size="mini"
                    v-model="dataForm.content"
                    placeholder="请输入测试内容"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="10">
                <el-form-item
                  prop="patientId"
                  :rules="RULE.remark_string"
                  label="微信号"
                >
                  <el-input
                    size="mini"
                    v-model="dataForm.patientId"
                    placeholder="请输入微信号"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="text-right">
                <el-button
                  size="mini"
                  class=" "
                  :disabled="isDefault(dataForm.patientId)"
                  @click="testPatientId"
                  type="primary"
                  >测试</el-button
                >
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="10">
                <el-form-item
                  prop="phone"
                  :rules="RULE.remark_string"
                  label="手机号"
                >
                  <el-input
                    size="mini"
                    v-model="dataForm.phone"
                    placeholder="请输入微信号"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="text-right">
                <el-button
                  size="mini"
                  class=" "
                  :disabled="isDefault(dataForm.phone)"
                  @click="testPhone"
                  type="primary"
                  >测试</el-button
                >
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12" class="text-center">
                <el-button
                  size="mini"
                  class="marginl24"
                  type="primary"
                  @click="serveData"
                  >保存</el-button
                >
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="12"></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  callsetGetOneById,
  callsetAdd,
  callsetUpdate,
  getTestWechat,
  getTestPhone,
  getOneByUserItCode,
  getTestAdd,
} from "@/api/phoneManagement";

export default {
  name: "PhoneManagement",
  data() {
    return {
      dataForm: {
        content: "",
        patientId: "",
        phone: "",
      },

      isDisabled: true,
    };
  },
  watch: {},
  created() {
    // this.callsetGetOneByIdFn();
    this.searchData()
  },
  mounted() {},
  methods: {
    // 是否是默认展示的字段
    isDefault: function (field) {
      return !field != false;
    },
    // 获取码值表
    callsetGetOneByIdFn() {
      callsetGetOneById()
        .then((res) => {
          console.log(res.data);
          this.dataForm = res.data || { password: "123456" };
          if (this.dataForm.uri == "") {
            this.isDisabled = true;
          } else {
            this.isDisabled = false;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    //确定
    determine1() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          callsetAdd(this.dataForm)
            .then((res) => {
              this.$message.success("新增成功");
              this.callsetGetOneByIdFn();
            })
            .catch((error) => {
              this.$message.error("新增失败");
            });
          this.dialogVisible = false;
        } else {
          this.$message.error("必填项不能为空");
        }
      });
    },
    determine2() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          callsetUpdate(this.dataForm)
            .then((res) => {
              this.$message.success("新增成功");
              this.callsetGetOneByIdFn();
            })
            .catch((error) => {
              this.$message.error("新增失败");
            });
          this.dialogVisible = false;
        } else {
          this.$message.error("必填项不能为空");
        }
      });
    },
    searchData(){
      getOneByUserItCode()
        .then((res) => {
          // this.$message.success(res.data.msg);
          console.log(res)
          if(res.data){
            this.dataForm =res.data
          }
        })
        .catch((error) => {
           this.$message.error('查询失败');
        });
    },
    testPatientId() {
      let getData = {
        patientId: this.dataForm.patientId,
        content: this.dataForm.content,
      };
      if (this.dataForm.content == "") {
        this.$message.error("测试内容不能为空");
        return;
      }
      getTestWechat(getData)
        .then((res) => {
          this.$message.success(res.data.msg);
        })
        .catch((error) => {
          this.$message.success(res.data.msg);
        });
    },
    testPhone() {
      let getData = {
        phone: this.dataForm.phone,
        content: this.dataForm.content,
      };
      if (this.dataForm.content == "") {
        this.$message.error("测试内容不能为空");
        return;
      }
      getTestPhone(getData)
        .then((res) => {
          this.$message.success(res.data.msg);
        })
        .catch((error) => {
          this.$message.success(res.data.msg);
        });
    },
    serveData() {
      console.log(this.dataForm);
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          getTestAdd(this.dataForm)
            .then((res) => {
              this.$message.success('保存成功');
            })
            .catch((error) => {
              this.$message.error('保存失败');
            });
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
  },
};
</script>

<style lang="scss">
.text-right {
  text-align: right;
}
</style>
