/**
 * Created by lxg on 15-2-25.
 */
window.RAF = (function(){
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        }
}());
var BEE = (function(){
	var imageSrc = {
	    "background" : "images/bg.png",
	    "bullet" : "images/bullet.png",
	    "bullet_enemy" : "images/bullet_enemy.png",
	    "enemy" : "images/enemy.png",
	    "ship" : "images/ship.png"
	};
    var extend = function(child,parent){
        var F = function(){}
        F.prototype = parent.prototype
        child.prototype = new F()
        child.prototype.constructor = child
    }
    ,imageOnload = function(fun){
    	var imageObj = []

    	if(typeof fun === 'function'){
    		fun(imageObj)
    	}
    };
    function DrawCanvas(x,y,speed){
    	this.x = x
    	this.y = y 
    	this.speed = speed || 0
    	this.canvas = document.getElementById('background')
    	this.ctx = this.canvas.getContext("2d")
    }
    DrawCanvas.prototype.getCanvasWidth = function(){
    	return this.canvas.width
    }
    DrawCanvas.prototype.getCnavasHeight = function(){
    	return this.canvas.height	
    }
    DrawCanvas.prototype.clearCanvas = function(){
    	this.ctx.clearRect(this.x,this.y,this.getCanvasWidth(),this.getCnavasHeight())
    }

    //loadbar
    function LoadBar(){
    	DrawCanvas.call(this)
    }
    extend(LoadBar,DrawCanvas)
    LoadBar.prototype.loadImage = function(fun){
    	var len = 0,tempSrc = [],itemArr = [],imageObject = {}
    	for(var item in imageSrc){
			itemArr.push(item)
    		tempSrc.push(imageSrc[item])
    	}
    	function _loadImage(tempSrc){
    		var temp = tempSrc.splice(0,1)
    		if(temp.length === 0){
				fun(imageObject)
    			return	
    		} 
    		var img = new Image()
            img.src = temp
            img.onload = function(){
            	imageObject[itemArr.splice(0,1)] = this
	    		_loadImage(tempSrc)
            }
    	}
    	_loadImage(tempSrc)
    }
    LoadBar.prototype.createCircle = function(){
    	
    }
    //sky
    function Background(){
    	DrawCanvas.call(this)
    }
    extend(Background,DrawCanvas)
    return {
        init : function(){
        	var loader = new LoadBar()
        	loader.loadImage(function(imageObj){
        		console.log(imageObj)
        	})
        }
    }
}());
