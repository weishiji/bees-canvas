var weishiji = window.weishiji || {}
weishiji.GAME = window.weishiji.GAME || (function(){
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
        Animation.prototype.addAnimate = function(key,fun){
            this.ainmateFunArr[key] = fun
        }
        Animation.prototype.deleteAnimate = function(key){
            delete this.ainmateFunArr[key]
        }
        return Animation
    })()
    var Stage = (function(){
    	function stage(){
    		if(!(this instanceof stage)) return new stage()

			this.createCanvas()
            this.animate = new Farme()
            this.events = {}
            var that = this
            this.animate.addAnimate("clearRect",function(){
            	//that.ctx.clearRect(0,0,that.canva.width,that.canva.height)
            })
    	}
    	stage.prototype.createCanvas = function(){
    		var canva = document.createElement("canvas")
            canva.width = 500
            canva.height = 500
            canva.style.border = "1px solid black"
            canva.style.background = "#f4fafa"
            this.canva = canva
            this.ctx = canva.getContext("2d")
    	}
    	stage.prototype.attachEvent = function(eventName,fun){
    		if(typeof fun === "function"){
    			this.events[eventName] = fun
    		}
    	}
    	return stage
    })()

    return {
    	"stageArr" : {},
    	"images" : {},
    	"createStage" : function(name){
    		if(this.stageArr[name]){
    			throw new Error(name + "'s stage is already exist")
    			return
    		}
    		var _stage = Stage()
			this.stageArr[name] = _stage
			document.body.appendChild(_stage.canva)
			return _stage
    	},
    	"extend":function(sup,sub){
			function temp(){};	
			temp.prototype=sup.prototype;
			temp.constructor=sub;
			sub.prototype=new temp();
		},
		"loadImage" : function(imageData,fun){
			var len = 0
				,that = this
				,imageArr = []
				,_load = function(count){
					var imageSrc = imageData[imageArr[count]]
						,img = new Image()
					img.src = imageSrc
					img.onload = function(){
						that.images[imageArr[count]] = img

						++count
						if(len === count){
							fun()
							return
						}
						_load(count)
					}
				}
			for(var item in imageData){
				len++
				imageArr.push(item)
			}
			
			_load(0)

		}
    }
})()