var WG = weishiji.GAME
function startGame(){
	var imageData = {"pushpin" : "image/pushpin.jpg"}

	WG.loadImage(imageData,function(){
		var stage = WG.createStage("weishiji")
		stage.canva.addEventListener("click",function(ev){
			var x = ev.offsetX, y = ev.offsetY
			console.log(x + "__" + y)
			weishiji.Sugar(stage,x,y,30)

		},false)
	})
}


weishiji.Sugar = (function(){
	function sugar(stage,x,y,r){
		if(!(this instanceof sugar)) return new sugar(stage,x,y,r)
		this.stage = stage
		this.centerX = x
		this.centerY = y
		this.radius = r
		this.createSugar()
	}
	sugar.prototype.createSugar = function(){
		var img = WG.images["pushpin"]
			,ctx = this.stage.ctx
		//ctx.drawImage(img, 100, 100,512,512,)

		ctx.drawImage(img,590,20,200,200,this.centerX-42,this.centerY-55,100,100)

	}
	return sugar
})()


