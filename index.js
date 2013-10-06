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

function _getParentObjectFromPath(o, path){
	for (var i = 0; i<path.length-1; i++){
		o = o[path[i]];
	}

	return o;
}

var _decorate = function(obj){
	obj.nostalgorithm = {
		calls: []
	};

	traverse(obj).forEach(function(p){
		if (typeof p !== 'function') return;

		var parent = _getParentObjectFromPath(obj, this.path);
		var newFunc =  _intercept(obj, this.path.join('.'), p);
		
		if (this.key){
			parent[this.key] = newFunc;
		} else { // when p===obj is the root, i.e. when the root is a function
			obj = newFunc;
			obj.nostalgorithm = p.nostalgorithm;
		}
	});

	return obj;
};

module.exports = _decorate;
