<template>
  <div>
    <!--过滤查询-->
    <el-row class="l-toolbar">
      <el-col :span="20">
        <el-form :inline="true" ref="filterForm" :model="filter" :rules="filterRules"> 
          <el-form-item label="售后类型">
            <el-select v-model="filter.afterSalesType" style="width:150px;" @change="getAfterSales(1)">
              <el-option label="全部" value=""></el-option>
              <el-option label="退货退款" value="7"></el-option>
              <el-option label="换货" value="8"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="申请时间" prop="dateRange">
            <el-date-picker type="daterange" placeholder="选择日期范围" :editable="false" v-model="filter.dateRange" :picker-options="pickerOptions" @change="search"></el-date-picker>
          </el-form-item>

          <el-form-item prop="searchKey">
            <el-input placeholder="请输入内容" style="width: 350px;" v-model="filter.searchKey">
              <el-select slot="prepend" placeholder="搜索类型" v-model="filter.searchType">
                <el-option label="手机号码" value="phoneNumber"></el-option>
                <el-option label="商品名称" value="goodsName"></el-option>
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
          
        </el-form>
      </el-col>
    </el-row>
    
    <!--列表-->
    <el-table :data="afterSalesList.data" highlight-current-row v-loading="afterSalesList.loading" @selection-change="sltChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="#" width="55" align="center"></el-table-column>
      <el-table-column prop="orderCode" label="订单编号" min-width="120"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称" min-width="120"></el-table-column>
      <el-table-column prop="goodsNumber" label="退货数量" align="center" min-width="100"></el-table-column>
      <el-table-column prop="userName" label="买家名称" min-width="120" align="center"></el-table-column>
      <el-table-column prop="phoneNumber" label="联系方式" min-width="120"></el-table-column>
      <el-table-column prop="afterSalesType" label="售后类型" align="center" min-width="120">
        <template scope="scope">
          <span v-if="scope.row.afterSalesType == 7">退货退款</span>
          <span v-if="scope.row.afterSalesType == 8">换货</span>
        </template>
      </el-table-column>
      <el-table-column prop="afterSalesReason" label="申请理由" min-width="120">
        <template scope="scope">
          <span v-if="scope.row.afterSalesReason == 1">产品质量原因</span>
          <span v-if="scope.row.afterSalesReason == 2">7天无理由退换货</span>
          <span v-if="scope.row.afterSalesReason == 10">其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="startDate" label="申请时间" min-width="120"></el-table-column>
      <el-table-column prop="remark" label="其他备注" min-width="120"></el-table-column>
      <el-table-column prop="afterSalesState" label="状态" min-width="120" align="center">
        <template scope="scope">
          <span v-if="scope.row.afterSalesState == 0">未审核</span>
          <span v-if="scope.row.afterSalesState == 1" class="l-text-ok">已通过</span>
          <span v-if="scope.row.afterSalesState == 2" class="l-text-error">已拒绝</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120" align="center">
        <template scope="scope">
          <el-button size="small" type="text" v-if="scope.row.images.length > 0" @click.native.prevent="viewImages(scope.row.images)">查看图片</el-button>
          <el-button size="small" type="text" v-if="scope.row.afterSalesState == 0" @click.native.prevent="examineDialog(scope.row)">审核</el-button>
          <el-button size="small" type="text" 
            v-if="scope.row.afterSalesState == 1 && scope.row.afterSalesType == 8 && !scope.row.isExpress" 
            @click.native.prevent="express(scope.row.afterSalesId)">发货</el-button>
          <el-button size="small" type="text" v-if="scope.row.isExpress" @click.native.prevent="expressView(scope.row.expressURL)">查看快递单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--列表 end-->

    <!--分页-->
    <el-col :span="24" class="l-toolbar l-text-right">
      <el-pagination layout="prev, pager, next" @current-change="pageChange" :page-size="20" :total="afterSalesList.total">
      </el-pagination>
    </el-col>
    
    <el-dialog custom-class="l-dialog" title="系统提示" :visible.sync="examineInfo.visible" size="tiny">
      <p class="l-margin-b-s">是否审核通过该售后申请?</p>
      <el-input type="textarea" :rows="2" placeholder="如果拒绝申请，请填写原因" v-model="examineInfo.reason">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="examine(0)">&ensp;拒绝&ensp;</el-button>
        <el-button type="primary" @click="examine(1)">&ensp;通过&ensp;</el-button>
      </span>
    </el-dialog>

    <el-dialog custom-class="l-dialog l-padding-0" title="查看图片" :visible.sync="images.visible" size="full" >
      <el-carousel ref="carousel" arrow="always" :height="images.height" :initial-index="0" :autoplay="false">
        <el-carousel-item class="l-flex-vhc" v-for="(item,index) in images.data" :key="index">
          <img :src="item" alt="">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>

    <!-- 快递列表 -->
    <el-dialog title="选择快递" custom-class="l-dialog" :visible.sync="expressInfo.visible" size="tiny">
      <div class="l-express-list">
        <div class="_item" v-for="item in expressInfo.data" 
          :class="{'_active': expressInfo.slted.expressId === item.expressId}" 
          @click="expressInfo.slted = item">
          <h3>{{item.expressName}}</h3>
          <p>{{expressInfo.payType[item.payType]}}</p>
        </div>
      </div>
      <div class="l-text-center l-margin-t">
        <el-button type="primary" :loading="expressInfo.loading" @click="expressOk">确定发货</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      expressInfo: {
        loading: false,
        afterSalesId: '',
        visible: false,
        payType: {
          'SHIPPER': '寄方付',
          'CONSIGNEE': '到付',
          'MONTHLY': '月结',
          'THIRDPARTY': '第三方支付',
          'ZITI': '不发快递'
        },
        slted: {},
        data: []
      },
      filter: {
        searchKey: '',
        searchType: 'goodsName',
        afterSalesType:'',
        judgegState: '',
        dateRange: [],
        startDate: '',
        finishDate: ''
      },
      filterRules:{
        afterSalesType: [],
        searchKey: [],
        dateRange: [],
        judgegState: []
      },
      examineInfo: {
        slted: {},
        reason: '',
        visible: false,
      },
      images: {
        height: '800px',
        visible: false,
        data: []
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
      afterSalesList: {
        data: [],
        slteds: [],
        page: 1,
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
      this.examineInfo.reason = ''
      this.examineInfo.slted = item
      this.examineInfo.visible = true
    },
    examine(isPass = 1) {
      if(isPass == 0 && !this.examineInfo.reason){
        this.$message({
          type: 'error',
          message: '请填写拒绝原因'
        })
        return
      }

      let loading = this.$loading()
      return this.$api.order.examineAfterSales(this.examineInfo.slted.afterSalesId, isPass, this.examineInfo.reason)
      .then(()=>{
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.examineInfo.visible = false
        this.getAfterSales()
      }).finally(()=>{
        loading.close()
      })
    },
    express(afterSalesId = ''){
      this.expressInfo.afterSalesId = afterSalesId
      
      let loading = this.$loading()
      this.$api.order.getExpressList().then(({data})=>{
        this.expressInfo.data = data
        this.expressInfo.slted = this.expressInfo.data[0]
        this.expressInfo.visible = true
      }).finally(()=>{
        loading.close()
      })
    },
    expressOk() {
      if(this.expressInfo.slted && this.expressInfo.slted.expressId){
        this.expressInfo.loading = true
        this.$api.order.expressAfterSales({
          expressId: this.expressInfo.slted.expressId,
          afterSalesId: this.expressInfo.afterSalesId
        }).then(({data})=>{
          this.$message({
            type: 'success',
            message: '发货成功'
          })
          this.expressInfo.visible = false
          this.refreshList()

          window.open(data)
        }).finally(()=>{
          this.expressInfo.loading = false
        })
      }else{
        this.$message('请选择快递')
      }
    },
    expressView(url = '') {
      window.open(url)
    },
    clearFilter() {
      this.$refs.filterForm.resetFields()
      this.getAfterSales()
    },
    refreshList() {
      this.getAfterSales(this.afterSalesList.page)
    },
    pageChange(page = 1) {
      this.getAfterSales(page)
    },
    getAfterSales(page = 1) {
      let formData = {}
      console.log(this.filter.searchType)

      this.filter.searchType && (formData[this.filter.searchType] = this.filter.searchKey)
      formData.startDate = this.filter.dateRange[0] ? this.filter.dateRange[0].format('yyyy-MM-dd') : ''
      formData.finishDate = this.filter.dateRange[1] ? this.filter.dateRange[1].format('yyyy-MM-dd') : ''  
      
      formData.afterSalesType = this.filter.afterSalesType

      page = Math.max(Math.min(page, this.afterSalesList.total), 1)

      this.afterSalesList.loading = true
      this.$api.order.getAfterSales(formData, page, this.afterSalesList.rows).then(({data})=>{
        this.afterSalesList.total = data.total
        this.afterSalesList.page = data.page
        this.afterSalesList.rows = data.rows
        this.afterSalesList.data = data.agentInfos.map((item)=>{
          item.images = item.images ? item.images.split(',') : []
          return item
        })
      }).finally(()=>{
        this.afterSalesList.loading = false
      })
    },
    sltChange(slteds) {
      this.afterSalesList.slteds = slteds
    },
    search() {
      this.getAfterSales()
    }
  },
  mounted() {
    this.images.height = ( Math.max(document.body.clientHeight, document.documentElement.clientHeight) - 47) + 'px'
    this.getAfterSales()
  }
}
</script>
<style scoped lang="scss">
.el-carousel__item {
  background-color: #000;
  img{
    max-width: 100%;
    max-height: 100%;
  }
}
</style>