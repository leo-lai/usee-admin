<template>
  <div class="l-order">
    <el-tabs v-model="tabIndex" type="card" @tab-click="tabClick">
      <el-tab-pane :label="item.name" v-for="(item, index) in tabList" :key="index"></el-tab-pane>
    </el-tabs>

    <div class="l-tab-content">
      <div class="l-tab-pane" v-show="tabIndex == 0">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="24">
            <el-form :inline="true">
              <el-form-item label="开发票">
                <el-select placeholder="是否要求开发票" v-model="filters[0].isPaperCheck" style="width:150px;" @change="getOrderList(1)">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="下单日期">
                <el-date-picker type="daterange" placeholder="选择日期范围" :editable="false" v-model="filters[0].dateRange" :picker-options="pickerOptions" @change="getOrderList(1)"></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-input placeholder="请输入内容" style="width: 400px;" v-model="filters[0].searchKey" @blur="getOrderList(1)">
                  <el-select slot="prepend" placeholder="搜索类型" v-model="filters[0].searchType">
                    <el-option label="订单编号" value="orderCode"></el-option>
                    <el-option label="手机号码" value="phoneNumber"></el-option>
                  </el-select>
                  <el-button slot="append" icon="search" @click="getOrderList(1)"></el-button>
                </el-input>
              </el-form-item>
            </el-form>
          </el-col> 
        </el-row>
        
        <!--列表-->
        <el-table :data="orderList[0].data" stripe highlight-current-row element-loading-text="拼命加载中" v-loading="orderList[0].loading" @selection-change="sltChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" align="center" label="#" width="55"></el-table-column>
          <el-table-column prop="orderCode" label="订单编号" min-width="150"></el-table-column>
          <el-table-column prop="startDate" label="下单日期" min-width="150"></el-table-column>
          <el-table-column prop="amount" align="center" label="订单金额" min-width="120"></el-table-column>
          <el-table-column align="center" label="订单状态" min-width="120">
            <template scope="scope">
              <span :class="formatState(scope.row.ordersState, 'cls')">{{formatState(scope.row.ordersState)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="购买商品" min-width="100">
            <template scope="scope">
              <el-popover trigger="hover" placement="top">
                <table class="l-inner-table">
                  <tr>
                    <th>商品名称</th>
                    <th>商品数量</th>
                    <th>商品价格</th>
                  </tr>
                  <tr v-for="item in scope.row.ordersInfo">
                    <td>{{item.goodsName}}</td>
                    <td>{{item.goodsNumber}}</td>
                    <td>{{item.goodsAmount}}</td>
                  </tr>
                </table>
                <div slot="reference">
                  <el-tag>查看商品</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="userName" label="买家名称" min-width="120"></el-table-column>
          <el-table-column prop="phoneNumber" label="买家手机" min-width="120"></el-table-column>
          <el-table-column align="center" label="开发票" min-width="120">
            <template scope="scope">
              <span :class="{'l-text-error': scope.row.isPaperCheck}">{{scope.row.isPaperCheck?'是':'否'}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="120">
            <template scope="scope">
              <el-button type="text" @click="getOrderInfo(scope.row.orderId)">查看明细</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--列表 end-->

        <!--分页-->
        <el-row class="l-toolbar" align="middle">
          <el-col :span="4">
            总条数：{{orderList[0].total}}
          </el-col>
          <el-col :span="20" class="l-text-right">
            <el-pagination layout="prev, pager, next" @current-change="pageChange" :page-size="20" :total="orderList[0].total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
      <div class="l-tab-pane" v-show="tabIndex == 1">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="24">
            <el-form :inline="true">
              <el-form-item label="下单日期">
                <el-date-picker type="daterange" placeholder="选择日期范围" :editable="false" v-model="filters[1].dateRange" :picker-options="pickerOptions" @change="getOrderList(1)"></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-input placeholder="请输入内容" style="width: 400px;" v-model="filters[1].searchKey" @blur="getOrderList(1)">
                  <el-select slot="prepend" placeholder="搜索类型" v-model="filters[1].searchType">
                    <el-option label="订单编号" value="orderCode"></el-option>
                    <el-option label="手机号码" value="phoneNumber"></el-option>
                  </el-select>
                  <el-button slot="append" icon="search" @click="getOrderList(1)"></el-button>
                </el-input>
              </el-form-item>
            </el-form>
          </el-col> 
        </el-row>
        
        <!--列表-->
        <el-table :data="orderList[1].data" stripe highlight-current-row element-loading-text="拼命加载中" v-loading="orderList[1].loading" @selection-change="sltChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" align="center" label="#" width="55"></el-table-column>
          <el-table-column prop="orderCode" label="订单编号" min-width="150"></el-table-column>
          <el-table-column prop="startDate" label="下单日期" min-width="150"></el-table-column>
          <el-table-column prop="amount" align="center" label="订单金额" min-width="120"></el-table-column>
          <el-table-column align="center" label="订单状态" min-width="120">
            <template scope="scope">
              <span :class="formatState(scope.row.ordersState, 'cls')">{{formatState(scope.row.ordersState)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="购买商品" min-width="100">
            <template scope="scope">
              <el-popover trigger="hover" placement="top">
                <table class="l-inner-table">
                  <tr>
                    <th>商品名称</th>
                    <th>商品数量</th>
                    <th>商品价格</th>
                  </tr>
                  <tr v-for="item in scope.row.ordersInfo">
                    <td>{{item.goodsName}}</td>
                    <td>{{item.goodsNumber}}</td>
                    <td>{{item.goodsAmount}}</td>
                  </tr>
                </table>
                <div slot="reference">
                  <el-tag>查看商品</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="userName" label="买家名称" min-width="120"></el-table-column>
          <el-table-column prop="phoneNumber" label="买家手机" min-width="120"></el-table-column>
          <el-table-column align="center" label="开发票" min-width="120">
            <template scope="scope">
              <span :class="{'l-text-error': scope.row.isPaperCheck}">{{scope.row.isPaperCheck?'是':'否'}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="120">
            <template scope="scope">
              <el-button type="text" @click="getOrderInfo(scope.row.orderId)">查看明细</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--列表 end-->

        <!--分页-->
        <el-col :span="24" class="l-toolbar l-text-right">
          <el-pagination layout="prev, pager, next" @current-change="pageChange" :page-size="20" :total="orderList[1].total">
          </el-pagination>
        </el-col>
      </div>
    </div>

    <!--订单详情-->
    <el-dialog title="订单详情" custom-class="l-dialog l-order-info" v-model="orderInfo.visible" >
      <div class="l-panel l-margin-b">
        <div class="l-panel-tit">基本信息</div>
        <div class="l-panel-cont">
          <div class="l-inline-row _33">
            <p class="_td">订单编号：{{orderInfo.data.orderCode}}</p>
            <p class="_td">订单金额：{{orderInfo.data.amount}}元</p>
            <p class="_td">买家名称：{{orderInfo.data.userName}}</p>
            <p class="_td">买家手机：{{orderInfo.data.phoneNumber}}</p>
            <p class="_td">订单来源：{{orderInfo.data.salesMode}}</p>
            <p class="_td">代&ensp;理&ensp;商：</p>
            <p class="_td">下单时间：{{orderInfo.data.startDate}}</p>
            <p class="_td">支付时间：{{orderInfo.data.payDate}}</p>
            <p class="_td">支付方式：微信支付</p>
            <p class="_td">审核时间：{{orderInfo.data.examineDate}}</p>
            <p class="_td">审核结果：{{orderInfo.data.examineState == -1 ? '不通过' : orderInfo.data.examineState == 1 ? '通过' : '未审核'}}</p>
            <p class="_td">审&ensp;核&ensp;人：{{orderInfo.data.systenUsersName}}</p>
            <p class="_td">发货时间：{{orderInfo.data.deliverGoodsDate}}</p>
            <p class="_td">快递单号：{{orderInfo.data.expressCode}}</p>
            <p class="_td">收货时间：{{orderInfo.data.goodsReceiptDate}}</p>
          </div>
        </div>
      </div>

      <div class="l-panel l-margin-b">
        <div class="l-panel-tit">发票信息：{{orderInfo.data.paperCheckType == 1 ? '普通发票' : orderInfo.data.paperCheckType == 2 ? '增值税发票' : '不开发票'}}</div>
        <div class="l-panel-cont" v-if="orderInfo.data.paperCheckContent">
          <div class="l-inline-row">
            <p class="_td" v-for="item in orderInfo.data.paperCheckContent.split('|')">{{item}}</p>
          </div>
        </div>
      </div>

      <div class="l-panel">
        <div class="l-panel-tit">商品信息</div>
        <div class="l-panel-cont">
          <div class="l-inline-row _50">
            <p class="_td">收&ensp;货&ensp;人：{{orderInfo.data.receiverUsersInfo}}</p>
            <p class="_td">收货区域：{{orderInfo.data.region}}</p>
            <p class="_td">收货地址：{{orderInfo.data.address}}</p>
          </div>
          <div class="l-margin-t-s">
            <el-table border :data="orderInfo.data.goodsInfo">
              <el-table-column prop="goodsCode" label="商品编号" min-width="180"></el-table-column>
              <el-table-column prop="goodsName" label="商品名称" min-width="180"></el-table-column>
              <el-table-column prop="goodsNumber" label="数量" align="center" min-width="180"></el-table-column>
              <el-table-column prop="goodsPayAmount" label="单价" align="center" min-width="180"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderInfo: {
        visible: false,
        data: {},
      },
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
      tabList: [
        {
          state: '',
          cls: '',
          name: '全部订单'
        },{
          state: '1',
          cls: 'l-text-error',
          name: '待付款'
        },{
          state: '2',
          cls: 'l-text-ok',
          name: '待审核'
        },{
          state: '3',
          cls: 'l-text-warn',
          name: '待发货'
        },{
          state: '4',
          cls: 'l-text-link',
          name: '待收货'
        },{
          state: '5',
          cls: 'l-text-link',
          name: '已收货'
        },{
          state: '10',
          cls: '',
          name: '交易完成'
        },{
          state: '-1',
          cls: '',
          name: '已关闭'
        },
      ],
      tabIndex: '0',
      orderList:[
        {
          data: [],
          slteds: [],
          total: 0,
          loading: false,
        },{
          data: [],
          slteds: [],
          total: 0,
          loading: false,
        },{
          data: [],
          slteds: [],
          total: 0,
          loading: false,
        },{
          data: [],
          slteds: [],
          total: 0,
          loading: false,
        },{
          data: [],
          slteds: [],
          total: 0,
          loading: false,
        },{
          data: [],
          slteds: [],
          total: 0,
          loading: false,
        },{
          data: [],
          slteds: [],
          total: 0,
          loading: false,
        },{
          data: [],
          slteds: [],
          total: 0,
          loading: false,
        },
      ],
      filters: [{
        searchKey: '',
        searchType: '',
        isPaperCheck: '',
        dateRange: [],
        startDate: '',
        finishDate: ''
      },{
        searchKey: '',
        searchType: '',
        dateRange: [],
        startDate: '',
        finishDate: ''
      },{
        searchKey: '',
        searchType: '',
        dateRange: [],
        startDate: '',
        finishDate: ''
      }],
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

      this.orderList[index] && this.orderList[index].data.length === 0 && this.getOrderList()
      this.$router.replace('?tab=' + index)
    },
    sltChange(slteds) {
      this.orderList[this.tabIndex].slteds = slteds
    },
    pageChange(page) {
      this.getOrderList(page)
    },
    formatState(state, prop = 'name') {
      let ret = this.tabList.filter((item)=>{
        return item.state == state
      })[0]
      return ret ? ret[prop] : ''
    },
    getOrderInfo(orderId) {
      let loading = this.$loading()
      this.$api.order.getInfo(orderId).then(({data})=>{
        if(data){
          this.orderInfo.data = data
          this.orderInfo.visible = true
        }
      }).finally(()=>{
        loading.close()
      })
    },
    getOrderList(page = 1) {
      let index = this.tabIndex
      let orderList = this.orderList[index]
      let tabList = this.tabList[index]
      let filter = this.filters[index]
      let formData = {}
      switch(index){
        case '0': // 全部订单
          filter.searchType && (formData[filter.searchType] = filter.searchKey)
          formData.isPaperCheck = filter.isPaperCheck
          formData.startDate = filter.dateRange[0] ? filter.dateRange[0].format('yyyy-MM-dd') : ''
          formData.finishDate = filter.dateRange[1] ? filter.dateRange[1].format('yyyy-MM-dd') : ''
          break
        case '1': // 未付款
          filter.searchType && (formData[filter.searchType] = filter.searchKey)
          formData.startDate = filter.dateRange[0] ? filter.dateRange[0].format('yyyy-MM-dd') : ''
          formData.finishDate = filter.dateRange[1] ? filter.dateRange[1].format('yyyy-MM-dd') : ''
          break
      }
      
      formData.ordersState = tabList.state

      orderList.loading = true
      this.$api.order.getList(formData, page, orderList.rows).then(({data})=>{
        orderList.total = data.total
        orderList.page = data.page
        orderList.rows = data.rows
        orderList.data = data.orders
      }).finally(()=>{
        orderList.loading = false
      })
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
.l-order-info{
  .l-panel-cont{
    margin-top: -5px;
  }
}
.l-inner-table{
  border-collapse:collapse;
  th, td{padding: 10px; border: 1px solid #ddd; text-align: center;}
}
</style>