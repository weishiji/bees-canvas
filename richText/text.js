$(document).ready(function(){
	var obj = Rtext($("#textarea"),{
		"wordbreakFun" : function(fun){
			if(this.wordbreak){

			}else{
				fun.call(obj)
			}
		},
		"wordbreak" : false,
		"placehoder" : "说些什么..."
	})
})
var Rtext = window.Rtext || (function(){
	var _bindEvt = function(){
		var that = this
		that.placehoder()
		that.elem.bind("focus",function(){
			that.fire.call(that)
		})
		that.elem.bind("blur",function(){
			that.unfire.call(that)
		})
	}
	var _cal = function(){
		var that = this
		var offset = that.elem.caret("position")
		console.log(offset)
	}
	function rich(elem,json){
		if(!(this instanceof rich)){
			return new rich(elem,json)
		}
		this.elem = elem
		this.config = json
		this.pl
		_bindEvt.call(this)
	}
	rich.prototype.fire = function(){
		var that = this
		that.unplacehoder()
		that.elem.keydown(function(ev){
			var keycode = ev.keyCode
			switch (keycode){
				case 13 :
					//enter
					that.enterEvent()
					return that.config.wordbreak
					break;
				case 37 :
					return false
					break
				case 39 :
					return false
					break
				default :
					break;
			}
		})
		that.elem.on("keyup",function(ev){
			_cal.call(that)
		})
	}
	rich.prototype.unfire = function(){
		var that = this
		that.elem.unbind("keypress")
		that.elem.unbind("keydown")
		that.elem.unbind("keyup")
		that.unforceclear()
		that.placehoder()
	}
	rich.prototype.getvalue = function(){
		var that = this
		console.log(that.elem.html())
	}
	rich.prototype.enterEvent = function(){
		var that = this
		that.getvalue()
		that.config.wordbreakFun(that.forceclear)
	}
	rich.prototype.forceclear = function(){
		var that = this
		that.elem.html("")
		that.elem.trigger("blur")
	}
	rich.prototype.unforceclear = function(){
		var that = this
	}
	rich.prototype.placehoder = function(){
		var that = this
		if(that.pl !== undefined || that.elem.html() !== ""){
			return
		}
		that.pl = $("<span/>",{"id" : "placehoder"}).html(that.config.placehoder)
		that.elem.append(that.pl)
	}
	rich.prototype.unplacehoder = function(){
		var that = this
		if(that.pl === undefined){
			return
		}
		that.pl.remove()
		delete that.pl
	}

	return rich
})()

