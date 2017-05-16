var sha1 = require('sha1')
var getRowBody= require('raw-body')
var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var WeChat = require('./wechat.js')
var util = require('./xml2js')
function Wechat(opts){
    var that = this;
    this.appID = opts.wechat.appID;
    this.appsecret = opts.wechat.appsecret;
    this.getAccessToken = opts.wechat.getAccessToken
    this.saveAccessToken = opts.wechat.saveAccessToken
    this.getAccessToken()
    .then(function(data){
    	try{
          data = JSON.parse(data)
    	}catch (e){
             return that.updateAccessToken(data)
    	}
    	if(that.isValidAccessToken(data)){
              Promise.resolve(data)
    	}else{
    		return that.updateAccessToken()
    	}
    })
    .then(function(data){
    	that.access_token = data.access_token
    	that.expires_in = data.expires_in
       // console.log("data.sreingyfy:"+JSON.stringify(data) );
       // console.log("access_token:"+data.body.access_token );
    	that.saveAccessToken(data.body)

    })

}
Wechat.prototype.isValidAccessToken = function(data){
	if(!data || !data.access_token || !data.expires_in){
     return false;
	}
	var access_token = data.access_token
	var expires_in = data.expires_in
	var now = (new Date()).getTime()
	if(now < expires_in){
       return true
	}else{
		return false
	}
}
Wechat.prototype.updateAccessToken = function() {
	var appID = this.appID
    var appsecret = this.appsecret
    var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential'+'&appid='+appID+'&secret='+appsecret;
    
    //console.log('url============='+url)
    return new Promise(function(resolve,reject){
    	request({
    		url:url,
    		json:true
    	}).then(function(response){
            
    		var data = response;
           // console.log('data============='+data)
    		var now =  (new Date().getTime())
    		var expires_in = now+(data.expires_in -20)*1000
    		data.expires_in = expires_in
            resolve(data)
    	})
    })
    

}
// 中间件是在应用与应用之间充当连接服务的
// 处理微信交互的接口 票据的更新等信息
// 
module.exports = function (config) {
	// body...
	var wechat = new Wechat(config)
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
                        if(message.MsgType ==='event'){
                            if(message.Event ==='subscribe'){
                                var now = new Date().getTime();
                                var that=this
                                that.status = 200
                                that.type = 'application/xml'
                                that.body = '<xml>'
                                 +'<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'
                                 +'<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'
                                 +'<CreateTime>'+now+'</CreateTime>'
                                 +'<MsgType><![CDATA[text]]></MsgType>'
                                 +'<Content><![CDATA[钱凯是个大傻子]]></Content>'
                                 +'<MsgId>1234567890123456</MsgId>'
                                 +'</xml>'
                             return
                            }

                        }
                        if(message.MsgType ==='text'){
                               var now = new Date().getTime();
                               var that=this
                               that.status = 200
                               that.type = 'application/xml'
                               that.body = '<xml>'
                                +'<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'
                                +'<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'
                                +'<CreateTime>'+now+'</CreateTime>'
                                +'<MsgType><![CDATA[text]]></MsgType>'
                                +'<Content><![CDATA[我是你老婆]]></Content>'
                                +'<MsgId>1234567890123456</MsgId>'
                                +'</xml>'
                            return
                        }

                    }else{
                        this.body = 'wrong'
                        return false
                    }
            }
			
	}
	

}