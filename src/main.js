import babelpolyfill    from 'babel-polyfill'
import Vue              from 'vue'
import VueRouter        from 'vue-router'
import ElementUI        from 'element-ui'
import Vuex             from 'vuex'

import { storage }      from './scripts/utils'
import api              from './api'
import store            from './vuex/store'
import routes           from './routes'
import App              from './App'

// import NProgress        from 'nprogress'
// NProgress.configure({ showSpinner: false })

// import Mock             from './mock'
// Mock.bootstrap()

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.use({
  install(Vue, options) {
    Vue.prototype.$href = function(url, action = 'push'){
      if(!url) return

      if(/^http(s?)/i.test(url)){
        window.location[action === 'push' ? 'assign' : action](url)
      }else{
        router[action] && router[action](url)
      }
    }
  }
})

const router = new VueRouter({
  routes,
  // mode: 'history',
})

router.beforeEach((to, from, next) => {
  // NProgress.start()
  if (!api.checkLogin() && to.path != '/login') {
    api.logout()
    next(false)
    // next({ path: '/login' })
  } else {
    next()
  }
})

router.afterEach(transition => {
  // NProgress.done()
})

Vue._vue = new Vue({
  //el: '#app',
  //template: '<App/>',
  //components: { App }
  router,
  store,
  render: h => h(App)
}).$mount('#app')

