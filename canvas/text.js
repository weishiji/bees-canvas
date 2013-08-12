var GamePage = window.GamePage || {}
$(document).ready(function(){
    var canvas = document.getElementById("cvs")
    var ctx = canvas.getContext("2d")
    /*var bo = GamePage.game(ctx,10,10,10)
    bo.spin()
    var bo1 = GamePage.game(ctx,10,10,10)
    bo1.gravity()*/
    GamePage.game(ctx)
})
GamePage.game = (function(){
    _extend = function(sup,sub){
        function temp(){};  
        temp.prototype=sup.prototype;
        temp.constructor=sub;
        sub.prototype=new temp();
    }
    var Farme = (function(){
        var RAF=window.mozRequestAnimationFrame || window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(callback){setTimeout(callback,60)}
        function Animation(ctx){
            this.ainmateFunArr = {}
            var that = this
            var setAni = function(){
                for(var i in that.ainmateFunArr){
                    that.ainmateFunArr[i]()
                }
                RAF(start)
            }
            
            var start = function(){
                setAni()
            }
            start()
        }
        Animation.prototype.addFun = function(key,fun){
            this.ainmateFunArr[key] = fun
        }
        Animation.prototype.deleteFun = function(key){

        }
        return Animation
    })()
    /** 角色类设计 */
    var Sprite = (function(){
        function sprite(ctx){
            this.ctx = ctx
            this.animate = new Farme(ctx)
            this.timestamp = new Date().getTime() / 1000
            this.direction = 1
        }
        return sprite
    })()  
    var Bobble = (function(){
        function bobble(ctx,x,y,r){
            if(!(this instanceof bobble)){
                return new bobble(ctx,x,y,r)
            }
            this.x = x
            this.y = y
            this.r = r
            Sprite.call(this,ctx)
        }
        _extend(Sprite,bobble)
        bobble.prototype.gravity = function(){
            var that = this
            this.ctx.clearRect(0,0,500,500)
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
            this.ctx.fillStyle = '#87CEEB';
            this.ctx.fill();
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = '#87CEEB';
            this.ctx.stroke();
            var _grvaity = function(){
                that.x+=4
                if(that.x >= 500){
                    that.x = 0
                }
                that.gravity()
            }
            this.animate.addFun("gravity",_grvaity)
        }
        bobble.prototype.spin = function(){
            var that = this
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
            this.ctx.fillStyle = 'red';
            this.ctx.fill();
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = 'red';
            this.ctx.stroke();
            var _spin = function(){
                that.y = 1/2 * 10 * Math.pow((new Date().getTime() / 1000 - that.timestamp),2) * 30 + 10
                if(that.y >= 500){
                    that.y = 10
                    that.timestamp = new Date().getTime() / 1000
                }
                that.spin()
            }
            this.animate.addFun("spin",_spin)
        }
        return bobble
    })()
    
    return function(ctx){
        var bo = Bobble(ctx,10,10,10)
        console.log(bo)
        bo.gravity()
        var bo1 = Bobble(ctx,10,10,10)
        console.log(bo1)
        bo1.spin()

    }
})()