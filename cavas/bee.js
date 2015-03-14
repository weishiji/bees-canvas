/**
 * Created by lxg on 13-12-26.
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
})();
var resource = {
    "background" : "images/bg.png",
    "bullet" : "images/bullet.png",
    "bullet_enemy" : "images/bullet_enemy.png",
    "enemy" : "images/enemy.png",
    "ship" : "images/ship.png"
};
var fn = {
    extend : function(child,parent){
        var F = function(){}
        F.prototype = parent.prototype
        child.prototype = new F()
        child.prototype.constructor = child
    }
};
function Drawable(x,y,speed){
    this.x = x
    this.y = y
    this.speed = speed || 0
    this.canvas = document.getElementById("background")
    this.ctx = this.canvas.getContext("2d")
    this.canvasWidth = this.canvas.width
    this.canvasHeight = this.canvas.height
}
Drawable.prototype.clearCanvas = function(){
    this.ctx.clearRect(this.x,this.y,this.canvasWidth,this.canvasHeight)
}
Drawable.prototype.draw = function(){

};
/*
* 所有的数据缓存
*
* */
function Pool(){
    Drawable.call(this)
    this.arr = new Array()
}
Pool.prototype.add = function(obj){
    this.arr.push(obj)
    this.clearBullet()

}
Pool.prototype.clearBullet = function(){
    console.log(this.arr)
    for(var i= 0,len = this.arr.length;i<len;i+=1){
        var temp = this.arr[i]
        console.log(temp)
        if(temp){
            if(temp.y < 0){
                this.arr.splice(i,1)
            }
        }
    }
}

/*
* 星空的背景色的滚动
*
* */
function Background(image){
    var x = 0,y = 0,speed = 1
    Drawable.call(this,x,y,speed)
    this.image = image
}
fn.extend(Background,Drawable)
Background.prototype.draw = function(){
    var that = this
    this.clearCanvas()
    this.y += this.speed
    this.ctx.drawImage(this.image,this.x,this.y)
    this.ctx.drawImage(this.image,this.x, this.y - this.canvasHeight)
    RAF(function(){
        that.draw()
    })
    if (this.y >= this.canvasHeight){
        this.y = 0;
    }
}
/*
*
* 我的飞船
*
*
* */

function Ship(speed,image,bullet){
    Drawable.call(this,undefined,undefined,speed)
    this.image = image
    this.bullet = bullet
    this.shipWidth = this.image.width
    this.shipHeight = this.image.height
    this.x = this.canvasWidth / 2 - this.shipWidth
    this.y = (this.canvasHeight - this.shipHeight) - 10
    this.keyStatus = this.bindEvt()
    this.counter = 0 //子弹的计数器
    this.bulletPool = new Pool()
}
fn.extend(Ship,Drawable)
Ship.prototype.draw = function(){
    var that = this
    this.ctx.drawImage(this.image,this.x,this.y)
    this.move()
    RAF(function(){
        that.draw()
    })
}
Ship.prototype.bindEvt = function(){
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
        if (this.x >= this.canvasWidth - this.shipWidth){this.x = this.canvasWidth - this.shipWidth}
    }if(this.keyStatus.up){
        this.y -= this.speed
        if (this.y <= this.canvasHeight/4*3){this.y = this.canvasHeight/4*3}
    }if(this.keyStatus.down){
        this.y += this.speed
        if (this.y >= this.canvasHeight - this.shipHeight){this.y = this.canvasHeight - this.shipHeight}
    }if(this.keyStatus.space && this.counter > interval){
        this.counter = 0
        // fire
        this.fire()
    }
}
Ship.prototype.fire = function(){
    var bullet = new Bullet(this.x,this.y,2,this.bullet)
    this.bulletPool.add(bullet)
}
function Bullet(x,y,speed,image){
    Drawable.call(this,x,y,speed)
    this.image = image
    this.bulletWidth = this.image.width
    this.buttetHeight = this.image.height
    this.draw()
}
fn.extend(Bullet,Drawable)
Bullet.prototype.draw = function(){
    var that = this, adjust = 6//子弹的校正量

    that.y -= this.speed
    this.ctx.drawImage(this.image,this.x+adjust,this.y)
    this.ctx.drawImage(this.image,this.x+40-adjust,this.y)
    RAF(function(){
        that.draw()
    })
}

;(function(files,callback){
    var imageObject = {},srcArr = new Array(),itemArr = new Array()
    for(var item in files){
        srcArr.push(files[item])
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
                callback(imageObject)
            }
        }
    }
    imageLoad(0)
}(resource,function(imageObject){
    var game = new Game(imageObject)
    game.init()
}));
var Game = (function(){
    function game(images){
        this.images = images
    }
    game.prototype.init = function(){
        var background = new Background(this.images.background)
        background.draw()
        var ship = new Ship(3,this.images.ship,this.images.bullet)
        ship.draw()
    }
    return game
}())
