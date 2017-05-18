var sha1 = require('sha1')
var getRowBody= require('raw-body')
var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var WeChat = require('./wechat.js')
var util = require('./xml2js')

// 中间件是在应用与应用之间充当连接服务的
// 处理微信交互的接口 票据的更新等信息
// 
module.exports = function (config,handler) {
	// body...
	var wechat = new WeChat(config)
	return function *(next){
			console.log(this.query);
			var token = config.wechat.token;
			var signature = this.query.signature;
			var nonce = this.query.nonce;
			var timestamp = this.query.timestamp;
			var echostr = this.query.echostr;
			var str = [token,timestamp,nonce].sort().join('')
			var sha = sha1(str)
		    if(this.method==='GET'){
                    if(sha===signature){
                        this.body = echostr + ''
                    }else{
                        this.body = 'wrong'
                    }
            }else if(this.method==='POST'){
                    if(sha===signature){
                        this.body = echostr + ''
                        console.log('this.length,===='+this.length)
                        var data = yield getRowBody(this.req,{ //
                            //length: this.length,
                            limit: '1mb',
                            encoding: this.charset
                        })
                        var content = yield util.parseXMLAsync(data)
                        var message = util.formatMessage(content.xml)
                        console.log('message====='+JSON.stringify(message));
                        this.weixin = message
                        yield handler.call(this, next)
                        wechat.reply.call(this)

                    }else{
                        this.body = 'wrong'
                        return false
                    }
            }
			
	}
	

}