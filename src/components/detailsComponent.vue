<template>
  <div>
    <!-- 第一种 -->
    <div
      class="details_table_column"
      v-for="(item,index) in dataList[0].list"
      :key="index"
    >
      <div>
        <el-table-column
          align="center"
          :label="`随访点${index+1}`"
          width="140"
        >
          <template slot-scope="scope">
            <el-tooltip
              placement="top"
              popper-class="tooltip_class"
            >
              <div slot="content">{{scope.row.list[index].content}}<br />{{scope.row.list[index].result}}</div>
              <span :class="`el-icon-circle-${scope.row.list[index].type}`"></span>
            </el-tooltip>
          </template>
        </el-table-column>
      </div>
    </div>

    <!-- 第二种 -->
    <!-- <div
      class="details_table_column"
      v-for="(item,index) in dataList[0].sfd"
      :key="index"
    >
      <div>
        <el-table-column
          align="center"
          :label="`随访点${index+1}`"
          width="140"
        >
          <template slot-scope="scope">
            <el-tooltip
              placement="top"
              popper-class="tooltip_class"
            >
              <div slot="content">{{scope.row[item]?scope.row[item].content:''}}<br />{{scope.row[item]?scope.row[item].result:''}}</div>
              <span :class="`el-icon-circle-${scope.row[item]?scope.row[item].type:''}`"></span>
            </el-tooltip>
          </template>
        </el-table-column>
      </div>
    </div> -->
  </div>
</template>


<script>
export default {

  // props: ['dataList'],
  props: ['dataList'],
  //  第一种方法
  //  结构对dataList有要求
  //  返回的数据结构，比如最多有10个随访点，那就每一条的数据的list都需要10条数据
  //  随访点有没有是type控制的，如果没有那么type设为‘’
  //  type的值要和el-icon的class名字一致
  data() {
    return {
    }
  },
  methods: {
  },
}
</script>

<style lang='scss' scoped>
</style>