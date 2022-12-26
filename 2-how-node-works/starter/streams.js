const fs = require('fs');
const server = require('http').createServer();

server.on('request' ,(req,res) => {
    // Solution 1
    // node will load all data in memory and if file is huge , it can create problems
    // fs.readFile('test-file.txt', (err,data) => {
    //     if(err) console.log('Error is ',err);
    //     res.end(data);
    // });

    // Solution 2 : Streams

    // const readable = fs.createReadStream('test-file.txt');
    // readable.on('data', chunk => {
    //     res.write(chunk);
    // });
    // readable.on('end', () => {
    //     res.end();
    // });

    // readable.on('error', err => {
    //     console.log(err);
    //     res.statusCode = 500;
    //     res.end('File not found');
    // });

    // Solution 3

    const readable = fs.createReadStream('test-file.txt');
    readable.pipe(res); // here pipe also solves the problem of backpressure

    // ReadableSource.pipe(writeableDestination);
});

// BackPressure :-> happens when response can not send as fast as nearly as it is receiving it from the file.


server.listen(8000, '127.0.0.1', () => {
    console.log('Listening.....');
});