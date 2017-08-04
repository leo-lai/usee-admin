import Vue              from 'vue'
import axios 						from 'axios'
import { utils, storage }      from 'src/scripts/utils'
import appConfig      				 from 'src/scripts/app-config'

let { baseUrl } = appConfig
let _vue = Vue.prototype

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
		return _http.post('/login', formData).then((response)=>{
			storage.local.set('sessionId', response.data.sessionId)
      storage.local.set('userInfo', response.data)
      return response
		})
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
		},
		changePwd(formData = {}) {
			return _http.post('/changePassword', formData).then((response)=>{
				storage.local.set('sessionId', response.data.sessionId)
	      storage.local.set('userInfo', response.data)
	      return response
			})
		}
	},
	order: {
		getList(formData = {}, page = 1, rows = 200) {
			formData.page = page
			formData.rows = rows
			return _http.post('/orderList', formData)
		},
		getInfo(orderId) {
			return _http.post('/orderDetails', { orderId })
		},
		examine(orderIds, status = '') {
			return _http.post('/toExamine', { orderIds, isPass: status })
		},
		expressAfterSales(formData) {
			return _http.post('/afterSalesSend', formData)
		},
		getAfterSales(formData = {}, page = 1, rows = 200) {
			formData.page = page
			formData.rows = rows
			return _http.post('/afterSalesList', formData)
		},
		examineAfterSales(afterSalesId, status = '', refuseRemark = '') {
			return _http.post('/afterSalesexamine', { afterSalesId, isPass: status, refuseRemark })
		},
		getExpressList() {
			return new Promise((resolve, reject)=>{
				let expressList = storage.session.get('temp_express_list')
				if(expressList && expressList.length > 0){
					resolve({data: expressList})
				}else{
					_http.post('/expressList').then((response)=>{
						response.data = response.data || []
						storage.session.set('temp_express_list', response.data)
						resolve(response)
					})
				}
			})
		},
		deliverDoods(formData) {
			return _http.post('/sendOrder', formData)
		}
	},
	agent: { // 代理商管理
		getList(formData = {}, page = 1, rows = 200){
			formData.page = page
			formData.rows = rows
			return _http.post('/agentList', formData)
		},
		getRebateList(formData = {}, page = 1, rows = 200){
			formData.page = page
			formData.rows = rows
			return _http.post('/rebateRecordList', formData)
		},
		examineRebate(rebateRecordIds = '', status = '', refuseRemark = '') {
			return _http.post('/examineRebate', { rebateRecordIds, isPass: status, refuseRemark })
		},
		getWithdrawalsList(formData = {}, page = 1, rows = 200){
			formData.page = page
			formData.rows = rows
			return _http.post('/withdrawalsList', formData)
		},
		examineWithdrawals(withdrawalsIds, status = '', refuseRemark = '') {
			return _http.post('/examineWithdrawals', { withdrawalsIds, isPass: status, refuseRemark })
		},
		addOrEdit(formData = {}) {
			return _http.post('/agentAddOrEdit', formData)
		},
		addArea(formData = {}){
			return _http.post('/agentInfoAreas', formData)
		},
		getInfo(agentInfoId = '') {
			return _http.post('/agentInfo', { agentInfoId })
		},
		getUserInfo(phoneNumber = '') {
			return _http.post('/checkGetReadyAgent', { phoneNumber })
		},
		changeXiaoU(formData = {}) {
			return _http.post('/agentUAddOrEdit', formData)
		},
		examineRebateH(rebateRecordIds = '', remark = '') {
			return _http.post('/examineRebate_H', { rebateRecordIds, remark })
		},
		getStockList(agentInfoId = '') { // 库存列表
			return _http.post('/agentGoods', { agentInfoId })
		},
		getDeliveryInfo(agentGoodsId = '') {
			return _http.post('/deliveryGoodsBefor', { agentGoodsId })
		},
		deliveryGoods(formData = {}) { // 提货
			return _http.post('/deliveryGoods', formData)
		},
		getDeliveryList(formData = {}, page = 1, rows = 200) {
			formData.page = page
			formData.rows = rows
			return _http.post('/deliveryList', formData)
		},
		agentUList(formData = {}, page = 1, rows = 200) {
			formData.page = page
			formData.rows = rows
			return _http.post('/agentExamineList', formData)
		},
		examineApply(formData = {}) {
			return _http.post('/agentExamine', formData)
		},
		checkAreas(formData = {}) {
			return _http.post('/checkAgentInfoAreas', formData)
		},
		deliveryGoodsBefore(agentInfoId = '') { // 小U发货
			return _http.post('/deliveryGoodsBefore', {agentInfoId})
		},
		deliveryGoods2(formData = {}) { // 小U发货
			return _http.post('/deliveryGoods', formData)
		}
	},
	goods: {
		getEvaluate(formData = {}, page = 1, rows = 200) {
			formData.page = page
			formData.rows = rows
			return _http.post('/judgeList', formData)
		},
		examineEvaluate(formData = {}) {
			return _http.post('/judge', formData)
		}
	},
	marketer: {
		getList(formData = {}, page = 1, rows = 200) {
			formData.page = page
			formData.rows = rows
			return _http.post('/marketersList', formData)
		},
		getUser(phoneNumber = '') {
			return _http.post('/checkGetReadyMarketers', { phoneNumber })
		},
		add(formData = {}) {
			return _http.post('/addMarketers', formData)
		},
		getScanList(formData = {}, page = 1, rows = 200) {
			formData.page = page
			formData.rows = rows
			return _http.post('/scanRecord', formData)
		},
		addArea(formData = {}) {
			return _http.post('/marketersAreas', formData)
		}
	},
	sys: {
		getCheckBodyList(formData = {}, page = 1, rows = 200) {
			formData.page = page
			formData.rows = rows
			return _http.post('/constitutionList', formData)
		},
		addCheckBodyQ(formData = {}) {
			return _http.post('/constitutionEdit', formData)
		},
		delCheckBodyQ(questionId) {
			return _http.post('/constitutionDelete', { questionId })
		}
	},
	news: {
		getList(formData = {}, page = 1, rows = 200) {
			formData.page = page
			formData.rows = rows
			return _http.post('/websiteNewsList', formData)
		},
		del(newsId, isDelete) {
			return _http.post('/websiteNewsDelete', {
				newsId,
				isDelete
			})
		},
		edit(formData = {}) {
			return _http.post('/websiteNewsEdit', formData)
		},
		getInfo(newsId) {
			return _http.post('/websiteNewsInfo', {newsId})
		}
	},
	movie: {
		getList(formData = {}, page = 1, rows = 200) {
			formData.page = page
			formData.rows = rows
			return _http.post('/filmFestivalList')
		},
		edit(formData = {}) {
			return _http.post('/addOrEdit', formData)
		},
		send(formData = {}) {
			return _http.post('/deliveryTicket', formData)
		},
		cancel(projectId = '') {
			return _http.post('/offTheShelf', { projectId })
		},
		getTickets(formData = {}, page = 1, rows = 200) {
			formData.page = page
			formData.rows = rows
			return _http.post('/ticketsList', formData)
		},
		cancelTicket(ticketsId = '') {
			return _http.post('/cancelTicket', { ticketsId })
		}
	},
	store: {
		getList(formData = {}, page = 1, rows = 200) {
			formData.page = page
			formData.rows = rows
			return _http.post('/storeList')
		},
		getXiaoU(formData = {}) {
			return _http.post('/storeGetAgent', formData)
		},
		getMarketers(formData = {}) {
			return _http.post('/storeGetMarketers', formData)
		},
		edit(formData = {}) {
			return _http.post('/storeAddOrEdit', formData)
		},
		disable(formData = {}) {
			return _http.post('/changeStoreState', formData)
		}
	}
}

Vue.mixin({
  created() {
  	this.$utils = utils
    // 接口
    this.$api = _api
    // 本地缓存
    this.$storage = storage
  }
})

export default _api
