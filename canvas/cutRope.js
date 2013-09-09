var WG = weishiji.GAME
function startGame(){
	var imageData = {"pushpin" : "image/pushpin.jpg","rope" : "image/rope.jpg"}

	WG.loadImage(imageData,function(){
		var stage = WG.createStage("weishiji")
		stage.canva.addEventListener("click",function(ev){
			var x = ev.offsetX, y = ev.offsetY
			console.log(x + "__" + y)
			weishiji.Sugar(stage,x,y,200)

		},false)
	})
}


weishiji.Sugar = (function(){
	function sugar(stage,x,y,r){
		if(!(this instanceof sugar)) return new sugar(stage,x,y,r)
		var that = this

		this.stage = stage
		this.centerX = x
		this.centerY = y
		this.radius = r
		//WG.getSpirit().call(this)
		this.stage.animate.addAnimate("sugar",function(){
			that.createSugar()
		})
		this.rope = rope(stage,x,y,r)
	}
	sugar.prototype.createSugar = function(){
		var img = WG.images["pushpin"]
			,ctx = this.stage.ctx
		ctx.drawImage(img,590,20,200,200,this.centerX-42,this.centerY-55,100,100)
	}
	function rope(stage,x,y,r){
		if(!(this instanceof rope)) return new rope(stage,x,y,r)
		var that = this
		this.stage = stage
		this.startX = x
		this.startY = y
		this.radius = r
		//WG.getSpirit().call(this)
		this.stage.animate.addAnimate("line",function(){
			that.createRope()
		})
		this.sweet = new sweet(stage,x,y,r)
	}
	rope.prototype.createRope = function(){
		/*var img = WG.images["rope"]
			,ctx = this.stage.ctx
		ctx.drawImage(img,590,20,200,200,100,100,100,100)*/
		var ctx = this.stage.ctx
		ctx.beginPath()
		ctx.moveTo(this.startX,this.startY)


	}
	function sweet(stage,x,y,r){
		var that = this
		this.stage = stage
		this.sX = x
		this.sY = y
		this.endX = x
		this.endY = y
		this.radius = r
		this.startTime = new Date().getTime()
		this.stage.animate.addAnimate("sweet",function(){
			that.createSweet()
		})
	}
	sweet.prototype.createSweet = function(){
		var ctx = this.stage.ctx
		ctx.lineTo(this.endX,this.endY)
		ctx.stroke()
		ctx.fillStyle="#FF0000"
		ctx.beginPath()
		ctx.arc(this.endX,this.endY,10,0,Math.PI*2,true)
		ctx.closePath()
		ctx.fill()
		this.gravity()
	}
	sweet.prototype.gravity = function(){
		var that = this
			,t = (new Date().getTime() - that.startTime) / 1000
			,g = 10 ,speed = 100
			,gs = that.sY + that.radius
			,gt = Math.sqrt(gs * 2 / speed / g)
		if(that.endY <= that.sY + that.radius){
			that.endY += g * t * t / 2 * speed
		}else if(that.endY > gs && that.endY <= gs + 100){
			//var ft = t - gt
			//that.endY += 0.1 / ft
			/*var ft = t - gt
			that.endY += -g * ft * ft / 2 * speed*/
		}
		//that.endY = that.sY+that.radius > (that.endY += 10 * t * t / 2 * 30) ? that.endY : that.sY + that.radius
	}
	return sugar
})()


