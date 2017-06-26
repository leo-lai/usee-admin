<template>
  <div>
    <el-tabs v-model="tabIndex" type="card" @tab-click="tabClick">
      <el-tab-pane label="体质问题列表">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="24" class="l-text-right">
            <el-form :inline="true">
              <el-form-item>
                <el-button type="primary" @click="question.visible = true">增加体质问题</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        
        <!--列表-->
        <el-table :data="list[0].data" highlight-current-row v-loading="list[0].loading" >
          <el-table-column align="center" prop="questionSort" label="题目序号" min-width="120"></el-table-column>
          <el-table-column align="center" prop="questionType" label="题目类型" min-width="120" :formatter="typeFormat"></el-table-column>
          <el-table-column prop="questionDescribe" label="题目内容" min-width="500"></el-table-column>
          <el-table-column label="操作" align="center" min-width="120">
            <template scope="scope">
              <el-button size="small" type="text" @click="eidtQuestion(scope.row)">编辑</el-button>
              <el-button class="l-text-error" size="small" type="text" @click="delQuestion(scope.row)">删除</el-button>
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

    <el-dialog title="填写体质问题信息" custom-class="l-dialog" :visible.sync="question.visible" :before-close="closeQuestionDialog" size="tiny">
      <el-form :model="question.form" :rules="question.rules" ref="questionForm" label-width="100px" style="margin-right: 1rem;">
        <el-form-item label="题目序号" prop="questionSort">
          <el-input v-model="question.form.questionSort" placeholder="不能重复题号" style="width: 217px;"></el-input>
        </el-form-item>
        <el-form-item label="题目类型" prop="questionType">
          <el-select v-model="question.form.questionType" placeholder="请选择">
            <el-option :label="item.questionTypeName" :value="item.questionTypeId" v-for="item in questionType"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题目内容" prop="questionDescribe">
          <el-input type="textarea" v-model="question.form.questionDescribe" :maxlength="1000"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="closeQuestionDialog">取消</el-button>
          <el-button type="primary" :disabled="question.submiting" @click="addQuestion">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    let validateNumber = (rule, value, callback) => {
      let number = Number(value)
      if (value === '') {
        callback(new Error('请正确输入题目序号'))
      } else if(Number.isNaN(number) || !/^\d+$/.test(number)){
        callback(new Error('请正确输入题目序号'))
      }else{
        callback()
      }
    }

    return {
      tabIndex: '0',
      question: {
        visible: false,
        submiting: false,
        rules: {
          questionSort: [{
            required: true,
            validator: validateNumber,
            message: '请正确输入题目序号',
            trigger: 'blur'
          }],
          questionType: [{
            required: true,
            type: 'number',
            message: '请选择题目类型',
            trigger: 'change'
          }],
          questionDescribe: [{
            required: true,
            message: '请填写题目内容',
            trigger: 'blur'
          }]
        },
        form: {
          questionSort: '',
          questionType: '',
          questionDescribe: ''
        } 
      },
      filters: [],
      questionType: [],
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
      this.questionType.some((item)=>{
        if(item.questionTypeId == row.questionType){
          type = item.questionTypeName
          return true
        }
      })
      return type
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
        promise = this.$api.sys.getCheckBodyList(formData, page, list.rows)
      }else{

      }

      promise.then(({data})=>{
        list.total = data.total
        list.page = data.page
        list.rows = data.rows
        list.data = Object.freeze(data.constitutionList)
        this.questionType = data.constitutionType
        this.question.form.questionSort = data.total + 1
      }).finally(()=>{
        list.loading = false
      })
    },
    closeQuestionDialog(done) {
      
      this.question.form.questionId = ''
      this.$refs.questionForm.resetFields()
      if(this.question.change){
        this.getList()
      }

      this.$nextTick(()=>{
        this.$utils.isFunction(done) && done()
        this.question.visible = false
      })
    },
    eidtQuestion(row) {
      this.question.form.questionId = row.questionId
      this.question.form.questionSort = row.questionSort
      this.question.form.questionType = row.questionTypeId
      this.question.form.questionDescribe = row.questionDescribe
      this.question.visible = true
    },
    addQuestion() {
      this.$refs.questionForm.validate((valid) => {
        if (valid) {
          this.question.submiting = true
          this.$api.sys.addCheckBodyQ(this.question.form).then(({data}) => {
            this.question.submiting = true
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.question.change = true
          }).finally(() => {
            this.question.submiting = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    delQuestion(row) {
      this.$api.sys.delCheckBodyQ(row.questionId).then(({data}) => {
        this.$message({
          type: 'success',
          message: '删除成功'
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