$(document).ready(function(){
	var obj = Rtext($("#textarea"),{
		"wordbreak" : function(fun){
			fun.call(obj)
		}
	})
})
var Rtext = window.Rtext || (function(){
	var _bindEvt = function(){
		var that = this
		that.elem.bind("focus",function(){
			that.fire.call(that)
		})
		that.elem.bind("blur",function(){
			that.unfire.call(that)
		})
	}
	function rich(elem,json){
		if(!(this instanceof rich)){
			return new rich(elem,json)
		}
		this.elem = elem
		this.config = json
		_bindEvt.call(this)
	}
	rich.prototype.fire = function(){
		var that = this
		that.elem.keypress(function(ev){
			var keycode = ev.keyCode
			switch (keycode){
				case 13 :
					//enter
					that.enterEvent()
					break;
				default :
					break;
			}
		})
	}
	rich.prototype.unfire = function(){
		var that = this
		that.elem.unbind("keypress")
		that.elem.unbind("keydown")
		that.elem.unbind("keyup")
	}
	rich.prototype.getvalue = function(){

	}
	rich.prototype.enterEvent = function(){
		var that = this
		that.config.wordbreak(that.clearvalue)
	}
	rich.prototype.clearvalue = function(){
		var that = this
		that.elem.html("")
	}
	return rich
})()

