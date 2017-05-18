var path = require('path')
var wechat_file = path.join(__dirname,'./wechat.txt')
var util = require('./util')

var config = {
	wechat:{
		appID:'wx690f7c97cb7ceb30',
		appsecret:'8e17c877334154ef0a7963820f4654c5',
		appsecretURL:'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
		uploadURL:'https://api.weixin.qq.com/cgi-bin/media/upload',
		token:'liuboying',
		getAccessToken:function  () {
			
			return util.readFileAsync (wechat_file)
		},
		saveAccessToken:function(data){
			data = JSON.stringify(data)
			return util.writeFileAsync(wechat_file,data)

		}
	}
}
module.exports = config