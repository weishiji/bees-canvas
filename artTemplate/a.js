$(document).ready(function(){
	
	var reply = {
		"content" : "this is my first time come to USA"
	}
	var replyStr = Layout.createReply(reply)
	console.log(replyStr)
	var data = {
		"name" : "liu xiao guang",
		"age" : "28",
		"hometown" : "CHINA"
	}
	var postStr = Layout.createPost(data)
	console.log(postStr)
	$("body").append(postStr,replyStr)
})

var Layout = window.Layout || (function(){
	var 
	include_post = $.ajax({
	    "url" : "./template/post.html",
	    "type" : "GET",
	    "async" : false
	}).responseText
	,include_reply = $.ajax({
	    "url" : "./template/reply.html",
	    "type" : "GET",
	    "async" : false
	}).responseText
	function _createPost(data){
		var post = template.compile(include_post)
		var postDom = post(data)
		return postDom
	}
	function _createReply(data){
		var reply = template.compile(include_reply)
		var replyDom = reply(data)
		return replyDom
	}
	return {
		"createPost" : function(data){
			return _createPost(data)
		}
		,"createReply" : function(data){
			return _createReply(data)
		}
	}
})()
