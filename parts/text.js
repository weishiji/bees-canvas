/*$(document).ready(function(){

})
var eventuality = function(that){
	var registry = {}
	that.fire = function(event){
		var array,func,handler,i,
			type = typeof event === "string" ? event : event.type
		if(registry.hasOwnProperty(type)){
			array = registry[type]
			for(var i=0;i<array.length;i++){
				handler = array[i]
				func = handler.method;
				if(typeof func === "string"){
					func = this[func]
				}
				func.apply(this,handler.parameters || [event])
			}
		}
		return this;
	}
	that.on = function(type,method,parameters){
		var handler = {
			method : method,
			parameters : parameters
		}
		if(registry.hasOwnProperty(type)){
			registry[type].push(handler)
		}else{
			registry[type] = [handler]
		}
		console.log(this)
		return this
	}
	return that
}

var test = eventuality({
	"address" : "beijing",
	"age" : "30"
})
test.on()
console.log(test)

*/
$(document).ready(function(){

})
var publisher = {
    subscribers: {
        any: [] // event type: subscribers
    },
    subscribe: function (fn, type) {
        type = type || 'any';
        if (typeof this.subscribers[type] === "undefined") {
            this.subscribers[type] = [];
        }
        this.subscribers[type].push(fn);
    },
    unsubscribe: function (fn, type) {
        this.visitSubscribers('unsubscribe', fn, type);
    },
    publish: function (publication, type) {
        this.visitSubscribers('publish', publication, type);
    },
    visitSubscribers: function (action, arg, type) {
        var pubtype = type || 'any',
            subscribers = this.subscribers[pubtype],
            i,
            max = subscribers.length;

        for (i = 0; i < max; i += 1) {
            if (action === 'publish') {
                subscribers[i](arg);
            } else {
                if (subscribers[i] === arg) {
                    subscribers.splice(i, 1);
                }
            }
        }
    }
};
function makePublisher(o) {
    var i;
    for (i in publisher) {
        if (publisher.hasOwnProperty(i) && typeof publisher[i] === "function") {
            o[i] = publisher[i];
        }
    }
    o.subscribers = {any: []};
}
var paper = {
    daily: function () {
        this.publish("hello");
    },
    monthly: function () {
        this.publish("interesting analysis", "monthly");
    }
};
makePublisher(paper);

var joe = {
    drinkCoffee: function (paper) {
        console.log('Just read ' + paper);
    },
    sundayPreNap: function (monthly) {
        console.log('About to fall asleep reading this ' + monthly);
    },
    "test" : function(liu){
    	console.log("liu xiao guang:" + liu)
    }
};
//paper.subscribe(joe.drinkCoffee);
paper.subscribe(joe.test)
/*paper.subscribe(joe.sundayPreNap, 'monthly');
paper.subscribe(joe.test,"show")*/

console.log(paper)
paper.daily();
/*paper.daily();
paper.daily();
paper.monthly();
*/