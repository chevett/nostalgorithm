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

function _replaceFunctions(o, fn){
	traverse(o).forEach(function(p){
		if (typeof p !== 'function') return;

		var self = this;

		fn.call(this, p, function(newFunc){
			var parent = _getParentObjectFromPath(o, self.path);

			if (self.key){
				parent[self.key] = newFunc;
			} else { // when p===obj is the root, i.e. when the root is a function
				o = newFunc;
				o.nostalgorithm = p.nostalgorithm;
			}
		});
	});

	return o;
}

var _watch = function(obj){
	obj.nostalgorithm = obj.nostalgorithm || {
		calls: []
	};

	obj = _replaceFunctions(obj, function(p, doReplace){
		var newFunc =  _intercept(obj, this.path.join('.'), p);
		newFunc.__nostalgorithmfunc = p;

		doReplace(newFunc);
	});

	return obj;
};

var _ignore = function(obj){
	if (!obj) return obj;

	var n = obj.nostalgorithm;

	obj = _replaceFunctions(obj, function(p, doReplace){
		if (!p.__nostalgorithmfunc) return;

		doReplace(p.__nostalgorithmfunc);
	});

	obj.nostalgorithm = n;

	return obj;
};

module.exports = {
	watch: _watch,
	ignore: _ignore
};
