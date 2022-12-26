const fs = require('fs');
const mongoose = require('mongoose');

const dotenv = require('dotenv');

const Tour = require('../../models/tourModel');

dotenv.config({ path:`./config.env` }); // to let the node app know that we have some configuarations made which we have to include to the app.


const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(() => console.log("db connection succesful"));

// Reading Json file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'));

// Import Data into Database

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data succesfully Loaded');
        
    } catch(err) {
        console.log(err);
    }
    process.exit();
}


// Delete All Data from DB

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data succesfully deleted');
        
    } catch(err) {
        console.log(err);
    }
    process.exit();
}

if(process.argv[2] === '--import') {
    importData(); // command required to run this is (node dev-data/data/import-dev-data.js --import)
} else if(process.argv[2] === '--delete') {
    deleteData(); // command required to run this is (node dev-data/data/import-dev-data.js --delete)
}


console.log(process.argv);// keeps track of arguments passed through command line