var GamePage = window.GamePage || {}
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
            delete this.ainmateFunArr[key]
        }
        return Animation
    })()
    var Stage = (function(){
        var ObjectArr = []
            ,_bindEvt = function(){
                var _thisObj = undefined
                    ,clickX = 0
                    ,clickY = 0
                this.canva.addEventListener("mousedown",function(ev){
                    clickX = ev.offsetX
                    clickY = ev.offsetY
                    var len = ObjectArr.length
                    for(var i=0;i<len;i++){
                        var temp = ObjectArr[i]
                        if(clickX>=temp.x-temp.r && clickX<=temp.x+temp.r && clickY>=temp.y-temp.r && clickY<=temp.y+temp.r){
                            _thisObj = temp
                            break
                        }
                    }
                },false)
                this.canva.addEventListener("mousemove",function(ev){
                    var moveX = ev.offsetX
                        ,moveY = ev.offsetY
                    if(_thisObj === undefined){
                        return
                    }
                    _thisObj.x = moveX
                    _thisObj.y = moveY
                },false)
                this.canva.addEventListener("mouseup",function(){
                    _thisObj = undefined
                })
            }
        function stage(){
            if(!(this instanceof stage)) return new stage()
            var canva = document.createElement("canvas")
                ,that = this
            canva.width = 500
            canva.height = 500
            canva.style.border = "1px solid #dddddd"
            this.canva = canva
            this.ctx = canva.getContext("2d")
            this.animate = new Farme()
            this.animate.addFun("clearRect",function(){
                that.ctx.clearRect(0,0,500,500)
            })
            this.animate.addFun("create",function(){
                var len = ObjectArr.length
                for(var i=0;i<len;i++){
                    var temp = ObjectArr[i]
                    temp.create()
                }
            })
            _bindEvt.call(this)
        }
        stage.prototype.getCanvas = function(){
            return this.canva
        }
        stage.prototype.pushObj = function(object){
            var that = this
            ObjectArr.push(object)
        }
        stage.prototype.getObj = function(){

        }
        stage.prototype.deleObj = function(){

        }
        return stage
    })()
    var Bobble = (function(){
        function bobble(stage,x,y,r){
            if(!(this instanceof bobble)){
                return new bobble(stage,x,y,r)
            }
            this.stage = stage
            this.x = x
            this.y = y
            this.r = r
            this.create()
            this.stage.pushObj(this)
        }
        bobble.prototype.create = function(){
            var that = this
            that.stage.ctx.beginPath()
            that.stage.ctx.arc(that.x, that.y, that.r, 0, 2 * Math.PI, false)
            that.stage.ctx.fillStyle = '#87CEEB'
            that.stage.ctx.fill()
            that.stage.ctx.lineWidth = 1
            that.stage.ctx.strokeStyle = "#87CEEB"
            this.stage.ctx.stroke()
        }
        bobble.prototype.move = function(moveX,moveY){
            var that = this
            that.x += moveX
            that.y += moveY
            that.create()
        }
        return bobble
    })()
    
    return {
        initialize : function(){
            var temp = Stage()
            document.body.appendChild(temp.getCanvas())
            return temp
        }
        ,cutRope : function(stage){
            Bobble(stage,100,100,20)
            Bobble(stage,200,100,20)
            Bobble(stage,300,200,40)
            Bobble(stage,300,300,10)
            Bobble(stage,400,200,10)
        }
    }
})()
$(document).ready(function(){
    var stage = GamePage.game.initialize()
    GamePage.game.cutRope(stage)
})