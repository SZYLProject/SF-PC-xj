<template>
	<div class="SurvivalAnalyContent content">
		<div class="query-box">
			<el-form label-position="left" ref="SurvivalAnalyForm" label-width="68px" :model="SurvivalAnalyForm">
				<el-row>
					<el-col :span="8">
						<el-form-item label="确诊时间"> 
							<el-date-picker
							  v-model="p31"
							  size="mini"
							  type="daterange"
							  range-separator="至"
							  unlink-panels
							  value-format="yyyy-MM-dd"
							  start-placeholder="开始日期"
							  end-placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="医院名称">
							<el-select
								@change="hospitalChange"
								v-model="SurvivalAnalyForm.hospitalName"
								filterable
								collapse-tags
								clearable
								size="mini"
								style="margin-left: 20px;"
								placeholder="请选择">
								<el-option
								  v-for="item in hospitalList"
								  :key="item.index"
								  :label="item.data.hos"
								  :value="item.index">
								</el-option>
						  </el-select>
						</el-form-item>
						<!-- <el-form-item label="肿瘤分期">
							<el-select
								v-model="SurvivalAnalyForm.name"
								multiple
								filterable
								collapse-tags
								size="mini"
								style="margin-left: 20px;"
								placeholder="请选择肿瘤分期">
									<el-option
									v-for="item in options"
									:key="item.value"
									:label="item.label"
									:value="item.value">
									</el-option>
								</el-select>
						</el-form-item> -->
						<!-- <el-form-item label="经管医师">
							<el-select
								v-model="SurvivalAnalyForm.P434"
								filterable
								collapse-tags
								size="mini"
								style="margin-left: 20px;"
								placeholder="请选择">
									<el-option
									v-for="item in minorList"
									:key="item.index"
									:label="item.name"
									:value="item.name">
									</el-option>
							</el-select>
						</el-form-item> -->
						<el-form-item label="年龄范围">
							<el-input size="mini" v-model="SurvivalAnalyForm.beforeAge" style="width: 44%;" placeholder="最小年龄"></el-input>
							<span style="display: inline-block;width: 12%;text-align: center;">至</span>
							<el-input size="mini" v-model="SurvivalAnalyForm.afterAge" style="width: 44%;" placeholder="最大年龄"></el-input>
						</el-form-item>
						<el-form-item label="性　　别">
							<el-select
								v-model="SurvivalAnalyForm.sex"
								filterable
								collapse-tags
								clearable
								size="mini"
								style="margin-left: 20px;"
								placeholder="请选择">
									<el-option
									v-for="item in sexOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value">
									</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="出院时间">
							<el-date-picker
							  v-model="dcDate"
							  type="daterange"
							  size="mini"
							  range-separator="至"
							  unlink-panels
							  value-format="yyyy-MM-dd"
							  start-placeholder="开始日期"
							  end-placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="科室名称">
							<el-select
								v-model="SurvivalAnalyForm.departmentNames"
								filterable
								collapse-tags
								multiple
								clearable
								size="mini"
								style="margin-left: 20px;"
								placeholder="请选择科室">
									<el-option
									  v-for="item in departmentList"
									  :key="item.index"
									  :label="item.name"
									  :value="item.name">
									</el-option>
							</el-select>
						</el-form-item>
						<!-- <el-form-item label="治疗方式">
							<el-select
								v-model="SurvivalAnalyForm.na1me"
								multiple
								filterable
								collapse-tags
								size="mini"
								style="margin-left: 20px;"
								placeholder="请选择">
									<el-option
									v-for="item in options"
									:key="item.value"
									:label="item.label"
									:value="item.value">
									</el-option>
							</el-select>
						</el-form-item> -->
						<!-- <el-form-item label="年龄范围">
							<el-input size="mini" v-model="SurvivalAnalyForm.beforeAge" style="width: 44%;" placeholder="最小年龄"></el-input>
							<span style="display: inline-block;width: 12%;text-align: center;">至</span>
							<el-input size="mini" v-model="SurvivalAnalyForm.afterAge" style="width: 44%;" placeholder="最大年龄"></el-input>
						</el-form-item> -->
						
						<el-form-item label="责任医师">
							<el-select
								v-model="SurvivalAnalyForm.zrys"
								filterable
								collapse-tags
								clearable
								multiple
								size="mini"
								style="margin-left: 20px;"
								placeholder="请选择">
									<el-option
									v-for="item in majorList"
									:key="item.index"
									:label="item.name"
									:value="item.name">
									</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="随访时间">
							<el-date-picker
								v-model="followupDate"
								type="daterange"
								size="mini"
								range-separator="至"
								unlink-panels
								value-format="yyyy-MM-dd"
								start-placeholder="开始日期"
								end-placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="疾病病种">
							<el-select
								v-model="SurvivalAnalyForm.diseaseNames"
								filterable
								collapse-tags
								clearable
								multiple
								size="mini"
								style="margin-left: 20px;"
								placeholder="请选择病种">
									<el-option
									v-for="item in diseaseList"
									:key="item.index"
									:label="item.name"
									:value="item.name">
									</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="经管医师">
							<el-select
								v-model="SurvivalAnalyForm.jgys"
								filterable
								collapse-tags
								clearable
								multiple
								size="mini"
								style="margin-left: 20px;"
								placeholder="请选择">
									<el-option
									v-for="item in minorList"
									:key="item.index"
									:label="item.name"
									:value="item.name">
									</el-option>
							</el-select>
						</el-form-item>
						<!-- <el-form-item label="性别">
							<el-select
								v-model="SurvivalAnalyForm.sex"
								filterable
								collapse-tags
								size="mini"
								style="margin-left: 20px;"
								placeholder="请选择">
									<el-option
									v-for="item in sexOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value">
									</el-option>
							</el-select>
						</el-form-item> -->
					</el-col>
				</el-row>
				<el-form-item class="buttons">
					<el-button size="mini" style="width: 70px;" @click="resetForm('SurvivalAnalyForm')">重置</el-button>
					<el-button size="mini" style="width: 70px;" type="primary" @click="submitForm('SurvivalAnalyForm')">查询</el-button>
					<el-button size="mini" style="width: 70px;" type="primary" :loading="exportLoading" @click="exportForm">导出</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="query-result">
			<el-tabs v-model="activeName">
				<el-tab-pane label="生存率(寿命表法)" name="second">
				<!-- <div class="query-result"> -->
				<div>
					<el-table
					stripe
					:data="tableData"
					v-loading="loading"
					class="survial-table two-lines"
					:cell-class-name="addClass"
					style="width: 100%"
					>
					<el-table-column
						fixed
						prop="diseaseName"
						align="center"
						label="病种"
						min-width="160"
						show-overflow-tooltip
					>
					</el-table-column>
					<el-table-column
						prop="should"
						align="center"
						width="100"
						label="患者总数"
					>
					</el-table-column>
					<el-table-column
						prop="actual"
						align="center"
						width="124"
						label="实际随访人数"
					>
					</el-table-column>
					<el-table-column
						prop="vaild"
						align="center"
						width="124"
						label="有效随访人数"
					>
					</el-table-column>
					<el-table-column
						prop="vaildPercent"
						align="center"
						width="124"
						label="有效随访率"
					>
					</el-table-column>
					<el-table-column
						prop="lostNum"
						align="center"
						label="期间失访人数"
						width="124"
					>
					</el-table-column>
					<el-table-column
						prop="deathNum"
						align="center"
						width="124"
						label="期间死亡人数"
					>
					</el-table-column>
					<el-table-column
						prop="deathNumPercent"
						align="center"
						width="101"
						label="死亡率"
					>
					</el-table-column>

					<el-table-column label="生存率(寿命表法)" align="center">
						<el-table-column
						prop="death90Percent"
						align="center"
						width="80"
						label="3个月"
						>
						</el-table-column>
						<el-table-column
						prop="death180Percent"
						align="center"
						width="80"
						label="6个月"
						>
						</el-table-column>
						<el-table-column
						prop="death270Percent"
						align="center"
						width="80"
						label="9个月"
						>
						</el-table-column>
						<el-table-column
						prop="death1365Percent"
						align="center"
						width="80"
						label="12个月"
						>
						</el-table-column>
						<el-table-column
						prop="death2365Percent"
						align="center"
						width="80"
						label="24个月"
						>
						</el-table-column>
						<el-table-column
						prop="death3365Percent"
						width="80"
						align="center"
						label="36个月"
						>
						</el-table-column>
						<el-table-column
						prop="death4365Percent"
						width="80"
						align="center"
						label="48个月"
						>
						</el-table-column>
						<el-table-column
						prop="death5365Percent"
						width="80"
						align="center"
						label="60个月"
						>
						</el-table-column>
					</el-table-column>
					</el-table>
					<div class="pages-modules">
					<el-pagination
						style="float: right"
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
				</el-tab-pane>
				<el-tab-pane label="生存率(K-M算法)" name="first">
				<!-- <div class="query-result"> -->
				<div>
					<el-table
					stripe
					:data="tableDataKM"
					v-loading="loadingKM"
					class="survial-table two-lines"
					:cell-class-name="addClass"
					style="width: 100%"
					>
					<el-table-column
						fixed
						prop="diseaseName"
						align="center"
						label="病种"
						min-width="160"
						show-overflow-tooltip
					>
					</el-table-column>
					<el-table-column
						prop="should"
						align="center"
						width="100"
						label="患者总数"
					>
					</el-table-column>
					<el-table-column
						prop="actual"
						align="center"
						width="124"
						label="实际随访人数"
					>
					</el-table-column>
					<el-table-column
						prop="vaild"
						align="center"
						width="124"
						label="有效随访人数"
					>
					</el-table-column>
					<el-table-column
						prop="vaildPercent"
						align="center"
						width="124"
						label="有效随访率"
					>
					</el-table-column>
					<el-table-column
						prop="lostNum"
						align="center"
						label="期间失访人数"
						width="124"
					>
					</el-table-column>
					<el-table-column
						prop="deathNum"
						align="center"
						width="124"
						label="期间死亡人数"
					>
					</el-table-column>
					<el-table-column
						prop="deathNumPercent"
						align="center"
						width="101"
						label="死亡率"
					>
					</el-table-column>

					<el-table-column label="生存率(K-M算法)" align="center">
						<el-table-column
						prop="death90Percent"
						align="center"
						width="80"
						label="3个月"
						>
						</el-table-column>
						<el-table-column
						prop="death180Percent"
						align="center"
						width="80"
						label="6个月"
						>
						</el-table-column>
						<el-table-column
						prop="death270Percent"
						align="center"
						width="80"
						label="9个月"
						>
						</el-table-column>
						<el-table-column
						prop="death1365Percent"
						align="center"
						width="80"
						label="12个月"
						>
						</el-table-column>
						<el-table-column
						prop="death2365Percent"
						align="center"
						width="80"
						label="24个月"
						>
						</el-table-column>
						<el-table-column
						prop="death3365Percent"
						width="80"
						align="center"
						label="36个月"
						>
						</el-table-column>
						<el-table-column
						prop="death4365Percent"
						width="80"
						align="center"
						label="48个月"
						>
						</el-table-column>
						<el-table-column
						prop="death5365Percent"
						width="80"
						align="center"
						label="60个月"
						>
						</el-table-column>
					</el-table-column>
					</el-table>
					<div class="pages-modules">
					<el-pagination
						style="float: right"
						:total="currentPageTotalKM"
						:current-page="currentPageKM"
						:page-sizes="[10, 20, 30, 40]"
						@size-change="handleSizeChangeKM"
						@current-change="handleCurrentChangeKM"
						layout="total, sizes, prev, pager, next, jumper"
						background
					></el-pagination>
					</div>
				</div>
				</el-tab-pane>
			</el-tabs>
		</div>
		<!-- <div class="query-result">
			<el-table stripe
 			    :data="tableDataKM"
                v-loading="loadingKM"
				:cell-class-name="addClass"
				class="two-lines"
			    style="width:100%">
				<el-table-column
				  fixed
			      prop="diseaseName"
				  label="病种"
				  align="center"
				  min-width="160"
				  show-overflow-tooltip>
			    </el-table-column>
				<el-table-column
				  prop="should"
				  align="center"
				  width="124"
				  label="患者总数">
				</el-table-column>
				<el-table-column
				  prop="actual"
				  align="center"
				  width="124"
				  label="实际随访人数">
				</el-table-column>
				<el-table-column
				  prop="vaild"
				  align="center"
				  width="124"
				  label="有效随访人数">
				</el-table-column>
				<el-table-column
			      prop="vaildPercent"
				  align="center"
				  width="124"
			      label="有效随访率">
			    </el-table-column>
				<el-table-column
				  prop="lostNum"
				  align="center"
				  label="期间失访人数"
				  width="124">
				</el-table-column> 
				<el-table-column
				  prop="deathNum"
				  align="center"
				   width="124"
				  label="期间死亡人数">
				</el-table-column>
				<el-table-column
				  prop="deathNumPercent"
				  align="center"
				  width="131"
				  label="死亡率">
				</el-table-column>
				
			    <el-table-column label="生存率(K-M算法)" align="center">
					<el-table-column
						prop="death90Percent"
						align="center"
						width="80"
						label="3个月">
					</el-table-column> 
			        <el-table-column
			          prop="death180Percent"
					  align="center"
					  width="80"
			          label="6个月">
			        </el-table-column>
					<el-table-column
			          prop="death270Percent"
					  align="center"
					  width="80"
			          label="9个月">
			        </el-table-column>
			        <el-table-column
			          prop="death1365Percent"
					  align="center"
					  width="80"
			          label="12个月">
			        </el-table-column>
			        <el-table-column
			          prop="death2365Percent"
					  align="center"
					  width="80"
			          label="24个月">
			        </el-table-column>
			        <el-table-column
			          prop="death3365Percent"
					  align="center"
					  width="80"
			          label="36个月">
			        </el-table-column> 
					<el-table-column
					  prop="death4365Percent"
					  align="center"
					  width="80"
					  label="48个月">
					</el-table-column>
					<el-table-column
					  prop="death5365Percent"
					  align="center"
					  width="80"
					  label="60个月">
					</el-table-column>
			    </el-table-column>
			  </el-table>
			<div class="pages-modules">
				<el-pagination
					style="float: right"
					:total="currentPageTotalKM"
					:current-page="currentPageKM"
					:page-sizes="[10, 20, 30, 40]"
					@size-change="handleSizeChangeKM"
					@current-change="handleCurrentChangeKM"
					layout="total, sizes, prev, pager, next, jumper"
					background
				></el-pagination>
			</div>
		</div>
		<div class="query-result">
			<el-table stripe
 			    :data="tableData"
                v-loading="loading"
				:cell-class-name="addClass"
				class="two-lines"
			    style="width:100%">
				<el-table-column
				  fixed
			      prop="diseaseName"
				  label="病种"
				  align="center"
				  min-width="160"
				  show-overflow-tooltip>
			    </el-table-column>
				<el-table-column
				  prop="should"
				  align="center"
				  width="124"
				  label="患者总数">
				</el-table-column>
				<el-table-column
				  prop="actual"
				  align="center"
				  width="124"
				  label="实际随访人数">
				</el-table-column>
				<el-table-column
				  prop="vaild"
				  align="center"
				  width="124"
				  label="有效随访人数">
				</el-table-column>
				<el-table-column
			      prop="vaildPercent"
				  align="center"
				  width="124"
			      label="有效随访率">
			    </el-table-column>
				<el-table-column
				  prop="lostNum"
				  align="center"
				  label="期间失访人数"
				  width="124">
				</el-table-column> 
				<el-table-column
				  prop="deathNum"
				  align="center"
				   width="124"
				  label="期间死亡人数">
				</el-table-column>
				<el-table-column
				  prop="deathNumPercent"
				  align="center"
				  width="131"
				  label="死亡率">
				</el-table-column>
				
			    <el-table-column label="生存率(寿命表法)" align="center">
					<el-table-column
						prop="death90Percent"
						align="center"
						width="80"
						label="3个月">
					</el-table-column> 
			        <el-table-column
			          prop="death180Percent"
					  align="center"
					  width="80"
			          label="6个月">
			        </el-table-column>
					<el-table-column
			          prop="death270Percent"
					  align="center"
					  width="80"
			          label="9个月">
			        </el-table-column>
			        <el-table-column
			          prop="death1365Percent"
					  align="center"
					  width="80"
			          label="12个月">
			        </el-table-column>
			        <el-table-column
			          prop="death2365Percent"
					  align="center"
					  width="80"
			          label="24个月">
			        </el-table-column>
			        <el-table-column
			          prop="death3365Percent"
					  align="center"
					  width="80"
			          label="36个月">
			        </el-table-column> 
					<el-table-column
					  prop="death4365Percent"
					  align="center"
					  width="80"
					  label="48个月">
					</el-table-column>
					<el-table-column
					  prop="death5365Percent"
					  align="center"
					  width="80"
					  label="60个月">
					</el-table-column>
			    </el-table-column>
			  </el-table>
			<div class="pages-modules">
				<el-pagination
					style="float: right"
					:total="currentPageTotal"
					:current-page="currentPage"
					:page-sizes="[10, 20, 30, 40]"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					layout="total, sizes, prev, pager, next, jumper"
					background
				></el-pagination>
			</div>
		</div> -->

		<!-- <div class="life_table_method">
			<el-form>
				<el-form-item label="疾病病种">
				<el-select
					v-model="lifeTableMethodDisease"
					filterable
					size="mini"
					placeholder="请选择病种"
					@change="lifeTableMethodDiseaseChange"
				>
					<el-option
					v-for="item in diseaseList"
					:key="item.index"
					:label="item.name"
					:value="item.name"
					>
					</el-option>
				</el-select>
				</el-form-item>
			</el-form>
			<el-table
				v-loading="lifeTableMethodloading"
				stripe
				:data="lifeTableMethodTableData"
				style="width: 100%"
			>
				<el-table-column
				prop="number"
				label="序号"
				align="center"
				></el-table-column>
				<el-table-column
				prop="month"
				label="确诊后月数"
				align="center"
				></el-table-column>
				<el-table-column
				prop="lost"
				label="期内截尾人数"
				align="center"
				></el-table-column>
				<el-table-column
				prop="death"
				label="期内死亡人数"
				align="center"
				></el-table-column>
				<el-table-column
				prop="actual"
				label="期初观察人数"
				align="center"
				></el-table-column>
				<el-table-column
				prop="normal"
				label="校正人数"
				align="center"
				></el-table-column>
				<el-table-column
				prop="deathPercent"
				label="死亡概率"
				align="center"
				></el-table-column>
				<el-table-column
				prop="surPercent"
				label="生存概率"
				align="center"
				></el-table-column>
				<el-table-column
				prop="percent"
				label="生存率"
				align="center"
				></el-table-column>
			</el-table>
		</div> -->
	</div>
</template>

<script>
	import { parseTime } from "@/utils/index.js";
	import { getHospitals,getDiseaseName ,getP433,getP434,SurvivalConditionAnalysis,SurvivalConditionAnalysisKM,exportBySur,exportByKM,lifeTableMethod } from "@/api/tumor/tumorFollowup";
	export default {
		name: "TumorStatisticAnaly",
		data() {
			const end = new Date();
			const start = new Date();
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
			return {
				activeName: 'second',
				exportLoading: false,
				loading: false,
				loadingKM: false,
				dcDate: ['',''],
				followupDate: ['',''],
				p31: ['',''],
				postHospitalName: '',
				SurvivalAnalyForm: {
					hospitalName: "",
					departmentNames: [],
					sex: "",
					beforeAge: "",
					afterAge: '',
					beforeDcDate: '',
					afterDcDate: '',
					beforeFollowupDate: '',
					afterFollowupDate: '',
					beforeP31: '',
					afterP31: '',
					diseaseNames: [],
					zrys: [],
					jgys: [],
				},
				lifeTableMethodloading: true,
				lifeTableMethodDisease: "",
				lifeTableMethodTableData: [],
				value:'',
				sexOptions: [{
				  value: 1,
				  label: '男'
				},{
				  value: 2,
				  label: '女'
				},{
				  value: 0,
				  label: '未知'
				}],
				options: [{
				  value: '选项1',
				  label: '选项1'
				}],
				hospitalList: [],
				departmentList: [],
				diseaseList: [],
				majorList: [],
				minorList: [],
				
				tableData:[],
				tableDataKM:[],
				// 分页数据
				currentPage: 1,
				currentPageSize: 10,
				currentPageTotal: 0,
				// 分页数据
				currentPageKM: 1,
				currentPageSizeKM: 10,
				currentPageTotalKM: 0,
			}
		},
		created() {
			this.getHospitalsFn();
			this.getDiseaseNameFn();
			this.getP433Fn();
			this.getP434Fn();
			this.SurvivalConditionAnalysisFn();
			this.SurvivalConditionAnalysisFnKM();
		},
		methods: {
			// 寿命表法table-病种改变
			lifeTableMethodDiseaseChange(val) {
				console.log(val);
				this.getlifeTableMethod();
			},
			// 寿命表法table
			getlifeTableMethod() {
				this.lifeTableMethodloading = true;
				const postData = {
					diseaseNames: [this.lifeTableMethodDisease],
				};
				lifeTableMethod(postData).then((res) => {
					console.log("寿命表法table", res);
					this.lifeTableMethodTableData = res.data;
					this.lifeTableMethodloading = false;
				});
			},
			addClassAssist(val){
				if (parseFloat(val) >= 50) {
					return "survival-color_50";
				}
				if (parseFloat(val) < 30) {
					return "survival-color_30";
				}
				if (parseFloat(val) >= 30 && parseFloat(val) < 50) {
					return "survival-color_30-50";
				}
			},
			// 修改单元格样式
			addClass({ row, column, rowIndex, columnIndex }) {
				return false;
				let val = null;
				if(columnIndex === 8){
					val = row.death90Percent;
				}
				if(columnIndex === 9){
					val = row.death180Percent;
				}
				if(columnIndex === 10){
					val = row.death270Percent;
				}
				if(columnIndex === 11){
					val = row.death1365Percent;
				}
				if(columnIndex === 12){
					val = row.death2365Percent;
				}
				if(columnIndex === 13){
					val = row.death3365Percent;
				}
				if(columnIndex === 14){
					val = row.death4365Percent;
				}
				if(columnIndex === 15){
					val = row.death5365Percent;
				}
				return this.addClassAssist(val)
			},
			// 获取列表
			SurvivalConditionAnalysisFn(){
				const postData = {
					page: this.currentPage,
					pageSize: this.currentPageSize,
					...this.SurvivalAnalyForm,
					hospitalName: this.postHospitalName,
					beforeDcDate: parseTime(this.dcDate[0],"{y}-{m}-{d}"),
					afterDcDate: parseTime(this.dcDate[1],"{y}-{m}-{d}"),
					beforeFollowupDate: parseTime(this.followupDate[0],"{y}-{m}-{d}"),
					afterFollowupDate: parseTime(this.followupDate[1],"{y}-{m}-{d}"),
					beforeP31: parseTime(this.p31[0],"{y}-{m}-{d}"),
					afterP31: parseTime(this.p31[1],"{y}-{m}-{d}"),
				};
				console.log(postData)
        		this.loading = true
				SurvivalConditionAnalysis(postData).then((res) => {
					console.log('获取列表',res);
					this.tableData = res.data.list;
					this.currentPageTotal = res.data.total;
					this.loading = false
				})
			},
			// 获取列表-KM
			SurvivalConditionAnalysisFnKM(){
				const postData = {
					page: this.currentPageKM,
					pageSize: this.currentPageSizeKM,
					...this.SurvivalAnalyForm,
					hospitalName: this.postHospitalName,
					beforeDcDate: parseTime(this.dcDate[0],"{y}-{m}-{d}"),
					afterDcDate: parseTime(this.dcDate[1],"{y}-{m}-{d}"),
					beforeFollowupDate: parseTime(this.followupDate[0],"{y}-{m}-{d}"),
					afterFollowupDate: parseTime(this.followupDate[1],"{y}-{m}-{d}"),
					beforeP31: parseTime(this.p31[0],"{y}-{m}-{d}"),
					afterP31: parseTime(this.p31[1],"{y}-{m}-{d}"),
				};
				console.log(postData)
        		this.loadingKM = true
				SurvivalConditionAnalysisKM(postData).then((res) => {
					console.log('获取列表',res);
					this.tableDataKM = res.data.list;
					this.currentPageTotalKM = res.data.total;
					this.loadingKM = false
				})
			},
			// 条件查询
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.currentPage = 1;
						this.SurvivalConditionAnalysisFn();
						this.SurvivalConditionAnalysisFnKM();
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//导出
			exportForm(){
				const postData = {
					page: this.currentPage,
					pageSize: this.currentPageSize,
					...this.SurvivalAnalyForm,
					hospitalName: this.postHospitalName,
					beforeDcDate: parseTime(this.dcDate[0],"{y}-{m}-{d}"),
					afterDcDate: parseTime(this.dcDate[1],"{y}-{m}-{d}"),
					beforeFollowupDate: parseTime(this.followupDate[0],"{y}-{m}-{d}"),
					afterFollowupDate: parseTime(this.followupDate[1],"{y}-{m}-{d}"),
					beforeP31: parseTime(this.p31[0],"{y}-{m}-{d}"),
					afterP31: parseTime(this.p31[1],"{y}-{m}-{d}"),
				};
				console.log(5555555,postData)
				this.exportLoading = true;
				this.activeName === 'first' ?
				exportByKM(postData).then((res) => {
					this.exportFormAssist(res);
				}).catch(err => {
					this.exportLoading = false;
				}) :
				exportBySur(postData).then((res) => {
					this.exportFormAssist(res);
				}).catch(err => {
					this.exportLoading = false;
				});
			},
			//导出-辅助fn
			exportFormAssist(res) {
			    const timeNow = parseTime(new Date(), "{y}{m}{d}{h}{i}{s}");
				var blob = new Blob([res], {
					type:
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
				}); // 以二进制形式存储，并转化为xlsx类型的Excel
				var downloadElement = document.createElement("a");
				var href = window.URL.createObjectURL(blob); // 创建下载的链接
				downloadElement.href = href;
				downloadElement.download = "生存随访生存情况分析生存率" + (this.activeName === 'first' ? 'K-M算法' : '寿命表法') + timeNow + ".xlsx"; // 下载后文件名
				document.body.appendChild(downloadElement);
				downloadElement.click(); // 点击下载
				document.body.removeChild(downloadElement); // 下载完成移除元素
				window.URL.revokeObjectURL(href); // 释放掉blob对象
				this.exportLoading = false;
			},
			// get医院科室
			getHospitalsFn(){
				getHospitals().then((res) => {
					this.hospitalList = res.data.reduce((t,e,i) => {
						t.push({data:e,index:i})
						return t;
					},[])
				})
			},
			// 医院切换赋值科室
			hospitalChange(value){
				// if(typeof value === 'string')return false;
				this.postHospitalName = this.hospitalList[value]?.data.hos || '';
				this.departmentList = this.hospitalList[value]?.data.deps.reduce((t,e,i) => {
					t.push({name:e,index:i})
					return t;
				},[]);
			},
			// get病种
			getDiseaseNameFn(){
				getDiseaseName().then((res) => {
					this.diseaseList = res.data.reduce((t,e,i) => {
						t.push({name:e,index:i})
						return t;
					},[])
					this.lifeTableMethodDisease = this.diseaseList[0].name;
        			// this.getlifeTableMethod();
				})
			},
			// get责任医师
			getP433Fn(){
				getP433().then((res) => {
					this.majorList = res.data.reduce((t,e,i) => {
						t.push({name:e,index:i})
						return t;
					},[])
				})
			},
			// get经管医师
			getP434Fn(){
				getP434().then((res) => {
					this.minorList = res.data.reduce((t,e,i) => {
						t.push({name:e,index:i})
						return t;
					},[])
				})
			},
			// 重值
			resetForm(formName) {
				// console.log(formName)
				// this.$refs[formName].resetFields();
				this.SurvivalAnalyForm = this.$options.data().SurvivalAnalyForm;
				this.dcDate = ['',''];
				this.followupDate = ['',''];
				this.p31 = ['',''];
			},
			// 分页
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.currentPageSize = val;
				this.SurvivalConditionAnalysisFn();
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.currentPage = val;
				this.SurvivalConditionAnalysisFn();
			},
			// 分页
			handleSizeChangeKM(val) {
				console.log(`每页 ${val} 条`);
				this.currentPageSizeKM = val;
				this.SurvivalConditionAnalysisFnKM();
			},
			handleCurrentChangeKM(val) {
				console.log(`当前页: ${val}`);
				this.currentPageKM = val;
				this.SurvivalConditionAnalysisFnKM();
			},
			
		},
	}
</script>

<style>
	.SurvivalAnalyContent .el-date-editor .el-range-separator{
		width: 10%;
	}
	.survival-color_30-50{
		background: rgba(189,109,222,0.75);
	}
	.survival-color_30{
		background: rgba(189,109,222,0.5);
	}
	.survival-color_50{
		background: #BD6DDE;
	}
	.SurvivalAnalyContent .el-table tbody tr { 
		pointer-events: none;
	}
</style>

<style lang="scss" scoped>
	.SurvivalAnalyContent{
		.query-box{
			background-color: #fff;
			padding: 40px 20px;
			
			.el-range-editor.el-input__inner{
				width: 100%; 
			}
			
			.el-select{
				width: 100%;
				margin: 0 !important;
			}
			
			.buttons{
				margin-top: 29px;
				text-align: center;
			}
		}
		
		.query-result{
			padding: 20px;
			margin-top: 10px;
			background-color: #fff;
			
			.buttons{
				width: 100%; 
				
				i.fr{
					padding: 20px;
					color: #2476C2;
					font-weight: bold;
				}
			}
		}
		.life_table_method {
			padding: 20px;
			margin-top: 10px;
			background-color: #fff;
		}
	}
</style>
