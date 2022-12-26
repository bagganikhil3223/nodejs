// File which we use to listen for the server
// it is also the entry point of our app.
// Here we also do stuff like database connection, error handling ,environment variables configuarations etc

const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path:`./config.env` }); // to let the node app know that we have some configuarations made which we have to include to the app.

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

// Here we are connecting with database using connect method of mongoose library, it accepts two arguments
// 1st is connection string and second is optional object to avoid deprecation warnings.
// this connect method returns a promise which we need to handle with then method
// here we are connecting with remote database(hosted on cloud)

mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(() => console.log("db connection succesful"));






// to connect to local databse , just update the connection string with local connection string 
// mongoose.connect(process.env.DATABASE_LOCAL,{
//     useNewUrlParser:true,
//     useCreateIndex:true,
//     useFindAndModify:false
// }).then(() => console.log("db connection succesful"));


// console.log('Env is',process.env);
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App is listening on port number ${port}`);
});

