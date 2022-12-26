const EventEmitter = require('events');
const http = require('http');

class Sales extends EventEmitter {
    constructor() {
        super();
    }
}


// Observer Pattern (here we are listening to the events and observing the values emitted);
const myEmitter = new Sales();

myEmitter.on('newSale',() => {
console.log("There was a new sale!");
});

myEmitter.on('newSale', () => {
    console.log('Customer Name is ABC');
});

myEmitter.on('newSale', stock => {
    console.log(`There are ${stock} items left in stock`);
})

myEmitter.emit('newSale',12);

///////////////////

const server = http.createServer();

server.on('request', (req,res) => {
    console.log('Request Received');
    res.end('Request Received');
});

server.on('request', (req,res) => {
    console.log('Another Request');
});

server.on('close', (req,res) => {
    console.log('Server Closed');
});

server.listen(8000,'127.0.0.1', () => {
    console.log('Waiting for Requests.....');
});