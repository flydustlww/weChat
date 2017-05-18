'use strict'
var Koa = require('koa')
var config = require('./config')
var wechat = require('./g')
var weixin = require('./weixin')
var app = new Koa()
app.use(wechat(config,weixin.reply))
app.listen(1234);
console.log('listeng 1234');