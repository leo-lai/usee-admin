<template>
  <div class="l-agent">
    <el-tabs v-model="tabIndex" type="card" @tab-click="tabClick">
      <el-tab-pane label="返利审核">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="24">
            <el-form ref="filterForm-0" :model="filters[0]" :rules="filterRules" :inline="true">
              <el-form-item label="审核时间" prop="dateRange">
                <el-date-picker type="daterange" placeholder="选择日期范围" :editable="false" v-model="filters[0].dateRange" :picker-options="pickerOptions" @change="search"></el-date-picker>
              </el-form-item>
              <el-form-item label="代理商类型">
                <el-select placeholder="代理商类型" style="width:150px;" v-model="filters[0].agentId" @change="getRebateList(1)">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="小U店长" value="1"></el-option>
                  <el-option label="区域合伙人" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="审核状态">
                <el-select placeholder="审核状态" style="width:150px;" v-model="filters[0].rebateRecordState" @change="getRebateList(1)">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="未审核" value="0"></el-option>
                  <el-option label="已通过" value="1"></el-option>
                  <el-option label="已拒绝" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 350px;" v-model="filters[0].searchKey" >
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
                  <el-button :disabled="rebateList[0].slteds.length===0" @click="examines">批量通过</el-button>
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
              <span v-if="scope.row.agentId == 1">小U店长</span>
              <span v-if="scope.row.agentId == 2">区域合伙人</span>
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
          </el-col>
          <el-col :span="20" class="l-text-right">
            <el-pagination
              @size-change="sizeChange"
              @current-change="pageChange"
              :current-page="rebateList[0].page"
              :page-sizes="[10, 50, 100, 200, 500, 1000]"
              :page-size="rebateList[0].rows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="rebateList[0].total">
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
                <el-select placeholder="代理商类型" style="width:150px;" v-model="filters[1].agentId" @change="getRebateList(1)">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="小U店长" value="1"></el-option>
                  <el-option label="区域合伙人" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="审核状态">
                <el-select placeholder="审核状态" style="width:150px;" v-model="filters[1].withdrawalsState" @change="getRebateList(1)">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="未审核" value="0"></el-option>
                  <el-option label="已通过" value="1"></el-option>
                  <el-option label="已拒绝" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 350px;" v-model="filters[1].searchKey" >
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
          <el-table-column prop="agentInfoName" label="提现代理商" min-width="120"></el-table-column>
          <el-table-column prop="phoneNumber" label="手机号码" min-width="100"></el-table-column>
          <el-table-column prop="agentId" label="代理商类型" align="center" min-width="100">
            <template scope="scope">
              <span v-if="scope.row.agentId == 1">小U店长</span>
              <span v-if="scope.row.agentId == 2">区域合伙人</span>
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
          </el-col>
          <el-col :span="20" class="l-text-right">
            <el-pagination
              @size-change="sizeChange"
              @current-change="pageChange"
              :current-page="rebateList[1].page"
              :page-sizes="[10, 50, 100, 200, 500, 1000]"
              :page-size="rebateList[1].rows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="rebateList[1].total">
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
                <el-select placeholder="状态" style="width:150px;" v-model="filters[2].rebateRecordState" @change="getRebateList(1)">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="未打款" value="1"></el-option>
                  <el-option label="已打款" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 350px;" v-model="filters[2].searchKey" >
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
          </el-col>
          <el-col :span="20" class="l-text-right">
            <el-pagination
              @size-change="sizeChange"
              @current-change="pageChange"
              :current-page="rebateList[2].page"
              :page-sizes="[10, 50, 100, 200, 500, 1000]"
              :page-size="rebateList[2].rows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="rebateList[2].total">
            </el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="代理商申请审核">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="24">
            <el-form ref="filterForm-2" :model="filters[3]" :rules="filterRules" :inline="true">
              <el-form-item label="审核状态">
                <el-select placeholder="审核状态" style="width:150px;" v-model="filters[3].rebateRecordState" @change="getRebateList(1)">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="未审核" value="1"></el-option>
                  <el-option label="已审核" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="申请类型">
                <el-select placeholder="申请类型" style="width:150px;" v-model="filters[3].rebateRecordState" @change="getRebateList(1)">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="小U店长" value="1"></el-option>
                  <el-option label="区域合伙人" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 350px;" v-model="filters[3].searchKey" >
                  <el-select slot="prepend" placeholder="搜索类型" v-model="filters[3].searchType">
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
        <el-table :data="rebateList[3].data" highlight-current-row v-loading="rebateList[3].loading" @selection-change="sltChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="#" width="55"></el-table-column>
          <el-table-column prop="agentInfoName" label="真实姓名" min-width="100"></el-table-column>
          <el-table-column prop="phoneNumber" label="联系方式" width="130"></el-table-column>
          <el-table-column prop="agentId" label="申请类型" min-width="100">
            <template scope="scope">
              <span v-if="scope.row.agentId == 1">小U店长</span>
              <span v-if="scope.row.agentId == 2">区域合伙人</span>
            </template>
          </el-table-column>
          <el-table-column prop="becomeAgentDate" label="申请时间" align="center" width="110"></el-table-column>
          <el-table-column prop="idCards" label="身份证号" align="center" min-width="120"></el-table-column>
          <el-table-column prop="image" label="营业执照" align="center" min-width="120">
            <template scope="scope">
              <img style="display:block;margin:10px auto;width:60px;height:60px;" @click="licenceImageShow(scope.row.image)" :src="$utils.image.thumb(scope.row.image, 60, 60)" alt="">
            </template>
          </el-table-column>
          <el-table-column prop="recommendName" label="推荐代理商" align="center" min-width="120">
            <template scope="scope">
              <div v-if="scope.row.recommendName">
                <span>{{scope.row.recommendName}}</span><br>
                <span class="l-fs-xs">剩余推荐小U数量({{scope.row.recommendNumber}})</span>
              </div>
            </template>
          </el-table-column>  
          <el-table-column prop="recommendExamineRemarks" label="申请备注" min-width="150"></el-table-column>
          <el-table-column prop="agentState" label="审核状态" align="center" min-width="110">
            <template scope="scope">
              <span class="l-text-warn" v-if="scope.row.agentState == 0">未审核</span>
              <span class="l-text-ok" v-if="scope.row.agentState == 1">已通过</span>
              <span class="l-text-error" v-if="scope.row.agentState == 2">已拒绝</span>
              <div class="l-fs-xs l-lh-s l-margin-t-s" v-if="scope.row.agentId == 1">
                <span v-if="scope.row.recommendExamineState == 0">(该小U上级代理未审核)</span>
                <span v-else>(该小U上级代理已通过)</span>  
              </div>
            </template>
          </el-table-column>  
          <el-table-column prop="rebateRecordState" label="操作" align="center" min-width="100">
            <template scope="scope">
              <el-button size="small" v-if="scope.row.agentState == 0" type="text" @click.native.prevent="examineAreaDialog(scope.row)">审核</el-button>
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
              :current-page="rebateList[3].page"
              :page-sizes="[10, 50, 100, 200, 500, 1000]"
              :page-size="rebateList[3].rows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="rebateList[3].total">
            </el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="负责区域管理" custom-class="l-dialog" :visible.sync="areaInfo.listVisible" size="tiny">
      <table class="l-areaInfo">
        <tr>
          <td>代理区域</td>
          <td width="300">
            <div style="position:relative;">
              <a class="l-margin-r-s">新增区域</a><i v-show="areaInfo.loading" class="el-icon-loading l-text-blue"></i>
              <div style="position: absolute; top:-10px; left:0; opacity: 0;">
                <el-cascader ref="agentArea" @change="addAreaOk" placeholder="请选择区域" v-model="areaInfo.sltedArea" :options="cityData" :props="{label: 'text'}"></el-cascader>  
              </div>
            </div>
            <ul>
              <li v-for="item in areaInfo.list">
                <a class="l-fr" @click="delArea(item)">删除</a>
                {{item.areaName}}
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <td>收货地址</td>
          <td>
            <el-input type="textarea" autosize placeholder="选填" v-model="areaInfo.address"></el-input>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <el-button type="danger" @click="examineArea(0)">&ensp;拒绝&ensp;</el-button>
            <el-button type="primary" @click="examineArea(1)">&ensp;通过&ensp;</el-button>
          </td>
        </tr>
      </table>
    </el-dialog>

    <!-- <el-dialog title="新增区域" :visible.sync="areaInfo.areaVisible" size="tiny" :close-on-click-modal="false">
      <el-form :inline="true" label-width="80px">
        <el-form-item>
          <el-cascader placeholder="请选择区域" style="width: 350px;" v-model="areaInfo.sltedArea" :options="cityData" :props="{label: 'text'}"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="areaInfo.loading" @click="addAreaOk">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog> -->

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

    <el-dialog title="营业执照" :visible.sync="licenceImage.visible" size="tiny">
      <img width="100%" :src="licenceImage.url" alt="" key="licenceImage">
    </el-dialog>
  </div>
</template>

<script>
import cityData from 'src/scripts/city.data'
export default {
  data() {
    return {
      cityData,
      tabIndex: '0',
      rebateRecordType: ['','商城销售返点','销售额外奖励','区域管理返点','集团分红','推荐区域返点','邮寄直接返点', '成本返利'],
      payMoneyInfo: {
        loading: false,
        visible: false,
        remark: '',
        money: 0
      },

      licenceImage: {
        url: '',
        visible: false
      },
      areaInfo: {
        loading: false,
        sltedArea: [],
        listVisible: false,
        areaVisible: false,
        list: [],
        address: '',
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
        },{
          loading: false,
          data: [],
          slteds: [],
          page: 1,
          total: 0
        }
      ],

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
    sizeChange(size = 200) {
      this.rebateList[this.tabIndex].rows = size
      this.getRebateList()
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
      this.getRebateList(this.rebateList[this.tabIndex].page)  
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
        formData.examineStartDate = filter.dateRange[0] ? filter.dateRange[0].format('yyyy-MM-dd') : ''
        formData.examineFinishDate = filter.dateRange[1] ? filter.dateRange[1].format('yyyy-MM-dd') : '' 
      }
      
      rebateList.loading = true
      let promise
      switch(Number(this.tabIndex)) {
        case 0:
          formData.rebateRecordState = filter.rebateRecordState
          promise = this.$api.agent.getRebateList(formData, page, rebateList.rows)
          break
        case 1:
          formData.withdrawalsState = filter.withdrawalsState
          promise = this.$api.agent.getWithdrawalsList(formData, page, rebateList.rows)
          break
        case 3:
          promise = this.$api.agent.agentUList(formData, page, rebateList.rows)
          break
        default:
          formData.rebateRecordState = filter.rebateRecordState
          formData.isPartner = this.tabIndex == 2 ? 1 : ''
          formData.agentId = this.tabIndex == 2 ? 2 : ''
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
      switch(Number(this.tabIndex)) {
        case 0:
          promise = this.$api.agent.examineRebate(this.examineInfo.slted.rebateRecordId, isPass, this.examineInfo.reason)
          break
        case 1:
          promise = this.$api.agent.examineWithdrawals(this.examineInfo.slted.withdrawalsId, isPass, this.examineInfo.reason)
          break
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
    examines() { // 批量通过
      let rebateRecordIds = []
      this.rebateList[0].slteds.forEach((item)=>{
        if(item.isExamine > 0 && item.rebateRecordState == 0){
          rebateRecordIds.push(item.rebateRecordId)  
        }
      })

      if(rebateRecordIds.length === 0){
        this.$message({
          type: 'info',
          message: '没有可审核通过的流水'
        })
        return
      }

      let loading = this.$loading()
      this.$api.agent.examineRebate(rebateRecordIds.join(','), 1, '').then(()=>{
        this.$message({
          type: 'success',
          message: '批量审核通过成功'
        })
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
    },
    examineDialog(item) {
      this.examineInfo.reason = ''
      this.examineInfo.slted = item
      this.examineInfo.visible = true
    },
    examineAreaDialog(item) {
      this.areaInfo.listVisible = true
      this.areaInfo.agentInfoId = item.agentInfoId
      this.areaInfo.address = item.address
      this.areaInfo.list = []
    },
    addAreaOk(value) {
      let hasAreaId = false
      let agentInfoId = this.areaInfo.agentInfoId
      let provinceId = this.areaInfo.sltedArea[0] || ''
      let cityId = this.areaInfo.sltedArea[1] || ''
      let areaId = this.areaInfo.sltedArea[2] || ''
      this.areaInfo.list.forEach((item)=>{
        if(item.areaId === areaId){
          hasAreaId = true
          return true
        }
      })

      if(!hasAreaId){
        this.areaInfo.loading = true
        this.$api.agent.checkAreas({
          provinceId, cityId, areaId, agentInfoId
        }).then(()=>{
          this.areaInfo.list.push({
            provinceId, cityId, areaId, 
            areaName: this.$refs.agentArea.currentLabels.join('')
          })
        }).finally(()=>{
          this.areaInfo.loading = false
        })
      }
    },
    delArea(item) {
      this.areaInfo.list = this.areaInfo.list.filter((_item)=>{
        return item.areaId !== _item.areaId
      })
    },
    examineArea(isPass = 1){
      let agentInfoId = this.areaInfo.agentInfoId
      let address = this.areaInfo.address
      let areaIds = ''
      if(isPass == 1) {
        areaIds = this.areaInfo.list.map((item)=>{
          return item.provinceId + ',' + item.cityId + ',' + item.areaId
        }).join('|')

        if(!areaIds){
          this.$message({
            type: 'error',
            message: '请选择代理区域'
          })
          return
        }
      }

      let loading = this.$loading()
      this.$api.agent.examineApply({
        isPass, areaIds, agentInfoId, address
      }).then(()=>{
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.areaInfo.listVisible = false
        this.refreshList()
      }).finally(()=>{
        loading.close()
      })
    },
    licenceImageShow(url = '') {
      let loading = this.$loading()
      let promise = new Promise((resolve, reject)=>{
        let img = new Image()
        img.onload = resolve
        img.onerror = reject
        img.src = url
      })

      promise.then((img)=>{
        this.licenceImage.url = url  
        this.licenceImage.visible = true
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
<style scoped lang="scss">
.l-areaInfo{
  a{color: #20a0ff;cursor: pointer;}
  a:hover{text-decoration: underline;}
  td{vertical-align: top; padding: 10px;}
  ul{margin:0; padding: 0; list-style: none;}
  li{margin: 10px 0; width: 350px;}
}
</style>