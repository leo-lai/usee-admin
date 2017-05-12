<template>
  <div class="l-goods">
    <el-tabs v-model="tabIndex" type="card" @tab-click="tabClick">
      <el-tab-pane label="商品列表">
        <!--过滤查询-->
        <el-row class="l-toolbar">
          <el-col :span="20">
            <el-form :inline="true">
              <el-form-item>
                <el-button-group>
                  <el-button :disabled="goodsList.slteds.length===0">批量上架</el-button>
                  <el-button :disabled="goodsList.slteds.length===0">批量下架</el-button>
                </el-button-group>  
              </el-form-item>
              <el-form-item>
                <el-select placeholder="上架/下架">
                  <el-option label="上架商品" value="1"></el-option>
                  <el-option label="下架商品" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input placeholder="请输入商品名称" style="width: 400px;">
                  <el-select slot="prepend" placeholder="商品分类">
                    <el-option label="U视喷喷" value="1"></el-option>
                  </el-select>
                  <el-button slot="append" icon="search"></el-button>
                </el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4" class="l-text-right">
            <el-form :inline="true">
              <el-form-item>
                <el-button type="primary" >新增商品</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        
        <!--列表-->
        <el-table :data="goodsList.data" highlight-current-row v-loading="loading.goodsList" @selection-change="goodsListSltChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="name" label="商品名称" min-width="300"></el-table-column>
          <el-table-column prop="sex" label="销售价格" min-width="120" sortable></el-table-column>
          <el-table-column prop="age" label="当前库存" min-width="100"></el-table-column>
          <el-table-column prop="birth" label="累计销量" min-width="120"></el-table-column>
          <el-table-column prop="addr" label="所属分类" min-width="120"></el-table-column>
          <el-table-column prop="fenlei" label="状态" min-width="120"></el-table-column>
          <el-table-column label="操作" min-width="150">
            <template scope="scope">
              <el-button size="small" @click="goodsListEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="goodsListDel(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--列表 end-->

        <!--分页-->
        <el-col :span="24" class="l-toolbar l-text-right">
          <el-pagination layout="prev, pager, next" @current-change="goodsListPageChange" :page-size="20" :total="goodsList.totalPage">
          </el-pagination>
        </el-col>

      </el-tab-pane>
      <el-tab-pane label="商品分类">开发中</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      tabIndex: '0',
      goodsList: {
        data: [],
        slteds: [],
        page: 1,
        totalPage: 0
      },
      loading: {
        goodsList: false
      }
    }
  },
  methods: {
    tabClick(tab, event) {
      this.tabInit(this.tabIndex)
    },
    tabInit(index){
      index = index || this.tabIndex
      switch(index){
        case '0':
          this.goodsList.data.length === 0 && this.getGoodsList()
          break
        case '1':
          break
      }
      this.tabIndex = index
      this.$router.replace('?tab=' + index)
    },
    goodsListSltChange(slteds) {
      console.log(slteds)
    },
    goodsListEdit(index, row) {

    },
    goodsListDel(index, row) {

    },
    goodsListPageChange(page) {
      this.goodsList.page = page
      this.getGoodsList()
    },
    getGoodsList() {

    }
  },
  mounted() {
    this.tabInit(this.$route.query.tab)
  }
}
</script>
<style scoped lang="scss">

</style>