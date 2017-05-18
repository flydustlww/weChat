var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var xml2js = require('./xml2js')
var fs = require('fs')
function Wechat(opts){
    //var that = this;
    this.appID = opts.wechat.appID
    this.appsecret = opts.wechat.appsecret
    this.appsecretURL = opts.wechat.appsecretURL
    this.uploadURL = opts.wechat.uploadURL
    this.getAccessToken = opts.wechat.getAccessToken
    this.saveAccessToken = opts.wechat.saveAccessToken
    this.fetchAccessToken()

}
// 获取票据
Wechat.prototype.fetchAccessToken = function() {
    var that = this
    if(this.access_token&& this.expires_in){
        if(this.isValidAccessToken(this)){
            return Promise.resolve(this)
        } 
    }
    // 注意下面的return 
    return this.getAccessToken()
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
        that.saveAccessToken(data.body)
        return Promise.resolve(data)
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
    
    return new Promise(function(resolve,reject){
    	request({
    		url:url,
    		json:true
    	}).then(function(response){    
    		var data = response;
    		var now =  (new Date().getTime())
    		var expires_in = now+(data.expires_in -20)*1000
    		data.expires_in = expires_in
            resolve(data)
    	})
    })
}
// 上传素材
Wechat.prototype.uploadMaterial = function(type,filepath) {
    var that = this
    var form = {
        media:fs.createReadStream(filepath)
    }
    var appID = this.appID
    var appsecret = this.appsecret
    var uploadURL = this.uploadURL
    return new Promise(function(resolve,reject){
        that.fetchAccessToken()
        .then(function(data){
            console.log("data.access_token=="+JSON.stringify(data))
            var url = uploadURL+'?access_token='+data.body.access_token+"&type="+type
            request({
                method:'POST',
                formData:form,
                url:url,
                json:true
            }).then(function(response){          
                var _data = response;
                if(_data){
                    resolve(_data)
                }else{
                    throw new Error('Upload material fails')
                }        
            })
            .catch(function(err){
                reject(_data)

            })
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