<template>
  <div class="l-evaluate">
    <!--过滤查询-->
    <el-row class="l-toolbar">
      <el-col :span="20">
        <el-form :inline="true" ref="filterForm" :model="filter" :rules="filterRules"> 
          <!-- <el-form-item>
            <el-button-group>
              <el-button :disabled="evaluateList.slteds.length===0">批量通过</el-button>
            </el-button-group>  
          </el-form-item> -->
          <el-form-item>
            <el-select placeholder="审核状态" v-model="filter.judgegState" @change="getEvaluateList(1)">
              <el-option label="未审核" value="0"></el-option>
              <el-option label="审核通过" value="1"></el-option>
              <el-option label="审核不通过" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评论时间" prop="dateRange">
            <el-date-picker type="daterange" placeholder="选择日期范围" :editable="false" v-model="filter.dateRange" :picker-options="pickerOptions" @change="search"></el-date-picker>
          </el-form-item>
          <!-- <el-form-item>
            <el-input placeholder="请输入商品名称" style="width: 300px;" v-model="filter.searchKey">
              <el-button slot="append" icon="search" @click="search"></el-button>
            </el-input>
          </el-form-item> -->
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
          
        </el-form>
      </el-col>
    </el-row>
    
    <!--列表-->
    <el-table :data="evaluateList.data" highlight-current-row v-loading="evaluateList.loading" @selection-change="sltChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="judgegDate" label="评论时间" min-width="120"></el-table-column>
      <el-table-column prop="userName" label="买家名称" min-width="120" align="center"></el-table-column>
      <el-table-column prop="phoneNumber" label="联系方式" min-width="120"></el-table-column>
      <el-table-column prop="judgegContent" label="评论内容" min-width="120"></el-table-column>
      <el-table-column prop="judgegState" label="状态" min-width="120" align="center">
        <template scope="scope">
          <span v-if="scope.row.judgegState == 0">未审核</span>
          <span v-if="scope.row.judgegState == 1" class="l-text-ok">审核通过</span>
          <span v-if="scope.row.judgegState == 2" class="l-text-error">审核不通过</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120" align="center">
        <template scope="scope">
          <el-button size="small" type="text" v-if="scope.row.images.length > 0" @click.native.prevent="viewImages(scope.row.images)">查看图片</el-button>
          <el-button size="small" type="text" @click.native.prevent="examineDialog(scope.row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--列表 end-->

    <!--分页-->
    <el-col :span="24" class="l-toolbar l-text-right">
      <el-pagination layout="prev, pager, next" @current-change="pageChange" :page-size="20" :total="evaluateList.total">
      </el-pagination>
    </el-col>


    <el-dialog title="查看图片" v-model="images.visible" size="full" >
      <el-carousel ref="carousel" arrow="always" :height="images.height" :initial-index="0" :autoplay="false">
        <el-carousel-item v-for="item in images.data" >
          <img :src="item" alt="">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      images: {
        height: '800px',
        visible: false,
        data: []
      },
      filter: {
        searchKey: '',
        searchType: 'goodsName',
        judgegState: '',
        dateRange: [],
        startDate: '',
        finishDate: ''
      },
      filterRules:{
        searchKey: [],
        dateRange: [],
        judgegState: []
      },
      pickerOptions: {
        shortcuts: [
          {
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
          }
        ]
      },
      evaluateList: {
        data: [],
        slteds: [],
        total: 1,
        loading: false
      }
    }
  },
  methods: {
    viewImages(images = []) {
      this.images.data = images
      this.images.visible = true
      this.$nextTick(()=>{
        setTimeout(()=>{
          this.$refs.carousel.setActiveItem(0)  
        }, 50)
      })
    },
    examineDialog(item) {
      this.$confirm('是否审核通过该评论?', '系统提示', {
        confirmButtonText: '通过',
        cancelButtonText: '不通过'
      }).then(() => {
        this.examine(item.judgeId, 1)
      }).catch(() => {
        this.examine(item.judgeId, 0)
      })
    },
    clearFilter() {
      this.$refs.filterForm.resetFields()
      this.getEvaluateList()
    },
    refreshList() {
      this.getEvaluateList(this.evaluateList.page)
    },
    examine(judgeId = '', isPass = 1) {
      let loading = this.$loading()
      return this.$api.goods.examineEvaluate({
        judgeId, isPass
      }).finally(()=>{
        this.$message({
          type: 'success',
          message: '操作成功'
        })

        loading.close()
        this.getEvaluateList()
      })
    },
    pageChange(page = 1) {
      this.getEvaluateList(page)
    },
    getEvaluateList(page = 1) {
      let formData = {}

      this.filter.searchType && (formData[this.filter.searchType] = this.filter.searchKey)
      formData.startDate = this.filter.dateRange[0] ? this.filter.dateRange[0].format('yyyy-MM-dd') : ''
      formData.finishDate = this.filter.dateRange[1] ? this.filter.dateRange[1].format('yyyy-MM-dd') : ''  
      
      formData.judgegState = this.filter.judgegState

      page = Math.max(Math.min(page, this.evaluateList.total), 1)
      this.$api.goods.getEvaluate(formData, page, this.evaluateList.rows).then(({data})=>{
        this.evaluateList.total = data.total
        this.evaluateList.page = data.page
        this.evaluateList.rows = data.rows
        this.evaluateList.data = data.judges.map((item)=>{
          item.images = item.imageMax ? item.imageMax.split(',') : []
          return item
        })
      }).finally(()=>{
        this.evaluateList.loading = false
      })
    },
    sltChange(slteds) {
      this.evaluateList.slteds = slteds
    },
    search() {
      this.getEvaluateList()
    }
  },
  mounted() {
    this.images.height = (window.screen.height - 200) + 'px'
    this.getEvaluateList()
  }
}
</script>
<style lang="scss">
.el-carousel__item {
  text-align: center;
  background-color: #eef1f6;
}

.el-carousel__item img{
  max-width: 100%;
  max-height: 100%;
}

</style>