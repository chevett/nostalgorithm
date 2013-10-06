var Nostalgorithm = require('./index.js');
var expect = require('chai').expect;

describe('nostalgorithm', function(){
	it('should be expose methods from original object', function(){
		var myObj = {
			meth: function(){}
		};

		var n = new Nostalgorithm(myObj);

		expect(n.meth).to.be.a('function');
	});
	it('should expose the original object', function(){
		var myObj = {};

		var n = new Nostalgorithm(myObj);
		expect(n.nostalgorithm.instance).to.be.equal(myObj);
	});
	it('should track function name', function(){
		var myObj = {
			meth: function(){}
		};

		var n = new Nostalgorithm(myObj);
		n.meth();

		expect(n.nostalgorithm.calls).to.have.length.of(1);
		var callInfo = n.nostalgorithm.calls[0];
		expect(callInfo.name).to.be.equal('meth');
	});
	it('should track function arguments', function(){
		var myObj = {
			meth: function(){}
		};

		var n = new Nostalgorithm(myObj);
		n.meth('hi', 'goodbye');

		expect(n.nostalgorithm.calls).to.have.length.of(1);
		var callInfo = n.nostalgorithm.calls[0];
		expect(callInfo.arguments).to.have.members(['hi', 'goodbye']);
	});
	it('should track return value', function(){
		var myObj = {
			meth: function(){return 'nah-nah-nah';}
		};

		var n = new Nostalgorithm(myObj);
		n.meth();

		expect(n.nostalgorithm.calls).to.have.length.of(1);
		var callInfo = n.nostalgorithm.calls[0];
		expect(callInfo.value).to.be.equal('nah-nah-nah');
	});
	it('should be able to access properties', function(){
		var myObj = {
			meth: function(){return 'nah-nah-nah';},
			prop: 5
		};

		var n = new Nostalgorithm(myObj);
		expect(n.prop).to.be.equal(5);
	});
});
