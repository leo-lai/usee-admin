<template>
  <div class="l-agent">
    <el-tabs v-model="tabIndex" type="card" @tab-click="tabClick">
      <el-tab-pane label="返利审核">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="24">
            <el-form ref="filterForm-0" :model="filters[0]" :rules="filterRules" :inline="true">
              <el-form-item label="代理商类型">
                <el-select placeholder="代理商类型" v-model="filters[0].agentId" @change="getRebateList(1)">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="小U店员" value="1"></el-option>
                  <el-option label="合伙人" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="审核状态">
                <el-select placeholder="审核状态" v-model="filters[0].rebateRecordState" @change="getRebateList(1)">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="未审核" value="0"></el-option>
                  <el-option label="已通过" value="1"></el-option>
                  <el-option label="已拒绝" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 400px;" v-model="filters[0].searchKey" >
                  <el-select slot="prepend" placeholder="搜索类型" v-model="filters[0].searchType">
                    <el-option label="手机号码" value="phoneNumber"></el-option>
                    <el-option label="订单号" value="orderCode"></el-option>
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
        <el-table :data="rebateList[0].data" highlight-current-row v-loading="rebateList[0].loading" @selection-change="sltChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="#" width="55"></el-table-column>
          <el-table-column prop="rebateRecordCode" label="返点单号" min-width="120"></el-table-column>
          <el-table-column prop="userName" label="返点对象" min-width="120"></el-table-column>
          <el-table-column prop="phoneNumber" label="对象手机号" min-width="100"></el-table-column>
          <el-table-column prop="agentId" label="代理商类型" align="center" min-width="100">
            <template scope="scope">
              <span v-if="scope.row.agentId == 1">小U店员</span>
              <span v-if="scope.row.agentId == 2">合伙人</span>
            </template>
          </el-table-column>
          <el-table-column prop="rebateRecordType" label="返点类型" align="center" min-width="120">
            <template scope="scope">
              <span>{{rebateRecordType[Math.abs(scope.row.rebateRecordType)]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderCode" label="对应订单号" min-width="120"></el-table-column>
          <el-table-column prop="amount" label="返点金额" align="center" min-width="120"></el-table-column>
          <el-table-column prop="auditedDate" label="可审核时间" min-width="120"></el-table-column>  
          <el-table-column prop="rebateRecordState" label="返点状态" align="center" min-width="100">
            <template scope="scope">
              <span v-if="scope.row.rebateRecordState == 0">未审核</span>
              <span class="l-text-ok" v-if="scope.row.rebateRecordState == 1">已通过</span>
              <span class="l-text-error" v-if="scope.row.rebateRecordState == 2">已拒绝</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100" align="center">
            <template scope="scope">
              <el-button size="small" type="text" v-if="scope.row.isExamine > 0 && scope.row.rebateRecordState == 0" @click.native.prevent="examineDialog(scope.row)">审核</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--列表 end-->

        <!--分页-->
        <el-row class="l-toolbar"  type="flex" align="middle">
          <el-col :span="4">
            <span class="l-text-gray">共{{rebateList[0].total}}条记录</span>
          </el-col>
          <el-col :span="20" class="l-text-right">
            <el-pagination layout="prev, pager, next" @current-change="pageChange" :page-size="20" :total="rebateList[0].total">
            </el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="提现审核">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="24">
            <el-form ref="filterForm-1" :model="filters[1]" :rules="filterRules" :inline="true">
              <el-form-item label="代理商类型">
                <el-select placeholder="代理商类型" v-model="filters[1].agentId" @change="getRebateList(1)">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="小U店员" value="1"></el-option>
                  <el-option label="合伙人" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="审核状态">
                <el-select placeholder="审核状态" v-model="filters[1].withdrawalsState" @change="getRebateList(1)">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="未审核" value="0"></el-option>
                  <el-option label="已通过" value="1"></el-option>
                  <el-option label="已拒绝" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 400px;" v-model="filters[1].searchKey" >
                  <el-select slot="prepend" placeholder="搜索类型" v-model="filters[1].searchType">
                    <el-option label="手机号码" value="phoneNumber"></el-option>
                    <el-option label="订单号" value="orderCode"></el-option>
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
        <el-table :data="rebateList[1].data" highlight-current-row v-loading="rebateList[1].loading" @selection-change="sltChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="#" width="55"></el-table-column>
          <el-table-column prop="withdrawalCode" label="提现单号" min-width="120"></el-table-column>
          <el-table-column prop="userName" label="提现代理商" min-width="120"></el-table-column>
          <el-table-column prop="phoneNumber" label="手机号码" min-width="100"></el-table-column>
          <el-table-column prop="agentId" label="代理商类型" align="center" min-width="100">
            <template scope="scope">
              <span v-if="scope.row.agentId == 1">小U店员</span>
              <span v-if="scope.row.agentId == 2">合伙人</span>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="提现金额(元)" align="center" min-width="120"></el-table-column>
          <el-table-column prop="startDate" label="申请时间" min-width="120"></el-table-column>  
          <el-table-column prop="withdrawalsState" label="申请状态" align="center" min-width="100">
            <template scope="scope">
              <span v-if="scope.row.withdrawalsState == 0">未审核</span>
              <span class="l-text-ok" v-if="scope.row.withdrawalsState == 1">已通过</span>
              <span class="l-text-error" v-if="scope.row.withdrawalsState == 2">已拒绝</span>
            </template>
          </el-table-column>
          <el-table-column label="收款信息" min-width="100" align="center">
            <template scope="scope">
              <el-popover trigger="hover" placement="top">
                <div>
                  <p>提现方式：银行卡</p>
                  <p>持卡人姓名：{{scope.row.accountHolder}}</p>
                  <p>银行卡号：{{scope.row.bankAccountNumber}}</p>
                  <p>银行名称：{{scope.row.bankAccount}}</p>
                  <p>银行支行：{{scope.row.bankBranch}}</p>
                </div>
                <div slot="reference">
                  <el-tag>查看</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100" align="center">
            <template scope="scope">
              <el-button size="small" type="text" v-if="scope.row.withdrawalsState == 0" @click.native.prevent="examineDialog(scope.row)">审核</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--列表 end-->

        <!--分页-->
        <el-row class="l-toolbar"  type="flex" align="middle">
          <el-col :span="4">
            <span class="l-text-gray">共{{rebateList[1].total}}条记录</span>
          </el-col>
          <el-col :span="20" class="l-text-right">
            <el-pagination layout="prev, pager, next" @current-change="pageChange" :page-size="20" :total="rebateList[1].total">
            </el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="合伙人打款审核">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="24">
            <el-form ref="filterForm-2" :model="filters[2]" :rules="filterRules" :inline="true">
              <el-form-item label="状态">
                <el-select placeholder="状态" v-model="filters[2].rebateRecordState" @change="getRebateList(1)">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="未打款" value="1"></el-option>
                  <el-option label="已打款" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 400px;" v-model="filters[2].searchKey" >
                  <el-select slot="prepend" placeholder="搜索类型" v-model="filters[2].searchType">
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
              <el-form-item>
                <el-button-group>
                  <el-button :disabled="rebateList[2].slteds.length===0" @click="payMoney">批量打款</el-button>
                </el-button-group>  
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        
        <!--列表-->
        <el-table :data="rebateList[2].data" highlight-current-row v-loading="rebateList[2].loading" @selection-change="sltChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="#" width="55"></el-table-column>
          <el-table-column prop="rebateRecordCode" label="返点单号" min-width="120"></el-table-column>
          <el-table-column prop="userName" label="返点对象" min-width="120"></el-table-column>
          <el-table-column prop="phoneNumber" label="对象手机号" min-width="100"></el-table-column>
          <el-table-column prop="rebateRecordType" label="返点类型" align="center" min-width="120">
            <template scope="scope">
              <span>{{rebateRecordType[Math.abs(scope.row.rebateRecordType)]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="返点金额" align="center" min-width="120"></el-table-column>
          <el-table-column prop="systemUserName" label="审核人" align="center" min-width="120"></el-table-column>
          <el-table-column prop="examineDate" label="审核通过时间" min-width="120"></el-table-column>  
          <el-table-column prop="rebateRecordState" label="打款状态" align="center" min-width="100">
            <template scope="scope">
              <span class="l-text-error" v-if="scope.row.rebateRecordState == 1">未打款</span>
              <span class="l-text-ok" v-if="scope.row.rebateRecordState == 3">已打款</span>
            </template>
          </el-table-column>
        </el-table>
        <!--列表 end-->

        <!--分页-->
        <el-row class="l-toolbar"  type="flex" align="middle">
          <el-col :span="4">
            <span class="l-text-gray">共{{rebateList[2].total}}条记录</span>
          </el-col>
          <el-col :span="20" class="l-text-right">
            <el-pagination layout="prev, pager, next" @current-change="pageChange" :page-size="20" :total="rebateList[2].total">
            </el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <el-dialog custom-class="l-dialog" title="系统提示" :visible.sync="examineInfo.visible" size="tiny">
      <p class="l-margin-b-s">是否审核通过该申请？</p>
      <el-input type="textarea" :rows="2" placeholder="如果拒绝申请，请填写原因" v-model="examineInfo.reason">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="examine(0)">&ensp;拒绝&ensp;</el-button>
        <el-button type="primary" @click="examine(1)">&ensp;通过&ensp;</el-button>
      </span>
    </el-dialog>

    <el-dialog custom-class="l-dialog" title="批量打款" :visible.sync="payMoneyInfo.visible" size="tiny">
      <p class="l-margin-b-s">本次打款金额：{{payMoneyInfo.money}}</p>
      <el-input type="textarea" :rows="2" placeholder="请填写打款备注" v-model="payMoneyInfo.remark">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="payMoneyInfo.visible = false">取消</el-button>
        <el-button type="primary" :loading="payMoneyInfo.loading" @click="payMoneyOk">&ensp;确定打款&ensp;</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabIndex: '0',
      rebateRecordType: ['','商城销售返点','销售额外奖励','区域管理返点','集团分红','推荐区域返点','邮寄直接返点', '成本返利'],
      payMoneyInfo: {
        loading: false,
        visible: false,
        remark: '',
        money: 0
      },
      examineInfo: {
        slted: {},
        reason: '',
        visible: false,
      },
      rebateList: [
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
        dateRange: [],
        rebateRecordState: [],
        agentId: []
      },
      filters:[
        {
          searchKey: '',
          searchType: 'phoneNumber',
          dateRange: [],
          agentId: '',
          rebateRecordState: '',
          startDate: '',
          finishDate: ''
        },{
          searchKey: '',
          searchType: 'phoneNumber',
          dateRange: [],
          agentId: '',
          withdrawalsState: '',
          startDate: '',
          finishDate: ''
        },{
          searchKey: '',
          searchType: 'phoneNumber',
          dateRange: [],
          agentId: '',
          rebateRecordState: '',
          startDate: '',
          finishDate: ''
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

      this.rebateList[index] && this.rebateList[index].data.length === 0 && this.getRebateList()
      this.$router.replace('?tab=' + index)
    },
    sltChange(slteds) {
      this.rebateList[this.tabIndex].slteds = slteds
    },
    pageChange(page) {
      this.getRebateList(page)
    },
    clearFilter() {
      this.$refs['filterForm-' + this.tabIndex].resetFields()
      this.filters[this.tabIndex].agentId = ''
      this.filters[this.tabIndex][this.tabIndex == 1 ? 'withdrawalsState' : 'rebateRecordState'] = ''
      this.getRebateList()
    },
    refreshList() {
      this.getRebateList()  
    },
    search() {
      this.getRebateList()
    },
    getRebateList(page = 1) {
      let index = this.tabIndex
      let rebateList = this.rebateList[index]
      let filter = this.filters[index]
      let formData = {}

      if(filter){
        filter.searchType && (formData[filter.searchType] = filter.searchKey)
        formData.agentId = filter.agentId
        formData.startDate = filter.dateRange[0] ? filter.dateRange[0].format('yyyy-MM-dd') : ''
        formData.finishDate = filter.dateRange[1] ? filter.dateRange[1].format('yyyy-MM-dd') : '' 
      }
      
      rebateList.loading = true
      let promise
      if(this.tabIndex == 1){
        formData.withdrawalsState = filter.withdrawalsState
        promise = this.$api.agent.getWithdrawalsList(formData, page, rebateList.rows)
      }else{
        formData.rebateRecordState = filter.rebateRecordState
        formData.isPartner = this.tabIndex == 2 ? 1 : ''
        promise = this.$api.agent.getRebateList(formData, page, rebateList.rows)
      }
      promise.then(({data})=>{
        rebateList.total = data.total
        rebateList.page = data.page
        rebateList.rows = data.rows
        rebateList.data = data.agentInfos
      }).finally(()=>{
        rebateList.loading = false
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
      let promise
      if(this.tabIndex == 1){
        promise = this.$api.agent.examineWithdrawals(this.examineInfo.slted.withdrawalsId, isPass, this.examineInfo.reason)
      }else{
        promise = this.$api.agent.examineRebate(this.examineInfo.slted.rebateRecordId, isPass, this.examineInfo.reason)
      }
      
      promise.then(()=>{
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.examineInfo.visible = false
        this.refreshList()
      }).finally(()=>{
        loading.close()
      })
    },
    payMoney() { // 批量打款
      let rebateRecordIds = [], money = 0
      this.rebateList[2].slteds.forEach((item)=>{
        rebateRecordIds.push(item.rebateRecordId)
        money += item.amount
      })
      this.payMoneyInfo.rebateRecordIds = rebateRecordIds.join(',')
      this.payMoneyInfo.money = money.toFixed(2)
      this.payMoneyInfo.visible = true
    },
    payMoneyOk() {
      this.payMoneyInfo.loading = true
      this.$api.agent.examineRebateH(this.payMoneyInfo.rebateRecordIds, this.payMoneyInfo.remark)
      .then(()=>{
        this.$message({
          type: 'success',
          message: '打款成功'
        })
        this.refreshList()
        this.payMoneyInfo.visible = false
      }).finally(()=>{
        this.payMoneyInfo.loading = false
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