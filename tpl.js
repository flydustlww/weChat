var ejs = require('ejs')
var heredoc = require('heredoc')
var tpl = heredoc(function(){/*
	<xml>
	 <ToUserName><![CDATA[<%= FromUserName %>]]></ToUserName>
	 <FromUserName><![CDATA[<%= ToUserName %>]]></FromUserName>

	 <CreateTime><%= createTime %></CreateTime>

	 <MsgType><![CDATA[<%= msgType %>]]></MsgType>
	 <% if(msgType === 'text') { %>
	 <Content><![CDATA[<%= content %>]]></Content>
	 <% } else if (msgType ==='image') { %>
	 	<Image>
        <MediaId><![CDATA[<%= content.media_id %>]]></MediaId>
        </Image>
	 <% } else if (msgType ==='voice') {%>
	 	 <MediaId><![CDATA[<%= content.media_id %>]]></MediaId>
         <Format><![CDATA[Format]]></Format>
     <% } else if (msgType ==='video') {%>
     	<MediaId><![CDATA[<%= content.media_id %>]]></MediaId>
        <ThumbMediaId><![CDATA[<%= content.thumb_media_id %>]]></ThumbMediaId>
     <% } else if (msgType ==='location') {%>
        	<Location_X>23.134521</Location_X>
            <Location_Y>113.358803</Location_Y>
            <Scale>20</Scale>
            <Label><![CDATA[位置信息]]></Label>
     <% } else if (msgType ==='link') {%>
     	<Title><![CDATA[公众平台官网链接]]></Title>
     	<Description><![CDATA[公众平台官网链接]]></Description>
     	<Url><![CDATA[url]]></Url>
     <% } else if (msgType ==='news') {%>
     	<ArticleCount><![CDATA[<%= content.length %>]]></ArticleCount>
     	<Articles>
     	<% for (var i=0;i<content.length;i++) { %>
			<item>
			<Title><![CDATA[<%= content[i].title %>]]></Title> 
			<Description><![CDATA[<%= content[i].description %>]]></Description>
			<PicUrl><![CDATA[<%= content[i].picUrl %>]]></PicUrl>
			<Url><![CDATA[<%= content[i].url %>]]></Url>
			</item>
     	<% } %>
     	
     	</Articles>
     	<% } %>
	 <MsgId>1234567890123456</MsgId>
	 </xml>

	*/})

var compile = ejs.compile(tpl)
exports = module.exports = {
	compile: compile
}