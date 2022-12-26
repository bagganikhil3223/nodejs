// console.log(arguments);
// console.log(require('module').wrapper);


// Module.exports
const C = require('./test-module-1.js');
const calc1 = new C();
console.log(calc1.add(2,8));

// Exports

// const calc2 = require('./test-module-2'); // will return exports object 

const {add,multiply} = require('./test-module-2'); // using destructuring to fetch add and mulitply only
console.log(multiply(2,7));


// caching
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();