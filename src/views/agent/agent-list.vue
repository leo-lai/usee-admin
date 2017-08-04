<template>
  <div class="l-agent">
    <el-tabs v-model="tabIndex" type="card" @tab-click="tabClick">
      <el-tab-pane label="区域合伙人">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="20">
            <el-form ref="filterForm-0" :model="filters[0]" :rules="filterRules" :inline="true">
              <el-form-item label="筛选时间" prop="dateRange">
                <el-date-picker type="daterange" placeholder="选择日期范围" :editable="false" v-model="filters[0].dateRange" :picker-options="pickerOptions" @change="search"></el-date-picker>
              </el-form-item>
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 350px;" v-model="filters[0].searchKey">
                  <el-select slot="prepend" placeholder="搜索类型" v-model="filters[0].searchType">
                    <el-option label="手机号码" value="phoneNumber"></el-option>
                    <el-option label="合伙人名称" value="agentInfoName"></el-option>
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
              <el-form-item>
                <!-- <el-button type="primary" @click="openAgentDialog(1)">新增合伙人</el-button> -->
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <!--列表-->
        <el-table :data="agentList[0].data" highlight-current-row v-loading="agentList[0].loading" @selection-change="sltChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="#" width="55"></el-table-column>
          <el-table-column prop="agentInfoName" label="姓名" min-width="120"></el-table-column>
          <el-table-column prop="phoneNumber" label="联系方式" min-width="120"></el-table-column>
          <el-table-column prop="area" label="代理区域" min-width="150"></el-table-column>
          <el-table-column prop="numberOfPeople" label="客户人数" align="center" min-width="120"></el-table-column>
          <el-table-column prop="accumulatedIncome" label="已返利金额" align="center" min-width="120"></el-table-column>
          <el-table-column prop="rebateRecordAmount" label="总返利(含未审核)" align="center" min-width="150"></el-table-column>
          <el-table-column prop="accountBalance" label="账户余额(元)" align="center" min-width="120"></el-table-column>
          <el-table-column prop="followNumber" label="关联合伙人" align="center" min-width="120"></el-table-column>
          <el-table-column prop="becomeAgentDate" label="加入日期" width="110"></el-table-column>
          <el-table-column label="订单状态" align="center" min-width="120">
            <template scope="scope">
              <span class="l-text-error" v-if="scope.row.isFrozen">账户冻结</span>
              <span class="l-text-ok" v-else>正常使用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="150" align="center">
            <template scope="scope">
              <el-button size="small" type="text" @click="editAgentInfo(scope.row.agentInfoId)">编辑</el-button>
              <el-button size="small" type="text" @click="stockAdmin(scope.row.agentInfoId)">库存管理</el-button>
              <!-- <el-button size="small">查看二维码</el-button> -->
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
              :current-page="agentList[0].page"
              :page-sizes="[10, 50, 100, 200, 500, 1000]"
              :page-size="agentList[0].rows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="agentList[0].total">
            </el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="小U店长">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="20">
            <el-form ref="filterForm-1" :model="filters[1]" :rules="filterRules" :inline="true">
              <el-form-item label="筛选时间" prop="dateRange">
                <el-date-picker type="daterange" placeholder="选择日期范围" :editable="false" v-model="filters[1].dateRange" :picker-options="pickerOptions" @change="search"></el-date-picker>
              </el-form-item>
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 350px;" v-model="filters[1].searchKey" @blur="search">
                  <el-select slot="prepend" placeholder="搜索类型" v-model="filters[1].searchType">
                    <el-option label="手机号码" value="phoneNumber"></el-option>
                    <el-option label="合伙人名称" value="agentInfoName"></el-option>
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
              <el-form-item>
                <!-- <el-button type="primary" @click="xiaoUInfo.visible = true">新增小U店长</el-button> -->
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <!--列表-->
        <el-table :data="agentList[1].data" highlight-current-row v-loading="agentList[1].loading" @selection-change="sltChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="#" width="55"></el-table-column>
          <el-table-column prop="agentInfoName" label="微信昵称" min-width="120"></el-table-column>
          <el-table-column prop="phoneNumber" label="联系方式" min-width="120"></el-table-column>
          <el-table-column prop="numberOfPeople" label="客户人数" align="center" min-width="120"></el-table-column>
          <el-table-column prop="accumulatedIncome" label="已返利金额" align="center" min-width="120"></el-table-column>
          <el-table-column prop="rebateRecordAmount" label="总返利(含未审核)" align="center" min-width="150"></el-table-column>
          <el-table-column prop="accumulatedIncome" label="累计销售(套)" align="center" min-width="120"></el-table-column>
          <el-table-column prop="accountBalance" label="账户余额(元)" align="center" min-width="120"></el-table-column>
          <el-table-column prop="becomeAgentDate" label="成为时间" width="110"></el-table-column>
          <el-table-column label="状态" align="center" min-width="120">
            <template scope="scope">
              <span class="l-text-error" v-if="scope.row.isFrozen">已取消小U资格</span>
              <span class="l-text-ok" v-else>正常使用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="150" align="center">
            <template scope="scope">
              <el-button size="small" type="primary" @click="deliveryGoods2Dialog(scope.row.agentInfoId)">发货</el-button>
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
              :current-page="agentList[1].page"
              :page-sizes="[10, 50, 100, 200, 500, 1000]"
              :page-size="agentList[1].rows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="agentList[1].total">
            </el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <!--合伙人信息-->
    <el-dialog title="合伙人信息" ref="agentDialog" custom-class="l-dialog" :before-close="closeAgentDialog" :close-on-click-modal="false" :visible.sync="agentInfo.visible">
      <el-tabs v-model="agentInfo.tabIndex">
        <el-tab-pane label="基本信息">
          <el-form ref="agentForm" :model="agentForm" :rules="agentRules" :inline="true" class="l-agent-info" label-width="100px">
            <el-form-item label="合伙人姓名" prop="agentInfoName">
              <el-input v-model="agentForm.agentInfoName"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phoneNumber">
              <el-input v-model="agentForm.phoneNumber" :maxlength="11" :disabled="agentInfo.type == 2"></el-input>
            </el-form-item>
            <el-form-item label="合伙人单位" prop="agentCompany" class="l-input-block">
              <el-input v-model="agentForm.agentCompany"></el-input>
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicenseImage">
              <el-upload ref="agentUpload" name="img_file" class="avatar-uploader" :action="$api.baseUrl + '/uploadImage'" :show-file-list="false" :on-progress="uploadProgress" :on-success="uploadSuccess" :on-error="uploadError" :before-upload="uploadBefore">
                <img v-if="agentForm.businessLicenseImage" :src="$utils.image.thumb(agentForm.businessLicenseImage, 100, 100)" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">
                  <p v-show="uploading" class="l-text-hot"><i class="el-icon-loading"></i>&nbsp;图片上传中...</p>
                  <p>
                    <el-button v-if="agentForm.businessLicenseImage" @click="agentInfo.preview = true" type="text">查看大图</el-button>
                  </p>
                  <p>只能上传jpg/png文件，且不超过2M</p>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="初始库存" prop="goodsStock">
              <el-input v-model="agentForm.goodsStock" placeholder="" :disabled="agentInfo.type == 2"></el-input>
            </el-form-item>
            <el-form-item label="">
              <span class="l-text-error"> 注意：库存一经保存，将不可更改。 </span>
            </el-form-item>
            <el-form-item label="推荐码" prop="recommendAgentCode">
              <el-input v-model="agentForm.recommendAgentCode" placeholder="选填"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remarks" class="l-input-block">
              <el-input v-model="agentForm.remarks" placeholder="选填"></el-input>
            </el-form-item>
            <el-form-item class="l-input-block" style="margin-left:100px;">
              <el-button type="primary" @click.native.prevent="submitAgentForm('agentForm')" :loading="agentInfo.submiting">
                &nbsp;&nbsp;保存信息&nbsp;&nbsp;
              </el-button>
              <!-- <el-button class="l-margin-l" @click.native.prevent="resetAgentForm('agentForm')">
                &nbsp;&nbsp;重置&nbsp;&nbsp;
              </el-button> -->
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="代理区域">
          <table class="l-agent-list">
            <tr>
              <th>序号</th>
              <th>省市区</th>
            </tr>
            <tr v-for="(item,index) in agentInfoAreas">
              <td>代理区域{{index+1}}</td>
              <td>{{item.province + (item.city === item.province ? '' : item.city) + item.area}}</td>
            </tr>
            <tr>
              <td colspan="2" class="l-text-center">
                <el-button type="primary" @click="addAgentArea">添加代理区域</el-button>
              </td>
            </tr>
          </table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 代理区域 -->
    <el-dialog :visible.sync="agentInfoArea.visible" size="tiny" :close-on-click-modal="false">
      <el-form :inline="true" label-width="80px">
        <el-form-item label="代理区域">
          <el-cascader placeholder="请选择代理区域" v-model="cityDataSlted" :options="cityData" :props="{label: 'text'}"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="agentInfoArea.loading" @click="saveAgentArea">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog :visible.sync="agentInfo.preview" size="tiny">
      <img width="100%" :src="agentForm.businessLicenseImage" alt="">
    </el-dialog>
    <!-- 新增小U店长 -->
    <el-dialog title="新增小U店长" custom-class="l-dialog" :visible.sync="xiaoUInfo.visible" size="tiny">
      <el-row type="flex" :gutter="10" align="middle">
        <el-col :span="4">手机号码</el-col>
        <el-col :span="14">
          <el-input v-model="xiaoUForm.phoneNumber" :maxlength="11" placeholder="请输入手机号码"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button @click="getXiaoU" :loading="xiaoUInfo.loading">查询用户</el-button>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="10" align="middle" class="l-margin-tb-m">
        <el-col :span="4">微信昵称</el-col>
        <el-col :span="14">{{xiaoUInfo.data.userName}}</el-col>
        <el-col :span="6"></el-col>
      </el-row>
      <el-row type="flex" :gutter="10" align="middle">
        <el-col :span="4">用户姓名</el-col>
        <el-col :span="14">
          <el-input v-model="xiaoUForm.agentInfoName" placeholder="请填写用户姓名"></el-input>
        </el-col>
        <el-col :span="6"></el-col>
      </el-row>
      <el-row type="flex" align="middle" class="l-margin-tb-m">
        <el-col :span="24">最高一次购买明目舒眼水套数：{{xiaoUInfo.data.maxGoodsNumber}}</el-col>
      </el-row>
      <el-row type="flex" align="middle" class="l-margin-tb-m">
        <el-col :span="24">累计购买明目舒眼水套数：{{xiaoUInfo.data.sunGoodsNumber}}</el-col>
      </el-row>
      <el-row type="flex" justify="center" class="l-margin-t">
        <el-col :span="24" class="l-text-center">
          <el-button type="primary" :loading="xiaoUInfo.submiting" @click="changeXiaoU">升级为小U店长</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 库存信息 -->
    <el-dialog title="合伙人库存" custom-class="l-dialog" :visible.sync="agentGoods.visible" size="tiny">
      <el-table :data="agentGoods.data" :loading="agentGoods.loading">
        <el-table-column prop="goodsName" label="商品名称" min-width="120"></el-table-column>
        <el-table-column prop="goodsStock" label="剩余库存" min-width="120" align="center"></el-table-column>
        <el-table-column label="操作" min-width="120" align="center">
          <template scope="scope">
            <el-button type="primary" size="small" @click="deliveryGoodsDialog(scope.row)">提货</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 合伙人提货信息 -->
    <el-dialog title="合伙人提货" custom-class="l-dialog" :visible.sync="deliveryGoods.visible" size="tiny" :close-on-click-modal="false">
      <el-form :model="deliveryGoods.form" :rules="deliveryGoods.rules" ref="deliveryGoodsForm" label-width="100px" style="width:90%;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="提货商品">{{deliveryGoods.info.goodsName}}</el-form-item>
          </el-col>  
          <el-col :span="12">
            <el-form-item label="当前库存">{{deliveryGoods.info.goodsStock}}</el-form-item>
          </el-col>  
        </el-row>
        <el-form-item label="选择规格" prop="colorTypeId">
          <el-radio-group v-model="deliveryGoods.form.colorTypeId">
            <el-radio :label="item.colorId" v-for="item in deliveryGoods.info.colour" :key="item.colorId">{{item.colorName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提货数量" prop="goodsNumber">
          <el-input v-model="deliveryGoods.form.goodsNumber" :maxlength="7" placeholder="不能大于当前库存" style="width:auto;"></el-input>
        </el-form-item>
        <el-form-item label="收货人" prop="userName">
          <el-input v-model="deliveryGoods.form.userName" :maxlength="50" style="width:auto;" placeholder="收货人姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phoneNumber">
          <el-input v-model="deliveryGoods.form.phoneNumber" :maxlength="15" style="width:auto;" placeholder="请输入常用联系方式"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" class="l-input-block" prop="address">
          <el-row>
            <el-cascader style="width:100%;" placeholder="请选择收货区域" 
              v-model="deliveryGoods.citySlted" :options="cityData" :props="{label: 'text', value: 'text'}"></el-cascader>
          </el-row>
          <el-row class="l-margin-t-s">
            <el-input placeholder="请输入详细地址(不需要填写省市区)" v-model="deliveryGoods.address" :maxlength="100"></el-input>  
          </el-row>
        </el-form-item>
        <el-form-item label="邮寄方式" prop="expressId">
          <el-select v-model="deliveryGoods.form.expressId" placeholder="请选择邮寄方式">
            <el-option v-for="item in deliveryGoods.info.express" :key="item.expressId" 
              :value="item.expressId" :label="item.expressName + '('+expressPayType[item.payType]+')'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提货备注" prop="remark">
          <el-input type="textarea" v-model="deliveryGoods.form.remark" :maxlength="500" placeholder="选填"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="deliveryGoods.visible = false">取消</el-button>
          <el-button type="primary" :loading="deliveryGoods.submiting" @click="deliveryGoodsSubmit">确定提货</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 小U店长发货信息 -->
    <el-dialog title="小U店长发货" custom-class="l-dialog" :visible.sync="deliveryGoods2.visible" :before-close="closeDelivery2Dialog" size="tiny" :close-on-click-modal="false">
      <div class="l-margin-b-s l-text-gray">发货商品</div>
      <el-table :data="deliveryGoods2.deliveryGoodsInfo" empty-text="您还没添加要发货的商品">
        <el-table-column prop="goodsName" align="center" label="商品名称" min-width="200"></el-table-column>
        <el-table-column prop="goodsNumber" align="center" label="商品数量" min-width="130">
          <template scope="scope">
            <el-input-number style="display:block;" size="small" :min="1" :max="1000000" v-model="scope.row.goodsNumber"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="100">
          <template scope="scope">
            <el-button size="small" type="danger" @click="delDeliveryGoods(scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="l-margin l-text-center">
        <el-button type="primary" size="small" @click="goodsListData.visible = true">添加商品</el-button>
      </div>
      <div class="l-margin" v-if="deliveryGoods2.isPartnerRecommend == 1">
        <span>
          是否扣除推荐人货款：<el-switch v-model="deliveryGoods2.form.isRebates" on-text="是" on-value="1" off-value="0" off-text="否"></el-switch>
        </span>
        <span class="l-margin-l">
          推荐人：{{deliveryGoods2.recommendName}}
        </span>
      </div>
      <el-form :model="deliveryGoods2.form" :rules="deliveryGoods2.rules" ref="deliveryGoods2Form" label-width="100px" style="width:90%;">
        <el-form-item label="收货人" prop="userName">
          <el-input v-model="deliveryGoods2.form.userName" :maxlength="50" style="width:auto;" placeholder="收货人姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phoneNumber">
          <el-input v-model="deliveryGoods2.form.phoneNumber" :maxlength="15" style="width:auto;" placeholder="请输入常用联系方式"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" class="l-input-block" prop="address">
          <el-row>
            <el-cascader style="width:100%;" placeholder="请选择收货区域" 
              v-model="deliveryGoods2.citySlted" :options="cityData" :props="{label: 'text', value: 'text'}"></el-cascader>
          </el-row>
          <el-row class="l-margin-t-s">
            <el-input placeholder="请输入详细地址(不需要填写省市区)" v-model="deliveryGoods2.address" :maxlength="100"></el-input>  
          </el-row>
        </el-form-item>
        <el-form-item label="邮寄方式" prop="expressId">
          <el-select v-model="deliveryGoods2.form.expressId" placeholder="请选择邮寄方式">
            <el-option v-for="item in deliveryGoods2.info.express" :key="item.expressId" 
              :value="item.expressId" :label="item.expressName + '('+expressPayType[item.payType]+')'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提货备注" prop="remark">
          <el-input type="textarea" v-model="deliveryGoods2.form.remark" :maxlength="500" placeholder="选填"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="closeDelivery2Dialog()">取消</el-button>
          <el-button type="primary" :loading="deliveryGoods2.submiting" @click="deliveryGoods2Submit">确定发货</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 发货列表 -->
    <el-dialog title="选择要发货的商品" custom-class="l-dialog" :visible.sync="goodsListData.visible" size="tiny" :close-on-click-modal="false">
      <el-table :data="goodsListData.list" empty-text="没有可发货的商品">
        <el-table-column prop="goodsName" align="center" label="商品名称" min-width="200"></el-table-column>
        <el-table-column align="center" label="操作" min-width="120">
          <template scope="scope">
            <div style="padding: 0.25rem 0;">
              <el-button size="small" :plain="true" @click="sltDeliveryGoods(scope.row)">添加此商品</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import cityData from 'src/scripts/city.data'
export default {
  data() {
     let validateGoodsNumber = (rule, value, callback) => {                                 
      let number = Number(value)
      if (value === '') {
        callback(new Error('请输入提货数量'))
      } else if(Number.isNaN(number) || !/^\d+$/.test(number)){
        callback(new Error('请输入正确的数量'))
      } else if( number > this.deliveryGoods.info.goodsStock ) {
        callback(new Error('提货数量不能大于当前库存'))
      }else{
        callback()
      }
    }

    let validateAddress = (rule, value, callback) => {
      let number = Number(value)
      if (this.deliveryGoods.citySlted.length === 0) {
        callback(new Error('请选择收货区域'))
      } else if(!this.deliveryGoods.address){
        callback(new Error('请输入详细地址'))
      }else{
        this.deliveryGoods.form.address = this.deliveryGoods.citySlted.join('') + this.deliveryGoods.address
        callback()
      }
    }

    let validateAddress2 = (rule, value, callback) => {
      let number = Number(value)
      if (this.deliveryGoods2.citySlted.length === 0) {
        callback(new Error('请选择收货区域'))
      } else if(!this.deliveryGoods2.address){
        callback(new Error('请输入详细地址'))
      }else{
        this.deliveryGoods2.form.address = this.deliveryGoods2.citySlted.join('') + this.deliveryGoods2.address
        callback()
      }
    }

    return {
      cityData,
      cityDataSlted: [],

      uploading: false,

      xiaoUInfo: {
        visible: false,
        loading: false,
        submiting: false,
        data: {
          userName: '',
          maxGoodsNumber: '',
          sunGoodsNumber: ''
        }
      },
      xiaoUForm: {
        phoneNumber: '',
        agentInfoName: ''
      },

      goodsListData: {
        visible: false,
        list: []
      },

      expressPayType: {
        'SHIPPER': '寄方付',
        'CONSIGNEE': '到付',
        'MONTHLY': '月结',
        'THIRDPARTY': '第三方支付',
        'ZITI': '不发快递'
      },
      deliveryGoods: {
        visible: false,
        submiting: false,
        citySlted: [],
        address: '',
        info: {},
        rules: {
          colorTypeId: [{
            required: true,
            type: 'number',
            trigger: 'change'
          }],
          userName: [{
            required: true,
            message: '请输入收货人姓名',
            trigger: 'blur'
          }],
          phoneNumber: [{
            required: true,
            message: '请输入联系方式',
            trigger: 'blur'
          }],
          expressId: [{
            required: true,
            type: 'number',
            message: '请输入邮寄方式',
            trigger: 'blur'
          }],
          address: [{
            required: true,
            validator: validateAddress,
            trigger: 'blur'
          }],
          goodsNumber: [{
            required: true,
            validator: validateGoodsNumber,
            trigger: 'blur'
          }]
        },
        form:{
          phoneNumber: '',
          agentGoodsId: '',
          colorTypeId: '',
          expressId: '',
          userName: '',
          address: '',
          remark: '',
          goodsNumber: ''
        }
      },
      deliveryGoods2: {
        visible: false,
        submiting: false,
        isPartnerRecommend: 0,
        recommendName: '',
        citySlted: [],
        address: '',
        info: {},
        deliveryGoodsInfo: [],
        rules: {
          userName: [{
            required: true,
            message: '请输入收货人姓名',
            trigger: 'blur'
          }],
          phoneNumber: [{
            required: true,
            message: '请输入联系方式',
            trigger: 'blur'
          }],
          expressId: [{
            required: true,
            type: 'number',
            message: '请输入邮寄方式',
            trigger: 'blur'
          }],
          address: [{
            required: true,
            validator: validateAddress2,
            trigger: 'blur'
          }]
        },
        form:{
          deliveryGoodsInfo: [],
          phoneNumber: '',
          expressId: '',
          userName: '',
          address: '',
          isRebates: '0',
          remark: ''
        }
      },
      agentGoods: {
        visible: false,
        loading: false,
        data: []
      },
      agentInfo: {
        type: 1,
        tabIndex: '0',
        preview: false,
        submiting: false,
        visible: false,
        loading: false
      },
      agentForm: {
        goodsStock: '',
        agentInfoId: '',
        agentInfoName: '',
        phoneNumber: '',
        agentCompany: '',
        businessLicenseImage: '',
        recommendAgentCode: '',
        remarks: ''
      },
      agentRules: {
        agentInfoName: [{
          required: true,
          message: '请输入合伙人姓名',
          trigger: 'blur'
        }],
        phoneNumber: [{
          required: true,
          message: '请输入手机号码',
          trigger: 'blur'
        }, {
          pattern: /^1\d{10}$/,
          message: '请输入正确的手机号码',
          trigger: 'blur'
        }],
        agentCompany: [{
          required: true,
          message: '请选择合伙人单位',
          trigger: 'blur'
        }],
        businessLicenseImage: [{
          required: true,
          message: '请上传营业执照',
          trigger: 'change'
        }],
        goodsStock: [{
          required: true,
          message: '请填写初始库存',
          trigger: 'change'
        }, {
          pattern: /\d{1,8}/,
          message: '请正确填写库存',
          trigger: 'blur'
        }]
      },

      agentInfoAreas: [],
      agentInfoArea: {
        visible: false,
        loading: false
      },

      tabIndex: '0',
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
      agentList: [
        {
          loading: false,
          data: [],
          slteds: [],
          page: 1,
          total: 0
        }, {
          loading: false,
          data: [],
          slteds: [],
          page: 1,
          total: 0
        }
      ],

      filterRules: {
        searchKey: [],
        dateRange: []
      },
      filters: [
        {
          searchKey: '',
          searchType: 'phoneNumber',
          dateRange: [],
          startDate: '',
          finishDate: ''
        }, {
          searchKey: '',
          searchType: 'phoneNumber',
          dateRange: [],
          startDate: '',
          finishDate: ''
        }
      ]
    }
  },
  methods: {
    uploadProgress(event, file, fileList) {
      console.log(event, file, fileList)
    },
    uploadSuccess(response, file, fileList) {
      this.uploading = false
      this.agentForm.businessLicenseImage = response.data
    },
    uploadError(response, file, fileList) {
      this.$message({
        type: 'error',
        message: '图片上传失败'
      })
    },
    uploadBefore(file) {
      // const isJPG = file.type === 'image/jpeg'
      const isJPG = true
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }

      if (isJPG && isLt2M) {
        this.uploading = true
      }
      return isJPG && isLt2M
    },

    tabClick(tab, event) {
      this.tabInit(this.tabIndex)
    },
    tabInit(index) {
      if (index) {
        this.tabIndex = index
      } else {
        index = this.tabIndex
      }

      this.agentList[index] && this.agentList[index].data.length === 0 && this.getAgentList()
      this.$router.replace('?tab=' + index)
    },
    sltChange(slteds) {
      this.agentList[this.tabIndex].slteds = slteds
    },
    sizeChange(size = 200) {
      this.agentList[this.tabIndex].rows = size
      this.getAgentList()
    },
    pageChange(page) {
      this.getAgentList(page)
    },
    clearFilter() {
      this.$refs['filterForm-' + this.tabIndex].resetFields()
      this.getAgentList()
    },
    refreshList() {
      this.getAgentList(this.agentList[this.tabIndex].page)
    },
    search() {
      this.getAgentList()
    },
    deliveryGoodsDialog(item) { // 提货
      this.deliveryGoods.visible = true
      let loading = this.$loading()
      this.$api.agent.getDeliveryInfo(item.agentGoodsId).then(({data}) => {
        data.goodsStock = item.goodsStock 
        this.deliveryGoods.info = data
        this.deliveryGoods.form.agentGoodsId = item.agentGoodsId
        this.deliveryGoods.form.colorTypeId = (data.colour[0] || {}).colorId || ''
      }).finally(() => {
        loading.close()
      })
    },
    deliveryGoodsSubmit() {
      this.$refs.deliveryGoodsForm.validate((valid) => {
        if (valid) {
          this.deliveryGoods.submiting = true
          this.$api.agent.deliveryGoods(this.deliveryGoods.form).then(({data}) => {
            this.$message({
              type: 'success',
              message: '提货成功'
            })
            this.$refs.deliveryGoodsForm.resetFields()
            this.deliveryGoods.visible = false
            this.agentGoods.visible = false
            window.open(data)
            // this.stockAdmin(this.agentGoods.agentInfoId)
          }).finally(() => {
            this.deliveryGoods.submiting = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deliveryGoods2Dialog(agentId = '') {
      this.deliveryGoods2.visible = true
      let loading = this.$loading()
      this.$api.agent.deliveryGoodsBefore(agentId).then(({data}) => {
        this.goodsListData.list = data.goodsList.map((item)=>{
          item.goodsNumber = 1
          item.slted = false
          return item
        })

        this.deliveryGoods2.info.express = data.express

        this.deliveryGoods2.form.isRebates = data.isPartnerRecommend + ''
        this.deliveryGoods2.form.agentInfoId = agentId
        this.deliveryGoods2.form.userName = data.agentInfoName
        this.deliveryGoods2.form.address = data.agentAddress
        this.deliveryGoods2.form.phoneNumber = data.phoneNumber
      }).finally(() => {
        loading.close()
      })
    },
    deliveryGoods2Submit() {
      if(this.deliveryGoods2.deliveryGoodsInfo.length === 0){
        this.$message({
          type: 'error',
          message: '请选择要发货的商品'
        })
        return
      }

      this.deliveryGoods2.form.deliveryGoodsInfo = window.JSON.stringify(this.deliveryGoods2.deliveryGoodsInfo)

      this.$refs.deliveryGoods2Form.validate((valid) => {
        if (valid) {
          this.deliveryGoods2.submiting = true
          this.$api.agent.deliveryGoods2(this.deliveryGoods2.form).then(({data}) => {
            this.$message({
              type: 'success',
              message: '发货成功'
            })
            this.closeDelivery2Dialog()
          }).finally(() => {
            this.deliveryGoods2.submiting = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    sltDeliveryGoods(item) {
      item.slted = !item.slted
      this.goodsListData.list.forEach(_item=>{
        _item.slted && this.deliveryGoods2.deliveryGoodsInfo.push(_item)
      })

      this.goodsListData.list = this.goodsListData.list.filter(_item=>!_item.slted)
      this.goodsListData.visible = false
    },
    delDeliveryGoods(item) {
      item.slted = !item.slted
      this.deliveryGoods2.deliveryGoodsInfo.forEach(_item=>{
        !_item.slted && this.goodsListData.list.unshift(_item)
      })

      this.deliveryGoods2.deliveryGoodsInfo = this.deliveryGoods2.deliveryGoodsInfo.filter(_item=>_item.slted)
    },
    closeDelivery2Dialog(done){
      this.deliveryGoods2.deliveryGoodsInfo = []
      this.$refs.deliveryGoods2Form.resetFields()
      this.deliveryGoods2.visible = false
      done && done()
    },
    stockAdmin(agentInfoId = '') { // 库存管理
      this.agentGoods.visible = true
      this.agentGoods.loading = true
      this.agentGoods.agentInfoId = agentInfoId
      this.$api.agent.getStockList(agentInfoId).then(({data}) => {
        this.agentGoods.data = data.agentInfos
      }).finally(() => {
        this.agentGoods.loading = false
      })
    },
    getAgentList(page = 1) {
      let index = this.tabIndex
      let agentList = this.agentList[index]
      let filter = this.filters[index]
      let formData = {}

      if (filter) {
        filter.searchType && (formData[filter.searchType] = filter.searchKey)
        formData.startDate = filter.dateRange[0] ? filter.dateRange[0].format('yyyy-MM-dd') : ''
        formData.finishDate = filter.dateRange[1] ? filter.dateRange[1].format('yyyy-MM-dd') : ''
      }

      formData.isPartner = this.tabIndex == 0 ? 1 : 0

      agentList.loading = true
      this.$api.agent.getList(formData, page, agentList.rows).then(({data}) => {
        agentList.total = data.total
        agentList.page = data.page
        agentList.rows = data.rows
        agentList.data = data.agentInfos
      }).finally(() => {
        agentList.loading = false
      })
    },
    addAgentArea() {
      if (!this.agentForm.agentInfoId) {
        this.$message('请先保存合伙人基本信息')
        this.agentInfo.tabIndex = '0'
        return
      }
      this.agentInfoArea.visible = true
    },
    saveAgentArea() {
      if (this.cityDataSlted.length === 0) {
        this.$message('请选择代理区域')
        return
      }
      this.agentInfoArea.loading = true
      this.$api.agent.addArea({
        agentInfoId: this.agentForm.agentInfoId,
        provinceId: this.cityDataSlted[0],
        cityId: this.cityDataSlted[1],
        areaId: this.cityDataSlted[2]
      }).then(({data}) => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.cityDataSlted = []
        this.agentInfoAreas.push(data)
        this.agentInfoArea.visible = false
        this.$refs.agentDialog.close()
      }).finally(() => {
        this.agentInfoArea.loading = false
      })
    },
    openAgentDialog(type = 1) {
      this.agentInfo.type = type
      this.agentInfo.visible = true
      this.agentInfo.tabIndex = '0'
    },
    closeAgentDialog(done) {
      if (this.agentForm.agentInfoId && this.agentInfoAreas.length === 0) {
        this.agentInfo.tabIndex = '1'
        this.$message('请添加代理区域')
      } else {
        done()
        this.agentInfo.visible = false
        this.agentInfoAreas = []
        this.resetAgentForm()
        if (this.agentInfo.submited) {
          this.getAgentList(this.agentList[this.tabIndex].page)
        }
      }
    },
    getXiaoU() {
      this.resetXiaoUForm()
      this.xiaoUInfo.loading = true
      this.$api.agent.getUserInfo(this.xiaoUForm.phoneNumber).then(({data}) => {
        Object.assign(this.xiaoUInfo.data, data)
      }).finally(() => {
        this.xiaoUInfo.loading = false
      })
    },
    changeXiaoU() {
      this.xiaoUInfo.submiting = true
      this.$api.agent.changeXiaoU(this.xiaoUForm).then(({data}) => {
        this.$message({
          type: 'success',
          message: '升级小U店长成功'
        })
        this.xiaoUForm.phoneNumber = ''
        this.resetXiaoUForm()
      }).finally(() => {
        this.xiaoUInfo.submiting = false
      })
    },
    resetXiaoUForm() {
      this.xiaoUForm.agentInfoName = ''
      this.xiaoUInfo.data.userName = ''
      this.xiaoUInfo.data.maxGoodsNumber = ''
      this.xiaoUInfo.data.sunGoodsNumber = ''
    },
    resetAgentForm() {
      this.agentForm.agentInfoId = ''
      this.$refs.agentForm.resetFields()
      this.$refs.agentUpload.clearFiles()
    },
    editAgentInfo(agentInfoId) {
      if (!agentInfoId) {
        this.$message('代理商ID为空')
        return
      }

      let loading = this.$loading()
      this.$api.agent.getInfo(agentInfoId).then(({data}) => {
        this.agentInfo.submited = false
        this.openAgentDialog(2)
        if (data) {
          this.$nextTick(() => {
            this.agentInfoAreas = data.agentInfoAreas
            Object.keys(this.agentForm).forEach((key) => {
              this.agentForm[key] = data[key]
            })
          })
        }
      }).finally(() => {
        loading.close()
      })
    },
    submitAgentForm(formName) {
      this.$refs.agentForm.validate((valid) => {
        if (valid) {
          this.agentInfo.submiting = true
          this.$api.agent.addOrEdit(this.agentForm).then(({data}) => {
            this.agentInfo.submited = true
            if (data) {
              this.agentForm.agentInfoId = data
              this.$message({
                type: 'success',
                message: '保存合伙人信息成功'
              })
              this.agentInfo.tabIndex = '1'
            } else {
              this.$message({
                type: 'error',
                message: '保存合伙人信息失败'
              })
            }
          }).finally(() => {
            this.agentInfo.submiting = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  mounted() {
    this.tabInit(this.$route.query.tab)
  }
}
</script>
<style scoped lang="scss">
.l-agent-list {
  border: 1px solid #dfe6ec;
  border-collapse: collapse;
  width: 700px;
  margin: 20px 50px;
  th,
  td {
    border-bottom: 1px solid #dfe6ec;
    padding: 10px 20px;
    text-align: left;
  }
  th {
    background-color: #eef1f6;
  }
}

.l-agent-info {
  max-width: 700px;
  margin: 30px auto;
}

.l-input-block {
  .el-form-item__content {
    width: 498px;
    max-width: 100%;
  }
}
</style>
