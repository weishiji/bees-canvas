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
                for(var item in that.events){
                    var temp = that.events[item]
                    temp()
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
        return shape
    }())
    function Sky(stage,x,y){
        Shape.call(this,stage,x,y)
        this.stage.addShape(this)
        this.test()
    }
    extend(Sky,Shape)
    Sky.prototype.test = function(){
        console.log(this.stage.shapesArr)
    }
    ;return {
        init : function(){
            var stage = Stage()
            new Sky(stage,10,10)
            
        }

    }
}());
