// pkId 表单模板  id    微信、短信模板    code  接通情况
// name 表单名称  title 微信、短信名称
<template>
  <ul>
    <li
      class="tempItem"
      v-for="(item, index) in tempList"
      :key="index"
      :title="item[options.label]"
      @click="tempItemClick(item, index)"
      :class="{ 'temp-active': checkArr.includes(item[options.id]) }"
      :style="{ width: width }"
    >
      {{ item[options.label] }}
      <div class="triangle">
        <span class="check"></span>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: "tempList",

  props: {
    tempList: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    width: {
      type: String,
      default() {
        return "200px";
      },
    },
    multiple: {
      type: Boolean,
      default() {
        return false;
      },
    },
    checkArr: {
      type: Array,
      default() {
        return [];
      },
    },
    options: {
      type: Object,
      default() {
        return {
          label: "label",
          id: "id",
        };
      },
    },
    isFollowForm: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isNotClick: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isView: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 是否为表单选择  是：formSelect
    selectType: {
      type: String,
      default() {
        return "noForm";
      },
    },
  },
  methods: {
    tempItemClick(item) {
      // isNotClick   去随访 查看其他永远禁止点击
      // isView    //  isView     true 看 false 编辑
      // isFollowForm ==true 禁用 并且选中第一个(生存表单仅一个) 默认选中生存 且不可取消
      //  专题  && item.typeCode != "routine" 默认选中生存 且不可取消
      if (this.selectType == "formSelect") {
        if (!this.isFollowForm && item.typeCode != "survival") {
          let id = item[this.options.id];
          this.checkArr.includes(id)
            ? this.checkArr.splice(this.checkArr.indexOf(id), 1)
            : this.multiple
            ? this.checkArr.push(id)
            : this.$set(this.checkArr, 0, id);
        }
      } else if (this.selectType == "isNotClick" || this.isView) {
        console.log("禁止点击");
      } else {
        if (!this.isFollowForm) {
          let id = item[this.options.id];
          this.checkArr.includes(id)
            ? this.checkArr.splice(this.checkArr.indexOf(id), 1)
            : this.multiple
            ? this.checkArr.push(id)
            : this.$set(this.checkArr, 0, id);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.temp-active {
  // color: #2476c2 !important;
  color: #46a28b !important;
  border-color: #46a28b !important;
  /* 三角形 */
  .triangle {
    position: absolute;
    right: -1px;
    top: 0;
    width: 0;
    height: 0;
    border: 11px solid #46a28b;
    border-left: 11px solid transparent;
    border-bottom: 11px solid transparent;
    border-radius: 0 4px 0 0;
  }
  /* 对号 */
  .check {
    position: relative;
    display: inline-block;
    width: 25px;
    height: 25px;
    border-radius: 25px;
  }
  .check::after {
    content: "";
    position: absolute;
    left: -1px;
    top: -9px;
    width: 40%;
    height: 22%;
    border: 2px solid #fff;
    border-radius: 1px;
    border-top: none;
    border-right: none;
    background: transparent;
    transform: rotate(-45deg);
  }
}
.tempItem {
  position: relative;
  display: inline-block;
  // width: 200px;
  height: 28px;
  line-height: 28px;
  font-size: 14px;
  color: #2c3e50;
  // text-indent: 1em;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  margin: 0 10px 10px 0;
  border-radius: 4px;
}
</style>