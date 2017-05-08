<template>
  <div class="l-agent">
    <el-tabs v-model="tabIndex" type="card" @tab-click="tabClick">
      <el-tab-pane label="区域合伙人">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="20">
            <el-form ref="filterForm-0" :model="filters[0]" :rules="filterRules" :inline="true">
              <el-form-item label="加入日期" prop="dateRange">
                <el-date-picker type="daterange" placeholder="选择日期范围" :editable="false" v-model="filters[0].dateRange" :picker-options="pickerOptions" @change="search"></el-date-picker>
              </el-form-item>
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 400px;" v-model="filters[0].searchKey" @blur="search">
                  <el-select slot="prepend" placeholder="搜索类型" v-model="filters[0].searchType">
                    <el-option label="手机号码" value="phoneNumber"></el-option>
                    <el-option label="合伙人名称" value="agentInfoName"></el-option>
                  </el-select>
                  <el-button slot="append" icon="search" @click="search"></el-button>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button @click="clearFilter">清除过滤</el-button>
                  <el-button @click="refreshList">刷新列表</el-button>
                </el-button-group>  
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4" class="l-text-right">
            <el-form :inline="true">
              <el-form-item>
                <el-button type="primary" @click="openAgentDialog(1)">新增合伙人</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        
        <!--列表-->
        <el-table :data="agentList[0].data" highlight-current-row v-loading="agentList[0].loading" @selection-change="sltChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="#" width="55"></el-table-column>
          <el-table-column prop="agentInfoName" label="姓名" min-width="120"></el-table-column>
          <el-table-column prop="phoneNumber" label="联系方式" min-width="120"></el-table-column>
          <el-table-column prop="area" label="代理区域" min-width="150"></el-table-column>
          <el-table-column prop="numberOfPeople" label="客户人数" align="center" width="100"></el-table-column>
          <el-table-column prop="accumulatedIncome" label="累计收益" align="center" width="120"></el-table-column>
          <el-table-column prop="accountBalance" label="账户余额" align="center" width="120"></el-table-column>
          <el-table-column prop="followNumber" label="关联合伙人" align="center" width="120"></el-table-column>
          <el-table-column prop="becomeAgentDate" label="加入日期" min-width="150"></el-table-column>  
          <el-table-column label="订单状态" align="center" min-width="120">
            <template scope="scope">
              <span class="l-text-error" v-if="scope.row.isFrozen">账户冻结</span>
              <span class="l-text-ok" v-else>正常使用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="150" align="center">
            <template scope="scope">
              <el-button size="small" type="text" @click="editAgentInfo(scope.row.agentInfoId)">编辑</el-button>
              <!-- <el-button size="small">查看二维码</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <!--列表 end-->

        <!--分页-->
        <el-row class="l-toolbar"  type="flex" align="middle">
          <el-col :span="4">
            <span class="l-text-gray">共{{agentList[0].total}}条记录</span>
          </el-col>
          <el-col :span="20" class="l-text-right">
            <el-pagination layout="prev, pager, next" @current-change="pageChange" :page-size="20" :total="agentList[0].total">
            </el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="小U店员">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="20">
            <el-form ref="filterForm-1" :model="filters[1]" :rules="filterRules" :inline="true">
              <el-form-item label="加入日期" prop="dateRange">
                <el-date-picker type="daterange" placeholder="选择日期范围" :editable="false" v-model="filters[1].dateRange" :picker-options="pickerOptions" @change="search"></el-date-picker>
              </el-form-item>
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 400px;" v-model="filters[1].searchKey" @blur="search">
                  <el-select slot="prepend" placeholder="搜索类型" v-model="filters[1].searchType">
                    <el-option label="手机号码" value="phoneNumber"></el-option>
                    <el-option label="合伙人名称" value="agentInfoName"></el-option>
                  </el-select>
                  <el-button slot="append" icon="search" @click="search"></el-button>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button @click="clearFilter">清除过滤</el-button>
                  <el-button @click="refreshList">刷新列表</el-button>
                </el-button-group>  
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4" class="l-text-right">
          </el-col>
        </el-row>
        
        <!--列表-->
        <el-table :data="agentList[1].data" highlight-current-row v-loading="agentList[1].loading" @selection-change="sltChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="#" width="55"></el-table-column>
          <el-table-column prop="agentInfoName" label="姓名" min-width="120" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="phoneNumber" label="联系方式" min-width="120"></el-table-column>
          <el-table-column prop="numberOfPeople" label="客户人数" align="center" min-width="100"></el-table-column>
          <el-table-column prop="accumulatedIncome" label="累计收益" align="center" min-width="120"></el-table-column>
          <el-table-column prop="accountBalance" label="账户余额" align="center" min-width="120"></el-table-column>
          <el-table-column prop="becomeAgentDate" label="加入日期" min-width="150"></el-table-column>  
          <!-- <el-table-column label="订单状态" align="center" min-width="120">
            <template scope="scope">
              <span class="l-text-error" v-if="scope.row.isFrozen">账户冻结</span>
              <span class="l-text-ok" v-else>正常使用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="150" align="center">
            <template scope="scope">
              <el-button size="small" type="text" @click="editAgentInfo(scope.row.agentInfoId)">编辑</el-button>
              <el-button size="small">查看二维码</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <!--列表 end-->

        <!--分页-->
        <el-row class="l-toolbar"  type="flex" align="middle">
          <el-col :span="4">
            <span class="l-text-gray">共{{agentList[1].total}}条记录</span>
          </el-col>
          <el-col :span="20" class="l-text-right">
            <el-pagination layout="prev, pager, next" @current-change="pageChange" :page-size="20" :total="agentList[1].total">
            </el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <!--合伙人信息-->
    <el-dialog title="合伙人信息" ref="agentDialog" custom-class="l-dialog" @close="closeAgentDialog" :close-on-click-modal="false" v-model="agentInfo.visible">
      <el-tabs v-model="agentInfo.tabIndex">
        <el-tab-pane label="基本信息">
          <el-form ref="agentForm" :model="agentForm" :rules="agentRules" :inline="true" class="l-agent-info" label-width="100px">
            <el-form-item label="合伙人姓名" prop="agentInfoName">
              <el-input v-model="agentForm.agentInfoName"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phoneNumber">
              <el-input v-model="agentForm.phoneNumber" :maxlength="11" :disabled="agentInfo.type == 2"></el-input>
            </el-form-item>
            <el-form-item label="合伙人单位" prop="agentCompany" class="l-input-block">
              <el-input v-model="agentForm.agentCompany"></el-input>
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicenseImage">
              <el-upload ref="agentUpload" name="img_file" class="avatar-uploader"
                :action="$api.baseUrl + '/uploadImage'"
                :show-file-list="false" :on-progress="uploadProgress"
                :on-success="uploadSuccess" :on-error="uploadError" 
                :before-upload="uploadBefore">
                <img v-if="agentForm.businessLicenseImage" :src="$utils.image.thumb(agentForm.businessLicenseImage, 100, 100)" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">
                  <p v-show="uploading" class="l-text-hot"><i class="el-icon-loading"></i>&nbsp;图片上传中...</p>
                  <p><el-button v-if="agentForm.businessLicenseImage" @click="agentInfo.preview = true" type="text">查看大图</el-button></p>
                  <p>只能上传jpg/png文件，且不超过2M</p>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="初始库存" prop="goodsStock" >
              <el-input v-model="agentForm.goodsStock" placeholder="" :disabled="agentInfo.type == 2"></el-input>
            </el-form-item>
            <el-form-item label="" >
              <span class="l-text-error"> 注意：库存一经保存，将不可更改。 </span>
            </el-form-item>
            <el-form-item label="推荐码" prop="recommendAgentCode">
              <el-input v-model="agentForm.recommendAgentCode" placeholder="选填"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remarks" class="l-input-block">
              <el-input v-model="agentForm.remarks" placeholder="选填"></el-input>
            </el-form-item>
            <el-form-item class="l-input-block" style="margin-left:100px;">
              <el-button type="primary" @click.native.prevent="submitAgentForm('agentForm')" :loading="agentInfo.submiting">
                &nbsp;&nbsp;保存信息&nbsp;&nbsp;
              </el-button>
              
              <!-- <el-button class="l-margin-l" @click.native.prevent="resetAgentForm('agentForm')">
                &nbsp;&nbsp;重置&nbsp;&nbsp;
              </el-button> -->
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="代理区域">
          <table class="l-agent-list">
            <tr>
              <th>序号</th>
              <th>省市区</th>
            </tr>
            <tr v-for="(item,index) in agentInfoAreas">
              <td>代理区域{{index+1}}</td>
              <td>{{item.province + (item.city === item.province ? '' : item.city) + item.area}}</td>
            </tr>
            <tr>
              <td colspan="2" class="l-text-center"><el-button type="primary" @click="addAgentArea">添加代理区域</el-button></td>
            </tr>
          </table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 代理区域 -->
    <el-dialog v-model="agentInfoArea.visible" size="tiny" :close-on-click-modal="false">
      <el-form :inline="true" label-width="80px">
        <el-form-item label="代理区域">
          <el-cascader placeholder="请选择代理区域" v-model="cityDataSlted" :options="cityData" :props="{label: 'text'}" filterable ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="agentInfoArea.loading" @click="saveAgentArea">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog v-model="agentInfo.preview" size="tiny">
      <img width="100%" :src="agentForm.businessLicenseImage" alt="">
    </el-dialog>
  </div>
</template>

<script>
import cityData from 'src/scripts/city.data'
export default {
  data() {
    return {
      cityData,
      cityDataSlted: [],

      uploading: false,
      agentInfo: {
        type: 1,
        tabIndex: '0',
        preview: false,
        submiting: false,
        visible: false,
        loading: false
      },
      agentForm: {
        goodsStock: '',
        agentInfoId: '',
        agentInfoName: '',
        phoneNumber: '',
        agentCompany: '',
        businessLicenseImage: '',
        recommendAgentCode: '',
        remarks: ''
      },
      agentRules: {
        agentInfoName: [
          { required: true, message: '请输入合伙人姓名', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        agentCompany: [
          { required: true, message: '请选择合伙人单位', trigger: 'blur' }
        ],
        businessLicenseImage: [
          { required: true, message: '请上传营业执照', trigger: 'change' }
        ],
        goodsStock: [
          { required: true, message: '请填写初始库存', trigger: 'change' },
          { pattern: /\d{1,8}/, message: '请正确填写库存', trigger: 'blur' }
        ]
      },

      agentInfoAreas: [],
      agentInfoArea: {
        visible: false,
        loading: false
      },

      tabIndex: '0',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      agentList: [{
        loading: false,
        data: [],
        slteds: [],
        page: 1,
        total: 0
      },{
        loading: false,
        data: [],
        slteds: [],
        page: 1,
        total: 0
      }],

      filterRules:{
        searchKey: [],
        dateRange: []
      },
      filters:[{
        searchKey: '',
        searchType: 'phoneNumber',
        dateRange: [],
        startDate: '',
        finishDate: ''
      },{
        searchKey: '',
        searchType: 'phoneNumber',
        dateRange: [],
        startDate: '',
        finishDate: ''
      }]
    }
  },
  methods: {
    uploadProgress(event, file, fileList) {
      console.log(event, file, fileList)
    },
    uploadSuccess(response, file, fileList) {
      this.uploading = false
      this.agentForm.businessLicenseImage = response.data
    },
    uploadError(response, file, fileList) {
      this.$message({
        type: 'error',
        message: '图片上传失败'
      })
    },
    uploadBefore(file) {
      // const isJPG = file.type === 'image/jpeg'
      const isJPG = true
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }

      if(isJPG && isLt2M){
        this.uploading = true
      }
      return isJPG && isLt2M
    },

    tabClick(tab, event) {
      this.tabInit(this.tabIndex)
    },
    tabInit(index){
      if(index){
        this.tabIndex = index 
      }else{
        index = this.tabIndex  
      }

      this.agentList[index] && this.agentList[index].data.length === 0 && this.getAgentList()
      this.$router.replace('?tab=' + index)
    },
    sltChange(slteds) {
      this.agentList[this.tabIndex].slteds = slteds
    },
    pageChange(page) {
      this.getAgentList(page)
    },
    clearFilter() {
      this.$refs['filterForm-' + this.tabIndex].resetFields()
      this.getAgentList()
    },
    refreshList() {
      this.getAgentList()
    },
    search() {
      this.getAgentList()
    },
    getAgentList(page = 1) {
      let index = this.tabIndex
      let agentList = this.agentList[index]
      let filter = this.filters[index]
      let formData = {}

      if(filter){
        filter.searchType && (formData[filter.searchType] = filter.searchKey)
        formData.startDate = filter.dateRange[0] ? filter.dateRange[0].format('yyyy-MM-dd') : ''
        formData.finishDate = filter.dateRange[1] ? filter.dateRange[1].format('yyyy-MM-dd') : ''  
      }

      formData.isPartner = this.tabIndex == 0 ? 1 : 0
      
      agentList.loading = true
      this.$api.agent.getList(formData, page, agentList.rows).then(({data})=>{
        agentList.total = data.total
        agentList.page = data.page
        agentList.rows = data.rows
        agentList.data = data.agentInfos
      }).finally(()=>{
        agentList.loading = false
      })
    },
    addAgentArea() {
      if(!this.agentForm.agentInfoId){
        this.$message('请先保存合伙人基本信息')
        this.agentInfo.tabIndex = '0'
        return
      }
      this.agentInfoArea.visible = true
    },
    saveAgentArea() {
      if(this.cityDataSlted.length === 0){
        this.$message('请选择代理区域')
        return
      }
      this.agentInfoArea.loading = true
      this.$api.agent.addArea({
        agentInfoId: this.agentForm.agentInfoId,
        provinceId: this.cityDataSlted[0],
        cityId: this.cityDataSlted[1],
        areaId: this.cityDataSlted[2]
      }).then(({data})=>{
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.cityDataSlted = []
        this.agentInfoAreas.push(data)
        this.agentInfoArea.visible = false
        this.$refs.agentDialog.close()
      }).finally(()=>{
        this.agentInfoArea.loading = false
      })
    },
    openAgentDialog(type = 1) {
      this.agentInfo.type = type
      this.agentInfo.visible = true
      this.agentInfo.tabIndex = '0'
    },
    closeAgentDialog(){
      this.agentInfo.visible = false
      this.agentInfoAreas = []
      this.resetAgentForm()
      if(this.agentInfo.submited){
        this.getAgentList(this.agentList[this.tabIndex].page)
      }
    },
    resetAgentForm() {
      this.agentForm.agentInfoId = ''
      this.$refs.agentForm.resetFields()
      this.$refs.agentUpload.clearFiles()  
    },
    editAgentInfo(agentInfoId) {
      if(!agentInfoId){
        this.$message('代理商ID为空')
        return
      }

      let loading = this.$loading()
      this.$api.agent.getInfo(agentInfoId).then(({data})=>{
        this.agentInfo.submited = false
        this.openAgentDialog(2)
        if(data){
          this.$nextTick(()=>{
            this.agentInfoAreas = data.agentInfoAreas
            Object.keys(this.agentForm).forEach((key)=>{
              this.agentForm[key] = data[key]
            }) 
          })
        }
      }).finally(()=>{
        loading.close()
      })
    },
    submitAgentForm(formName) {
      this.$refs.agentForm.validate((valid) => {
        if (valid) {
          this.agentInfo.submiting = true
          this.$api.agent.addOrEdit(this.agentForm).then(({data})=>{
            this.agentInfo.submited = true
            if(data){
              this.agentForm.agentInfoId = data
              this.$message({
                type: 'success',
                message: '保存合伙人信息成功'
              })
              this.agentInfo.tabIndex = '1'
            }else{
              this.$message({
                type: 'error',
                message: '保存合伙人信息失败'
              })
            }
          }).finally(()=>{
            this.agentInfo.submiting = false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    }
  },
  mounted() {
    this.tabInit(this.$route.query.tab)
  }
}
</script>
<style scoped>
.avatar-uploader .el-upload{
  cursor: pointer;
  position: relative;
  overflow: hidden;
  position: relative;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader .el-upload__tip {
  display: inline-block;
  vertical-align: middle;
  margin-left: 15px;
  line-height: 1;
}
.avatar-uploader .avatar, .avatar-uploader-icon {
  border-radius: 5px;
  border:1px solid #bfcbd9;
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  vertical-align: middle;
}
</style>
<style lang="scss">
.l-agent-list{
  border: 1px solid #dfe6ec; border-collapse:collapse; width: 700px; margin: 20px 50px;
  th,td{ border-bottom: 1px solid #dfe6ec; padding: 10px 20px; text-align: left;}
  th{
    background-color: #eef1f6;
  }
}
.l-agent-info{
  max-width: 700px; margin:30px auto;
}
.l-input-block{
  .el-form-item__content{
    width: 498px;
    max-width: 100%;
  }
}
.l-agent{
  .el-select .el-input {
    width: 120px;
  }
}
</style>