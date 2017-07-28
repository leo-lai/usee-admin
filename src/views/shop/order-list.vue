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
            <el-form ref="filterForm-0" :model="filters[0]" :rules="filterRules" :inline="true">
              <el-form-item label="开发票" prop="isPaperCheck">
                <el-select placeholder="是否要求开发票" v-model="filters[0].isPaperCheck" style="width:150px;" @change="getOrderList(1)">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="下单日期" prop="dateRange">
                <el-date-picker type="daterange" placeholder="选择日期范围" :editable="false" v-model="filters[0].dateRange" :picker-options="pickerOptions" @change="search"></el-date-picker>
              </el-form-item>
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 350px;" v-model="filters[0].searchKey">
                  <el-select slot="prepend" placeholder="搜索类型" v-model="filters[0].searchType">
                    <el-option label="订单编号" value="orderCode"></el-option>
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
        <el-table :data="orderList[0].data" stripe highlight-current-row element-loading-text="拼命加载中" v-loading="orderList[0].loading" @selection-change="sltChange">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" type="index" label="#" width="55"></el-table-column>
          <el-table-column prop="orderCode" label="订单编号" min-width="120"></el-table-column>
          <el-table-column prop="startDate" label="下单日期" min-width="120"></el-table-column>
          <el-table-column align="center"  prop="amount"label="订单金额" min-width="100"></el-table-column>
          <el-table-column align="center" label="订单状态" min-width="120">
            <template scope="scope">
              <span :class="formatState(scope.row.ordersState, 'cls')">{{formatState(scope.row.ordersState)}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="购买商品" min-width="100">
            <template scope="scope">
              <el-popover trigger="hover" placement="top">
                <table class="l-inner-table">
                  <tr>
                    <th>商品名称</th>
                    <th>商品款式</th>
                    <th>商品数量</th>
                    <th>商品价格</th>
                  </tr>
                  <tr v-for="item in scope.row.ordersInfo">
                    <td>{{item.goodsName}}</td>
                    <td>{{item.colorTypeName}}</td>
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
          <el-table-column align="center" prop="phoneNumber" label="买家手机" min-width="100"></el-table-column>
          <el-table-column align="center" label="开发票" min-width="100">
            <template scope="scope">
              <span :class="{'l-text-error': scope.row.isPaperCheck}">{{scope.row.isPaperCheck?'是':'否'}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="150">
            <template scope="scope">
              <el-button size="small" type="text" @click.native.prevent="getOrderInfo(scope.row.orderId)">查看详情</el-button>
              <el-button v-if="scope.row.ordersState == 2" size="small" type="text" @click.native.prevent="examine(1, scope.row.orderId)">审核通过</el-button>
              <template v-if="scope.row.ordersState == 3">
                <el-button size="small" type="text" @click.native.prevent="print(scope.row.orderId)">打印订单</el-button>
                <el-button size="small" type="text" @click.native.prevent="express(scope.row.orderId)">发货</el-button>
              </template>
              <template v-if="scope.row.ordersState == 4">
                <el-button size="small" type="text" @click.native.prevent="expressView(scope.row.expressURL)">查看快递单</el-button>
              </template>
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
              :current-page="orderList[0].page"
              :page-sizes="[10, 50, 100, 200, 500, 1000]"
              :page-size="orderList[0].rows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="orderList[0].total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
      <div class="l-tab-pane" v-show="tabIndex == 1">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="24">
            <el-form ref="filterForm-1" :model="filters[1]" :rules="filterRules" :inline="true">
              <el-form-item label="下单日期" prop="dateRange">
                <el-date-picker type="daterange" placeholder="选择日期范围" :editable="false" v-model="filters[1].dateRange" :picker-options="pickerOptions" @change="search"></el-date-picker>
              </el-form-item>
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 350px;" v-model="filters[1].searchKey">
                  <el-select slot="prepend" placeholder="搜索类型" v-model="filters[1].searchType">
                    <el-option label="订单编号" value="orderCode"></el-option>
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
        <el-table :data="orderList[1].data" stripe highlight-current-row element-loading-text="拼命加载中" v-loading="orderList[1].loading" @selection-change="sltChange">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" type="index" label="#" width="55"></el-table-column>
          <el-table-column prop="orderCode" label="订单编号" min-width="120"></el-table-column>
          <el-table-column prop="startDate" label="下单日期" min-width="120"></el-table-column>
          <el-table-column align="center" prop="amount" label="订单金额" min-width="100"></el-table-column>
          <el-table-column align="center" label="购买商品" min-width="100">
            <template scope="scope">
              <el-popover trigger="hover" placement="top">
                <table class="l-inner-table">
                  <tr>
                    <th>商品名称</th>
                    <th>商品款式</th>
                    <th>商品数量</th>
                    <th>商品价格</th>
                  </tr>
                  <tr v-for="item in scope.row.ordersInfo">
                    <td>{{item.goodsName}}</td>
                    <td>{{item.colorTypeName}}</td>
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
          <el-table-column align="center" prop="phoneNumber" label="买家手机" min-width="100"></el-table-column>
          <el-table-column align="center" label="开发票" min-width="100">
            <template scope="scope">
              <span :class="{'l-text-error': scope.row.isPaperCheck}">{{scope.row.isPaperCheck?'是':'否'}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="100">
            <template scope="scope">
              <el-button size="small" type="text" @click.native.prevent="getOrderInfo(scope.row.orderId)">查看</el-button>
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
              :current-page="orderList[1].page"
              :page-sizes="[10, 50, 100, 200, 500, 1000]"
              :page-size="orderList[1].rows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="orderList[1].total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
      <div class="l-tab-pane" v-show="tabIndex == 2">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="24">
            <el-form ref="filterForm-2" :model="filters[2]" :rules="filterRules" :inline="true">
              <el-form-item>
                <el-button-group>
                  <el-button :disabled="orderList[2].slteds.length===0" @click.native.prevent="examine(1)">批量通过</el-button>
                  <!-- <el-button :disabled="orderList[2].slteds.length===0" @click.native.prevent="examine(0)">批量不通过</el-button> -->
                </el-button-group>
              </el-form-item>
              <el-form-item label="开发票" prop="isPaperCheck">
                <el-select placeholder="是否要求开发票" v-model="filters[2].isPaperCheck" style="width:150px;" @change="search">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="下单日期" prop="dateRange">
                <el-date-picker type="daterange" placeholder="选择日期范围" :editable="false" v-model="filters[2].dateRange" :picker-options="pickerOptions" @change="search"></el-date-picker>
              </el-form-item>
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 350px;" v-model="filters[2].searchKey">
                  <el-select slot="prepend" placeholder="搜索类型" v-model="filters[2].searchType">
                    <el-option label="订单编号" value="orderCode"></el-option>
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
        <el-table :data="orderList[2].data" stripe highlight-current-row element-loading-text="拼命加载中" v-loading="orderList[2].loading" @selection-change="sltChange">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" type="index" label="#" width="55"></el-table-column>
          <el-table-column prop="orderCode" label="订单编号" min-width="120"></el-table-column>
          <el-table-column prop="payDate" label="支付时间" min-width="120"></el-table-column>
          <el-table-column align="center" prop="amount" label="订单金额" min-width="100"></el-table-column>
          <el-table-column align="center" label="购买商品" min-width="100">
            <template scope="scope">
              <el-popover trigger="hover" placement="top">
                <table class="l-inner-table">
                  <tr>
                    <th>商品名称</th>
                    <th>商品款式</th>
                    <th>商品数量</th>
                    <th>商品价格</th>
                  </tr>
                  <tr v-for="item in scope.row.ordersInfo">
                    <td>{{item.goodsName}}</td>
                    <td>{{item.colorTypeName}}</td>
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
          <el-table-column align="center" prop="phoneNumber" label="买家手机" min-width="100"></el-table-column>
          <el-table-column align="center" label="开发票" min-width="100">
            <template scope="scope">
              <span :class="{'l-text-error': scope.row.isPaperCheck}">{{scope.row.isPaperCheck?'是':'否'}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="120">
            <template scope="scope">
              <el-button size="small" type="text" @click.native.prevent="getOrderInfo(scope.row.orderId)">查看</el-button>
              <el-button size="small" type="text" @click.native.prevent="examine(1, scope.row.orderId)">审核通过</el-button>
              <!-- <el-button size="small" type="text" @click.native.prevent="examine(0, scope.row.orderId)">审核不通过</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <!--列表 end-->

        <!--分页-->
        <el-row class="l-toolbar" type="flex" align="middle">
          <el-col :span="4">
          </el-col>
          <el-col :span="20" class="l-text-right">
            <el-pagination
              @size-change="sizeChange"
              @current-change="pageChange"
              :current-page="orderList[2].page"
              :page-sizes="[10, 50, 100, 200, 500, 1000]"
              :page-size="orderList[2].rows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="orderList[2].total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
      <div class="l-tab-pane" v-show="tabIndex == 3">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="24">
            <el-form ref="filterForm-3" :model="filters[3]" :rules="filterRules" :inline="true">
              <el-form-item label="审核日期" prop="dateRange">
                <el-date-picker type="daterange" placeholder="选择日期范围" :editable="false" v-model="filters[3].dateRange" :picker-options="pickerOptions" @change="search"></el-date-picker>
              </el-form-item>
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 350px;" v-model="filters[3].searchKey">
                  <el-select slot="prepend" placeholder="搜索类型" v-model="filters[3].searchType">
                    <el-option label="订单编号" value="orderCode"></el-option>
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
        <el-table :data="orderList[3].data" stripe highlight-current-row element-loading-text="拼命加载中" v-loading="orderList[3].loading" @selection-change="sltChange">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" type="index" label="#" width="55"></el-table-column>
          <el-table-column prop="orderCode" label="订单编号" min-width="120"></el-table-column>
          <el-table-column prop="examineDate" label="审核日期" min-width="120"></el-table-column>
          <el-table-column prop="systenUsersName" label="审核人" min-width="100"></el-table-column>
          <el-table-column align="center" prop="userName" label="买家名称" min-width="120"></el-table-column>
          <el-table-column align="center" prop="phoneNumber" label="买家手机" min-width="100"></el-table-column>
          <el-table-column prop="address" label="收货地址" min-width="120"></el-table-column>
          <el-table-column align="center" label="购买商品" min-width="100">
            <template scope="scope">
              <el-popover trigger="hover" placement="top">
                <table class="l-inner-table">
                  <tr>
                    <th>商品名称</th>
                    <th>商品款式</th>
                    <th>商品数量</th>
                    <th>商品价格</th>
                  </tr>
                  <tr v-for="item in scope.row.ordersInfo">
                    <td>{{item.goodsName}}</td>
                    <td>{{item.colorTypeName}}</td>
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
          <el-table-column align="center" label="操作" min-width="150">
            <template scope="scope">
              <el-button size="small" type="text" @click.native.prevent="getOrderInfo(scope.row.orderId)">查看</el-button>
              <el-button size="small" type="text" @click.native.prevent="print(scope.row.orderId)">打印</el-button>
              <el-button size="small" type="text" @click.native.prevent="express(scope.row.orderId)">发货</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--列表 end-->

        <!--分页-->
        <el-row class="l-toolbar" type="flex" align="middle">
          <el-col :span="4">
          </el-col>
          <el-col :span="20" class="l-text-right">
            <el-pagination
              @size-change="sizeChange"
              @current-change="pageChange"
              :current-page="orderList[3].page"
              :page-sizes="[10, 50, 100, 200, 500, 1000]"
              :page-size="orderList[3].rows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="orderList[3].total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
      <div class="l-tab-pane" v-show="tabIndex == 4">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="24">
            <el-form ref="filterForm-4" :model="filters[4]" :rules="filterRules" :inline="true">
              <el-form-item label="发货日期" prop="dateRange">
                <el-date-picker type="daterange" placeholder="选择日期范围" :editable="false" v-model="filters[4].dateRange" :picker-options="pickerOptions" @change="search"></el-date-picker>
              </el-form-item>
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 350px;" v-model="filters[4].searchKey">
                  <el-select slot="prepend" placeholder="搜索类型" v-model="filters[4].searchType">
                    <el-option label="订单编号" value="orderCode"></el-option>
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
        <!--列表-->
        <el-table :data="orderList[4].data" stripe highlight-current-row element-loading-text="拼命加载中" v-loading="orderList[4].loading" @selection-change="sltChange">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" type="index" label="#" width="55"></el-table-column>
          <el-table-column prop="orderCode" label="订单编号" min-width="120"></el-table-column>
          <el-table-column prop="examineDate" label="审核日期" min-width="120"></el-table-column>
          <el-table-column prop="systenUsersName" label="审核人" min-width="100"></el-table-column>
          <el-table-column align="center" prop="userName" label="买家名称" min-width="120"></el-table-column>
          <el-table-column align="center" prop="phoneNumber" label="买家手机" min-width="100"></el-table-column>
          <el-table-column prop="address" label="收货地址" min-width="120"></el-table-column>
          <el-table-column align="center" label="购买商品" min-width="100">
            <template scope="scope">
              <el-popover trigger="hover" placement="top">
                <table class="l-inner-table">
                  <tr>
                    <th>商品名称</th>
                    <th>商品款式</th>
                    <th>商品数量</th>
                    <th>商品价格</th>
                  </tr>
                  <tr v-for="item in scope.row.ordersInfo">
                    <td>{{item.goodsName}}</td>
                    <td>{{item.colorTypeName}}</td>
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
          <el-table-column align="center" label="操作" min-width="120">
            <template scope="scope">
              <el-button size="small" type="text" @click.native.prevent="getOrderInfo(scope.row.orderId)">查看</el-button>
              <el-button v-if="scope.row.ordersState == 4" size="small" type="text" @click.native.prevent="expressView(scope.row.expressURL)">查看快递单</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--列表 end-->
        <!--列表 end-->

        <!--分页-->
        <el-row class="l-toolbar" type="flex" align="middle">
          <el-col :span="4">
          </el-col>
          <el-col :span="20" class="l-text-right">
            <el-pagination
              @size-change="sizeChange"
              @current-change="pageChange"
              :current-page="orderList[4].page"
              :page-sizes="[10, 50, 100, 200, 500, 1000]"
              :page-size="orderList[4].rows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="orderList[4].total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
      <div class="l-tab-pane" v-show="tabIndex == 5">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="24">
            <el-form ref="filterForm-5" :model="filters[5]" :rules="filterRules" :inline="true">
              <el-form-item label="收货日期" prop="dateRange">
                <el-date-picker type="daterange" placeholder="选择日期范围" :editable="false" v-model="filters[5].dateRange" :picker-options="pickerOptions" @change="search"></el-date-picker>
              </el-form-item>
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 350px;" v-model="filters[5].searchKey">
                  <el-select slot="prepend" placeholder="搜索类型" v-model="filters[5].searchType">
                    <el-option label="订单编号" value="orderCode"></el-option>
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
        <!--列表-->
        <el-table :data="orderList[5].data" stripe highlight-current-row element-loading-text="拼命加载中" v-loading="orderList[5].loading" @selection-change="sltChange">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" type="index" label="#" width="55"></el-table-column>
          <el-table-column prop="orderCode" label="订单编号" min-width="120"></el-table-column>
          <el-table-column prop="examineDate" label="收货日期" min-width="120"></el-table-column>
          <el-table-column align="center" prop="userName" label="买家名称" min-width="120"></el-table-column>
          <el-table-column align="center" prop="phoneNumber" label="买家手机" min-width="100"></el-table-column>
          <el-table-column prop="address" label="收货地址" min-width="120"></el-table-column>
          <el-table-column align="center" label="购买商品" min-width="100">
            <template scope="scope">
              <el-popover trigger="hover" placement="top">
                <table class="l-inner-table">
                  <tr>
                    <th>商品名称</th>
                    <th>商品款式</th>
                    <th>商品数量</th>
                    <th>商品价格</th>
                  </tr>
                  <tr v-for="item in scope.row.ordersInfo">
                    <td>{{item.goodsName}}</td>
                    <td>{{item.colorTypeName}}</td>
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
          <el-table-column prop="amount" align="center" label="订单金额" min-width="100"></el-table-column>
          <el-table-column align="center" label="操作" min-width="100">
            <template scope="scope">
              <el-button size="small" type="text" @click.native.prevent="getOrderInfo(scope.row.orderId)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--列表 end-->
        <!--列表 end-->

        <!--分页-->
        <el-row class="l-toolbar" type="flex" align="middle">
          <el-col :span="4">
          </el-col>
          <el-col :span="20" class="l-text-right">
            <el-pagination
              @size-change="sizeChange"
              @current-change="pageChange"
              :current-page="orderList[5].page"
              :page-sizes="[10, 50, 100, 200, 500, 1000]"
              :page-size="orderList[5].rows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="orderList[5].total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
      <div class="l-tab-pane" v-show="tabIndex == 6">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="24">
            <el-form ref="filterForm-5" :model="filters[6]" :rules="filterRules" :inline="true">
              <el-form-item label="下单日期" prop="dateRange">
                <el-date-picker type="daterange" placeholder="选择日期范围" :editable="false" v-model="filters[6].dateRange" :picker-options="pickerOptions" @change="search"></el-date-picker>
              </el-form-item>
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 350px;" v-model="filters[6].searchKey">
                  <el-select slot="prepend" placeholder="搜索类型" v-model="filters[6].searchType">
                    <el-option label="订单编号" value="orderCode"></el-option>
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
        <!--列表-->
        <el-table :data="orderList[6].data" stripe highlight-current-row element-loading-text="拼命加载中" v-loading="orderList[6].loading" @selection-change="sltChange">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" type="index" label="#" width="55"></el-table-column>
          <el-table-column prop="orderCode" label="订单编号" min-width="120"></el-table-column>
          <el-table-column prop="startDate" label="下单日期" min-width="120"></el-table-column>
          <el-table-column align="center" prop="userName" label="买家名称" min-width="120"></el-table-column>
          <el-table-column align="center" prop="phoneNumber" label="买家手机" min-width="100"></el-table-column>
          <el-table-column prop="address" label="收货地址" min-width="120"></el-table-column>
          <el-table-column align="center" label="购买商品" min-width="100">
            <template scope="scope">
              <el-popover trigger="hover" placement="top">
                <table class="l-inner-table">
                  <tr>
                    <th>商品名称</th>
                    <th>商品款式</th>
                    <th>商品数量</th>
                    <th>商品价格</th>
                  </tr>
                  <tr v-for="item in scope.row.ordersInfo">
                    <td>{{item.goodsName}}</td>
                    <td>{{item.colorTypeName}}</td>
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
          <el-table-column align="center" prop="amount" label="订单金额(元)" min-width="100"></el-table-column>
          <el-table-column align="center" label="操作" min-width="100">
            <template scope="scope">
              <el-button size="small" type="text" @click.native.prevent="getOrderInfo(scope.row.orderId)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--列表 end-->
        <!--列表 end-->

        <!--分页-->
        <el-row class="l-toolbar" type="flex" align="middle">
          <el-col :span="4">
          </el-col>
          <el-col :span="20" class="l-text-right">
            <el-pagination
              @size-change="sizeChange"
              @current-change="pageChange"
              :current-page="orderList[6].page"
              :page-sizes="[10, 50, 100, 200, 500, 1000]"
              :page-size="orderList[6].rows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="orderList[6].total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
    </div>
    <!--订单详情-->
    <el-dialog title="订单详情" custom-class="l-dialog l-order-info" :visible.sync="orderInfo.visible" >
      <div class="l-panel l-margin-b">
        <div class="l-panel-tit">基本信息</div>
        <div class="l-panel-cont">
          <div class="l-inline-row _33">
            <p class="_td">订单编号：{{orderInfo.data.orderCode}}</p>
            <p class="_td">订单金额：{{orderInfo.data.amount}}元</p>
            <p class="_td">买家名称：{{orderInfo.data.userName}}</p>
            <p class="_td">买家手机：{{orderInfo.data.phoneNumber}}</p>
            <p class="_td">订单来源：{{orderInfo.data.salesMode}}</p>
            <p class="_td">代&ensp;理&ensp;商：{{orderInfo.data.agentInfoName}}</p>
            <p class="_td">下单时间：{{orderInfo.data.startDate}}</p>
            <p class="_td">支付时间：{{orderInfo.data.payDate}}</p>
            <p class="_td">支付方式：{{orderInfo.data.paymentMethod === 1 ? '微信支付' : ''}}</p>
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
              <el-table-column prop="goodsCode" label="商品编号" min-width="120"></el-table-column>
              <el-table-column prop="goodsName" label="商品名称" min-width="120"></el-table-column>
              <el-table-column prop="colorTypeName" label="商品款式" align="center" min-width="120"></el-table-column>
              <el-table-column prop="goodsNumber" label="数量" align="center" min-width="120"></el-table-column>
              <el-table-column prop="goodsPayAmount" label="单价" align="center" min-width="120"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 快递列表 -->
    <el-dialog title="选择快递" custom-class="l-dialog" :visible.sync="expressInfo.visible" size="tiny">
      <div class="l-express-list">
        <div class="_item" v-for="item in expressInfo.data" 
          :class="{'_active': expressInfo.slted.expressId === item.expressId}" 
          @click="expressInfo.slted = item">
          <h3>{{item.expressName}}</h3>
          <p>{{expressInfo.payType[item.payType]}} </p>
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
        orderId: '',
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
      orderInfo: {
        loading: false,
        visible: false,
        data: {},
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
      stateList: [
        {
          state: '',
          cls: '',
          name: '全部订单'
        },{
          state: '1',
          cls: '',
          name: '待付款'
        },{
          state: '2',
          cls: 'l-text-hot',
          name: '待审核'
        },{
          state: '3',
          cls: 'l-text-fuchsia',
          name: '待发货'
        },{
          state: '4',
          cls: '',
          name: '已发货'
        },{
          state: '5',
          cls: '',
          name: '客户已收货'
        },{
          state: '-1',
          cls: 'l-text-gray',
          name: '已取消'
        },{
          state: '6',
          cls: '',
          name: '已评价',
          hidden: true
        }
      ],
      tabIndex: '0',
      orderList:[
        {
          data: [],
          slteds: [],
          total: 1,
          loading: false,
        },{
          data: [],
          slteds: [],
          total: 1,
          loading: false,
        },{
          data: [],
          slteds: [],
          total: 1,
          loading: false,
        },{
          data: [],
          slteds: [],
          total: 1,
          loading: false,
        },{
          data: [],
          slteds: [],
          total: 1,
          loading: false,
        },{
          data: [],
          slteds: [],
          total: 1,
          loading: false,
        },{
          data: [],
          slteds: [],
          total: 1,
          loading: false,
        },{
          data: [],
          slteds: [],
          total: 1,
          loading: false,
        },{
          data: [],
          slteds: [],
          total: 1,
          loading: false,
        },{
          data: [],
          slteds: [],
          total: 1,
          loading: false,
        }
      ],

      filterRules:{
        searchKey: [],
        dateRange: [],
        isPaperCheck: []
      },
      filters: [
        {
          searchKey: '',
          searchType: 'orderCode',
          isPaperCheck: '',
          dateRange: [],
          startDate: '',
          finishDate: ''
        },{
          searchKey: '',
          searchType: 'orderCode',
          dateRange: [],
          startDate: '',
          finishDate: ''
        },{
          searchKey: '',
          searchType: 'orderCode',
          isPaperCheck: '',
          dateRange: [],
          startDate: '',
          finishDate: ''
        },{
          searchKey: '',
          searchType: 'orderCode',
          dateRange: [],
          startDate: '',
          finishDate: ''
        },{
          searchKey: '',
          searchType: 'orderCode',
          dateRange: [],
          startDate: '',
          finishDate: ''
        },{
          searchKey: '',
          searchType: 'orderCode',
          dateRange: [],
          startDate: '',
          finishDate: ''
        },{
          searchKey: '',
          searchType: 'orderCode',
          dateRange: [],
          startDate: '',
          finishDate: ''
        },{
          searchKey: '',
          searchType: 'orderCode',
          dateRange: [],
          startDate: '',
          finishDate: ''
        }
      ]
    }
  },
  computed: {
    tabList() {
      return this.stateList.filter((item)=>!item.hidden)
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
    formatState(state, prop = 'name') {
      let ret = this.stateList.filter((item)=>{
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
    clearFilter() {
      this.$refs['filterForm-' + this.tabIndex].resetFields()
      this.getOrderList()
    },
    refreshList() {
      this.getOrderList(this.orderList[this.tabIndex].page)
    },
    search() {
      this.getOrderList()
    },
    sizeChange(size = 200) {
      this.orderList[this.tabIndex].rows = size
      this.getOrderList()
    },
    pageChange(page = 1) {
      this.getOrderList(page)
    },
    getOrderList(page = 1, size = 200) {

      let index = this.tabIndex
      let orderList = this.orderList[index]
      let tabList = this.tabList[index]
      let filter = this.filters[index]
      let formData = {}
      switch(index){
        case '0': // 全部订单
          formData.isPaperCheck = filter.isPaperCheck
          break
        case '1': // 未付款
          break
        case '2': // 待审核
          formData.isPaperCheck = filter.isPaperCheck
          break
      }

      if(filter){
        filter.searchType && (formData[filter.searchType] = filter.searchKey)
        formData.startDate = filter.dateRange[0] ? filter.dateRange[0].format('yyyy-MM-dd') : ''
        formData.finishDate = filter.dateRange[1] ? filter.dateRange[1].format('yyyy-MM-dd') : ''  
      }
      
      formData.ordersState = tabList.state
      orderList.loading = true

      page = Math.max(Math.min(page, orderList.total), 1)
      this.$api.order.getList(formData, page, orderList.rows).then(({data})=>{
        orderList.total = data.total
        orderList.page = data.page
        orderList.rows = data.rows
        orderList.data = data.orders
      }).finally(()=>{
        orderList.loading = false
      })
    },
    print(orderId = '') { // 打印
      // window.open('/order/print/' + orderId, '_blank', 'location=no, menubar=no, status=no, toolbar=no, titlebar=no')
      window.open('/order/print/' + orderId)
    },
    express(orderId = ''){
      this.expressInfo.orderId = orderId

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
        this.$api.order.deliverDoods({
          expressId: this.expressInfo.slted.expressId,
          orderId: this.expressInfo.orderId
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
    examine(status, orderId) { // 审核
      if(status == undefined){
        return 
      }

      let list = this.orderList[this.tabIndex]
      if(!orderId){
        if(list.slteds.length === 0){
          this.$message('请选择要审核的订单')
          return
        }else{
          orderId = list.slteds.map((item)=>{
            return item.orderId
          }).join(',')
        }
      }
      list.loading = true
      this.$api.order.examine(orderId, status).then(()=>{
        this.$message('操作成功')
        this.getOrderList(list.page)
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
@import '~scss_vars';
.l-order-info{
  .l-panel-cont{
    margin-top: -5px;
  }
}
</style>