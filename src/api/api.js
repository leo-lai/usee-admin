import Vue              from 'vue'
import axios 						from 'axios'
import { storage }      from 'src/scripts/utils'

const _vue = Vue.prototype

let baseUrl = 'http://api.deyila.cn/useeproject/management'
const _http = {
  ajax(url = '', data = {}, method = 'GET', contentType = 'form') {
    url = baseUrl + url
    let headers = {
      // 'sessionId': storage.local.get('sessionId') || '',
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    if (contentType === 'json' || method === 'PUT') {
      // headers['Content-Type'] = 'text/plain'
      data = JSON.stringify(data)
    }
    data.sessionId = storage.local.get('sessionId')

    return axios({
    	method,
    	url,
      data,
      headers,
      responseType: 'json',
      timeout: 60000
    }).then(function (response){
      if (response.resultCode === 4002) { // 登录失效
        storage.local.remove('sessionId')
        _vue.$message({
					type: 'error',
					message: response.message || '登录失效，请重新登录。',
					onClose(instance) {
						_server.logout()
					}
				})
      } else if (response.resultCode !== 200) {
        _vue.$alert(response.message)
      }
      return response
	  })
	  .catch(function (response) {
	  	_vue.$message('服务器连接失败')
	  })
  },
  get(url = '', data) {
    return this.ajax(url)
  },
  delete(url = '', data) {
    return this.ajax(url, undefined, 'DELETE')
  },
  post(url, data, contentType = 'form') {
    return this.ajax(url, data, 'POST', contentType)
  },
  put(url, data, contentType = 'json') {
    return this.ajax(url, data, 'PUT', contentType)
  }
}

const _server = {
	login(formData) {
		return _http.post('/login', formData)
	}
}

Vue.mixin({
  created() {
    // 接口
    this.$server = _server
    // 本地缓存
    this.$storage = storage
  }
})

// export default _server

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data) }

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }) }

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }) }

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }) }

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }) }

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }) }

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }) }