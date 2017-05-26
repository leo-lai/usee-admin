import frame            from './views/frame'
import webview          from './views/webview'
import login            from './views/login'
import NotFound         from './views/404'
import index            from './views/index'
import GoodsList        from './views/shop/goods-list'
import EvaluateList     from './views/shop/evaluate-list'
import OrderList        from './views/shop/order-list'
import OrderPrint       from './views/shop/order-print'
import AfterSales       from './views/shop/after-sales'

import AgentList        from './views/agent/agent-list'
import AgentRebate      from './views/agent/agent-rebate'
import AgentRecord      from './views/agent/agent-record'

import UserMarketer    from './views/user/user-marketer'

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
      { path: 'record',       component: AgentRecord,   name: '流水/记录' },
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
          href: 'http://report.deyila.cn/wabacus/ShowReport.wx?PAGEID=binding'  
        }
      },
      { 
        path: 'rebaterecord', 
        component: webview,         
        name: '返利流水',  
        meta: {
          href: 'http://report.deyila.cn/wabacus/ShowReport.wx?PAGEID=rebaterecord'   
        }
      },
      { 
        path: 'orderInfo',    
        component: webview,         
        name: '订单详情',
        meta: {
          href: 'http://report.deyila.cn/wabacus/ShowReport.wx?PAGEID=orderInfo'   
        }
      },
    ],
  }, {
    path: '/user',
    component: frame,
    name: '系统管理',
    iconCls: 'l-icon-user',
    children: [
      { path: 'marketing', component: UserMarketer,  name: '营销人员' }
    ]
  }, {
    path: '/',
    component: frame,
    name: '基本设置',
    // single: true, //只有一个节点
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
