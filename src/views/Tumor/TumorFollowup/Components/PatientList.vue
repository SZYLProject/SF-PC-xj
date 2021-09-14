<template>
  <div class="page-table" style="padding: 0 !important;">
	   <el-table stripe :data="tableData" border style="width: 99%;">
      <el-table-column prop="tpatno" align="center" label="病案号"></el-table-column>
	    <el-table-column prop="patientName" align="center" label="姓名"></el-table-column>
	    <el-table-column align="center" label="最后接触时间">
	      <template slot-scope="scope">
	        <span>{{ parseTime(scope.row.lastContactTime,'{y}-{m}-{d}') }}</span>
	      </template>
	    </el-table-column>
	    <el-table-column prop="lastContactType" align="center" label="最后接触类型" width="110"></el-table-column>
	    <el-table-column prop="lastContactResult" align="center" label="最后接触结果" width="110"></el-table-column>
	    <el-table-column prop="recentTime" align="center" label="最近随访时间" width="140">
	      <!-- <template slot-scope="scope">
	        <span>{{ parseTime(scope.row.recentTime,'{y}-{m}-{d}') }}</span>
	      </template> -->
	    </el-table-column>
	    <el-table-column prop="recentResult" align="center" label="最近随访结局" width="140"></el-table-column>
	    <template class="details_table_column" v-if="tableData.length">
	      <!-- <el-table-column align="center" :label="`随访点${index+1}`" width="140"  v-for="(item,index) in tableData[0].registerGroups" :key="index" >
	        <template slot-scope="scope">
	          <el-tooltip placement="top" popper-class="tooltip_class">
	            <div slot="content">
	              {{scope.row.registerGroups[index].statusName}} 
	            </div>
	            <span class="cursor" @click="toFollow(scope.row,scope.row.registerGroups[index])" >{{scope.row.registerGroups[index].statusName}}</span>
	          </el-tooltip>
	        </template>
	      </el-table-column> -->
        <el-table-column align="center" :label="`${item.nodeName} - ${item.nodePoint}`" width="140" v-for="(item, index) in tableData[0].registerGroups" :key="index">
          <template slot-scope="scope">
            <el-tooltip placement="top" popper-class="tooltip_class">
              <div slot="content">
                {{ scope.row.registerGroups[index].statusName }}
              </div>
              <span class="cursor" @click="toFollow(scope.row, scope.row.registerGroups[index])">{{ scope.row.registerGroups[index].statusName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
	    </template>
	  </el-table>
    <div class="pages-modules">
      <el-pagination
        style="float:right"
        :total="currentPageTotal"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        background
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { parseTime } from "@/utils/index.js";
import { getFindPatientInfoByProject } from "@/api/survivalFollowup";
import { registrationGetProspectAllPatient } from "@/api/tumor/tumorFollowup";

export default {
  name: "PatientList",
  props: {
    searchData: {
      type: Object,
      default() {
        return {
          status: 0
        };
      },
    },
    typeNumber: {
      type: Number, // 0 带随访 1 已随访 2 暂存
      default() {
        return 0;
      },
    },
  },
  data() {
    return {
      tableData: [],
      // 分页数据
      currentPage: 1,
      currentPageSize: 10,
      currentPageTotal: 0,
      statusCode: this.$route.query.statusCode,
      statusName: this.$route.query.statusName,
      followType: this.$route.query.type, // 随访类型
    };
  },
  created() {
    this.registrationGetProspectAllPatientFn();
  },
  methods: {
		parseTime(time, cFormat) {
		  if (arguments.length === 0 || !time) {
		    return null;
		  }
		  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
		  let date;
		  if (typeof time === "object") {
		    date = time;
		  } else {
		    if (typeof time === "string") {
		      if (/^[0-9]+$/.test(time)) {
		        // support "1548221490638"
		        time = parseInt(time);
		      } else {
		        // support safari
		        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
		        time = time.replace(new RegExp(/-/gm), "/");
		      }
		    }
		    if (typeof time === "number" && time.toString().length === 10) {
		      time = time * 1000;
		    }
		    date = new Date(time);
		  }
		  const formatObj = {
		    y: date.getFullYear(),
		    m: date.getMonth() + 1,
		    d: date.getDate(),
		    h: date.getHours(),
		    i: date.getMinutes(),
		    s: date.getSeconds(),
		    a: date.getDay(),
		  };
		  const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
		    const value = formatObj[key];
		    // Note: getDay() returns 0 on Sunday
		    if (key === "a") {
		      return ["日", "一", "二", "三", "四", "五", "六"][value];
		    }
		    return value.toString().padStart(2, "0");
		  });
		  return timeStr;
		},
		
    toFollow(row,  groupsVal,isView ) {
      //      id | 患者id
      // patientId | 患者的微信id
      // diseaseId | 病例id
			
			console.log('row ---->>>',row,isView)
      let { id, diseaseId, patientId, resultId,groupId,ppId} = row;
      let followEndtype = "prospect";
       if (groupsVal.status != -1) {
        if (groupsVal.status == 1 || groupsVal.status == 3) {
          isView = true;
          followEndtype = "1";
        } else {
          isView = false;
        }
        let groupId = groupsVal.id;
        let resultId = groupsVal.resultId ? groupsVal.resultId : "";
        this.$router.push({
          path: "/tumor/followUpDetails",
          query: {
            id,
            groupId,
            ppId,
            projectId: this.$route.query.id,
            patientId,
            diseaseId,
            resultId,
            type: groupsVal.status,
            isView: isView,
            isfollowType: followEndtype,
            statusCode_old:this.statusCode,
            statusName_old:this.statusName,
            followType_old:this.followType,
          },
        });
      } else {
        this.$message.success("暂时不可以去随访");
      }




        
      // this.$router.push({ // 点击随访点到 患者随访详情
      //   path: "/tumor/followUpDetails",
      //   query: {
      //     id,
      //     groupId: groupsVal.id,
      //     ppId,
      //     projectId:this.$route.query.id,
      //     patientId,
      //     diseaseId, 
      //     resultId: groupsVal.resultId ? groupsVal.resultId : '',
      //     type: this.typeNumber,
      //     isView: isView,
      //     statusCode_old: this.statusCode,
      //     statusName_old: this.statusName,
      //     followType_old: this.followType,
      //   },
      // });
      // sessionStorage.setItem("saveIsView", isView);
    },
    //获取表单列表
    registrationGetProspectAllPatientFn() {
      const getData = {
        projectId: this.$route.query.id,
        status: this.searchData.status,
        keyword: "",
				name: this.searchData.name,
        pageNum: this.currentPage,
        pageSize: this.currentPageSize,
      };
			
			// 更新项目的患者   表格统计接口 肿瘤
      registrationGetProspectAllPatient(getData)
        .then((res) => {
          this.tableData = res.data.list;
          this.currentPageTotal = res.data.total;
        })
        .catch((error) => {
          console.error("getFindPlanByTypesss", error);
        });
    },
    
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.registrationGetProspectAllPatientFn();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.registrationGetProspectAllPatientFn();
    },
  },
};
</script>
<style lang="scss" scoped>
.list-operating {
  font-size: 20px;
  margin: 0 12px;
  cursor: pointer;
}
.cursor {
  cursor: pointer;
  &:hover {
    color: #2476c2;
  }
}
</style>