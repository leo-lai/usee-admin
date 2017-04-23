import frame            from './views/frame.vue'
import login            from './views/login.vue'
import NotFound         from './views/404.vue'
import index            from './views/index.vue'
import GoodsList        from './views/shop/goods-list.vue'
import OrderList        from './views/shop/order-list.vue'
import AgentList        from './views/agent/agent-list.vue'

import Table            from './views/nav1/Table.vue'
import form             from './views/nav1/form.vue'
import user             from './views/nav1/user.vue'
import echarts          from './views/charts/echarts.vue'

let routes = [{
    path: '/login',
    component: login,
    name: '登录',
    hidden: true,
  }, {
    path: '/404',
    component: NotFound,
    name: '找不到页面',
    hidden: true,
  }, {
    path: '/',
    redirect: '/index',
    component: frame,
    children: [
      { path: '/index', component: index, name: '首页' },
    ], 
    hidden: true,
  }, {
    path: '/shop',
    component: frame,
    name: '商城管理',
    iconCls: 'l-icon-shop',
    children: [
      { path: 'goods',    component: GoodsList, name: '商品管理', hidden:true  },
      { path: 'order',    component: OrderList, name: '订单管理' },
      { path: 'evaluate', component: Table, name: '商品评价', hidden:true },
      { path: 'service',  component: Table, name: '售后服务', hidden:true },
    ],
  }, {
    path: '/agent',
    component: frame,
    name: '代理管理',
    iconCls: 'l-icon-agent',
    children: [
      { path: 'list', component: AgentList, name: '代理商列表' },
      { path: 'rebate', component: index, name: '返利/申请' },
      { path: 'setting', component: index, name: '基础设置' },
    ],
  }, {
    path: '/',
    component: frame,
    name: '数据统计',
    iconCls: 'l-icon-data',
    children: [
      { path: 'page9', component: index, name: '商城数据' },
      { path: 'page10', component: index, name: '合伙人数据' },
    ],
    hidden: true,
  }, {
    path: '/',
    component: frame,
    name: '用户管理',
    iconCls: 'l-icon-user',
    // single: true, //只有一个节点
    children: [
      { path: 'page12', component: index, name: '商城用户' },
    ],
    hidden: true,
  }, {
    path: '/',
    component: frame,
    name: '基本设置',
    iconCls: 'l-icon-setting',
    children: [
      { path: 'page13', component: echarts, name: '系统用户' },
      { path: 'page14', component: echarts, name: '部门设置' },
      { path: 'page15', component: echarts, name: '角色权限' },
    ],
    hidden: true,
  }, {
    path: '*',
    hidden: true,
    redirect: { path: '/404' },
  }
]

export default routes
