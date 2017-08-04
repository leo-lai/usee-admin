<template>
  <div>
    <el-tabs v-model="tabIndex" type="card" @tab-click="tabClick">
      <el-tab-pane label="电影活动">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="24" class="l-text-right">
            <el-form ref="filterForm-0" :model="filters[0]" :rules="filterRules" :inline="true">
              <el-form-item>
                <el-button type="primary" @click="movie.visible = true">发布新电影活动</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        
        <!--列表-->
        <el-table :data="list[0].data" highlight-current-row v-loading="list[0].loading" >
          <el-table-column align="center" type="index" label="#" width="80"></el-table-column>
          <el-table-column prop="projectName" label="电影名称" min-width="200"></el-table-column>
          <el-table-column align="center" prop="prefix" label="标识券码" min-width="100"></el-table-column>
          <el-table-column align="center" prop="maxNumber" label="总票数" width="100"></el-table-column>
          <el-table-column align="center" prop="minNumber" label="可抢票数" width="100"></el-table-column>
          <el-table-column align="center" prop="reserveNumber" label="可派票数" width="100"></el-table-column>
          <el-table-column align="center" prop="usefulTime" label="有效时间" min-width="150"></el-table-column>
          <el-table-column align="center" prop="systemUserCreateName" label="发布人" min-width="100"></el-table-column>
          <el-table-column align="center" prop="createDate" label="发布时间" min-width="150"></el-table-column>
          <el-table-column align="center" prop="projectState" label="状态" min-width="100">
            <template scope="scope">
              <span class="l-text-ok" v-if="scope.row.projectState === 0">已上架</span>
              <span class="l-text-error" v-if="scope.row.projectState === 1">已下架</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="150">
            <template scope="scope">
              <div v-if="scope.row.projectState === 0">
                <el-button size="mini" type="primary" @click="eidtMovie(scope.row)">编辑</el-button>
                <el-button size="mini" @click="sendMovieDialog(scope.row)">派券</el-button>
                <el-button size="mini" type="danger" @click="cancelMovie(scope.row)">下架</el-button>
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
      <el-tab-pane label="领取结果">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="24">
            <el-form ref="filterForm-1" :model="filters[1]" :rules="filterRules" :inline="true">
              <el-form-item label="领券方式">
                <el-select placeholder="领券方式" style="width:150px;" v-model="filters[1].getTicketWay" @change="getList(1)">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="本人抢券" value="1"></el-option>
                  <el-option label="系统派券" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="审核状态">
                <el-select placeholder="审核状态" style="width:150px;" v-model="filters[1].projectState" @change="getList(1)">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="未核销" value="0"></el-option>
                  <el-option label="已核销" value="1"></el-option>
                  <el-option label="已作废" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 350px;" v-model="filters[1].searchKey" >
                  <el-select slot="prepend" placeholder="搜索类型" v-model="filters[1].searchType">
                    <el-option label="手机号码" value="phone"></el-option>
                    <el-option label="活动名称" value="projectName"></el-option>
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
        </el-row>
        
        <!--列表-->
        <el-table :data="list[1].data" highlight-current-row v-loading="list[1].loading" >
          <el-table-column align="center" type="index" label="#" width="80"></el-table-column>
          <el-table-column prop="projectName" label="电影名称" min-width="150"></el-table-column>
          <el-table-column align="center" prop="number" label="券码" min-width="100"></el-table-column>
          <el-table-column align="center" prop="userName" label="领取人" min-width="100"></el-table-column>
          <el-table-column align="center" prop="phone" label="领取人电话" min-width="100"></el-table-column>
          <el-table-column align="center" prop="getTicketWay" label="领取方式" width="100">
            <template scope="scope">
              <span v-if="scope.row.getTicketWay === 1">本人抢券</span>
              <span v-if="scope.row.getTicketWay === 2">系统派送</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createDate" label="领取时间" width="110"></el-table-column>
          <el-table-column align="center" prop="remarks" label="备注" width="200"></el-table-column>
          <el-table-column align="center" prop="projectState" label="状态" min-width="100">
            <template scope="scope">
              <span class="l-text-ok" v-if="scope.row.projectState === 0">未核销</span>
              <span class="l-text-error" v-if="scope.row.projectState === 1">已核销</span>
              <span class="l-text-error" v-if="scope.row.projectState === 2">已作废</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="verificationUserName" label="核销人" min-width="100"></el-table-column>
          <el-table-column align="center" prop="verificationDate" label="核销时间" width="110"></el-table-column>
          <el-table-column label="操作" align="center" min-width="120">
            <template scope="scope">
              <el-button size="small" v-if="scope.row.projectState === 0" @click="cancelTicket(scope.row)">作废</el-button>
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
              :current-page="list[1].page"
              :page-sizes="[10, 50, 100, 200, 500, 1000]"
              :page-size="list[1].rows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="list[1].total">
            </el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="电影节活动信息" custom-class="l-dialog" :visible.sync="movie.visible" :before-close="closeMovieDialog" :close-on-press-escape="false" :close-on-click-modal="false" size="tiny">
      <el-form :model="movie.form" :rules="movie.rules" ref="movieForm" label-width="100px" style="margin-right: 1rem;">
        <el-form-item label="活动名称" prop="projectName">
          <el-input v-model="movie.form.projectName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="活动简介" prop="projectBrief">
          <el-input type="textarea" v-model="movie.form.projectBrief" :autosize="{ minRows: 1, maxRows: 4}" placeholder="" :maxlength="500"></el-input>
        </el-form-item>
        <el-form-item label="活动图片" prop="projectImage">
          <el-upload ref="agentUpload" name="img_file" class="avatar-uploader" :action="$api.baseUrl + '/uploadImage'" 
            :show-file-list="false" :on-success="uploadSuccess" :on-error="uploadError" :before-upload="uploadBefore">
            <img v-if="movie.form.projectImage" :src="$utils.image.thumb(movie.form.projectImage, 100, 100)" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              <p v-show="uploading" class="l-text-hot"><i class="el-icon-loading"></i>&nbsp;图片上传中...</p>
              <p>图片尺寸750x375，且不超过1M</p>
            </div>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="是否上架" prop="projectState" style="display: inline-block; width:200px;">
          <el-switch :width="70" on-text="上架" on-value="0" off-text="下架" off-value="1" v-model="movie.form.projectState"></el-switch>
        </el-form-item> -->
        <el-form-item label="票券有效期" prop="usefulTime">
          <el-date-picker v-model="movie.form.usefulTime" @change="timeChange" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择时间" :editable="false" ></el-date-picker>
        </el-form-item>
        <el-form-item label="标识券码" prop="prefix" style="display: inline-block; width:200px;">
          <el-input v-model="movie.form.prefix" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="总票数" prop="maxNumber" style="display: inline-block; width:200px;">
          <el-input-number class="l-input-number" :controls="false" :min="0" :max="9999999" v-model.number="movie.form.maxNumber"></el-input-number>
        </el-form-item>
        <el-form-item label="可抢票数" prop="minNumber" style="display: inline-block; width:200px;">
          <el-input-number class="l-input-number" :controls="false" :min="0" :max="9999999" v-model.number="movie.form.minNumber"></el-input-number>
        </el-form-item>
        <el-form-item label="可派票数" prop="reserveNumber" style="display: inline-block; width:200px;">
          <el-input-number class="l-input-number" :controls="false" :min="0" :max="9999999" v-model.number="movie.form.reserveNumber"></el-input-number>
        </el-form-item>
        <el-form-item label="活动地址" prop="address">
          <el-input v-model="movie.form.address" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="活动备注" prop="remarks">
          <el-input type="textarea" v-model="movie.form.remarks" :autosize="{ minRows: 1, maxRows: 4}" placeholder="" :maxlength="500"></el-input>
        </el-form-item>
        <el-form-item class="l-text-right">
          <el-button @click="closeMovieDialog">取消</el-button>
          <el-button type="primary" :disabled="movie.submiting" @click="addMovie">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    
    <el-dialog title="派券" custom-class="l-dialog" :visible.sync="send.visible" :close-on-press-escape="false" :close-on-click-modal="false" size="tiny">
      <el-form :model="send.form" :rules="send.rules" ref="sendForm" label-width="100px" style="margin-right: 1rem;">
        <el-form-item label="派券数量" prop="reserveNumber" style="display: inline-block; width:200px;">
          <el-input-number class="l-input-number" :controls="false" :min="1" :max="9999999" v-model.number="send.form.reserveNumber"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input type="textarea" v-model="send.form.remarks" :autosize="{ minRows: 1, maxRows: 4}" placeholder="" :maxlength="500"></el-input>
        </el-form-item>
        <el-form-item class="l-text-right">
          <el-button @click="send.visible = false">取消</el-button>
          <el-button type="primary" @click="sendMovie">确定派券</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uploading: false,
      tabIndex: '0',
      movie: {
        visible: false,
        submiting: false,
        usefulTime: '',
        rules: {
          projectName: [{
            required: true,
            message: '请输入活动名称',
            trigger: 'blur'
          }],
          projectBrief: [{
            required: true,
            message: '请输入活动简介',
            trigger: 'blur'
          }],
          projectImage: [{
            required: true,
            message: '请上传活动图片',
            trigger: 'change'
          }],
          prefix: [{
            required: true,
            message: '请输入标识券码',
            trigger: 'change'
          }],
          maxNumber: [
            {required: true, message: '请输入总票数'},
            {type: 'number', message: '必须为数字值'}
          ],
          minNumber: [
            {required: true, message: '请输入可抢票数'},
            {type: 'number', message: '必须为数字值'}
          ],
          reserveNumber: [
            {required: true, message: '请输入可派票数'},
            {type: 'number', message: '必须为数字值'}
          ],
          usefulTime: [{
            required: true,
            message: '请选择票券有效期时间',
            trigger: 'change'
          }],
          address: [{
            required: true,
            message: '请输入活动地址',
            trigger: 'blur'
          }]
        },
        form: {
          projectName: '',
          projectBrief: '',
          projectImage: '',
          prefix: '',
          maxNumber: '',
          minNumber: '',
          reserveNumber: '',
          usefulTime: '',
          remarks: '',
          projectState: '0',
          address: ''
        } 
      },
      filterRules:{
        searchKey: [],
        getTicketWay: []
      },
      filters: [
        {

        },{
          searchKey: '',
          searchType: 'projectName',
          getTicketWay: '',
          projectState: ''
        }
      ],
      list: [
        {
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
        }
      ],
      send: {
        visible: false,
        rules: {
          reserveNumber: [
            {required: true, message: '请输入派券数量'},
            {type: 'number', message: '必须为数字值'}
          ]
        },
        form: {
          projectId: '',
          reserveNumber: 0,
          remarks: ''
        }
      }
    }
  },
  methods: {
    uploadSuccess(response, file, fileList) {
      this.uploading = false
      this.movie.form.projectImage = response.data
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
      const isLt2M = file.size / 1024 / 1024 < 1

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!')
      }

      if (isJPG && isLt2M) {
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

      this.list[index] && this.list[index].data.length === 0 && this.getList()
      this.$router.replace('?tab=' + index)
    },
    timeChange(dateValue) {
      this.movie.form.usefulTime = dateValue
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
        promise = this.$api.movie.getList(formData, page, list.rows)
      }else{
        promise = this.$api.movie.getTickets(formData, page, list.rows)
      }

      promise.then(({data})=>{
        list.total = data.total
        list.page = data.page
        list.rows = data.rows
        if(this.tabIndex == 0){
          list.data = Object.freeze(data.projects)
        }else{
          list.data = Object.freeze(data.tickets)
        }
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
    closeMovieDialog(done) {
      this.movie.form.newsId = ''
      this.movie.form.newsContent = ''
      this.$refs.movieForm.resetFields()
      if(this.movie.change){
        this.getList()
      }
      this.$nextTick(()=>{
        this.$utils.isFunction(done) && done()
        this.movie.visible = false
      })
    },
    eidtMovie(row) {
      this.movie.form = Object.assign(this.movie.form, row)
      this.movie.form.projectState += ''
      this.movie.visible = true
    },
    addMovie() {
      this.$refs.movieForm.validate((valid) => {
        if (valid) {
          this.movie.submiting = true
          let loading = this.$loading()
          this.$api.movie.edit(this.movie.form).then(({data}) => {
            this.movie.submiting = true
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.movie.change = true
            this.closeMovieDialog()
          }).finally(() => {
            this.movie.submiting = false
            loading.close()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    sendMovieDialog(row) {
      this.send.form.projectId = row.projectId
      this.send.visible = true
    },
    sendMovie() {
      let loading = this.$loading()
      this.$api.movie.send(this.send.form).then(({data}) => {
        this.$message({
          type: 'success',
          message: '派券成功'
        })
        this.send.visible = false
        this.getList()
      }).finally(()=>{
        loading.close()
      })
    },
    cancelMovie(row) {
      let loading = this.$loading()
      this.$api.movie.cancel(row.projectId).then(()=>{
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.getList()
      }).finally(()=>{
        loading.close()
      })
    },
    cancelTicket(row) {
      let loading = this.$loading()
      this.$api.movie.cancelTicket(row.ticketsId).then(()=>{
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.getList()
      }).finally(()=>{
        loading.close()
      })
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
.l-input-number{vertical-align: middle; width: 100%; }
.l-areaInfo{
  a{color: #20a0ff;cursor: pointer;}
  a:hover{text-decoration: underline;}
  td{vertical-align: top; padding: 10px;}
  ul{margin:0; padding: 0; list-style: none;}
  li{margin: 10px 0; width: 350px;}
}
</style>