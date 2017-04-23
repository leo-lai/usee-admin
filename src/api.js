import Vue              from 'vue'
import axios 						from 'axios'
import { storage }      from 'src/scripts/utils'

let _vue = Vue.prototype

let baseUrl = 'http://api.deyila.cn/useeproject/management/admin'
const _http = {
  ajax(url = '', data = {}, method = 'GET', contentType = 'form') {
  	let headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    url = baseUrl + url
    data.sessionId = storage.local.get('sessionId')
    return new Promise((resolve, reject)=>{
    	axios({
    		url,
	    	method,
	      data,
	      headers,
	      timeout: 60000,
			  transformRequest: [function (data) {
			    let ret = []
			    for (let key in data) {
			    	ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
			    }
			    return ret.join('&')
			  }]
	    }).then(function ({ data }){
	      if (data.resultCode === 4002) { // 登录失效
	        storage.local.remove('sessionId')
	        _vue.$message({
						type: 'error',
						message: data.message || '登录失效，请重新登录。',
						onClose(instance) {
							_api.logout()
						}
					})
					reject(data.message)
	      } else if (data.resultCode !== 200) {
	      	_vue.$message({
	          message: data.message,
	          type: 'error'
	        })
	        reject(data.message)
	      }
	      resolve(data)
		  })
		  .catch(function (message) {
		  	_vue.$message('服务器连接失败')
		  	reject('服务器连接失败')
		  })
    })
  },
  get(url, data) {
    return _http.ajax(url, data)
  },
  post(url, data) {
    return _http.ajax(url, data, 'POST')
  }
}

const _api = {
	baseUrl,
	login(formData) {
		storage.local.remove('sessionId')
		return _http.post('/login', formData)
	},
	logout() {
		let loading = _vue.$loading()
		return new Promise((resolve)=>{
			if(storage.local.get('sessionId')){
				_http.post('/loginOut').then(resolve)
			}else{
				resolve()	
			}
		}).finally(()=>{
			loading.close()
			storage.local.remove('sessionId')
			storage.local.remove('userInfo')
			_vue.$href('/login?to=' + encodeURIComponent(window.location.href))
		})
	},
	checkLogin() {
		return !!storage.local.get('sessionId')
	},
	user: {
		getInfo() {
			return new Promise((resolve)=>{
				resolve({data: storage.local.get('userInfo') || {}})
			})
		}
	},
	order: {
		getList(formData = {}, page = 1, rows = 20) {
			formData.page = page
			formData.rows = rows
			return _http.post('/orderList', formData)
		},
		getInfo(orderId) {
			return _http.post('/orderDetails', { orderId })
		},
		examine(orderIds, status = '') {
			return _http.post('/toExamine', { orderIds, isPass: status })
		}
	},
	agent: {
		getList(formData = {}, page = 1, rows = 20){
			formData.page = page
			formData.rows = rows
			return _http.post('/agentList', formData)
		},
		addOrEdit(formData = {}) {
			return _http.post('/agentAddOrEdit', formData)
		},
		addArea(formData = {}){
			return _http.post('/agentInfoAreas', formData)
		},
		getInfo(agentInfoId = '') {
			return _http.post('/agentInfo', { agentInfoId })
		}
	}
}

Vue.mixin({
  created() {
    // 接口
    this.$api = _api
    // 本地缓存
    this.$storage = storage
  }
})

export default _api

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data) }

// export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }) }

// export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }) }

// export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }) }

// export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }) }

// export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }) }

// export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }) }