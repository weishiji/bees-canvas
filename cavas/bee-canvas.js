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
    };
    var Stage = (function(){

        var _bindEvt = function(){
            var that = this
            that.canvas.addEventListener('click',function(ev){
                var clickedX = ev.pageX - this.offsetLeft
                    ,clickedY = ev.pageY - this.offsetTop
                    ,clickPos = {'x' : clickedX,'y' : clickedY}
                    ,currentShape
                    ,bool = false
                for(var i=0;i<that.shapesArr.length;i+=1){
                    currentShape = that.shapesArr[i]
                    bool = that.isInboundary(clickPos,currentShape)
                    if(bool) break
                }
                if(bool){
                    for(var item in currentShape.events){
                        currentShape.events[item](clickPos)
                    }
                }
            })
        }
		var _startAnimate = function(){
			var that = this
			that.clearCanvas()
			for(var item in that.animates){
				var temp = that.animates[item]
				temp()
			}	

			RAF(function(){
				_startAnimate.call(that)
			})
		
		}
        function stage(){
            this.canvas = document.getElementById('background')
            this.ctx = this.canvas.getContext('2d')
            this.attrs = {
                'w' : this.canvas.width
                ,'h' : this.canvas.height
            }
            this.shapesArr = []
			this.animates = {}
            _bindEvt.call(this)
			_startAnimate.call(this)
        }
        
        stage.prototype.addShape = function(shape){
            this.shapesArr.push(shape)
        }
        stage.prototype.isInboundary = function(clickPos,shape){
            var clickedX = clickPos['x']
                ,clickedY = clickPos['y']
            if(clickedX < shape.right && clickedX > shape.left && clickedY > shape.top && clickedY < shape.bottom) {
                return true
            }
            return false
        }
        stage.prototype.clearCanvas = function(){
            this.ctx.clearRect(0,0,this.attrs.w,this.attrs.h)
        }
		stage.prototype.addAnimate = function(animateName,fun){
			this.animates[animateName] = fun
		}
		stage.prototype.removeAnimate = function(animateName){
			delete this.animates[animateName]	
		}
		stage.prototype.stopAnimate = function(){
			
		}
        return new stage()
    })
    var Shape = (function(){
        function shape(stage,x,y){
            this.stage = stage
            this.x = x
            this.y = y
            this.events = {}
        }
        shape.prototype.createCircle = function(){
            var x = this.x,y = this.y,radius = this.radius
            this.left = x - radius;
            this.top = y - radius;
            this.right = x + radius;
            this.bottom = y + radius;
        }
        shape.prototype.addEvt = function(name,fun){
            if(this.events[name]) return
            this.events[name] = fun
        }
        shape.prototype.removeEvt = function(name){
            delete this.events[name]
        }
        return shape
    }())
    function Circle(stage,x,y,radius){
        Shape.call(this,stage,x,y)
        this.radius = radius
        this.createCircle()
        this.draw()
        this.stage.addShape(this)
    }
    extend(Circle,Shape)
    Circle.prototype.draw = function(){
        var context = this.stage.ctx
            ,x = this.x
            ,y = this.y
            ,radius = this.radius
            ,that = this
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'green';
        context.fill();

        context.fillStyle = '#fff';
        context.textAlign = 'center';

        context.fillText('click start', x, y);
		that.stage.addAnimate('startButton',function(){
			that.draw()
		})
    }
    Circle.prototype.startGame = function(){
		var that = this
		var imageObject = {},srcArr = new Array(),itemArr = new Array()
		for(var item in imageSrc){
			srcArr.push(imageSrc[item])
				itemArr.push(item)
		}
		var len = srcArr.length
		var imageLoad = function(i){
			if(srcArr[i]){
				var img = new Image()
					img.src = srcArr[i]
					img.onload = function(){
						imageObject[itemArr[i]] = this
							imageLoad(++i)
							if(i !== len){return}
							that.stage.imageObject = imageObject
							new Sky(that.stage)
							new Ship(that.stage,3)
					}
			}
		}
        this.addEvt('start',function(clickPos){
			that.stage.removeAnimate('startButton')
			imageLoad(0)
        })
    }
    Circle.prototype.endGame = function(){
        this.addEvt('end',function(clickPos){
            console.log('end')
        })
    }
    function Sky(stage){
        Shape.call(this,stage)
        this.x = 0
        this.y = 0
        this.speed = 1
        this.image = this.stage.imageObject['background'] 
        this.draw()
    }
    Sky.prototype.draw = function(){
        var that = this
        this.y += this.speed
        this.stage.ctx.drawImage(this.image,this.x,this.y)
        this.stage.ctx.drawImage(this.image,this.x, this.y - this.stage.attrs.h)
		this.stage.addAnimate('background',function(){
			that.draw()
		})
        if (this.y >= this.stage.attrs.h){
            this.y = 0;
        }
    }
    function Ship(stage,speed){
        Shape.call(this,stage)
        this.speed = speed
		this.image = this.stage.imageObject['ship']
		this.shipWidth = this.image.width
    	this.shipHeight = this.image.height
		this.x = this.stage.attrs.w / 2 - this.shipWidth
	    this.y = (this.stage.attrs.h - this.shipHeight) - 10

    	this.keyStatus = this.controlEvt()
    	this.counter = 0 //子弹的数量
		this.draw()
    }
    extend(Ship,Shape)
    Ship.prototype.draw = function(){
		var that = this
    	that.stage.ctx.drawImage(that.image,that.x,that.y)	
    	that.move()
		that.stage.addAnimate('ship',function(){
			that.draw()
		})
	}
	Ship.prototype.controlEvt = function(){
		//获取当前的键盘相应事件类型，传递给move方法，移动飞机
	    var that = this
	        ,KEY_CODE = {
	            32 : "space",
	            37 : "left",
	            38 : "up",
	            39 : "right",
	            40 : "down"
	        }
	    document.body.onkeydown = function(ev){
	        var code = (ev.keyCode) ? ev.keyCode : ev.charCode
	        if(!KEY_CODE[code]){return}
	        that.keyStatus[KEY_CODE[code]] = true
	        ev.preventDefault()
	    }
	    document.body.onkeyup = function(ev){
	        var code = (ev.keyCode) ? ev.keyCode : ev.charCode
	        if(KEY_CODE[code]){
	            that.keyStatus[KEY_CODE[code]] = false
	        }
	        ev.preventDefault()
	    }
	    return {}
	}
	Ship.prototype.move = function(){
		this.counter += 1
	    var interval = 20 //发射子弹的时间间隔
	    if(this.keyStatus.left){
	        this.x -= this.speed
	        if (this.x <= 0){this.x = 0}
	    }if(this.keyStatus.right){
	        this.x += this.speed
	        if (this.x >= this.stage.attrs.w - this.shipWidth){this.x = this.stage.attrs.w - this.shipWidth}
	    }if(this.keyStatus.up){
	        this.y -= this.speed
	        if (this.y <= this.stage.attrs.h/4*3){this.y = this.stage.attrs.h/4*3}
	    }if(this.keyStatus.down){
	        this.y += this.speed
	        if (this.y >= this.stage.attrs.h - this.shipHeight){this.y = this.stage.attrs.h - this.shipHeight}
	    }if(this.keyStatus.space && this.counter > interval){
	        this.counter = 0
	        // fire
	        this.fire()
	    }		
	}
	Ship.prototype.fire = function(){
		//TODO:ship's file
		console.log('file in the hole')		

	}
    ;return {
        init : function(){
            var stage = Stage()
            var endCricle = new Circle(stage,180,110,30)
            endCricle.startGame()
        }

    }
}());
