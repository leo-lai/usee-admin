<template>
  <div>
    <el-tabs v-model="tabIndex" type="card" @tab-click="tabClick">
      <el-tab-pane label="营销人员">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="20">
            <el-form ref="filterForm-0" :model="filters[0]" :rules="filterRules" :inline="true">
              <el-form-item prop="searchKey">
                <el-input placeholder="请输入内容" style="width: 350px;" v-model="filters[0].searchKey" >
                  <el-select slot="prepend" placeholder="搜索类型" v-model="filters[0].searchType">
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
          <el-col :span="4" class="l-text-right">
            <el-form :inline="true">
              <el-form-item>
                <el-button type="primary" @click="marketer.visible = true">新增营销人员</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        
        <!--列表-->
        <el-table :data="list[0].data" highlight-current-row v-loading="list[0].loading" @selection-change="sltChange">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" type="index" label="#" width="55"></el-table-column>
          <el-table-column align="center" prop="realName" label="真实姓名" min-width="120"></el-table-column>
          <el-table-column align="center" prop="phoneNumber" label="手机号码" min-width="120"></el-table-column>
          <el-table-column align="center" prop="startDate" label="创建时间" min-width="120"></el-table-column>
          <el-table-column align="center" prop="followNumber" label="推广人数" min-width="120"></el-table-column>
          <el-table-column align="center" prop="followAmount" label="成交金额" min-width="120"></el-table-column>
          <el-table-column align="center" label="推广二维码" min-width="120">
            <template scope="scope">
              <img style="display:block;margin:5px auto;" width="50" @click="showQrcode(scope.row.qrImage)" :src="scope.row.qrImage" alt="">
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="120">
            <template scope="scope">
              <el-button size="small" type="text" @click="editArea(scope.row)">编辑区域</el-button>
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
      <el-tab-pane label="扫码关注记录">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="20">
            <el-form ref="filterForm-1" :model="filters[1]" :rules="filterRules" :inline="true">
              <el-form-item label="筛选时间" prop="dateRange">
                <el-date-picker type="daterange" placeholder="选择日期范围" :editable="false" v-model="filters[1].dateRange" :picker-options="pickerOptions" @change="search"></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button @click="refreshList">刷新列表</el-button>
                </el-button-group>  
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4" class="l-text-right">
          
          </el-col>
        </el-row>
        
        <!--列表-->
        <el-table :data="list[1].data" highlight-current-row v-loading="list[1].loading" @selection-change="sltChange">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" type="index" label="#" width="55"></el-table-column>
          <el-table-column align="center" prop="userName" label="微信昵称" min-width="120"></el-table-column>
          <el-table-column align="center" prop="realName" label="营销人员" min-width="120"></el-table-column>
          <!-- <el-table-column align="center" prop="phoneNumber" label="手机号码" min-width="120"></el-table-column> -->
          <el-table-column align="center" prop="bindingMarketersDate" label="扫码关注时间" min-width="120"></el-table-column>
        </el-table>
        <!--列表 end-->

        <!--分页-->
        <el-row class="l-toolbar"  type="flex" align="middle">
          <el-col :span="4">
            <span class="l-text-gray">共{{list[1].total}}条记录</span>
          </el-col>
          <el-col :span="20" class="l-text-right">
            <el-pagination layout="prev, pager, next" @current-change="pageChange" :page-size="20" :total="list[1].total">
            </el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="新增营销人员" custom-class="l-dialog" :visible.sync="marketer.visible" size="tiny">
      <el-row type="flex" :gutter="10" align="middle">
        <el-col :span="4">手机号码</el-col>
        <el-col :span="14">
          <el-input v-model="marketer.form.phoneNumber" :maxlength="11" placeholder="请输入手机号码"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button @click="getUser" :loading="marketer.loading">查询用户</el-button>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="10" align="middle" class="l-margin-tb-m">
        <el-col :span="4">微信昵称</el-col>
        <el-col :span="14">{{marketer.data.userName}}</el-col>
        <el-col :span="6"></el-col>
      </el-row>
      <el-row type="flex" :gutter="10" align="middle">
        <el-col :span="4">用户姓名</el-col>
        <el-col :span="14">
          <el-input v-model="marketer.form.realName" placeholder="请填写用户姓名"></el-input>
        </el-col>
        <el-col :span="6"></el-col>
      </el-row>
      <el-row type="flex" justify="center" class="l-margin-t">
        <el-col :span="24" class="l-text-center">
          <el-button type="primary" :loading="marketer.submiting" @click="addMarketer">确定新增</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog title="负责区域管理" custom-class="l-dialog" :visible.sync="areaInfo.listVisible" size="tiny" :before-close="areaInfoClose">
      <table class="l-areaInfo">
        <tr>
          <td>真实姓名</td>
          <td>{{areaInfo.slted.realName}}</td>
        </tr>
        <tr>
          <td>负责区域</td>
          <td>
            <div><a @click="addArea">新增区域</a></div>
            <ul>
              <li v-for="item in areaInfo.list">
                <a class="l-fr" @click="delArea(item)">删除</a>
                {{item.areasName}}
              </li>
            </ul>
          </td>
        </tr>
      </table>
    </el-dialog>

    <el-dialog title="新增区域" :visible.sync="areaInfo.areaVisible" size="tiny" :close-on-click-modal="false">
      <el-form :inline="true" label-width="80px">
        <el-form-item>
          <el-cascader placeholder="请选择区域" style="width: 350px;" v-model="areaInfo.sltedArea" :options="cityData" :props="{label: 'text'}"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="areaInfo.loading" @click="addAreaOk">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="推广二维码" :visible.sync="qrcode.visible" size="tiny">
      <img width="100%" :src="qrcode.url" alt="">
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
      qrcode: {
        visible: false,
        url: ''
      },
      areaInfo: {
        slted: {},
        sltedArea: [],
        loading: false,
        listVisible: false,
        areaVisible: false,
        list: []
      },
      marketer: {
        visible: false,
        loading: false,
        submiting: false,
        form: {
          phoneNumber: '',
          realName: ''
        },
        data: {
          userName: ''
        }
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
        dateRange: []
      },
      filters:[
        {
          searchKey: '',
          searchType: 'phoneNumber',
          dateRange: [],
          startDate: '',
          finishDate: ''
        },
        {
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
    editArea(item) {
      this.areaInfo.hasDel = false
      this.areaInfo.slted = item
      this.areaInfo.list = item.areas || []
      this.areaInfo.listVisible = true
    },
    addArea() {
      this.areaInfo.areaVisible = true
    },
    delArea(item) {
      let loading = this.$loading('删除中...')
      this.$api.marketer.addArea({
        marketersId: this.areaInfo.slted.marketersId,
        areaId: item.areasId,
        isAdd: 0
      }).then(({data})=>{
        this.areaInfo.areaVisible = false
        this.areaInfo.list = this.areaInfo.list.filter((_item)=>{
          return _item.areasId != item.areasId
        })
        this.areaInfo.hasDel = true
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).finally(()=>{
        loading.close()
      })
    },
    addAreaOk() {
      this.areaInfo.loading = true
      this.$api.marketer.addArea({
        marketersId: this.areaInfo.slted.marketersId,
        provinceId: this.areaInfo.sltedArea[0] || '',
        cityId: this.areaInfo.sltedArea[1] || '',
        areaId: this.areaInfo.sltedArea[2] || '',
        isAdd: 1
      }).then(({data})=>{
        this.areaInfo.areaVisible = false
        this.areaInfo.list.push({
          areasId: data.areaId,
          areasName: data.province + data.city + data.area
        })
      }).finally(()=>{
        this.areaInfo.loading = false
      })
    },
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
        promise = this.$api.marketer.getList(formData, page, list.rows)
      }else{
        promise = this.$api.marketer.getScanList(formData, page, list.rows)
      }

      promise.then(({data})=>{
        list.total = data.total
        list.page = data.page
        list.rows = data.rows
        list.data = Object.freeze(data.agentInfos)
      }).finally(()=>{
        list.loading = false
      })
    },
    getUser() {
      this.resetMarketerForm()
      this.marketer.loading = true
      this.$api.marketer.getUser(this.marketer.form.phoneNumber).then(({data}) => {
        Object.assign(this.marketer.data, data)
      }).finally(() => {
        this.marketer.loading = false
      })
    },
    resetMarketerForm() {
      this.marketer.data.userName = ''
      this.marketer.form.realName = ''
    },
    addMarketer() {
      this.marketer.submiting = true
      this.$api.marketer.add(this.marketer.form).then(({data}) => {
        this.$message({
          type: 'success',
          message: '新增营销人员成功'
        })
        this.marketer.form.phoneNumber = ''
        this.refreshList()
        this.resetMarketerForm()
      }).finally(() => {
        this.marketer.submiting = false
      })
    },
    showQrcode(url = '') {
      if(url){
        this.qrcode.visible = true
        this.qrcode.url = url
      }
    },
    areaInfoClose(done) {
      this.areaInfo.hasDel && this.refreshList()
      done()
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