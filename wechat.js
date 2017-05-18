var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var xml2js = require('./xml2js')
function Wechat(opts){
    var that = this;
    this.appID = opts.wechat.appID;
    this.appsecret = opts.wechat.appsecret;
    this.appsecretURL = opts.wechat.appsecretURL
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
             return Promise.resolve(data)
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
    var url = this.appsecretURL+'&appid='+appID+'&secret='+appsecret;
    
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

Wechat.prototype.reply = function() {
    var content = this.body
    var message = this.weixin
    var xml = xml2js.tpl(content, message)
    this.status = 200
    this.type = 'application/xml'
    this.body = xml
}
module.exports = Wechat