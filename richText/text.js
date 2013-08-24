/**
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
**/

$(document).ready(function(){
	contenteditable($("#textarea"),{

	})
})
var contenteditable = window.contenteditable || (function(){
	var setting = {
		"keypress" : true,
		"pholder" : "say something..."
	}
	,_updateContent = function(element){
		var c = element.html()
		if(c === "" || c === "<br>" || c === "</br>"){ 
			c = ""
		}
		return c
	}
	function cet(element,option){
		if(!(this instanceof cet)) return new cet(element,option)
		this.$element = element
		this.$option = $.extend(option,setting,{})
		this.focusBool = false
		this.placehoder()
		this.focused()
		this.blured()
		this.onactive()
	}
	cet.prototype.getContent = function(){
		var that = this
		that.content = that.$element[0].textContent
		
	}
	cet.prototype.placehoder = function(){
		var that = this
		if(that.content === ""){
			that.$element[0].textContent = that.$option.pholder
		}
	}
	cet.prototype.focused = function(){
		var that = this
		that.$element.on("focus",function(){
			that.focusBool = true
			that.getContent()
			that.keyEvent()
		})
	}
	cet.prototype.blured = function(){
		var that = this
		that.$element.on("blur",function(){
			that.focusBool = false
			that.$element.off("focus,keyup")
			that.getContent(that.placehoder)
		})
	}
	cet.prototype.keyEvent = function(){
		var that = this
		that.$element.on("keyup",function(ev){
			that.getContent()
		})
	}
	cet.prototype.onactive = function(){
		var that =this
		that.$element.on("activate",function(){
			console.log("123")
		})
	}
	return cet
})()


/*
;(function($,window,document){

	var updateContent = function(element){
		var c = $(element).html();
		if(c == '' || c == '<br>' || c == ' ' || c == '</br>'){ c = ''; }
		return c;
	};

	$.fn.contentEditable = function(options){

		var defaults = {
			'placeholder' 			: 'Insert content',
			'newLineOnEnterKey'		: false,
			'onActivate'			: false,
			'onFocusIn'				: false,
			'onFocusOut'			: false,
			'onBlur'				: false
		};
		var settings = $.extend( {}, defaults, options);

		return this.each(function() {
			$(this).attr("contenteditable","true");
			this.content = $(this).html();
			this.settings = settings;
			if(this.content == ''){ $(this).html(settings.placeholder); }
			$(this).on('activate',function(){
				this.content = updateContent(this);
				if(this.content == settings.placeholder){
					$(this).empty();
					var range, sel;
					if ( (sel = document.selection) && document.body.createTextRange) {
						range = document.body.createTextRange();
						range.moveToElementText(this);
						range.select();
					}
				}
				if($.isFunction(settings.onActivate)){ settings.onActivate(this); }
			})
			.focusin(function(e){
				this.content = updateContent(this);
				if(this.content == settings.placeholder){
					$(this).empty();
					var range = document.createRange();
					range.selectNodeContents(this);
					var sel = window.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
				}
				if(settings.newLineOnEnterKey == false){

					$(this).keypress(function(e){
						var keycode = (e.keyCode ? e.keyCode : e.which);
						if(keycode == '13') {
							e.preventDefault();
							$(this).focusout().blur();
						}
					});
				}
				if($.isFunction(settings.onFocusIn)){ settings.onFocusIn(this); }
			})
			.focusout(function(e){
				this.content = updateContent(this);
				$(this).unbind("keypress");
				if(this.content == ''){ $(this).html(settings.placeholder); }
				if($.isFunction(settings.onFocusOut)){ settings.onFocusOut(this); }
			}).blur(function(e){
				if($.isFunction(settings.onBlur)){ settings.onBlur(this); }
			});
		});
	}
})(jQuery,window,document);
$(document).ready(function(){
	$("#textarea").contentEditable({
		"placeholder" : "say something..."
	})
})*/