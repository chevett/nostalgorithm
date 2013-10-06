var traverse = require('traverse');
var _slice = Array.prototype.slice;

var _intercept = function(self, name, fn){
	return function(){
		var callInfo = {
			name: name,
			arguments: _slice.call(arguments)
		};

		var result = callInfo.value = fn.apply(self, arguments);

		self.nostalgorithm.calls.push(callInfo);

		return result;
	};
};

var Nostalgorithm = function(obj){
	var self = Object.create(obj);

	self.nostalgorithm = {
		instance: obj,
		calls: []
	};

	traverse(obj).forEach(function(p){
		if (typeof p !== 'function') return;

		self[this.key] = _intercept(self, this.key, p);

	});

	return self;
};

module.exports = Nostalgorithm;
