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
  myMethodTwo: function(x){ return 5 + x; }
};

n.watch(o);

o.myMethodOne();
o.myMethodTwo();

console.log(o.nostalgorithm.calls); => [
  {name: 'myMethodTwo', arguments: [], value: 5 },
  {name: 'myMethodTwo, arguments: [4], value: 9 }
] 

n.ignore(o);

o.myMethodOne();

// o.nostalgorithm.calls is unchanged because we called ignore
