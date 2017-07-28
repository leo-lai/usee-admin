<template>
  <div class="l-agent">
    <el-tabs v-model="tabIndex" type="card" @tab-click="tabClick">
      <el-tab-pane label="提货记录">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="24">
            <el-form ref="filterForm-0" :model="filters[0]" :rules="filterRules" :inline="true">
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 350px;" v-model="filters[0].searchKey" >
                  <el-select slot="prepend" placeholder="搜索类型" v-model="filters[0].searchType">
                    <el-option label="提货单号" value="deliveryCode"></el-option>
                    <el-option label="手机号码" value="phoneNumber"></el-option>
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
        <el-table :data="list[0].data" highlight-current-row v-loading="list[0].loading" @selection-change="sltChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="#" width="55"></el-table-column>
          <el-table-column prop="deliveryCode" label="提货单号" min-width="120"></el-table-column>
          <el-table-column prop="goodsTypeName" label="提货商品" min-width="120"></el-table-column>
          <el-table-column prop="goodsNumber" label="提货数量" align="center" min-width="80"></el-table-column>
          <el-table-column prop="startDate" label="提货时间" min-width="120"></el-table-column>  
          <el-table-column prop="expressCode" label="快递单号" min-width="100"></el-table-column>
          <el-table-column prop="userName" label="收货人" min-width="100"></el-table-column>
          <el-table-column prop="phoneNumber" label="联系方式" min-width="100"></el-table-column>
          <el-table-column prop="address" label="发货地址" min-width="120"></el-table-column>
          <el-table-column prop="systemUserName" label="操作人" min-width="100"></el-table-column>
          <el-table-column label="操作" min-width="100" align="center">
            <template scope="scope">
              <el-button size="small" type="text" @click="printExpress(scope.row.expressURL)">打印快递单</el-button>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabIndex: '0',
      examineInfo: {
        slted: {},
        reason: '',
        visible: false,
      },
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
        },{
          loading: false,
          data: [],
          slteds: [],
          page: 1,
          total: 0
        }
      ],

      filterRules:{
        searchKey: [],
        dateRange: []
      },
      filters:[
        {
          searchKey: '',
          searchType: 'deliveryCode',
          dateRange: [],
          startDate: '',
          finishDate: ''
        }
      ]
    }
  },
  methods: {
    printExpress(url = '') {
      window.open(url)
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
        promise = this.$api.agent.getDeliveryList(formData, page, list.rows)
      }

      promise.then(({data})=>{
        list.total = data.total
        list.page = data.page
        list.rows = data.rows
        list.data = Object.freeze(data.deliverys)
      }).finally(()=>{
        list.loading = false
      })
    }
  },
  mounted() {
    this.tabInit(this.$route.query.tab)
  }
}
</script>
<style scoped lang="scss">

</style>