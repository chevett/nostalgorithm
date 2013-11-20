var merle = require('merle');
var _slice = Array.prototype.slice;
var IGNORED = {
	nostalgorithm: true,
	__nostalgorithmfunc: true
};

var _isPromise = function(v){
	if (v && typeof v.then === 'function') return true; // i don't know if there is a right way to do this. halp!
	
	return false;
};

var _intercept = function(self, name, fn){
	return function(){
		var callInfo = {
			name: name,
			arguments: _slice.call(arguments)
		};

		self.nostalgorithm._beforeFunctions.forEach(function(fn){
			fn.call(self, callInfo);
		});

		var result = callInfo.value = fn.apply(self, arguments);

		if (_isPromise(result)){
			result.done(function(v){
				self.nostalgorithm._afterFunctions.forEach(function(fn){
					fn.call(self, callInfo);
				});
				result = callInfo.value = v;
			});
		} else {
			self.nostalgorithm._afterFunctions.forEach(function(fn){
				fn.call(self, callInfo);
			});
		}


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
	merle(o, function(){
		if (IGNORED[this.name]) return false;
		if (typeof this.value !== 'function') return;

		var self = this;

		fn.call(this, this.value, function(newFunc){
			var n = self.value.nostalgorithm;
			self.value = newFunc;
			
			if (self.isRoot){
				self.nostalgorithm = n;
			}
		});
	});

	return o;
}

var _watch = function(obj){
	obj.nostalgorithm = obj.nostalgorithm || {
		_beforeFunctions: [],
		_afterFunctions: [],
		calls: [],
		before: function(fn){
			obj.nostalgorithm._beforeFunctions.push(fn);
		},
		after: function(fn){
			obj.nostalgorithm._afterFunctions.push(fn);
		}
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

var _before = function(obj, fn){
	if (!obj) return;
	if (!obj.nostalgorithm) {
		obj = _watch(obj);
	}

	obj.nostalgorithm.before(fn);
};

var _after = function(obj, fn){
	if (!obj) return;
	if (!obj.nostalgorithm) {
		obj = _watch(obj);
	}

	obj.nostalgorithm.after(fn);
	
};

module.exports = {
	watch: _watch,
	ignore: _ignore,
	before: _before,
	after: _after
};
