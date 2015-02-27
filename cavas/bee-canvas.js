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
                    ,clickedY = ev.pageY - this.offsetTop;
                for(var i=0;i<that.shapesArr.length;i+=1){
                    var temp = that.shapesArr[i]
                    if (clickedX < temp.right && clickedX > temp.left && clickedY > temp.top && clickedY < temp.bottom) {
                        alert ('clicked number ' + (i + 1));
                        return
                    }
                }
                /*for(var item in that.events){
                    var temp = that.events[item]
                    temp()
                }*/
            })
        }
        function stage(){
            this.canvas = document.getElementById('background')
            this.ctx = this.canvas.getContext('2d')
            this.attrs = {
                'w' : this.canvas.width
                ,'y' : this.canvas.height
            }
            this.events = {}
            this.shapesArr = []
            _bindEvt.call(this)
        }
        stage.prototype.addEvt = function(name,fun){
            if(this.events[name]) return
            this.events[name] = fun
        }
        stage.prototype.removeEvt = function(name){
            delete this.events[name]
        }
        stage.prototype.addShape = function(shape){
            this.shapesArr.push(shape)
        }
        return new stage()
    })
    var Shape = (function(){
        function shape(stage,x,y){
            this.stage = stage
            this.x = x
            this.y = y
        }
        shape.prototype.createCircle = function(){
            var x = this.x,y = this.y,radius = this.radius
            this.left = x - radius;
            this.top = y - radius;
            this.right = x + radius;
            this.bottom = y + radius;
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
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'green';
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = '#333';
        context.stroke();

        context.fillStyle = '#fff';
        context.textAlign = 'center';

        context.fillText('start', x, y);
    }


    function Sky(stage,x,y){
        Shape.call(this,stage,x,y)
        this.stage.addShape(this)
        this.test()
    }
    extend(Sky,Shape)
    Sky.prototype.test = function(){
        this.stage.ctx.fillRect(this.x,this.y,40,40)
        console.log(this.stage.shapesArr)
    }
    ;return {
        init : function(){
            var stage = Stage()
            new Circle(stage,100,100,20)
            new Circle(stage,120,110,30)
        }

    }
}());
