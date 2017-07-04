<template>
  <div>
    <el-tabs v-model="tabIndex" type="card" @tab-click="tabClick">
      <el-tab-pane label="文章管理">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="24" class="l-text-right">
            <el-form :inline="true">
              <el-form-item>
                <el-button type="primary" @click="news.visible = true">发布文章</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        
        <!--列表-->
        <el-table :data="list[0].data" highlight-current-row v-loading="list[0].loading" >
          <el-table-column align="center" type="index" label="#" width="80"></el-table-column>
          <el-table-column prop="newsTitle" label="文章标题" min-width="200"></el-table-column>
          <el-table-column align="center" prop="newsType" label="类型" min-width="100">
            <template scope="scope">
              <span v-if="scope.row.newsType == 1">企业动态</span>
              <span v-else-if="scope.row.newsType == 2">护眼知识</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="isShare" label="代理商可否分享" min-width="100">
            <template scope="scope">
              <span v-if="scope.row.isShare == 1">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="published" label="网页显示时间" min-width="200"></el-table-column>
          <el-table-column align="center" prop="systemUsersName" label="发布人" min-width="120"></el-table-column>
          <el-table-column align="center" prop="updateDate" label="发布时间" min-width="120"></el-table-column>
          <el-table-column align="center" prop="isDelete" label="状态" min-width="120">
            <template scope="scope">
              <span class="l-text-error" v-if="scope.row.isDelete">未上线</span>
              <span class="l-text-ok" v-else>已上线</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="120">
            <template scope="scope">
              <el-button v-if="scope.row.isDelete" size="small" type="success" @click="delNews(scope.row, 0)">上线</el-button>
              <el-button v-else size="small" type="danger" @click="delNews(scope.row, 1)">下线</el-button>
              <el-button size="small" type="primary" @click="eidtNews(scope.row)">编辑</el-button>
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

    <el-dialog title="文章信息" custom-class="l-dialog" :visible.sync="news.visible" :before-close="closeNewsDialog" :close-on-press-escape="false" :close-on-click-modal="false" size="small">
      <el-form :model="news.form" :rules="news.rules" ref="newsForm" label-width="100px" style="margin-right: 1rem;">
        <el-form-item label="文章标题" prop="newsTitle">
          <el-input v-model="news.form.newsTitle" placeholder="不超过20个字"></el-input>
        </el-form-item>
        <el-form-item label="文章类型" prop="newsType" style="display: inline-block;">
          <el-select v-model="news.form.newsType" placeholder="请选择" style="width: 125px;">
            <el-option label="企业动态" value="1" ></el-option>
            <el-option label="护眼知识" value="2" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间" prop="published" style="display: inline-block;">
          <el-date-picker v-model="news.form.published" @change="timeChange" type="datetime" placeholder="选择时间" :editable="false" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
        <el-form-item label="代理商是否可分享" label-width="160px" prop="isShare" style="display: inline-block;">
          <el-switch on-text="" off-text="" v-model="news.form.isShare"></el-switch>
        </el-form-item>
        <el-form-item label="缩略图" prop="newsMinImage">
          <el-upload ref="agentUpload" name="img_file" class="avatar-uploader" :action="$api.baseUrl + '/uploadImage'" 
            :show-file-list="false" :on-success="uploadSuccess" :on-error="uploadError" :before-upload="uploadBefore">
            <img v-if="news.form.newsMinImage" :src="$utils.image.thumb(news.form.newsMinImage, 100, 100)" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              <p v-show="uploading" class="l-text-hot"><i class="el-icon-loading"></i>&nbsp;图片上传中...</p>
              <p>图片尺寸100x100，且不超过100k</p>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="文章摘要" prop="newsDescribe">
          <el-input type="textarea" v-model="news.form.newsDescribe" placeholder="不超过100个字" :maxlength="120"></el-input>
        </el-form-item>
        <el-form-item label="文章内容" prop="newsContent">
          <vue-editor :content="news.form.newsContent"  @change="updateContent" :height="300" :z-index="1000" :auto-height="false" :show-module-name="false"></vue-editor>
        </el-form-item>
        <el-form-item label="文章备注" prop="remarks">
          <el-input v-model="news.form.remarks" placeholder="（选填）不会在网页显示" :maxlength="200"></el-input>
        </el-form-item>
        <el-form-item class="l-text-right">
          <el-button @click="closeNewsDialog">取消</el-button>
          <el-button type="primary" :disabled="news.submiting" @click="addNews">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import VueHtml5Editor from 'vue-html5-editor'
import EditorConfig from 'src/scripts/editor-config'

const VueEditor = new VueHtml5Editor(EditorConfig)

export default {
  components: {
    VueEditor
  },
  data() {
    return {
      uploading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      tabIndex: '0',
      news: {
        visible: false,
        submiting: false,
        published: '',
        rules: {
          newsTitle: [{
            required: true,
            message: '请输入文章标题',
            trigger: 'blur'
          }],
          newsType: [{
            required: true,
            message: '请选择文章类型',
            trigger: 'change'
          }],
          published: [{
            required: true,
            message: '请选择发布时间',
            trigger: 'change'
          }],
          newsDescribe: [{
            required: true,
            message: '请填写文章摘要',
            trigger: 'blur'
          }],
          newsContent: [{
            required: true,
            message: '请填写文章内容',
            trigger: 'blur'
          }]
        },
        form: {
          newsTitle: '',
          newsContent: '',
          newsDescribe: '',
          newsMinImage: '',
          published: '',
          remarks: '',
          newsType: '',
          isShare: false
        } 
      },
      filters: [],
      newsType: [],
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
      this.uploading = false
      this.news.form.newsMinImage = response.data
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
    typeFormat(row, column) {
      let type = ''
      this.newsType.some((item)=>{
        if(item.newsTypeId == row.newsType){
          type = item.newsTypeName
          return true
        }
      })
      return type
    },
    timeChange(dateValue) {
      this.news.form.published = dateValue
    },
    updateContent(content) {
      this.news.form.newsContent = content
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
        formData.startDate = filter.dateRange[0] ? filter.dateRange[0].format('yyyy-MM-dd') : ''
        formData.finishDate = filter.dateRange[1] ? filter.dateRange[1].format('yyyy-MM-dd') : '' 
      }
      
      list.loading = true
      let promise
      if(this.tabIndex == 0){
        promise = this.$api.news.getList(formData, page, list.rows)
      }else{

      }

      promise.then(({data})=>{
        list.total = data.total
        list.page = data.page
        list.rows = data.rows
        list.data = Object.freeze(data.websiteNews)
        this.newsType = data.constitutionType
        this.news.form.newsSort = data.total + 1
      }).finally(()=>{
        list.loading = false
      })
    },
    closeNewsDialog(done) {
      this.news.form.newsId = ''
      this.news.form.newsContent = ''
      this.$refs.newsForm.resetFields()
      if(this.news.change){
        this.getList()
      }
      this.$nextTick(()=>{
        this.$utils.isFunction(done) && done()
        this.news.visible = false
      })
    },
    eidtNews(row) {
      let loading = this.$loading()
      this.$api.news.getInfo(row.newsId).then(({data})=>{
        data.newsType +=  ''
        data.isShare = !!data.isShare
        this.news.form = Object.assign(this.news.form, data)
        this.news.visible = true
      }).finally(()=>{
        loading.close()
      })
    },
    addNews() {
      this.$refs.newsForm.validate((valid) => {
        if (valid) {
          this.news.submiting = true
          this.news.form.isShare = Number(this.news.form.isShare)
          this.$api.news.edit(this.news.form).then(({data}) => {
            this.news.submiting = true
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.news.change = true
            this.closeNewsDialog()
          }).finally(() => {
            this.news.submiting = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    delNews(row, isDelete = 0) {
      this.$api.news.del(row.newsId, isDelete).then(({data}) => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.getList()
      })
    }
  },
  mounted() {
    this.tabInit(this.$route.query.tab)
  }
}
</script>
<style scoped lang="scss">
.l-areaInfo{
  a{color: #20a0ff;cursor: pointer;}
  a:hover{text-decoration: underline;}
  td{vertical-align: top; padding: 10px;}
  ul{margin:0; padding: 0; list-style: none;}
  li{margin: 10px 0; width: 350px;}
}
</style>