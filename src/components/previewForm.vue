// :prop="'copyData.' + item +'.value'" ===== asasasasas
// groupItem.copyData ===== form.list

<template>
    <div class="form-main" v-loading="loadingForm">
        <el-collapse v-for="(collapse,index) in form.getData" :key="index" v-model="collapse.groupCode + index">
            <el-collapse-item v-for="(groupItem,gKey) in collapse.ddList" :key="gKey" :name="collapse.groupCode + index">
                <template slot="title">
                    {{collapse.groupName}}
                    <i v-show="collapse.isCopy" class="el-icon-document-copy op" title="复制" @click.stop="groupChange(index,gKey,groupItem)"></i>
                    <i v-show="collapse.ddList.length>1" class="el-icon-delete op" title="删除" @click.stop="groupChange(index,gKey)"></i>
                </template>
                <el-form ref="getData" :model="groupItem" size="mini">
                    <div v-for="item in groupItem.ddOrder" :key="item">
                        <!-- 单文本 -->
                        <el-form-item v-if="form.list[item].controlType==='TB'" class="label100" :label="form.list[item].ddName" v-show="form.list[item].visible" asasasasas :rules="form.list[item].isNeed ? [{required: true, message: '请填写'+form.list[item].ddName}] : null">
                            <el-input type="input" :disabled="!!form.list[item].readOnly" v-model="form.list[item].value">
                                <template slot="append" v-if="form.list[item].unitOfMeasure">
                                    {{form.list[item].unitOfMeasure}}
                                </template>
                            </el-input>
                        </el-form-item>
                        <!-- 单选 -->
                        <el-form-item v-if="form.list[item].controlType==='RB'" class="label100" :label="form.list[item].ddName" v-show="form.list[item].visible" asasasasas :rules="form.list[item].isNeed ? [{required: true, message: '请选择'+form.list[item].ddName}] : null">
                            <template>
                                <el-radio-group :disabled="!!form.list[item].readOnly" v-model="form.list[item].value">
                                    <el-radio v-for="(listItem,itemIndex) in form.list[item].optionList" :key="itemIndex" :label="listItem.value">
                                        {{listItem.displayName}}
                                    </el-radio>
                                </el-radio-group>
                            </template>
                        </el-form-item>
                        <!-- 多选 -->
                        <el-form-item v-if="form.list[item].controlType==='CB'" class="label100" :label="form.list[item].ddName" v-show="form.list[item].visible" asasasasas :rules="form.list[item].isNeed ? [{required: true, message: '请选择'+form.list[item].ddName}] : null">
                            <template>
                                <el-checkbox-group :disabled="!!form.list[item].readOnly" v-model="form.list[item].value">
                                    <el-checkbox v-for="(listItem,itemIndex) in form.list[item].optionList" :key="itemIndex" :label="listItem.value">
                                        {{listItem.displayName}}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </template>
                        </el-form-item>
                        <!-- 下拉单选 -->
                        <el-form-item v-if="form.list[item].controlType==='SEL_SIG'" class="label100" :label="form.list[item].ddName" v-show="form.list[item].visible" asasasasas :rules="form.list[item].isNeed ? [{required: true, message: '请选择'+form.list[item].ddName}] : null">
                            <template>
                                <el-select :disabled="!!form.list[item].readOnly" v-model="form.list[item].value" filterable collapse-tags placeholder="请选择">
                                    <el-option v-for="listItem in form.list[item].optionList" :key="listItem.displayName" :label="listItem.displayName" :value="listItem.value"></el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                        <!-- 日期选择 -->
                        <el-form-item v-if="form.list[item].controlType==='DP'" class="label100" :label="form.list[item].ddName" v-show="form.list[item].visible" asasasasas :rules="form.list[item].isNeed ? [{required: true, message: '请选择'+form.list[item].ddName}] : null">
                            <template>
                                <el-date-picker :disabled="!!form.list[item].readOnly" value-format="yyyy/MM/dd" v-model="form.list[item].value" type="date" placeholder="选择日期"></el-date-picker>
                            </template>
                        </el-form-item>
                        <!-- 时间选择 -->
                        <el-form-item v-if="form.list[item].controlType==='TP'" class="label100" :label="form.list[item].ddName" v-show="form.list[item].visible" asasasasas :rules="form.list[item].isNeed ? [{required: true, message: '请选择'+form.list[item].ddName}] : null">
                            <template>
                                <el-time-select :disabled="!!form.list[item].readOnly" v-model="form.list[item].value" placeholder="选择时间" :picker-options="{start:'00:00',step:'00:15',end:'23:59'}"></el-time-select>
                            </template>
                        </el-form-item>
                        <!-- 时间日期选择 -->
                        <el-form-item v-if="form.list[item].controlType==='DTP'" class="label100" :label="form.list[item].ddName" v-show="form.list[item].visible" asasasasas :rules="form.list[item].isNeed ? [{required: true, message: '请选择'+form.list[item].ddName}] : null">
                            <template>
                                <el-date-picker :disabled="!!form.list[item].readOnly" value-format="yyyy-MM-dd HH:mm:ss" v-model="form.list[item].value" type="datetime" placeholder="选择日期时间"></el-date-picker>
                            </template>
                        </el-form-item>
                        <!-- 数字 -->
                        <el-form-item v-if="form.list[item].controlType==='NTX'" class="label100" :label="form.list[item].ddName" v-show="form.list[item].visible" asasasasas :rules="form.list[item].isNeed ? [{required: true, message: '请填写'+form.list[item].ddName}] : null">
                            <template>
                                <el-input type="number" :disabled="!!form.list[item].readOnly" v-model="form.list[item].value">
                                    <template slot="append" v-if="form.list[item].unitOfMeasure">
                                        {{form.list[item].unitOfMeasure}}
                                    </template>
                                </el-input>
                            </template>
                        </el-form-item>
                        <!-- 总分 -->
                        <el-form-item v-if="form.list[item].controlType==='TOTAL'" class="label100" :label="form.list[item].ddName" v-show="form.list[item].visible">
                            <template>
                                <el-input type="number" disabled v-model="form.list[item].value"></el-input>
                            </template>
                        </el-form-item>
                        <!-- 多行文本 -->
                        <el-form-item v-if="form.list[item].controlType==='TA'" class="label100" :label="form.list[item].ddName" v-show="form.list[item].visible" asasasasas :rules="form.list[item].isNeed ? [{required: true, message: '请填写'+form.list[item].ddName}] : null">
                            <template>
                                <el-input type="textarea" :disabled="!!form.list[item].readOnly" v-model="form.list[item].value" rows="1"></el-input>
                            </template>
                        </el-form-item>
                        <!-- LABEL -->
                        <el-form-item v-if="form.list[item].controlType==='LABEL'" class="label100" :label="form.list[item].ddName" v-show="form.list[item].visible">
                            <template>
                                <el-input type="textarea" v-model="form.list[item].value" :style="{'visibility':'hidden'}"></el-input>
                            </template>
                        </el-form-item>
                        <!-- 文件上传 -->
                        <el-form-item v-if="form.list[item].controlType==='SUF'" class="label100" :label="form.list[item].ddName" v-show="form.list[item].visible" asasasasas :rules="form.list[item].isNeed ? [{required: true, message: '请选择'+form.list[item].ddName}] : null">
                            <el-upload action="#" ref="uploadPic" list-type="picture-card" name="files" :auto-upload="false" multiple :before-upload="beforeUpload" :file-list="picList">
                                <i slot="default" class="el-icon-plus"></i>
                                <div slot="file" slot-scope="{file}">
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" >
                                    <span class="el-upload-list__item-actions">
                                        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                            <i class="el-icon-zoom-in"></i>
                                        </span>
                                        <!-- <span v-if="!disabledImage" class="el-upload-list__item-delete" @click="handleDownload(file)">
                                        <i class="el-icon-download"></i>
                                        </span> -->
                                        <span v-if="!disabledImage" class="el-upload-list__item-delete" @click="handleRemove(file)">
                                            <i class="el-icon-delete"></i>
                                        </span>
                                    </span>
                                </div>
                            </el-upload>
                        </el-form-item>
                        <!-- 地址选择 -->
                        <el-form-item v-if="form.list[item].controlType==='ADSEL'" class="label100" :label="form.list[item].ddName" v-show="form.list[item].visible" asasasasas :rules="form.list[item].isNeed ? [{required: true, message: '请选择'+form.list[item].ddName}] : null">
                            <el-cascader :disabled="!!form.list[item].readOnly" size="mini" style="width:100%" :options="ADoptions" v-model="form.list[item].value"></el-cascader>
                        </el-form-item>
                        <!-- 文本标题 -->
                        <el-form-item v-if="form.list[item].controlType==='LB'" class="label100" :label="form.list[item].ddName" v-show="form.list[item].visible"></el-form-item>
                    </div>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <!-- 表单缩略图预览 -->
        <el-dialog :visible.sync="dialogImageVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
import { regionDataPlus } from 'element-china-area-data';
import { isArray } from "@/utils/index";
import { deletePic, uploadImage } from "@/api/projectAudit";
import { previewFormDetails } from "@/api/formManagementDesign.js";
export default {
    name: 'previewForm',
    props: ['code'],
    data() {
        return {
            form: {
                getData: [],
                list: {}
            },
            picList: [],
            dialogImageUrl: '',
            dialogImageVisible: false,
            disabledImage: false,
            ADoptions: regionDataPlus,
            //存储所有watcher,增删组时需全部清除
            formWatchers: [],
            loadingForm:false
        }
    },
    created(){
        (!!this.code || !!this.$route.query.code) && this.previewForm();
    },
    watch:{
        code: {
            handler (data) {
                this.previewForm();
            }
        }
    },
    methods: {
        previewForm(){
            const postData = {
                questionnaireTitleCode: this.$route.query.code || this.code.split("-")[0]
            };
            this.loadingForm=true
            previewFormDetails(postData).then((res) => {
                 this.loadingForm=false
                // res.data.forEach(item => {
                //     item.ddList.forEach((gItem,gIndex) => {
                //         Object.keys(gItem.copyData).forEach(gKey => {
                //             let el = gItem.copyData[gKey];
                //             if(el.controlType === 'CB' || el.controlType === 'ADSEL'){
                //                 el.value = !!el.value ? el.value.split(',') : [];
                //             }
                //             if (el.controlType === 'SLD') {
                //                 el.value = Number(el.value);
                //             }
                //             if (el.controlType === 'SUF') {
                //                 el.value.split('&&&').forEach((pic,ind) => {
                //                     if(!!pic)
                //                     this.$set(this.picList,ind,JSON.parse(pic))
                //                 });
                //             }
                //         })
                //     })
                // })
                // this.$set(this.form,'getData',res.data)
                res.data.list = res.data.list.reduce((t,e,i) => {
                    t[e.ddCode] = e;
                    return t;
                },{})
                res.data.groups.forEach(gItem => {
                    gItem.ddList.forEach((gItem,gIndex) => {
                        gItem.ddOrder.forEach(gKey => {
                            let el = res.data.list[gKey];
                            if(el.controlType === 'CB' || el.controlType === 'ADSEL'){
                                el.value = !!el.value ? el.value.split(',') : [];
                            }
                            if (el.controlType === 'SLD') {
                                el.value = Number(el.value);
                            }
                            if (el.controlType === 'SUF') {
                                el.value.split('&&&').forEach((pic,ind) => {
                                    if(!!pic)
                                    this.$set(this.picList,ind,JSON.parse(pic))
                                });
                            }
                        })
                    })
                })
                this.$set(this.form,'getData',res.data.groups);
                this.$set(this.form,'list',res.data.list);
                this.formWatchers.forEach(_ => _());
                this.addComOrResRules();
                //隐藏折叠标题为未分组的头
                this.$nextTick(() => {
                    let panel = document.querySelectorAll(".el-collapse-item .el-collapse-item__header");
                    // console.log(panel)
                    Array.from(panel).forEach(e => {
                        if(e.innerText === '未分组'){
                            e.style.display = "none";
                            e.parentNode.style.borderTop = "1px solid #ccc";
                            e.parentNode.style.margin = "20px 0";
                        };
                    })
                })
            })
        },
        //增删组
		groupChange(index,gIndex,copyData){
			//清空所有watcher
			this.formWatchers.forEach(_ => _());
			!!copyData ?
			this.form.getData[index].ddList.push(JSON.parse(JSON.stringify(copyData))) :
			this.form.getData[index].ddList.splice(gIndex,1);
			this.addComOrResRules();
        },
        //添加计算与约束规则
		addComOrResRules(){
            let _this = this;
            Object.keys(_this.form.list).forEach(key => {
                let el = _this.form.list[key];
                el.calculations &&
                el.calculations.indexOf('=') > -1 &&
                _this.formWatchers.push(_this.$watch('form.list.' + key, (n, o) => {
                    let res = n.calculations.split('=')[0].replace(/[0-9A-Za-z]{16}/img, item => {
                        let bindEl = _this.form.list[item];
                        if(bindEl.controlType === 'CB'){
                            return isArray(bindEl.value) ? bindEl.value.reduce((total, item) => { return total += Number(item)},0) : bindEl.value
                        }else{
                            if(bindEl.controlType === 'RB'){
                                isNaN(bindEl.value) && (bindEl.value = bindEl.optionList.filter(op => op.displayName === bindEl.value)[0].value);
                            }
                            return Number(bindEl.value)
                        }
                    });
                    _this.form.list[n.calculations.split('=')[1]].value = eval(res).toString().indexOf('Infinity') > -1 ? 'error' : eval(res);
                },{deep: true,immediate: true}));
                el.binds && 
                el.binds.replace(/[0-9A-Za-z]{16}/img, itemKey => {
                    _this.formWatchers.push(_this.$watch('form.list.'+ itemKey, (n, o) => {
                        let res = el.binds.replace(/[0-9A-Za-z]{16}/img, item => {
                            let bindEl = _this.form.list[item];
                            if(bindEl.controlType === 'DTP' || bindEl.controlType === 'DP'){
                                return +new Date(bindEl.value)
                            }else
                                return !!bindEl.value ? (isArray(bindEl.value) ? bindEl.value.join(',').replace(/[^,]+/g,str => {return isNaN(str) ? '"'+str+'"' : str}) : '"'+bindEl.value+'"') : null
                        });
                        el.visible = eval(res) ? 0 : 1;
                        // console.log(res);
                        // console.log(eval(res));
                        // console.log(el.visible)
                    },{deep: true,immediate: true}));
                })
            })
            // _this.form.getData.forEach((_, index) => {
            //     _.ddList.forEach((__, gIndex) => {
            //         Object.keys(__.copyData).forEach(___ => {
            //             __.copyData[___].calculations &&
            //             __.copyData[___].calculations.indexOf('=') > -1 &&
            //             _this.formWatchers.push(_this.$watch('form.getData.' + index + '.ddList.' + gIndex + '.copyData.' + ___, (n, o) => {
            //                 let res = n.calculations.split('=')[0].replace(/[0-9A-Za-z]{16}/img, key => {
            //                 let el = __.copyData[key];
            //                 if(el.controlType === 'CB'){
            //                     return isArray(el.value) ? el.value.reduce((total, item) => { return total += Number(item)},0) : el.value
            //                 }else{
            //                     if(el.controlType === 'RB'){
            //                         isNaN(el.value) && (el.value = el.optionList.filter(op => op.displayName === el.value)[0].value);
            //                     }
            //                     return Number(el.value)
            //                 }
            //             });
            //             __.copyData[n.calculations.split('=')[1]].value = eval(res).toString().indexOf('Infinity') > -1 ? 'error' : eval(res);
            //         },{deep: true,immediate: true}));
            //         __.copyData[___].binds && 
            //         __.copyData[___].binds.replace(/[0-9A-Za-z]{16}/img, key => {
            //             _this.formWatchers.push(_this.$watch('form.getData.'+ index + '.ddList.' + gIndex + '.copyData.' + key, (n, o) => {
            //                 let res = __.copyData[___].binds.replace(/[0-9A-Za-z]{16}/img, item => {
            //                     if(__.copyData[item].controlType === 'DTP' || __.copyData[item].controlType === 'DP'){
            //                         return +new Date(__.copyData[item].value)
            //                     }else
            //                         return !!__.copyData[item].value ? (isArray(__.copyData[item].value) ? __.copyData[item].value : '"'+__.copyData[item].value+'"') : null
            //                 });
            //                 __.copyData[___].visible = eval(res) ? 0 : 1;
            //             },{deep: true,immediate: true}));
            //             })
            //         })
            //     })
            // })
        },
        //上传前可做处理-限制格式、大小等
        beforeUpload(file) {
            let check_message = this.file_info_check(file);
            if(check_message){
                this.$message(check_message);
                this.imageUrl = "";
                return false;
            }
            // this.upload(file);
        },
        //定义上传
        upload(file){
            this.formPicsData = new FormData();
            this.formPicsData.append('files', file);
            const postData = {
                files: this.formPicsData
            };
            uploadImage(this.formPicsData).then(res => {
                console.log(555,res);
                this.picList.push(res.data[0]);
            });
        },
        // 前端校验文件上传是否符合条件
        file_info_check(file){
            var ret = "";
            if(file === void(0)){
                ret = "";
            }
            var max_file_size = 1024 * 1024 * 10;
            if(file.size > max_file_size){
                ret = "图片不能大于10Mb";
            }
            var allow_type = "image/jpeg|image/png";
            if(allow_type.indexOf(file.type) == -1){
                ret = "图片格式要求是jpg或png";
            }
            return ret;
        },
        //缩略图预览、下载、删除
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogImageVisible = true;
        },
        handleRemove(file) {
            this.picList = this.picList.filter(_ => _.name !== file.name);
        },
    }
}
</script>

<style lang="scss">
.form-main .el-collapse{
    border-top: none;
    .el-collapse-item__wrap{
        border-bottom: none;
    }
    &:first-of-type .el-collapse-item > div:first-of-type{
        border-top: none !important;
    }
    .el-collapse-item__header{
        background: #eef4fa;
        color: #2476c2;
        height: 36px;
        line-height: 36px;
        padding-left: 20px;
        position: relative;
        i.op{
            position: absolute;
            right: 30px;
            cursor: pointer;
            &:nth-of-type(1){
                right: 50px;
            }
        }
    }
}
</style>