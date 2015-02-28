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
                        var fun = currentShape.events[item](clickPos)
                    }
                }
            })
        }
        function stage(){
            this.canvas = document.getElementById('background')
            this.ctx = this.canvas.getContext('2d')
            this.attrs = {
                'w' : this.canvas.width
                ,'y' : this.canvas.height
            }
            this.shapesArr = []
            _bindEvt.call(this)
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

        context.fillText('start', x, y);
    }
    Circle.prototype.startGame = function(){
        var that = this
        this.addEvt('start',function(clickPos){
            var img = new Image()
            img.src = imageSrc['background']
            img.onload = function(){
                new Sky(that.stage,img)
            }
        })
    }
    Circle.prototype.endGame = function(){
        this.addEvt('end',function(clickPos){
            console.log('end')
        })
    }
    function Sky(stage,image){
        Shape.call(this)
        this.test()
    }
    extend(Sky,Shape)
    Sky.prototype.test = function(){
        console.log(this.stage)
    }
    ;return {
        init : function(){
            var stage = Stage()
            var startCilcle = new Circle(stage,20,20,20)
            startCilcle.startGame()
            var endCilcle = new Circle(stage,180,110,30)
            endCilcle.endGame()
        }

    }
}());
