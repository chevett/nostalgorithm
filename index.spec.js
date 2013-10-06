var nostalgorithm = require('./index.js');
var expect = require('chai').expect;

describe('nostalgorithm', function(){
	it('should be expose methods from original object', function(){
		var myObj = {
			meth: function(){}
		};

		nostalgorithm.watch(myObj);
		expect(myObj.meth).to.be.a('function');
	});
	it('should track function name', function(){
		var myObj = {
			meth: function(){}
		};

		nostalgorithm.watch(myObj);
		myObj.meth();

		expect(myObj.nostalgorithm.calls).to.have.length.of(1);
		var callInfo = myObj.nostalgorithm.calls[0];
		expect(callInfo.name).to.be.equal('meth');
	});
	it('should track nested function names', function(){
		var myObj = {
			bart:{
				simpson: {
					doTheBartMan: function(){}
				}
			},
			meth: function(){}
		};

		nostalgorithm.watch(myObj);
		myObj.bart.simpson.doTheBartMan();

		expect(myObj.nostalgorithm.calls).to.have.length.of(1);
		var callInfo = myObj.nostalgorithm.calls[0];
		expect(callInfo.name).to.be.equal('bart.simpson.doTheBartMan');
	});
	it('should track function arguments', function(){
		var myObj = {
			meth: function(){}
		};

		nostalgorithm.watch(myObj);
		myObj.meth('hi', 'goodbye');

		expect(myObj.nostalgorithm.calls).to.have.length.of(1);
		var callInfo = myObj.nostalgorithm.calls[0];
		expect(callInfo.arguments).to.have.members(['hi', 'goodbye']);
	});
	it('should track return value', function(){
		var myObj = {
			meth: function(){return 'nah-nah-nah';}
		};

		nostalgorithm.watch(myObj);
		myObj.meth();

		expect(myObj.nostalgorithm.calls).to.have.length.of(1);
		var callInfo = myObj.nostalgorithm.calls[0];
		expect(callInfo.value).to.be.equal('nah-nah-nah');
	});
	it('should be able to access properties', function(){
		var myObj = {
			meth: function(){return 'nah-nah-nah';},
			prop: 5
		};

		nostalgorithm.watch(myObj);
		expect(myObj.prop).to.be.equal(5);
	});
	it('should work on only a function', function(){
		var myFunc = function(){ };

		myFunc = nostalgorithm.watch(myFunc);
		myFunc();

		expect(myFunc.nostalgorithm).to.be.ok;
		expect(myFunc.nostalgorithm.calls).to.have.length.of(1);
	});
	it('should be able to watch and ignore at your leisure', function(){
		var myObj = {
			meth: function(){return 'nah-nah-nah';},
			prop: 5
		};

		myObj = nostalgorithm.watch(myObj);

		myObj.meth();

		expect(myObj.nostalgorithm).to.be.ok;
		expect(myObj.nostalgorithm.calls).to.have.length.of(1);

		myObj = nostalgorithm.ignore(myObj);
		var ans = myObj.meth();

		expect(ans).to.be.equal('nah-nah-nah');
		expect(myObj.nostalgorithm.calls).to.have.length.of(1);

		myObj = nostalgorithm.watch(myObj);
	
		expect(myObj.nostalgorithm.calls).to.have.length.of(1);

		myObj.meth();
		expect(myObj.nostalgorithm.calls).to.have.length.of(2);
	});
});
