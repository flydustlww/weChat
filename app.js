'use strict'
var Koa = require('koa')
var path = require('path')
var wechat_file = path.join(__dirname,'./wechat.txt')
var util = require('./util')
var g=require('./g')
var config = {
	wechat:{
		appID:'wx690f7c97cb7ceb30',
		appsecret:'8e17c877334154ef0a7963820f4654c5',
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

var app = new Koa()
app.use(g(config))
app.listen(1234);
console.log('listeng 1234');