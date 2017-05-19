import frame            from './views/frame.vue'
import webview          from './views/webview.vue'
import login            from './views/login.vue'
import NotFound         from './views/404.vue'
import index            from './views/index.vue'
import GoodsList        from './views/shop/goods-list.vue'
import EvaluateList     from './views/shop/evaluate-list.vue'
import OrderList        from './views/shop/order-list.vue'
import OrderPrint       from './views/shop/order-print.vue'
import AfterSales       from './views/shop/after-sales.vue'

import AgentList        from './views/agent/agent-list.vue'
import AgentRebate      from './views/agent/agent-rebate.vue'

let routes = [
  {
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
    path: '/order/print/:id',
    component: OrderPrint,
    name: '打印订单信息',
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
      { path: 'goods',        component: GoodsList,     name: '商品管理',   hidden:true  },
      { path: 'order',        component: OrderList,     name: '订单管理' },
      { path: 'evaluate',     component: EvaluateList,  name: '商品评价'},
      { path: 'aftersales',   component: AfterSales,    name: '售后服务' },
    ],
  }, {
    path: '/agent',
    component: frame,
    name: '代理管理',
    iconCls: 'l-icon-agent',
    children: [
      { path: 'list',         component: AgentList,     name: '代理商列表' },
      { path: 'rebate',       component: AgentRebate,   name: '返利/申请' },
      { path: 'setting',      component: index,         name: '基础设置',   hidden:true },
    ],
  }, {
    path: '/data',
    component: frame,
    name: '数据报表',
    iconCls: 'l-icon-data',
    children: [
      { 
        path: 'binding',      
        component: webview,         
        name: '绑定流水',  
        meta: {
          href: 'http://report.deyila.cn/wabacus/howReport.wx?PAGEID=binding'  
        }
      },
      { 
        path: 'rebaterecord', 
        component: webview,         
        name: '返利流水',  
        meta: {
          href: 'http://report.deyila.cn/wabacus/howReport.wx?PAGEID=rebaterecord'   
        }
      },
      { 
        path: 'orderInfo',    
        component: webview,         
        name: '订单详情',
        meta: {
          href: 'http://report.deyila.cn/wabacus/howReport.wx?PAGEID=orderInfo'   
        }
      },
    ],
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
      { path: 'page13', component: index, name: '系统用户' },
      { path: 'page14', component: index, name: '部门设置' },
      { path: 'page15', component: index, name: '角色权限' },
    ],
    hidden: true,
  }, {
    path: '*',
    hidden: true,
    redirect: { path: '/404' },
  }
]

export default routes
