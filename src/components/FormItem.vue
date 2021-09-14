<template>
    <el-card class="box-card" :body-style="{ height: 'calc(100% - 117px)',overflowY: 'auto',padding: '15px' }">
        <div slot="header" class="clearfix">
            <el-input v-model="search" size="smmall" @input='selectContrl' placeholder="请输入关键字查找组件"></el-input>
        </div>
        <draggable class="list-group" v-model="controlList" :clone="cloneElement" :group="{ name: 'people', pull: 'clone', put: false }" @change="log">
            <transition-group type="transition" :name="'flip-list'">
                <div class="list-group-item item clearfix" v-for="element in controlList" :key="element.name">
                    <i class="iconfont fl" :class="element.icon"></i>
                    <span class="fl">{{element.subName}}</span>
                    <i class="iconfont icon-tuodong fr"></i>
                </div>
            </transition-group>
        </draggable>
    </el-card>
</template>


<script>
    import draggable from "vuedraggable";
    let baseControlArr = [
        {
            name: '单行文本',
            subName: '单行文本',
            type: 'TB',
            id: 1,
            fixed: false,
            icon: 'icondanhangwenben'
        },
        {
            name: '多行文本',
            subName: '多行文本',
            type: 'TA',
            fixed: false,
            id: 2,
            icon: 'iconduohang'
        }, {
            name: '单选题',
            subName: '单选题',
            type: 'RB',
            fixed: false,
            id: 3,
            icon: 'iconiconfontoptionbutton'
        },{
            name: '多选题',
            subName: '多选题',
            type: 'CB',
            fixed: false,
            id: 6,
            icon: 'iconduoxuanti'
        },
        {
            name: '下拉单选',
            subName: '下拉单选',
            type: 'SEL_SIG',
            id: 4,
            fixed: false,
            icon: 'iconxialadanxuan'
        }, {
            name: '数字题',
            subName: '数字题',
            type: 'NTX',
            fixed: false,
            id: 5,
            icon: 'iconshuzi'
        }, {
            name: '总分',
            subName: '总分',
            type: 'TOTAL',
            fixed: false,
            id: 6,
            icon: 'iconshuzi'
        }, 
        // {
        //     name: '时间选择器',
        //     subName: '时间选择器',
        //     type: 'TP',
        //     fixed: false,
        //     id: 7,
        //     icon: 'icon-shijianxuanzeqi'
        // }, 
        {
            name: '日期选择器',
            subName: '日期选择器',
            type: 'DP',
            fixed: false,
            id: 8,
            icon: 'iconshumogongjuicon-'
        }, {
            name: '日期时间选择器',
            subName: '日期时间选择器',
            type: 'DTP',
            fixed: false,
            id: 9,
            icon: 'iconriqishijian'
        }, {
            name: '地址选择器',
            subName: '地址选择器',
            type: 'ADSEL',
            fixed: false,
            id: 10,
            icon: 'icondizhixuanze'
        },
        {
            name: '图片上传',
            subName: '图片上传',
            type: 'SUF',
            fixed: false,
            id: 12,
            icon: 'iconupload'
        },
        // {
        //     name: '文本标题',
        //     subName: '文本标题',
        //     type: 'LB',
        //     fixed: false,
        //     id: 13,
        //     icon: 'icon-wenbenbiaoti'
        // }
    ]
    export default {
        components: {
            draggable
        },
        props: ['formData'],
        data() {
            return {
                search: '',
                controlList: baseControlArr
            }
        },
        methods: {
            selectContrl() {
                let search = this.search
                if (search) {
                    this.controlList = this.controlList.filter(item => {
                        return item.name.toLowerCase().indexOf(search.toLowerCase()) > -1 || item.subName.toLowerCase().indexOf(search.toLowerCase()) > -1
                    })
                } else {
                    this.controlList = baseControlArr
                }
            },
            cloneElement(clone) {
                return {
                    binds: '',
                    calculations: '',
                    constraints: '',
                    questionnaireTitleCode: this.$route.query.code,//表单code
                    controlType: clone.type,    //字段类型
                    ddName: clone.name, //字段名称
                    unitOfMeasure: '',  //单位
                    defaultValue: clone.type === 'CB' ? [] : '',   //默认值
                    // displayOrder: this.idGlobal,    //排序字段
                    visible: 1, //是否显示：0-否；1-是
                    dataLength: 200,    //字段值长度限制
                    readOnly: clone.type === 'TOTAL' ? 1 : 0,  //是否只读 1是,0否
                    isNeed: 0,  //是否必填
                    groupCode: 'default', //组属
                    rule: 'all',    
                    desensitization: 'bypassed', //脱敏设置
                    itemOptionList: (clone.type === 'CB' || clone.type === 'SEL_SIG' || clone.type === 'RB') ? [
                        {
                            displayName: '',
                            value: '',
                            sort: 0
                        }
                    ] : [],
                };
            },
            log() {

            }
        },
    }
</script>

<style lang='scss' scoped>
    .box-card {
        height: 100%;
        .input {
            border-bottom: 1px solid #ebeef5;
        }
        .item {
            width: 100%;
            margin: 0 auto;
            color: #606266;
            cursor: move;
            border: 1px solid #ebeef5;
            overflow: hidden;
            white-space: nowrap;
            display: inline-block;
            text-overflow: ellipsis;
            border-radius: 3px;
            padding: 6px 8px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            margin: 5px;
            font-size: 12px;
            line-height: 1.5em;
            .comp-item-title {
                font-weight: 700;
                color: #222;
            }
            &.input {
                width: 180px;
            }
        }
        .flip-list-move {
            transition: transform 0.8s;
        }

        .no-move {
            transition: transform 0s;
        }

        .ghost {
            opacity: 0.5;
            background: #c8ebfb;
            color: red;
        }

        .list-group {
            // min-height: 20px;
            height: 100%;
        }

        .list-group-item {
            margin-top: 10px;
            border: 1px solid #eee;
            box-sizing: border-box;
            padding: 15px 10px;
            cursor: move;
            span{
                margin-left: 10px;
                vertical-align: top;
            }
        }

    }
</style>