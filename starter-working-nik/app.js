
const express = require('express');
const morgan = require('morgan'); // package which we use for request logging 

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();


// 1) MIDDLEWARES

// console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development') {
    // here we using this environment variable to log the prints only if we are in development mode.
    app.use(morgan('dev')); // using this middleware to print logs in console
}


app.use(express.json()); // Middleware (Data body is not present on request object when client sends it and using middleware we get that client data in express)
// here express.json() is a middleware

app.use(express.static(`${__dirname}/public`)); // inbuilt middleware to serve static files and string passed in the argument is the directory from which file will be served.

// Custom Middleware

app.use((req,res,next) => {
    console.log('Hello from the middleware!'); // will print this log, because it is still the part of request response cycle
    next(); // if we don't call this next method, then code will stuck and request-response cycle also gets stuck
});

app.use((req,res,next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// app.get('/' ,(req,res) => {
//     // res.status(200).send('Hello from the server side!'); // this will send a string as response
//     res.status(200).json({
//         message:'Hello from the server side',
//         app:'Natours'
//     }); // sending json response
// });

// app.post('/' ,(req,res) => {
//     res.send('You can post to this endpoint....');
// });






// Get Request
// app.get('/api/v1/tours', getAllTours);

// Responding to url parameters
// app.get('/api/v1/tours/:id', getTour);

// Post Request
// app.post('/api/v1/tours', createTour);

// Patch Request

// app.patch('/api/v1/tours/:id', updateTour);

// Delete Request

// app.delete('/api/v1/tours/:id', deleteTour);

// 3) ROUTES







// app.use((req,res,next) => {
//     console.log('Hello from the middleware!'); // will not print this log, because route has already sent the response( for CreateTour and GetAll tour) and (request-response cycle) is finished executing.
//                                                // but it will work for below routes because it is present above in the middleware stack from the below routes.
//     next(); // if we don't call this next method, then code will stuck and request-response cycle also gets stuck
// });




app.use('/api/v1/tours',tourRouter); // implementing Sub Routing as middleware (this is called mounting a router)
app.use('/api/v1/users',userRouter);

// 4) START SERVER

module.exports = app;