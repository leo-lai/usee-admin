<template>
  <div>
    <el-tabs v-model="tabIndex" type="card" @tab-click="tabClick">
      <el-tab-pane label="门店列表">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="24" class="l-text-right">
            <el-form ref="filterForm-0" :model="filters[0]" :rules="filterRules" :inline="true">
              <el-form-item>
                <el-button type="primary" @click="store.visible = true">新增线下门店</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        
        <!--列表-->
        <el-table :data="list[0].data" highlight-current-row v-loading="list[0].loading" >
          <el-table-column align="center" type="index" label="#" width="80"></el-table-column>
          <el-table-column prop="storeName" label="门店名称" min-width="120"></el-table-column>
          <el-table-column align="center" prop="phoneNumber" label="联系电话" min-width="100"></el-table-column>
          <el-table-column align="center" label="所在地区" min-width="130">
            <template scope="scope">
              <div :title="scope.row.address">
                {{scope.row.province + scope.row.city + scope.row.area}}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="userAgentName" label="关联小U" min-width="100"></el-table-column>
          <el-table-column align="center" prop="exploitMarketersName" label="拓店人员" width="150"></el-table-column>
          <el-table-column align="center" prop="serviceMarketersName" label="对接服务人员" width="150"></el-table-column>
          <el-table-column align="center" prop="exploitDate" label="加入时间" min-width="150"></el-table-column>
          <el-table-column align="center" prop="storeState" label="状态" min-width="100">
            <template scope="scope">
              <span class="l-text-ok" v-if="scope.row.storeState === 0">正常</span>
              <span class="l-text-error" v-if="scope.row.storeState === 1">已禁用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="100">
            <template scope="scope">
              <div v-if="scope.row.storeState == 0">
                <el-button size="mini" type="primary" @click="eidtStore(scope.row)">编辑</el-button>
                <el-button size="mini" @click="disableStore(scope.row)">禁用</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--列表 end-->

        <!--分页-->
        <el-row class="l-toolbar"  type="flex" align="middle">
          <el-col :span="4">
          </el-col>
          <el-col :span="20" class="l-text-right">
            <el-pagination
              @size-change="sizeChange"
              @current-change="pageChange"
              :current-page="list[0].page"
              :page-sizes="[10, 50, 100, 200, 500, 1000]"
              :page-size="list[0].rows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="list[0].total">
            </el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="门店信息" custom-class="l-dialog" :visible.sync="store.visible" :before-close="closeStoreDialog" :close-on-press-escape="false" :close-on-click-modal="false" size="small" >
      <el-form :model="store.form" :rules="store.rules" ref="storeForm" label-width="100px" style="width: 800px; margin:0 auto;">
        <el-form-item label="门店名称" prop="storeName" style="display:inline-block;">
          <el-input v-model="store.form.storeName" style="width: 155px;" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="门店电话" prop="phoneNumber" style="display:inline-block;">
          <el-input v-model="store.form.phoneNumber" style="width: 120px;" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="绑定小U" prop="userAgentId" style="display:inline-block;">
          <el-input v-model="store.form.userAgentName" :readonly="true" style="display:inline-block;width:120px;"></el-input>
          <el-button @click="addPeople(1)">更改/选择</el-button>
        </el-form-item>
        <el-form-item label="门店介绍" prop="storeBrief">
          <el-input type="textarea" v-model="store.form.storeBrief" :autosize="{ minRows: 1, maxRows: 4}" placeholder="" :maxlength="500"></el-input>
        </el-form-item>
        <el-form-item label="所在地区" prop="address">
          <el-cascader ref="storeRegion" style="width:39%;" placeholder="请选择门店区域" 
            v-model="store.citySlted" :options="cityData" :props="{label: 'text', value: 'value'}"></el-cascader>
          <el-input style="width:60%;" placeholder="请输入门店详细地址(不需要填写省市区)" v-model="store.form.address" :maxlength="100"></el-input>  
        </el-form-item>
        <el-form-item label="经度" prop="longitude" style="display:inline-block;">
          <el-input v-model="store.form.longitude" placeholder="" style="width: 162px;"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude" style="display:inline-block;">
          <el-input v-model="store.form.latitude" placeholder="" style="width: 162px;"></el-input>
        </el-form-item>
        <el-form-item label="合同有效期" style="display:inline-block;" prop="timeRange">
          <el-date-picker v-model="store.contractStartDate" type="date" placeholder="开始日期"> </el-date-picker>
          <span style="margin: 0 10px;">至</span>
          <el-date-picker v-model="store.contractEndDate" type="date" placeholder="结束日期"> </el-date-picker>
        </el-form-item>
        <el-form-item label="是否线上显示" prop="isShowOnLine" style="display: inline-block; width:200px;" label-width="150px">
          <el-switch :width="70" on-text="显示" on-value="1" off-text="不显示" off-value="0" v-model="store.form.isShowOnLine"></el-switch>
        </el-form-item>

        <el-form-item label="门店图片(最多9张)" prop="images">
          <label slot="label">门店图片<br><span class="l-fs-xs l-text-error">(最多9张)</span></label>
          <el-upload ref="imageUpload" accept="image/*" name="img_file" :action="$api.baseUrl + '/uploadImage'"list-type="picture-card" :file-list="store.images" :multiple="true" :on-change="uploadChange"
            :before-upload="uploadBefore" :on-success="uploadSuccess" :on-preview="uploadPreview" :on-remove="uploadRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="拓店人员" prop="exploitMarketersId">
          <div class="l-like-ipt" style="width: 80%;">
            <el-tag :key="item.exploitMarketersId" v-for="item in store.exploitMarketers" :closable="true" @close="removePeople(2, item.exploitMarketersId)">
              {{item.exploitMarketersName}}
            </el-tag>
          </div>
          <el-button style="vertical-align:middle;" @click="addPeople(2)">更改/选择</el-button>
        </el-form-item>
        <el-form-item label="服务人员" prop="serviceMarketersId">
          <div class="l-like-ipt" style="width: 80%;">
            <el-tag :key="item.serviceMarketersId" v-for="item in store.serviceMarketers" :closable="true" @close="removePeople(3, item.serviceMarketersId)">
              {{item.serviceMarketersName}}
            </el-tag>
          </div>
          <el-button style="vertical-align:middle;" @click="addPeople(3)">更改/选择</el-button>
        </el-form-item>

        <el-form-item class="l-text-center">
          <el-button @click="closeStoreDialog">取消</el-button>
          <el-button type="primary" :disabled="store.submiting" @click="addStore">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    
    <!-- 新增人员 -->
    <el-dialog :title="people.title" custom-class="l-dialog" :visible.sync="people.visible" size="tiny">
      <el-row type="flex" :gutter="10" align="middle">
        <el-col :span="4">手机号码</el-col>
        <el-col :span="14">
          <el-input v-model="people.form.phoneNumber" :maxlength="11" placeholder="请输入手机号码"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="getPeople" :loading="people.loading">查询用户</el-button>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="10" align="middle" class="l-margin-tb-m">
        <el-col :span="4">用户姓名</el-col>
        <el-col :span="14">{{people.userName}}</el-col>
        <el-col :span="6"></el-col>
      </el-row>
      <el-row type="flex" justify="center" class="l-margin-t">
        <el-col :span="24" class="l-text-center">
          <el-button :loading="people.submiting" @click="addPeopleOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog v-model="imagePreview.visible" size="tiny">
      <img width="100%" :src="imagePreview.url" alt="">
    </el-dialog>
  </div>
</template>

<script>
import cityData from 'src/scripts/city.data'

export default {
  data() {
    let validateAddress = (rule, value, callback) => {
      if (this.store.citySlted.length === 0) {
        callback(new Error('请选择门店区域'))
      }else if(!this.store.form.address){
        callback(new Error('请输入门店详细地址'))
      }else{
        this.store.form.provinceId = this.store.citySlted[0]
        this.store.form.cityId = this.store.citySlted[1]
        this.store.form.areaId = this.store.citySlted[2]

        this.store.form.province = this.$refs.storeRegion.currentLabels[0]
        this.store.form.city = this.$refs.storeRegion.currentLabels[1]
        this.store.form.area = this.$refs.storeRegion.currentLabels[2]
        callback()
      }
    }

    let validateTimeRange = (rule, value, callback) => {
      if (!this.store.contractStartDate) {
        // callback(new Error('请选择合同开始时间'))
      }else if(!this.store.contractEndDate){
        // callback(new Error('请选择合同结束时间'))
      }else{
        
      }

      this.store.form.contractStartDate = this.store.contractStartDate.format ? this.store.contractStartDate.format('yyyy-MM-dd') : this.store.contractStartDate
      this.store.form.contractEndDate = this.store.contractEndDate.format ? this.store.contractEndDate.format('yyyy-MM-dd') : this.store.contractEndDate
      callback()
    }

    return {
      cityData,
      tabIndex: '0',
      imagePreview: {
        visible: false,
        url: ''
      },
      people: {
        type: 1, // 1小U  2拓展人员 3服务人员
        visible: false,
        loading: false,
        submiting: false,
        title: '选择人员',
        userId: '',
        userName: '',
        form: {
          phoneNumber: '',
        }
      },
      store: {
        visible: false,
        submiting: false,
        uploading: false,
        images: [],
        imageLength: 0,
        citySlted: [],
        exploitMarketers: [],
        serviceMarketers: [],
        contractStartDate: '',
        contractEndDate: '',
        rules: {
          storeName: [{required: true, message: '请输入门店名称', trigger: 'blur'}],
          phoneNumber: [{required: true, message: '请输入门店电话', trigger: 'blur'}],
          userAgentId: [{required: true, type: 'number', message: '请请选择绑定小U', trigger: 'change'}],
          // storeBrief: [{required: true, message: '请输入门店介绍', trigger: 'blur'}],
          address: [{required: true, validator: validateAddress, trigger: 'change'}],
          timeRange: [{required: false, validator: validateTimeRange, trigger: 'change'}],
          // longitude: [{required: true, message: '请输入门店位置经度', trigger: 'blur'}],
          // latitude: [{required: true, message: '请输入门店位置纬度', trigger: 'blur'}],
          // images: [{required: true, message: '请上传门店图片', trigger: 'change'}],
          exploitMarketersId: [{required: true, message: '请选择拓店人员', trigger: 'change'}],
          serviceMarketersId: [{required: true, message: '请选择服务人员', trigger: 'change'}],
        },
        form: {
          storeName: '',
          phoneNumber: '',
          userAgentId: '',
          userAgentName: '',
          storeBrief: '',
          provinceId: '',
          province: '',
          cityId: '',
          city: '',
          areaId: '',
          area: '',
          address: '',
          longitude: '',
          latitude: '',
          contractStartDate: '',
          contractEndDate: '',
          isShowOnLine: '1',
          images: '',
          exploitMarketersId: '',
          exploitMarketersName: '',
          serviceMarketersId: '',
          serviceMarketersName: '',
        } 
      },
      filterRules:{
        searchKey: [],
        getTicketWay: []
      },
      filters: [],
      list: [
        {
          loading: false,
          data: [],
          slteds: [],
          page: 1,
          total: 0
        }
      ]
    }
  },
  methods: {
    uploadSuccess(response, file, fileList) {
      file.orgin = response.data
      file.url = this.$utils.image.thumb(response.data, 150, 150)
      this.store.form.images = fileList.map(item => item.orgin).join(',')
      this.store.imageLength = fileList.length

      if(fileList.every(item => !!item.orgin)){
        this.store.uploading = false
      }
    },
    uploadChange(file, fileList) {
      this.store.imageLength = fileList.length
      // console.log(file)
      // if(this.store.imageLength >= 10){
      //   console.log(fileList)
      //   this.$refs.imageUpload.submit()
      // }
    },
    uploadBefore(file) {
      let hasLength = this.store.imageLength

      const isLt2M = file.size / 1024 / 1024 < 2
      const isImage = file.type ? /^image\/.+$/i.test(file.type) : false
      const isLimit = ++hasLength > 10
      const result = isLt2M && isImage 

      if (!isImage) {
        this.$message.error('请上传图片文件')
        return false
      }

      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB')
        return false
      }

      if(isLimit){
        this.$message.error('不能超过9张图片')
        // return false
      }
      
      if (result) {
        this.store.uploading = true
      }
      return result
    },
    uploadPreview(file) {
      let url = file.orgin || file.url
      let loading = this.$loading()
      let promise = new Promise((resolve, reject)=>{
        let img = new Image()
        img.onload = resolve
        img.onerror = reject
        img.src = url
      })

      promise.then((img)=>{
        this.imagePreview.url = url  
        this.imagePreview.visible = true
      }).finally(()=>{
        loading.close()
      })
    },
    uploadRemove(file, fileList) {
      this.store.form.images = fileList.map(item=>item.orgin).join(',')
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

      this.list[index] && this.list[index].data.length === 0 && this.getList()
      this.$router.replace('?tab=' + index)
    },
    sltChange(slteds) {
      this.list[this.tabIndex].slteds = slteds
    },
    sizeChange(size = 200) {
      this.list[this.tabIndex].rows = size
      this.getList()
    },
    pageChange(page) {
      this.getList(page)
    },
    getList(page = 1) {
      let index = this.tabIndex
      let list = this.list[index]
      let filter = this.filters[index]
      let formData = {}

      if(filter){
        filter.searchType && (formData[filter.searchType] = filter.searchKey)
        formData.getTicketWay = filter.getTicketWay
        formData.projectState = filter.projectState
      }
      
      list.loading = true
      let promise
      if(this.tabIndex == 0){
        promise = this.$api.store.getList(formData, page, list.rows)
      }else{
      
      }

      promise.then(({data})=>{
        list.total = data.total
        list.page = data.page
        list.rows = data.rows
        list.data = Object.freeze(data.agentInfos)
      }).finally(()=>{
        list.loading = false
      })
    },
    clearFilter() {
      this.$refs['filterForm-' + this.tabIndex].resetFields()
      this.getList()
    },
    refreshList() {
      this.getList(this.list[this.tabIndex].page)
    },
    search() {
      this.getList()
    },
    closeStoreDialog(done) {
      this.store.form.storeId = ''
      this.$refs.storeForm.resetFields()
      if(this.store.change){
        this.store.change = false
        this.getList()
      }
      this.$nextTick(()=>{
        this.$utils.isFunction(done) && done()
        this.store.visible = false
      })
    },
    disableStore(row) {
      let loading = this.$loading()
      this.$api.store.disable({storeId: row.storeId, storeState: 1}).then(()=>{
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getList()
      }).finally(()=>{
        loading.close()
      })
    },
    eidtStore(row) {
      this.store.form = Object.assign(this.store.form, row)
      this.store.form.isShowOnLine += ''
      this.store.citySlted = [row.provinceId+'', row.cityId+'', row.areaId+'']

      // 门店图片

      this.store.images = row.images ? 
      row.images.split(',').map((item)=>{
        return {
          url: this.$utils.image.thumb(item, 150, 150),
          orgin: item
        }
      }) : []
      this.store.imageLength = this.store.images.length

      // 拓店人员
      if(row.exploitMarketersId){
        let exploitMarketersId = row.exploitMarketersId.split(',')
        let exploitMarketersName = row.exploitMarketersName.split(',')
        this.store.exploitMarketers = exploitMarketersId.map((item,index)=>{
          return {
            exploitMarketersId: item,
            exploitMarketersName: exploitMarketersName[index]
          }
        })
      }

      // 服务人员
      if(row.serviceMarketersId){
        let serviceMarketersId = row.serviceMarketersId.split(',')
        let serviceMarketersName = row.serviceMarketersName.split(',')
        this.store.serviceMarketers = serviceMarketersId.map((item,index)=>{
          return {
            serviceMarketersId: item,
            serviceMarketersName: serviceMarketersName[index]
          }
        }) 
      }
      
      // 合同日期
      row.contractStartDate && (this.store.contractStartDate = new Date(row.contractStartDate))
      row.contractEndDate && (this.store.contractEndDate = new Date(row.contractEndDate))

      this.store.visible = true
    },
    addStore() {
      if(this.store.form.images && this.store.form.images.split(',').length > 9){
        this.$message.error('只能上传9张图片！')
        return
      }

      if(this.store.uploading){
        this.$message.error('请等待图片上传完毕！')
        return
      }
      this.$refs.storeForm.validate((valid) => {
        if (valid) {
          this.store.submiting = true
          let loading = this.$loading()
          this.$api.store.edit(this.store.form).then(({data}) => {
            this.store.submiting = true
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.store.change = true
            this.closeStoreDialog()
          }).finally(() => {
            this.store.submiting = false
            loading.close()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addPeople(type = 1) {
      this.people.type = type
      this.people.userId = ''
      this.people.userName = ''
      switch(type){
        case 1:
          this.people.title = '选择绑定小U'
          break
        case 2:
          this.people.title = '选择拓店人员'
          break
        case 3:
          this.people.title = '选择服务人员'
          break
      }
      this.people.visible = true
    },
    addPeopleOk() {
      if(!this.people.userId){
        this.$message({
          type: 'info',
          message: '请先查询用户'
        })
        return
      }
      switch(this.people.type){
        case 1:
          this.store.form.userAgentId = this.people.userId
          this.store.form.userAgentName = this.people.userName
          break
        case 2:
          if(!this.store.exploitMarketers.some(item => item.exploitMarketersId === this.people.userId)){
            this.store.exploitMarketers.push({
              exploitMarketersId: this.people.userId,
              exploitMarketersName: this.people.userName
            })
          }
          this.store.form.exploitMarketersId = this.store.exploitMarketers.map(item => item.exploitMarketersId).join(',')
          this.store.form.exploitMarketersName = this.store.exploitMarketers.map(item => item.exploitMarketersName).join(',')
          break
        case 3:
          if(!this.store.serviceMarketers.some(item => item.serviceMarketersId === this.people.userId)){
            this.store.serviceMarketers.push({
              serviceMarketersId: this.people.userId,
              serviceMarketersName: this.people.userName
            })
          }
          this.store.form.serviceMarketersId = this.store.serviceMarketers.map(item => item.serviceMarketersId).join(',')
          this.store.form.serviceMarketersName = this.store.serviceMarketers.map(item => item.serviceMarketersName).join(',')
          break
      }

      this.people.visible = false  
    },
    getPeople() {
      this.people.loading = true
      switch(this.people.type){
        case 1:
          this.$api.store.getXiaoU(this.people.form).then(({data})=>{
            this.people.userId = data.userAgentId
            this.people.userName = data.userAgentName
          }).finally(()=>{
            this.people.loading = false
          })
          break
        case 2:
        case 3:
          this.$api.store.getMarketers(this.people.form).then(({data})=>{
            this.people.userId = data.marketersId
            this.people.userName = data.marketersName
          }).finally(()=>{
            this.people.loading = false
          })
          break
      }
    },
    removePeople(type = 2, id = '') {
      switch(type){
        case 2:
          this.store.exploitMarketers = this.store.exploitMarketers.filter(item => item.exploitMarketersId !== id)
          this.store.form.exploitMarketersId = this.store.exploitMarketers.map(item=>item.exploitMarketersId).join(',')
          this.store.form.exploitMarketersName = this.store.exploitMarketers.map(item=>item.exploitMarketersName).join(',')
          break
        case 3:
          this.store.serviceMarketers = this.store.serviceMarketers.filter(item => item.serviceMarketersId !== id)
          this.store.form.serviceMarketersId = this.store.serviceMarketers.map(item=>item.serviceMarketersId).join(',')
          this.store.form.serviceMarketersName = this.store.serviceMarketers.map(item=>item.serviceMarketersName).join(',')
          break
      }
    }
  },
  mounted() {
    this.tabInit(this.$route.query.tab)
  }
}
</script>
<style>
.el-form-item__error{white-space: nowrap;}
</style>
<style scoped lang="scss">
.l-like-ipt{
  display: inline-block; border: 1px solid #bfcbd9;padding: 0 5px; height: 34px; line-height: 32px;
  border-radius: 4px; vertical-align: middle;
  .el-tag{margin: 0 5px;}
}
</style>