console.log("Hello from the module"); // will be logged once as this module will be cached somewhere by node

module.exports = () => console.log("Log this beautiful text 😍");