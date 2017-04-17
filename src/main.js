import babelpolyfill    from 'babel-polyfill'
import Vue              from 'vue'
import VueRouter        from 'vue-router'
import ElementUI        from 'element-ui'
import Vuex             from 'vuex'
import NProgress        from 'nprogress'

import store            from './vuex/store'
import routes           from './routes'
import App              from './App'

import Mock             from './mock'
Mock.bootstrap()


Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

NProgress.configure({ showSpinner: false })

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

router.afterEach(transition => {
  NProgress.done()
})

new Vue({
  //el: '#app',
  //template: '<App/>',
  //components: { App }
  router,
  store,
  render: h => h(App)
}).$mount('#app')

