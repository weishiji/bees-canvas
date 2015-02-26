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
    	this.ctx.clearRect(0,0,this.getCanvasWidth(),this.getCnavasHeight())
    }

    //loadbar
    function LoadBar(){
    	DrawCanvas.call(this)
        this.startDeg = 0
    }
    extend(LoadBar,DrawCanvas)
    LoadBar.prototype.loadImage = function(fun){
    	var len = 0,srcArr = [],itemArr = [],imageObject = {},that = this
    	for(var item in imageSrc){
			itemArr.push(item)
    		srcArr.push(imageSrc[item])
    	}
    	function _loadImage(srcArr){
    		var temp = srcArr.splice(0,1)
    		if(temp.length === 0) return; 
    		var img = new Image()
            img.src = temp
            img.onload = function(){
            	imageObject[itemArr[len]] = this
	    		_loadImage(srcArr)
                that.createCircle( len * 100 / itemArr.length)
                len += 1
                if(len === itemArr.length){
                    that.createCircle(100)
                    fun(imageObject)
                }
            }
    	}
    	_loadImage(srcArr)
    }
    LoadBar.prototype.createCircle = function(degNum){
    	var centerX = this.getCanvasWidth() / 2
    		,centerY = this.getCnavasHeight() / 2
    		,radius = 60,deg = Math.PI * (2 * degNum / 100)

        this.clearCanvas()
    	this.ctx.beginPath()
        this.ctx.moveTo(centerX,centerY)
    	this.ctx.arc(centerX,centerY,radius,this.startDeg,deg,false);
        this.ctx.lineTo(centerX,centerY)
    	this.ctx.fillStyle = 'green';
        this.ctx.fill();
        this.startDeg = deg
    }
    //sky
    function Background(){
    	DrawCanvas.call(this)
    }
    extend(Background,DrawCanvas)
    return {
        init : function(){
        	var loader = new LoadBar()
        	//loader.loadImage(function(imageObj){
              //  console.log(imageObj)
        	//})
            var i = 0,timer;
            timer = setInterval(function(){
                i += 1
                loader.createCircle(i)
                console.log(i)
                if(i > 100){
                    clearInterval(timer)
                }
            },10)
        }

    }
}());
