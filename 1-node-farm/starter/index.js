// Importing core modules
const fs = require('fs');
const http = require('http');
const url = require('url');

// Importing 3rd party modules

const slugify = require('slugify');

//Importing our own modules
const replaceTemplate = require('./modules/replaceTemplate');

//////////////////////
//FILES

// reading and writing files (Blocking and synchronous way)
// reading data from a file using readFileSync method (read file synchronously)
// const textIn = fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado : ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textOut);

// console.log('File Written!');


// reading and writing files (Non-Blocking and Asynchronous way)

// fs.readFile('./txt/start.txt','utf-8',(err,data1) => {
//     if(err) return console.log('ERROR 😢');
//     console.log('Data is ',data1);
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err,data3) => {
//             console.log(data3);
//             fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8',err => {
//                 console.log('Your file has been written 😎');
//             });
//         });
//     });
// });

// console.log('Reading file');


//////////////////////////
// SERVER and ROUTING


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8'); // reading data from file synchronously because this code will be executed once and doesn't matter if it is blocking code to some extent.
const dataObj = JSON.parse(data); // converts string in javascript object

const slugs = dataObj.map(el => slugify(el.productName, {lower:true})); // using 3rd party module in app
console.log(slugs);

// creating server using createServer method on http object 
const server = http.createServer((req,res) => {
    console.log(req.url);

    const {query,pathname} = url.parse(req.url,true); // using the url module to fetch query parameters and pathname
    // const pathName = req.url;  // implementing basic routing (fetching the url from the request and based upon it sending different responses.)
    
    
    // Overview page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200,{
            'Content-type':'text/html'
        });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard,el)).join('');
        const output = tempOverview.replace('{%PRODUCTS_CARDS%}',cardsHtml);
        res.end(output);


      // Product page  
    } else if (pathname === '/product') {
        console.log(query);
        res.writeHead(200,{
            'Content-type':'text/html'
        });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct,product);
        res.end(output);

        // API
    } else if (pathname === '/api') {
        res.writeHead(200,{
            'Content-type':'application/json'
        });
        res.end(data);
    } else {
        res.writeHead(404, { // writeHead used to write headers and other stuff like status code
            'Content-type':'text/html',
            'my-own-header':'hello-world'
        });
        res.end('<h1>Page not found!</h1>'); // fallback in case of route requested doesn't exist
    }  
});

// Listening to server on port 8000
server.listen(8000,'127.0.0.1', () => {
    console.log('Listening to requests on port number 8000');
});


