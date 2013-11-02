nostalgorithm
=============
[![Build Status](https://travis-ci.org/chevett/nostalgorithm.png?branch=master)](https://travis-ci.org/chevett/nostalgorithm?branch=master)
[![Dependency Status](https://gemnasium.com/chevett/nostalgorithm.png)](https://gemnasium.com/chevett/nostalgorithm)


create an audit trail of every method call

examples
========
	var n = require('nostalgorithm');
	var o = {
  		myMethodOne: function(){ return 5; },
  		myMethodTwo: function(x){ return 5 + x; },
  		child: {
  			anotherMethod: function(x){ return 2*x; }
  		}
	};

	n.watch(o);

	o.myMethodOne();
	o.child.anotherMethod(10);
	o.myMethodTwo(4);

	console.log(o.nostalgorithm.calls); => [
  		{name: 'myMethodOne', arguments: [], value: 5 },
  		{name: 'child.anotherMethod', arguments: [10], value: 20 },
  		{name: 'myMethodTwo, arguments: [4], value: 9 }
	] 

	n.ignore(o);

	o.myMethodOne();

	// o.nostalgorithm.calls is unchanged because we called ignore
