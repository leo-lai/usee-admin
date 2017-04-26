<template>
	<div class="l-print">
		<!--startprint-->
		<div class="l-text-center l-margin-tb">
			<h3>U视一号订单信息</h3>
			<p>客服电话：020-85655842</p>
			<p>公司官网：http://www.usee1.cn</p>
		</div>
		<div class="l-flex-hc l-margin-tb-m">
			<div class="l-rest">订单编号：{{orderInfo.orderCode}}</div>
			<div class="l-rest">下单时间：{{orderInfo.startDate}}</div>
			<div class="l-rest">支付时间：{{orderInfo.payDate}}</div>
			<div class="l-rest">支付方式：{{payType[orderInfo.paymentMethod]}}</div>
		</div>
		<el-table :data="orderInfo.goodsInfo" v-loading="loading">
      <el-table-column prop="goodsCode" label="商品编号" min-width="150"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称" min-width="150"></el-table-column>
      <el-table-column prop="goodsNumber" label="数量" align="center" min-width="150"></el-table-column>
      <el-table-column prop="goodsAmount" label="单价(元)" align="center" min-width="150"></el-table-column>
    </el-table>
    <div class="l-flex-hc l-margin-tb-m">
    	<p class="l-rest">收&ensp;货&ensp;人：{{orderInfo.receiverUsersInfo}}</p>
    	<p class="l-rest">收货地址：{{orderInfo.address}}</p>
    </div>
    <br> <br>
    <div class="l-text-center">
    	<img width="100" src="~assets/lizong.jpg" alt="">
    </div>
    <!--endprint-->
    <br><br><br>
    <div class="l-text-center noprint"><el-button @click="print" size="large">打印</el-button></div>
	</div>
	
	
</template>

<script>
export default {
  data() {
  	return {
  		payType: {
  			'1': '微信支付'
  		},
  		loading: false,
  		orderInfo: {}
  	}
  },
  methods: {
  	print() {
  		window.print()
  	}
  },
  mounted() {
  	let loading = this.$loading()
    this.$api.order.getInfo(this.$route.params.id).then(({data})=>{
      this.orderInfo = data || {}
      this.$nextTick(()=>{
      	setTimeout(()=>{
      		this.print()
      	}, 100)
      })
    }).finally(()=>{
      loading.close()
    })
  }
}
</script>
<style lang="scss" scoped media="print">
.l-print{
	width: 1000px; margin: 30px auto;
	p{margin: 5px 0;}
}
@media print { 
	.noprint { display: none; }
} 
</style>