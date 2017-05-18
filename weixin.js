exports.reply = function * (next) {
	var message = this.weixin
	if (message.MsgType === 'event') {
		if(message.Event ==='subscribe'){
			if(message.EventKey){
				console.log('扫描二维码进来'+message.EventKey+' '+message.ticket)
			}
             this.body = '欢迎您关注柏缨的公众号,本公众号仅做学习输出用\r\n'+'请您输入数字1,看看我的智能性'
		}else if (message.Event ==='unsubscribe'){
			console.log('无情的取消关注')
			this.body = '我会继续改进的,bye!'
		}else if (message.Event ==='LOCATION'){
			this.body = '您上报的位置是:'+message.Latitude+'/'+message.Longitude+'-'+message.Precision
		}else if (message.Event ==='CLICK'){
			this.body = '您点击了菜单'+message.EventKey
		}else if (message.Event ==='SCAN'){
			this.body = '看到你扫一下噢!'
		}else if (message.Event ==='VIEW'){
			console.log('无情的取消关注')
			this.body = '您点击了菜单中的链接'+message.EventKey
		}
		
	}else if(message.MsgType === 'text'){
				var content = message.Content
				var reply = ''
				if(content==='1') {
		            reply ="好的,请您再输入一个2"
				}else if (content==='2'){
		            reply ="让你输入啥你就输入啥?输入3有惊喜"
				}else if (content==='3'){
					reply =[{
						title: '自爆本人照片',
						description: '我是百度糯米的FE',
						picUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/1nAZJsBNv0Bd4BFRIP0gXYGta9rrxf9RNrA5ciaFvuGBhS4SDUFpdH08jt7qyuEYOKKnpcCkjicK4WjGlY5R06wQ/0',
						url:'http://www.baidu.com'
					},{
						title: '这是我的儿子钱宏奕',
						description: '现在13个月',
						picUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/1nAZJsBNv0Bd4BFRIP0gXYGta9rrxf9RIibLfXmTt624UHxicf8lzDVHZwBspYMlXAXGniayuV6sic2cNlmg8zj9xw/0',
						url:'http://www.nuomi.com'
					}]
				}else{
					reply = '呃,您说的'+ content +'太复杂了'
				}
				this.body = reply
	}else if(message.MsgType === 'image'){
		var reply = '照片的地址为:'+message.PicUrl
		this.body = reply
	}else if(message.MsgType === 'location'){
		var reply = '您上报的地址为:'+message.Label
		this.body = reply
	}
}