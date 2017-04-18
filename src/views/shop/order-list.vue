<template>
  <div class="l-order">
    <el-tabs v-model="tabIndex" type="card" @tab-click="tabClick">
      <el-tab-pane :label="item.name" v-for="(item, index) in tabList"></el-tab-pane>
    </el-tabs>

    <div class="l-tab-content">
      <div class="l-tab-pane" v-show="tabIndex == 0">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="24">
            <el-form :inline="true">
              <el-form-item label="开发票">
                <el-select placeholder="是否要求开发票" style="width:150px;">
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="2"></el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item label="下单日期" class="l-date">
                <el-col :span="11">
                  <el-date-picker type="date" placeholder="开始日期" :editable="false" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="l-text-center" :span="2">至</el-col>
                <el-col :span="11">
                  <el-date-picker type="date" placeholder="结束日期" :editable="false" style="width: 100%;"></el-date-picker>
                </el-col>
              </el-form-item>

              <el-form-item>
                <el-input placeholder="请输入内容" style="width: 400px;">
                  <el-select slot="prepend" placeholder="搜索类型">
                    <el-option label="订单编号" value="1"></el-option>
                    <el-option label="手机号码" value="2"></el-option>
                  </el-select>
                  <el-button slot="append" icon="search"></el-button>
                </el-input>
              </el-form-item>
            </el-form>
          </el-col> 
        </el-row>
        
        <!--列表-->
        <el-table :data="orderList[0].data" highlight-current-row v-loading="orderList[0].loading" @selection-change="sltChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="name" label="订单编号" min-width="120"></el-table-column>
          <el-table-column prop="sex" label="下单日期" min-width="120"></el-table-column>
          <el-table-column prop="birth" label="订单金额" min-width="120"></el-table-column>
          <el-table-column prop="fenlei" label="订单状态" min-width="120"></el-table-column>
          <el-table-column prop="age" label="购买商品" min-width="100"></el-table-column>
          <el-table-column prop="name" label="下单用户" min-width="120"></el-table-column>
          <el-table-column prop="name" label="用户手机" min-width="120"></el-table-column>
          <el-table-column prop="addr" label="开发票" min-width="120"></el-table-column>
          <el-table-column label="操作" min-width="150">
            <template scope="scope">
              <el-button size="small" @click="orderEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="orderDel(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--列表 end-->

        <!--分页-->
        <el-col :span="24" class="l-toolbar l-text-right">
          <el-pagination layout="prev, pager, next" @current-change="pageChange" :page-size="20" :total="orderList[0].totalPage">
          </el-pagination>
        </el-col>
      </div>
      <div class="l-tab-pane" v-show="tabIndex == 1">开发中</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabList: [
        {
          name: '全部订单'
        },{
          name: '待付款'
        },{
          name: '待审核'
        },{
          name: '待发货'
        },{
          name: '待收货'
        },{
          name: '已收货'
        },{
          name: '交易完成'
        },{
          name: '已关闭'
        },
      ],
      tabIndex: '0',
      orderList:[
        {
          data: [],
          slteds: [],
          page: 1,
          totalPage: 0,
          loading: false,
        },{
          data: [],
          slteds: [],
          page: 1,
          totalPage: 0,
          loading: false,
        },{
          data: [],
          slteds: [],
          page: 1,
          totalPage: 0,
          loading: false,
        },
      ]
    }
  },
  methods: {
    tabClick(tab, event) {
      this.tabInit(this.tabIndex)
    },
    tabInit(index){
      index = index || this.tabIndex
      switch(index){
        
      }
      this.tabIndex = index
      this.$router.replace('?tab=' + index)
    },
    sltChange(slteds) {
      console.log(slteds)
    },
    orderEdit(index, row) {

    },
    orderDel(index, row) {

    },
    pageChange(page) {
      this.goodsList.page = page
      this.getGoodsList()
    },
    getOrderList() {

    }
  },
  mounted() {
    this.tabInit(this.$route.query.tab)
  }
}
</script>
<style lang="scss">
.l-order{
  .el-select .el-input {
    min-width: 120px;
  }
  .l-date{
    width: 350px;
    .el-form-item__content{width: 282px;}
  }
}
</style>