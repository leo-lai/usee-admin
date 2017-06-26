let baseUrl = 'http://api.usee1.com.cn/useeproject/management/admin'
// 正式
if (['admin.ushiyihao.com'].indexOf(window.location.host) > -1) {
  baseUrl = 'https://api.ushiyihao.com/useeproject02/management/admin'
}

export default {
  baseUrl
}