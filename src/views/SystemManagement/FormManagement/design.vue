<template>
    <div class="content" style="height:calc(100% - 32px);">
        <div class="relative">
            <el-button type="primary" @click="previewForm" size="mini" class="yulan" >预览</el-button>
        </div>
        <div class="form_content">
            <div class="content_left">
                <FormItem :formData="formData"/>
            </div>
            <div class="content_right">
                <el-row style="height:100%" :gutter="30">
                    <el-col :span="12" style="height:100%;background:#fff;position:relative;" ref="colWidth">
                        <el-form label-position="top" v-model="formList" size="mini" class="formScroll">
                            <draggable class="dragArea list-group" :list="formList" group="people" @change="log">
                                <div title="拖拽控件以排序" class="list-group-item" v-for="(item,index) in formList" :key="item.pkId" @click="showFormItem(item,index)" :class="{'item_focu':index==current}">
                                    <!-- 单文本 -->
                                    <el-form-item v-if="item.controlType==='TB'" :label="item.ddName">
                                        <el-input type="input" v-model="item.defaultValue">
                                            <template slot="append" v-if="item.unitOfMeasure">
                                                {{item.unitOfMeasure}}
                                            </template>
                                        </el-input>
                                    </el-form-item>
                                    <!-- 单选 -->
                                    <el-form-item v-if="item.controlType==='RB'" :label="item.ddName">
                                        <template>
                                            <el-radio-group v-model="item.defaultValue">
                                                <el-radio v-for="(listItem,index) in item.itemOptionList" :key="index" :label="listItem.value" @click.native.prevent="cancelChecked(item,listItem.value)">
                                                    {{listItem.displayName}}
                                                </el-radio>
                                            </el-radio-group>
                                        </template>
                                    </el-form-item>
                                    <!-- 多选 -->
                                    <el-form-item v-if="item.controlType==='CB'" :label="item.ddName">
                                        <template>
                                            <el-checkbox-group v-model="item.defaultValue" @change="itemOptionChange">
                                                <el-checkbox v-for="(listItem,index) in item.itemOptionList" :key="index" :label="listItem.value">
                                                    {{listItem.displayName}}
                                                </el-checkbox>
                                            </el-checkbox-group>
                                        </template>
                                    </el-form-item>
                                    <!-- 下拉 -->
                                    <el-form-item v-if="item.controlType==='SEL_SIG'" :label="item.ddName">
                                        <template>
                                            <el-select v-model="item.defaultValue" filterable collapse-tags placeholder="请选择">
                                                <el-option v-for="listItem in item.itemOptionList" :key="listItem.displayName" :label="listItem.displayName" :value="listItem.value"></el-option>
                                            </el-select>
                                        </template>
                                    </el-form-item>
                                    <!-- 日期选择 -->
                                    <el-form-item v-if="item.controlType==='DP'" :label="item.ddName">
                                        <template>
                                            <el-date-picker value-format="yyyy-MM-dd" v-model="item.defaultValue" type="date" placeholder="选择日期"></el-date-picker>
                                        </template>
                                    </el-form-item>
                                    <!-- 时间选择 -->
                                    <el-form-item v-if="item.controlType==='TP'" :label="item.ddName">
                                        <template>
                                            <el-time-select v-model="item.defaultValue" placeholder="选择时间" :picker-options="{start:'00:00',step:'00:15',end:'23:59'}"></el-time-select>
                                        </template>
                                    </el-form-item>
                                    <!-- 时间日期选择 -->
                                    <el-form-item v-if="item.controlType==='DTP'" :label="item.ddName">
                                        <template>
                                            <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="item.defaultValue" type="datetime" placeholder="选择日期时间"></el-date-picker>
                                        </template>
                                    </el-form-item>
                                    <!-- 数字 -->
                                    <el-form-item v-if="item.controlType==='NTX'" :label="item.ddName">
                                        <template>
                                            <el-input type="number" v-model="item.defaultValue">
                                                <template slot="append" v-if="item.unitOfMeasure">
                                                    {{item.unitOfMeasure}}
                                                </template>
                                            </el-input>
                                        </template>
                                    </el-form-item>
                                    <!-- 总分 -->
                                    <el-form-item v-if="item.controlType==='TOTAL'" class="label100" :label="item.ddName" v-show="item.visible">
                                        <template>
                                            <el-input type="number" disabled v-model="item.defaultValue"></el-input>
                                        </template>
                                    </el-form-item>
                                    <!-- 多行文本 -->
                                    <el-form-item v-if="item.controlType==='TA'" :label="item.ddName">
                                        <template>
                                            <el-input type="textarea" v-model="item.defaultValue" rows="1"></el-input>
                                        </template>
                                    </el-form-item>
                                    <!-- LABEL -->
                                    <el-form-item v-if="item.controlType==='LABEL'" :label="item.ddName">
                                        <template>
                                            <el-input type="textarea" v-model="item.defaultValue" :style="{'visibility':'hidden'}"></el-input>
                                        </template>
                                    </el-form-item>
                                    <!-- 文件上传 -->
                                    <el-form-item v-if="item.controlType==='SUF'" :label="item.ddName">
                                        <el-upload action="" :show-file-list="false" multiple :limit="3" :auto-upload="false">
                                            <el-button slot="trigger" size="mini" type="primary">文件选取</el-button>
                                        </el-upload>
                                    </el-form-item>
                                    <!-- 地址选择 -->
                                    <el-form-item v-if="item.controlType==='ADSEL'" :label="item.ddName">
                                        <el-cascader size="mini" style="width:100%" :options="ADoptions" v-model="item.defaultValue" @change="itemOptionChange"></el-cascader>
                                    </el-form-item>
                                    <!-- 文本标题 -->
                                    <el-form-item v-if="item.controlType==='LB'" :label="item.ddName"></el-form-item>
                                    <span class="top_right_two">
                                        <el-tag type="success" v-if="item.ddCode">已保存</el-tag>
                                        <el-tag type="info" v-else>未保存</el-tag>
                                    </span>
                                    <el-popconfirm title="确定删除该项吗？" @confirm="deleteFormItemFn(item,index)">
                                        <i slot="reference" class="el-icon-delete top_right"></i>
                                    </el-popconfirm>
                                </div>
                                <div v-if="formList.length == 0" class="noDate list-group-item"> 从左侧拖拽来添加表单项</div>
                            </draggable>
                        </el-form>
                        <div style="position:absolute;right:15px;bottom:-6px;">
                            <!-- <el-button type="primary" @click="previewForm" size="mini" style="margin:10px;">预览</el-button> -->
                            <!-- <el-button type="primary" @click="sortForm" size="mini" style="margin:10px 0;">提交</el-button> -->
                        </div>
                    </el-col>
                    <el-col :span="12" class="" style="height:100%;padding:0;position:relative;" v-show="currentItem.controlType&&isShowDetail">
                        <div class="config_body">
                            <el-form :model="currentItem" size="mini" class="formScroll" label-width="70px" :rules="rules" ref="currentItem">
                                <el-tabs type="border-card" v-model="activeTab" :stretch="Boolean(true)">
                                    <el-tab-pane label="变量" name="variable">
                                        <el-form-item label="问题" prop="ddName">
                                            <el-input v-model="currentItem.ddName" minlength="1"></el-input>
                                        </el-form-item>
                                        <!--
                                            标签所对应的英文名
                                            问题: 你的身高是多少  变量名: height
                                        -->
                                        <!-- <el-form-item label="变量名" prop="ddDisplayNameEn">
                                            <el-input v-model="currentItem.ddDisplayNameEn"></el-input>
                                        </el-form-item> -->
                                        <el-form-item label="组别">
                                            <el-select v-model="groupValue" placeholder="请选择" style="width:100%;">
                                                <el-option v-for="(item,index) in groupList" :key="index" :label="item.groupName+(item.isCopy===1 ? '(可重复)' : '')" :value="item.groupCode">
                                                    <span style="float: left">{{ item.groupName + (item.isCopy === 1 ? '(可重复)' : '') }}</span>
                                                    <span style="float: right; color: #8492a6; font-size: 13px" v-show="item.groupCode!=='default'" @click.stop="updataGroup(item)"><i class="el-icon-edit-outline"></i></span>
                                                    <!-- <span style="float: right; color: #8492a6; font-size: 13px" v-show="index!==0" @click.stop="deleteGroup(item.pkId)"><i class="el-icon-close"></i></span> -->
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item style="color:#0D83D8;">
                                            <el-popover placement="bottom" width="360" v-model="groupTagVisible" popper-class="grouptagAddPopper" @show="groupTagShow">
                                                <h5 style="cursor:pointer;">新增组标签</h5>
                                                <el-form ref="groupTagForm" :model="groupTagForm" label-width="70px" size="mini">
                                                    <el-form-item label="组标签" prop="name" :rules="[{ required:true,message:'请输入组标签名称',trigger: 'blur'}]">
                                                        <el-input v-model="groupTagForm.name"></el-input>
                                                    </el-form-item>
                                                    <el-form-item label="可重复">
                                                        <el-switch v-model="groupTagForm.switch"></el-switch>
                                                    </el-form-item>
                                                </el-form>
                                                <div style="text-align: right; margin: 0">
                                                    <el-button size="mini" type="text" @click="groupTagVisible = false">取消</el-button>
                                                    <el-button type="primary" size="mini" @click="addGroupLabel('groupTagForm')">确定</el-button>
                                                </div>
                                                <i class="el-icon-circle-plus-outline" slot="reference" style="cursor:pointer;">&nbsp;&nbsp;&nbsp;新增组标签</i>
                                            </el-popover>
                                        </el-form-item>
                                        <el-form-item label="单位" v-if="currentItem.controlType == 'TB'||currentItem.controlType =='NTX'">
                                            <el-input v-model="currentItem.unitOfMeasure"></el-input>
                                        </el-form-item>
                                        <el-collapse v-model="activeName" accordion v-if="currentItem.controlType=='RB'|| currentItem.controlType=='CB'|| currentItem.controlType=='SEL_SIG'" style="padding:0 20px;">
                                            <el-collapse-item title="选项设置" name="1">
                                                <el-form :model="currentItem" ref="itemOptions" class="optionsBox" label-width="0">
                                                    <div class="optionsTitle">
                                                        <span>选项名称</span>
                                                        <span>选项评分</span>
                                                    </div>
                                                    <draggable tag="div" :list="currentItem.itemOptionList" class="list-group2" handle=".handle">
                                                        <div class="list-group2-item" v-for="(domain, index) in currentItem.itemOptionList" :key="index">
                                                            <el-form-item :rules="{required: true, message: '显示值不能为空', trigger: 'blur'}" :prop="'itemOptionList.' + index + '.displayName'">
                                                                <el-input v-model="domain.displayName" size="mini"></el-input>
                                                            </el-form-item>
                                                            <el-form-item :prop="'itemOptionList.' + index + '.value'">
                                                                <el-input v-model="domain.value" size="mini" placeholder="默认等同选项名称"></el-input>
                                                                <el-button size="mini" icon="el-icon-sort" circle class="handle" style="cursor: move"></el-button>
                                                                <el-button size="mini" icon="el-icon-close" circle @click="optionsDelete(index)"></el-button>
                                                            </el-form-item>
                                                        </div>
                                                    </draggable>
                                                    <div class="footer_div" style="bottom:20px;">
                                                        <el-button type="primary" size="mini" @click="optionsAdd">增加一项</el-button>
                                                    </div>
                                                </el-form>
                                            </el-collapse-item>
                                        </el-collapse>
                                    </el-tab-pane>
                                    <el-tab-pane label="值" name="value">
                                        <el-form-item label="默认值" v-if="currentItem.controlType == 'CB' || currentItem.controlType == 'ADSEL'">
                                            <el-input disabled v-model="optionValue"></el-input>
                                        </el-form-item>
                                        <el-form-item label="默认值" v-else>
                                            <el-input disabled v-model="currentItem.defaultValue"></el-input>
                                        </el-form-item>
                                        <el-form-item label="是否必填">
                                            <el-radio-group v-model="currentItem.isNeed" :disabled="currentItem.controlType=='LB'">
                                                <el-radio :label="1">是</el-radio>
                                                <el-radio :label="0">否</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                        <el-form-item label="是否只读">
                                            <el-radio-group v-model="currentItem.readOnly" :disabled="currentItem.controlType=='LB'">
                                                <el-radio value="'1'" :label="1">是</el-radio>
                                                <el-radio value="'0'" :label="0">否</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                        <el-form-item label="是否隐藏">
                                            <el-radio-group v-model="currentItem.visible" :disabled="currentItem.controlType=='LB'">
                                                <el-radio value="'0'" :label="0">是</el-radio>
                                                <el-radio value="'1'" :label="1">否</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                        <el-form-item label="隐藏规则" v-show="currentItem.visible===0">
                                            <el-select v-model="visibleRule.item" filterable placeholder="请选择列表项" style="margin-bottom:10px;width:100%;" @change="visibleItemChange">
                                                <el-option v-for="formItem in formList" :key="formItem.ddCode" :label="formItem.ddName" :value="formItem.ddCode" :disabled="currentItem.ddCode===formItem.ddCode||formItem.controlType==='ADSEL'"></el-option>
                                            </el-select>
                                            <el-select v-model="visibleRule.operator" placeholder="请选择运算符" style="margin-bottom:10px;width:100%;" @change="operatorChange">
                                                <el-option v-for="operator in ruleOperator" :key="operator.label" :label="operator.label" :value="operator.value" v-show="operator.show.includes(visibleItem.controlType)"></el-option>
                                            </el-select>
                                            <el-select v-model="visibleRule.value" placeholder="请选择" style="margin-bottom:10px;width:100%;"
                                                v-if="visibleItem.controlType==='CB' || visibleItem.controlType==='RB' || visibleItem.controlType==='SEL_SIG'"
                                                :multiple="visibleItem.controlType==='CB'"
                                                :collapse-tags="visibleItem.controlType==='CB'" >
                                                <el-option v-for="visibleItemOp in visibleItem.itemOptionList" :key="visibleItemOp.sort" :label="visibleItemOp.displayName" :value="visibleItemOp.value"></el-option>
                                            </el-select>
                                            <el-date-picker placeholder="请选择" v-model="visibleRule.value" style="margin-bottom:10px;width:100%;"
                                                v-else-if="visibleItem.controlType==='DP' || visibleItem.controlType==='DTP'" 
                                                :value-format="visibleItem.controlType==='DTP' ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'" 
                                                :type="(visibleRule.operator === '~'||visibleRule.operator === '!~') ? 'daterange' : visibleItem.controlType==='DTP' ? 'datetime' : 'date'" 
                                                :unlink-panels="visibleRule.operator === '~'||visibleRule.operator === '!~'"
                                                ></el-date-picker>
                                            <el-input v-model="visibleRule.value" size="mini" style="margin-bottom:10px;width:100%;" :placeholder="(visibleRule.operator === '~'||visibleRule.operator === '!~') ? '请用逗号隔开' : ''" v-else></el-input>
                                        </el-form-item>
                                        <el-form-item label="被求和项" v-show="currentItem.controlType==='TOTAL'">
                                            <el-select v-model="reduceList" filterable multiple collapse-tags placeholder="请选择列表项" style="margin-bottom:10px;width:100%;" @change="reduceListChange">
                                                <el-option v-for="formItem in formList" :key="formItem.ddCode" :label="formItem.ddName" :value="formItem.ddCode" 
                                                    :disabled="currentItem.ddCode===formItem.ddCode||!(formItem.controlType==='CB'||formItem.controlType==='RB'||formItem.controlType==='SEL_SIG'||formItem.controlType==='NTX')"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-tab-pane>
                                </el-tabs>
                            </el-form>
                            <div class="footer_div" v-if="!currentItem.ddCode">
                                <el-button type="primary" size="mini" @click="saveFormItemFn(1)">设置</el-button>
                            </div>
                            <div class="footer_div" v-else>
                                <!-- <el-button type="primary" size="mini" @click="saveFormItemFn(2)">确定</el-button> -->
                                <el-button type="primary" size="mini" @click="saveFormItemFn(2)">设置</el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <!-- 预览 -->
        <el-dialog :visible.sync="dialogVisible" v-if="dialogVisible" width="60%" >
            <div slot="title" style="text-align:center;">{{formName}}</div>
            <PreviewForm />
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
        <!-- 编辑组标签 -->
        <el-dialog title="编辑组标签" :visible.sync="groupDialogVisible" v-if="groupDialogVisible" width="60%" >
            <el-form ref="groupEdit" :model="groupEdit" label-width="70px" size="mini">
                <el-form-item label="组标签" prop="groupName" :rules="[{ required:true,message:'请输入组标签名称',trigger: 'blur'}]">
                    <el-input v-model="groupEdit.groupName"></el-input>
                </el-form-item>
                <el-form-item label="可重复">
                    <el-switch v-model="groupEdit.isCopy"></el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="groupDialogVisible = false">关 闭</el-button>
                <el-button type="primary" @click="updataGroupConf">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import FormItem from "@/components/FormItem.vue";
import PreviewForm from "@/components/previewForm.vue";
import { isArray } from "@/utils/index";
import { regionDataPlus } from 'element-china-area-data';
import { getGroupList,addGroup,deleteGroup,updataGroup,getFormList,addFormItem,editFormItem,deleteFormItem,sortFormList,updateFormulaRule } from "@/api/formManagementDesign.js";
export default {
    name: 'FormDesign',
    components: {draggable,FormItem,PreviewForm},
    data () {
        return {
            formCode: this.$route.query.code,
            formName: this.$route.query.name,
            formData: [],
            formList: [],
            currentItem: {},
            visibleRule: {
                item: '',
                operator: '',
                value: ''
            },
            visibleItem: {},
            ruleOperator: [
                {
                    label: '等于',
                    value: '==',
                    show: ['RB','SEL_SIG','NTX','CB','DP','DTP']
                },
                {
                    label: '不等于',
                    value: '!=',
                    show: ['RB','SEL_SIG','NTX','CB','DP','DTP']
                },
                {
                    label: '晚于',
                    value: '>>',
                    show: ['DP','DTP']
                },
                {
                    label: '大于',
                    value: '>',
                    show: ['NTX']
                },
                {
                    label: '早于',
                    value: '<<',
                    show: ['DP','DTP']
                },
                {
                    label: '小于',
                    value: '<',
                    show: ['NTX']
                },
                {
                    label: '大于等于',
                    value: '>=',
                    show: ['NTX']
                },
                {
                    label: '小于等于',
                    value: '<=',
                    show: ['NTX']
                },
                {
                    label: '包含',
                    value: '⊇',
                    show: ['TB','TA','CB']
                },
                {
                    label: '不包含',
                    value: '!⊇',
                    show: ['TB','TA','CB']
                },
                {
                    label: '范围内',
                    value: '~',
                    show: ['NTX','DP','DTP']
                },
                {
                    label: '范围外',
                    value: '!~',
                    show: ['NTX','DP','DTP']
                }
            ],
            reduceList: [],
            reduceListResult: [],
            reduceListexclude: [],
            rules: {
                ddName: [
                    {required: true, message: '请设置问题名称', trigger: 'blur'},
                    {min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur'}
                ]
            },
            activeTab: 'variable',
            activeName: '1',
            current: -1,
            isShowDetail: false,
            //组标签
            groupDialogVisible: false,
            groupList: [],
            groupValue: '',
            groupTagVisible: false,
            groupTagForm: {
                name: '',
                switch: false
            },
            groupEdit: {
                groupName: '',
                isCopy: false
            },
            //多选和地址值处理
            optionValue: '',
            //
            dialogVisible: false,
            ADoptions: regionDataPlus,
        }
    },
    created () {
        this.getGroupListFn();
        this.getFormListFn();
    },
    methods: {
        //表单项列表
        getFormListFn(){
            getFormList({questionnaireTitleCode:this.formCode}).then(res => {
                console.log('getFormList',res)
                res.data.forEach(item => {
                    if(item.controlType === 'CB' || item.controlType === 'ADSEL'){
                        item.defaultValue = !!item.defaultValue ? item.defaultValue.split(',') : [];
                        this.optionValue = item.defaultValue.join(',');
                    }
                    if (item.controlType === 'SLD') {
                        item.defaultValue = Number(item.defaultValue);
                    }
                })
                this.formList = res.data;
                setTimeout(this.changeLabelWidth, 300);
            })
        },
        // 表单项新增/编辑
        saveFormItemFn(type) {
            console.log(this.currentItem)
            this.$refs['currentItem'].validate((valid) => {
                if (valid) {
                    this.currentItem.groupCode = this.groupValue;
                    if (this.currentItem.controlType === 'CB' || this.currentItem.controlType === 'ADSEL') {
                        this.currentItem.defaultValue = isArray(this.currentItem.defaultValue) ? this.currentItem.defaultValue.join(',') : this.currentItem.defaultValue;
                    }
                    let optionLength = this.currentItem.itemOptionList.length;
                    for (let i = 0; i < optionLength; i++) {
                        this.currentItem.itemOptionList[i].sort = i;
                        this.currentItem.itemOptionList[i].value = this.currentItem.itemOptionList[i].value || this.currentItem.itemOptionList[i].displayName;
                    }
                    //约束规则字段上送处理
                    if(this.currentItem.visible === 0){
                        let {item, operator, value} = this.visibleRule;
                        let visibled = this.formList.filter(_ => _.ddCode === item)[0];
                        // if(operator!=='~' && operator!=='!~'){
                        //     value = 
                        //     visibled.controlType === 'DP'||visibled.controlType === 'DTP' ?
                        //     +new Date(value) : 
                        //     isArray(value) ? 
                        //     value.join(',') :
                        //     '"'+value+'"'
                        // }
                        console.log(item, operator, value)
                        switch (operator) {
                            case '~':
                                isArray(value) ?
                                this.currentItem.binds = item + '<=' + +new Date(value[1]) + '&&' + item + '>=' + +new Date(value[0]) :
                                this.currentItem.binds = item + '<=' + Math.max.apply(null,value.split(/\,|\，/g)) + '&&' + item + '>=' + Math.min.apply(null,value.split(/\,|\，/g));
                                break;
                            case '!~':
                                isArray(value) ?
                                this.currentItem.binds = item + '>' + +new Date(value[1]) + '||' + item + '<' + +new Date(value[0]) :
                                this.currentItem.binds = item + '>' + Math.max.apply(null,value.split(/\,|\，/g)) + '||' + item + '<' + Math.min.apply(null,value.split(/\,|\，/g));
                                break;
                            case '⊇':
                                isArray(value) ?
                                this.currentItem.binds = '[' + value.join(',').replace(/[^,]+/g,str => {return isNaN(str) ? '"'+str+'"' : str}) + '].every(val => [' + item + '].includes(val))' :
                                this.currentItem.binds = '(\'' + item + '\').indexOf(\'' + value + '\') >= 0';
                                break;
                            case '!⊇':
                                isArray(value) ?
                                this.currentItem.binds = '![' + value.join(',').replace(/[^,]+/g,str => {return isNaN(str) ? '"'+str+'"' : str}) + '].every(val => [' + item + '].includes(val))' :
                                this.currentItem.binds = '(\'' + item + '\').indexOf(\'' + value + '\') < 0'; 
                                break;
                            default:
                                isArray(value) ?
                                this.currentItem.binds = '['+ value.join(',').replace(/[^,]+/g,str => {return isNaN(str) ? '"'+str+'"' : str}) +'].concat(['+ item +']).filter(v => ![' + value.join(',').replace(/[^,]+/g,str => {return isNaN(str) ? '"'+str+'"' : str}) + '].includes(v) || ![' + item + '].includes(v)).length' + operator + '0' :              
                                this.currentItem.binds = item + (operator === '>>' ? '>' : operator === '<<' ? '<' : operator) + (visibled.controlType === 'DP'||visibled.controlType === 'DTP' ? +new Date(value) : '"'+value+'"'); 
                                break;
                        }
                        this.currentItem.constraints = item + '&&&' + operator + '&&&' + value;   
                    }else{
                        this.currentItem.binds = null;
                        this.currentItem.constraints = null;
                        this.currentItem.visible = 1;
                    }
                    console.log("保存の item", this.currentItem);
                    //计算求和字段保存
                    if(this.currentItem.controlType === 'TOTAL'){
                        const postData = {
                            "questionnaireTitleCode": this.formCode,
                            "ddList": this.reduceListResult,
                            'exclude': this.reduceListexclude,
                            "calculations": this.reduceListResult.join('+') + '=' + this.currentItem.ddCode
                        };
                        this.currentItem.calculations = this.reduceListResult.join(',');
                        editFormItem(this.currentItem).then(res => {
                            console.log('editFormItem',res)
                            updateFormulaRule(postData).then(res => {
                                console.log('updateFormulaRule',res)
                                this.getFormListFn();
                            });
                        })
                    }
                    else
                        type === 1&&!this.currentItem.ddCode ?
                        addFormItem(this.currentItem).then(res => {
                            console.log('addFormItem',res)
                            // this.currentItem.ddCode = res.data.ddCode;
                            this.$set(this.currentItem,'ddCode',res.data.ddCode)
                            // this.current = 0;
                            // this.getFormListFn();
                            this.sortForm(true);
                        }) : 
                        editFormItem(this.currentItem).then(res => {
                            console.log('editFormItem',res)
                            // this.getFormListFn();
                            this.sortForm(true);
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //删除表单项
        deleteFormItemFn(item,index){
            console.log(item,index);
            const postData = {
                questionnaireTitleCode: item.questionnaireTitleCode,
                ddCode: item.ddCode
            };
            postData.ddCode === void(0) ?
            this.formList.splice(index,1) :
            deleteFormItem(postData).then(res => {
                console.log('deleteFormItem',res)
                this.getFormListFn();
            });
            this.isShowDetail = false;
        },
        //预览表单
        previewForm(){
            this.dialogVisible = true;
        },
        //项列表排序
        sortForm(isSave) {
            let postData = this.formList.reduce((total,item,index) => {
                total.push({
                    questionnaireTitleCode: item.questionnaireTitleCode,
                    ddCode: item.ddCode,
                    displayOrder: index + 1
                })
                return total
            },[])
            sortFormList(postData).then(res => {
                isSave && this.getFormListFn();
            })
        },
        //单选反选清空
        cancelChecked(item,value){
            item.defaultValue = value == item.defaultValue ? '' : value
        },
        //点击查看项信息
        showFormItem(ele, index) {
            this.current = index;
            this.isShowDetail = true;
            this.visibleRule = this.$options.data.call(this).visibleRule;
            // this.activeTab = 'variable';
            if(ele.controlType == 'CB' || ele.controlType == 'ADSEL'){
                this.optionValue = ele.defaultValue && ele.defaultValue.join(',') || '';
            }
            if(ele.controlType == 'TOTAL'){
                this.reduceList = ele.calculations.split(',');
                this.reduceListexclude = ele.calculations.split(',');
            }
            //隐藏规则回显处理
            if(!!ele.constraints){
                let visibleRule = ele.constraints.split('&&&');
                Object.assign(this.visibleItem,this.formList.filter(_ => _.ddCode === visibleRule[0])[0]);
                this.$set(this.visibleRule,'item',visibleRule[0]);
                this.$set(this.visibleRule,'operator',visibleRule[1]);
                if(this.visibleRule.operator==='~'||this.visibleRule.operator==='!~'||this.visibleItem.controlType==='CB'){
                    this.$set(this.visibleRule,'value',visibleRule[2].split(','))
                }else{
                    this.$set(this.visibleRule,'value',visibleRule[2])
                }
            }
            this.currentItem = ele;
            this.groupValue = ele.groupCode;
        },
        //组标签
        getGroupListFn() {
            getGroupList({questionnaireTitleCode:this.formCode}).then(res => {
                console.log('getGroupList',res)
                this.groupValue = res.data[0].groupCode;
                this.groupList = res.data;
            })
        },
        groupTagShow() {
            this.groupTagForm = this.$options.data.call(this).groupTagForm;
            this.$refs.groupTagForm && this.$refs.groupTagForm.clearValidate();
        },
        addGroupLabel(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const postData = {
                        groupName: this.groupTagForm.name,
                        isCopy: this.groupTagForm.switch ? 1 : 0,
                        questionnaireTitleCode: this.formCode
                    };
                    addGroup(postData).then(res => {
                        console.log('addGroup',res)
                        this.getGroupListFn();
                    })
                    this.groupTagVisible = false;
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        deleteGroup(id){
            deleteGroup({id: id}).then(res => {
                console.log('deleteGroup',res)
                this.getGroupListFn();
            })
        },
        updataGroup(data){
            this.groupEdit = Object.assign(this.groupEdit,data);
            this.groupDialogVisible = true;
        },
        updataGroupConf(){
            const postData = {
                groupCode: this.groupEdit.groupCode,
                groupName: this.groupEdit.groupName,
                isCopy: this.groupEdit.isCopy === false ? 0 : 1
            }
            updataGroup(postData).then(res => {
                this.getGroupListFn();
                this.groupDialogVisible = false;
            })
        },
        //约束三个字段
        visibleItemChange(ddCode){
            this.visibleRule.operator = '';
            this.visibleRule.value = '';
            this.visibleItem = this.formList.filter(_ => _.ddCode === ddCode)[0];
        },
        operatorChange(operator){
            this.visibleRule.value = '';
        },
        //求和项
        reduceListChange(val){
            console.log(val)
            this.reduceListResult = val;
        },
        //
        log(arg) {
            if(arg.moved){
                let hasDdCodeLength = this.formList.reduce((t,e) => {
                    return t = !!e.ddCode ? t+1 : t
                },0)
                if(hasDdCodeLength === this.formList.length)
                this.sortForm(true)
                return false;
            }
            this.changeLabelWidth();
            let el = arg.added.element;
            let index = arg.added.newIndex;
            if(el.controlType === 'TOTAL'){
                // this.currentItem = el;
                Object.assign(this.currentItem,el,true);
                addFormItem(this.currentItem).then(res => {
                    console.log('addFormItem',res);
                    // this.formList[index].ddCode = res.data.ddCode
                    this.$set(this.formList[index],'ddCode',res.data.ddCode)
                })
            }
        },
        //多选和地址类型值改变时特殊处理
        itemOptionChange(){
            this.optionValue = this.currentItem.defaultValue.join(',');
        },
        //多选单选下拉单选选项增/删
        optionsAdd() {
            this.currentItem.itemOptionList.push({
                displayName: '',
                value: '',
                sort: this.currentItem.itemOptionList.length
            })
        },
        optionsDelete(index) {
            this.currentItem.itemOptionList.splice(index, 1);
            this.changeLabelWidth();
        },
        //表单项label过长，省略号显示
        changeLabelWidth() {
            let col = this.$refs.colWidth.$el;
            let oNode = col.querySelectorAll('.el-form-item__label');
            let oOption = col.querySelectorAll('.el-radio__label,.el-checkbox__label');
            Array.from(oNode).forEach((node) => {
                node.style.width = col.offsetWidth - 160 + 'px';
            })
            Array.from(oOption).forEach((node) => {
                node.style.maxWidth = col.offsetWidth - 90 + 'px';
            });
        },
    },
    //跳出当前页之前，查看是否全部项都已保存
    beforeRouteLeave(to, from, next) {
        let state = true;
        try {
            this.formList.forEach((item, index) => {
                if (!item.ddCode) {
                    state = false
                    throw new Error('endRouteLeave');
                }
            })
        } catch (e) {
            console.log(333, state)
            if (e.message === 'endRouteLeave') {
                setTimeout(() => {
                    this.$confirm('表单中尚有控件未保存，是否确认离开？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        next()
                    }).catch(() => {
                        next(false)
                    });
                })
            }
        } finally {
            state && next()
        }
    },
}
</script>

<style lang="scss" scoped>
.yulan{
    position: absolute;
    top: -40px;
    right: 20px;
}
.form_content{
    height: calc(100% - 40px);
    .content_left {
        width: 200px;
        height: 100%;
        float: left;
    }
    .content_right {
        width: calc(100% - 200px);
        padding: 0 20px;
        height: 100%;
        float: left;
        .el-form-item{
            padding-left: 0;
        }
        .item_focu {
            background: rgba(30, 149, 234, 0.05);
        }
        .formScroll {
            height: calc(100% - 40px);
            overflow: auto;
            .dragArea {
                height: calc(100% - 10px);
            }
            .noDate {
                width: 100%;
                height: 300px;
                line-height: 300px;
                background-color: #fff;
                color: #909399;
                text-align: center;

            }
            .list-group-item {
                margin-top: 10px;
                border: 1px solid #eee;
                box-sizing: border-box;
                padding: 15px 20px;
                position: relative;
                cursor: move;
                .top_right {
                    position: absolute;
                    right: 20px;
                    top: 20px;
                    cursor: pointer;
                }
                .top_right_two {
                    position: absolute;
                    right: 50px;
                    top: 10px;
                }
            }
        }
        .config_body {
            height: 100%;
            margin: 0 10px;
            min-width: 340px;
            background: #fff;
            box-sizing: border-box;
            // border: 1px solid #eee;
            // padding: 20px;
            .optionsBox {
                // padding: 0 20px;
                .el-form-item {
                    &:nth-child(2) {
                        width: 60%;
                        .el-input {
                            display: inline-block;
                            width: 50%;
                        }
                    }
                    display: inline-block;
                    width: 30%;
                    margin-right: 10px;
                    height: 55px;
                }
                button {
                    background: #4b89dc;
                    color: #fff;
                }
                .optionsTitle {
                    margin-bottom: 15px;
                    span:nth-child(1) {
                        display: inline-block;
                        margin-right: 10px;
                        width: 30%;
                        &:before {
                            content: "*";
                            color: #f56c6c;
                            margin-right: 4px;
                        }
                    }
                    span:nth-child(2) {
                        display: inline-block;
                        margin: 0 10px;
                    }
                    .handle {
                        cursor: move !important;
                    }
                }
            }
            .footer_div {
                position: absolute;
                right: 15px;
                bottom: 4px;
            }
        }
    }
}
</style>
<style lang="scss">
.formScroll{
    .el-form-item__label{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .el-tabs--border-card{
        border: none;
        box-shadow: none;
    }
    // 反选清空单选样式影响处理
    .el-radio:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio__inner {
        -webkit-box-shadow: none;
        box-shadow: none;
    }
}

</style>