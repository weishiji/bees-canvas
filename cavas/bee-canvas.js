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
    var imgSrc = [
        "images/bg.png","images/bullet.png","images/bullet_enemy.png",
        "images/enemy.png","images/ship.png"
    ]
    ,extend = function(child,parent){
        var F = function(){}
        F.prototype = parent.prototype
        child.prototype = new F()
        child.prototype.constructor = child
    }
    ,imageOnload = function(){
        
    };

    return {
        init : function(){
            var imgObj = [],len = imgSrc.length
        }
    }
}());

BEE.init()