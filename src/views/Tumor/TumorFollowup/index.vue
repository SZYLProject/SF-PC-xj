<template>
	<div class="content">
		<div class="page-search">
			<el-form :inline="true" :model="searchForm" class="demo-form-inline searchformFirst" size="mini">
				<el-form-item>
					<el-input class v-model="searchForm.name" placeholder="搜索项目名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select class v-model="searchForm.status" clearable filterable placeholder="选择状态">
						<el-option v-for="item in statusList" :label="item.name" :value="item.code" :key="item.code"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-select class v-model="searchForm.hospitalName" clearable filterable placeholder="选择医院">
						<el-option v-for="(item,index) in hospitalList" :label="item.hospitalName" :value="item.hospitalName" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button class="marginl24" type="primary" icon="el-icon-search" @click="registrationLiveFindAllProjectFn">查询</el-button>
					<el-button v-show="!['分中心负责人','分中心随访人员'].filter(v => roleName.split(',').includes(v)).length" class="marginl24" type="primary" icon="el-icon-plus" @click="openModel">新建</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="page-table">
			 <el-table stripe v-loading="loading" :data="tableData" border style="width: 99%;">
				<el-table-column align="center" prop="hospitalName"  min-width="120" show-overflow-tooltip label="所属医院"></el-table-column>
				<el-table-column align="center" prop="name" label="项目名称"></el-table-column>
				<el-table-column align="center" prop="wait" label="项目状态">
					<template slot-scope="scope">
						<span v-if="scope.row.status == 0">未开始</span>
						<span v-if="scope.row.status == 1">进行中</span>
						<span v-if="scope.row.status == 2">已完成</span>
						<span v-if="scope.row.status == 3">已终止</span>
					</template>
				</el-table-column>
				<!-- <el-table-column align="center" prop="percent" label="完成度" width="240">
					<template slot-scope="scope">
            			<span >- -</span>
					</template>
				</el-table-column> -->
				<el-table-column align="center" prop="patientNum" label="应随访人数">
					<template slot-scope="scope">
						{{scope.row.status === '0' ? '-' : scope.row.patientNum}}
					</template>
				</el-table-column>
				<el-table-column align="center" prop="wait" label="待随访人数">
					<template slot-scope="scope">
						{{scope.row.status === '0'||scope.row.type !== "review" ? '-' : scope.row.wait}}
					</template>
				</el-table-column>
				<el-table-column align="center" prop="finish" label="已随访人数">
					<template slot-scope="scope">
						{{scope.row.status === '0'||scope.row.type !== "review" ? '-' : scope.row.finish}}
					</template>
				</el-table-column>
				<el-table-column align="center" prop="temp" label="暂存人数">
					<template slot-scope="scope">
						{{scope.row.status === '0'||scope.row.type !== "review" ? '-' : scope.row.temp}}
					</template>
				</el-table-column>
				<el-table-column align="center" prop="temp" label="有效随访率">
					<template slot-scope="scope">
						{{scope.row.validpercent }}%
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作" fixed="right" :width="['管理员','病案管理科主任','多中心负责人'].filter(v => roleName.split(',').includes(v)).length ? 240 : 80">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" v-if="scope.row.status != '0'" content="项目详情" placement="top">
							<i class="iconfont iconicon_xiangqing icon-custom list-item" @click.stop="viewDetails(scope.row)"></i>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="随访方案" placement="top">
							<i class="iconfont iconicon_fangan icon-custom list-item" @click.stop="viewModel(scope.row)" v-show="['管理员','病案管理科主任','多中心负责人'].filter(v => roleName.split(',').includes(v)).length&&scope.row.status!=='3'&&scope.row.status!=='2'"></i>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" v-if="scope.row.status != '0'" content="终止项目" placement="top">
							<i class="iconfont iconicon_zhongzhi icon-custom list-item" @click.stop="stopProFn(scope.row)" v-show="['管理员','病案管理科主任','多中心负责人'].filter(v => roleName.split(',').includes(v)).length&&scope.row.status!=='3'&&scope.row.status!=='2'"></i>
						</el-tooltip>
						<!-- <el-tooltip class="item" effect="dark" content="数据导出" placement="top">
							<i class="iconfont icondownload icon-custom list-item"></i>
						</el-tooltip> -->
					</template>
				</el-table-column>
			</el-table>
			<div class="pages-modules">
				<el-pagination style="float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange"
				 :current-page="pageNum" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" :pager-count="7" layout="total, sizes, prev, pager, next, jumper"
				 :total="total" background></el-pagination>
			</div>
		</div>
		<!-- 编辑/新建弹窗 -->
		<el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
			<el-row class="inline-row">
				<el-form :model="dataForm" ref="dataForm" :rules="rules">
					<el-form-item prop="name" label="项目名称">
						<el-input v-model="dataForm.name" placeholder="请输入项目名称"></el-input>
					</el-form-item>
					<el-form-item prop="hospitalName" label="所属医院" class="label100">
						<el-select v-model="dataForm.hospitalName" placeholder="请选择医院" clearable>
							<!-- <el-option v-for="item in departmentList" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option> -->
							<el-option v-for="(item,index) in hospitalList" :label="item.hospitalName" :value="item.hospitalName" :key="index"></el-option>
						</el-select>
					</el-form-item>
					<!-- 肿瘤登记只有前瞻  不必显示-->
					<el-form-item v-if="false" class="label100" label="项目类型">
						<el-select v-model="dataForm.type" clearable filterable placeholder="请选择项目类型">
							<el-option v-for="item in typeList" :label="item.name" :value="item.code" :key="item.code"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<el-col class="dialog-footer">
					<el-button class="cancel-btn" @click="dialogVisible = false">取 消</el-button>
					<el-button class="determine-btn marginl24" type="primary" @click="determine">确 定</el-button>
				</el-col>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
	import {
		liveFindByType,
		liveFindByStatus,
		liveFindAllProject,
		getDepartments,
		liveAddProject,
	} from "@/api/survivalFollowup";

	import {
		registrationLiveFindAllProject,
		registrationAllHospital,
		registrationAddProject,
		stopPro,
	} from "@/api/tumor/tumorFollowup";


	export default {
		name: "SurvivalFollowup",
		data() {
			return {
				afNum: 0,
				beNum: 0,
				totalNum: 0,
				endNum: 0,
				endingNum: 0,
				nostartNum: 1,
				startedNum: 1,
				departmentList: [],
				dialogState: false, // false 弹框可编辑 true 弹框不可编辑
				dialogTitle: "新建登记随访",
				searchForm: {},
				dataForm: {
					title: "",
					depart: "",
					typeCode: "",
					typeName: "",
					content: "",
					hospitalName: "", // 查询医院
					status: "",
				},
				rules: {
					name: [{
						required: true,
						message: '请输入项目名称',
						trigger: 'blur'
					}, ],
					hospitalName: [{
						required: true,
						message: '请输入医院名称',
						trigger: 'blur'
					}, ],
				},
				followUpType: [],
				typeList: [{
						name: "前瞻",
						code: "prospect",
					},
					{
						name: "回顾",
						code: "review",
					},
				],
				statusList: [{
						name: "未开始",
						code: "0",
					},
					{
						name: "进行中",
						code: "1",
					},
					{
						name: "已完成",
						code: "2",
					},
					{
						name: "已终止",
						code: "3",
					},
				],
				hospitalList: [], // 医院列表 option
				tableData: [],
				loading: false,
				pageNum: 1, // 分页数据
				pageSize: 10, // 每页展示数量
				total: 0, // 总数
				dialogVisible: false, // 是否显示弹窗

				roleName: '',
			};
		},
		watch: {},
		created() {
			this.roleName = JSON.parse(sessionStorage.getItem("userData")).roleName;
			// this.liveFindByTypeFn(); // 项目随访类型数据
			this.liveFindByStatusFn(); // 项目状态数据  
			this.registrationLiveFindAllProjectFn(); // 查询项目列表
			this.getDepartmentsFn(); // 获取科室列表
			this.registrationAllHospitalFn(); // 获取医院列表
		},
		mounted() {},
		methods: {
			// 项目详情
			viewDetails(row) {
				console.log(row);
				this.$router.push({
					path: "/tumor/followup/details",
					query: {
						id: row.id,
						statusCode: row.status,
						statusName: row.statusName
					},
				});
			},

			// 随访方案
			viewModel(row) {
				localStorage.getItem('searchConditionTumor') && localStorage.removeItem('searchConditionTumor');
				this.$router.push({
					path: "/tumor/planSetUp",
					query: {
						id: row.id,
						type: 'prospect',
						projectStatus:row.status 
					},
				});
			},
			//终止项目
			stopProFn(row){
				console.log(row)
				const confirmText = [
					"您确认是否需要终止本项目？",
					"已保存的随访结果不会受到影响，",
					"暂存结果的患者将释放随访状态,",
					"结果不会进行记录。",
				];
				const newDatas = [];
				const h = this.$createElement;
				for (const i in confirmText) {
					newDatas.push(h("p", null, confirmText[i]));
				}
				this.$confirm("提示", {
					title: "提示",
					message: h("div", null, newDatas),
					showCancelButton: true,
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}).then(() => {
					let data = {
						status: "3",
						id: row.id,
					};
					stopPro(data).then((res) => {
						console.log('stopProFn',res);
						this.$message.success("终止成功");
						this.registrationLiveFindAllProjectFn();
						this.liveFindByStatusFn();
					})
				})
			},
			//查询项目
			registrationLiveFindAllProjectFn() {
				let params = {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					name: this.searchForm.name,
					hospitalName: this.searchForm.hospitalName,
					status: this.searchForm.status,
				};
				this.loading = true;
				registrationLiveFindAllProject(params)
					.then((res) => {
						this.loading = false;
						this.tableData = res.data.list;
						this.total = res.data.total;
					})
					.catch((error) => {
						console.error(error);
					});
			},
			// 项目随访类型数据
			liveFindByTypeFn() {
				liveFindByType()
					.then((res) => {
						this.afNum = res.data.af;
						this.beNum = res.data.be;
						this.totalNum = res.data.total;
					})
					.catch((error) => {
						console.error(error);
					});
			},
			// 项目状态数据
			liveFindByStatusFn() {
				liveFindByStatus()
					.then((res) => {
						this.endNum = res.data.end;
						this.endingNum = res.data.ending;
						this.nostartNum = res.data.nostart;
						this.startedNum = res.data.started;
					})
					.catch((error) => {
						console.error(error);
					});
			},
			// 获取医院列表
			registrationAllHospitalFn() {
				registrationAllHospital()
					.then((res) => {
						this.hospitalList = res.data;
					})
					.catch((error) => {
						console.error(error);
					});

			},
			// 获取科室列表
			getDepartmentsFn() {
				getDepartments()
					.then((res) => {
						this.departmentList = res.data.department;
					})
					.catch((error) => {
						console.error("getDepartments", error);
					});
			},
			// 新增
			openModel() {
				this.$refs['dataForm'] && this.$refs['dataForm'].resetFields();
				this.dialogVisible = true;
				this.dialogTitle = "新建登记随访";
				this.dataForm = {}; // 清空 新增 form
				localStorage.getItem('searchConditionTumor') && localStorage.removeItem('searchConditionTumor');
			},

			//确定
			determine() {
				// 新增
				this.$refs['dataForm'].validate((valid) => { 
					if (valid) {
						const postData = {
							name: this.dataForm.name,
							hospitalName: this.dataForm.hospitalName,
							type: 'register', // 前瞻
						};
						registrationAddProject(postData)
							.then((res) => {
								this.$message.success("新增成功");
								this.$router.push({
									path: "/tumor/planSetUp",
									query: {
										id: res.data.id,
										type: "prospect"
									},
								});
							})
							.catch((error) => {
								this.$message.error("新增失败");
							});
						this.dialogVisible = false; 
					} else {
						this.$message.error("必填项不能为空");
						return false;
					}
				});
			},
			
			// 每页条数
			handleSizeChange(val) {
				this.pageSize = val;
				this.registrationLiveFindAllProjectFn();
			},
			
			// 页数按钮
			handleCurrentChange(val) {
				this.pageNum = val;
				console.log(`当前页: ${val}`);
				this.registrationLiveFindAllProjectFn();
			},
			
			// 关闭确认
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
// .disabledBtn{
// 	pointer-events: none;
// 	color: #ccc !important;
// }
	.num-nav {
		height: 80px;
		margin-bottom: 16px;
		background: #ffffff;

		.alltotal {
			width: 80px;
			height: 80px;
			text-align: center;
			// background: #2476c2;
			background: #2F7E7D; // 主题修改yuwen
			float: left;
			font-family: PingFang SC Bold, PingFang SC Bold-Bold;
			font-weight: 700;
			padding-top: 12px;

			.type-title {
				font-size: 14px;
			}

			.type-num {
				font-size: 24px;
				line-height: 42px;
			}
		}

		.type-box {
			float: left;
			position: relative;
			padding: 14px 0px 14px 40px;
			height: 80px;

			.type-title {
				font-size: 14px;
			}

			.type-num {
				font-size: 24px;
				line-height: 42px;
			}
		}

		.type-box:after {
			content: "";
			position: absolute;
			width: 1px;
			height: 40px;
			background: #cccccc;
			top: 22px;
			right: 0;
		}

		.type-box:last-child:after {
			content: "";
			position: absolute;
			width: 0;
			height: 0;
		}
	}

	.list-item {
		font-size: 24px;
		color: #2F7E7D;
		margin: 0 10px;
		cursor: pointer;
	}

	.list-item:hover {
		color: #2F7E7D;
	}
</style>
