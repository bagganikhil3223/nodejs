// const fs = require('fs');

const Tour = require('../models/tourModel');

const APIFeatures = require('../utils/apiFeatures');


exports.aliasTopTours = (req,res,next) => {
    req.query.limit = '5';
    req.query.sort='-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();

}

// reading data from tours-simple file
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


// ROUTE HANDLERS (Handlers are also called controllers)

// exports.checkID = (req,res,next,val) => {
//     console.log(`Tour id is ${val}`); // this val will hold the value of id parameter
//     if(req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status:'fail',
//             message:'Invalid ID'
//         });
//     }
//     next();
// }

// exports.checkRequestBody = (req,res,next) => {
//     if(!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status:'Bad Request',
//             message:'Request does not have name and price'
//         });
//     }
//     next();
    
// }

exports.getAllTours = async (req,res) => {

    try {

        // implementation of all features before putting it into APIFeatures class
        // // Build Query 
        // // 1A) Filtering
        // const queryObj = {...req.query};
        // const excludedFields = ['page','sort','limit','fields'];
        // excludedFields.forEach(el => delete queryObj[el]);

        // // 1B) Advanced Filtering 
        // let queryStr = JSON.stringify(queryObj);
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // // {difficulty:'easy', duration: {$gte:5}};
        // // { duration: { gte: '5' }, difficulty: 'easy' } received from postman while sending with gte operator
        // // gte,gt,lte,lt
        // // console.log(req.query); // will have all the query parameters in an object 
        
        // // 1st way of filtering data
        // let query = Tour.find(JSON.parse(queryStr));


        //2) Sorting
        // if(req.query.sort) { // if we are sorting it in ascending then in postman sort=price or any other field.
        //     // if we want to sort in descending then in postman sort=-price and mongoose will automatically detect it for us.
            
        //     const sortBy = req.query.sort.split(',').join(' ');
        //     query = query.sort(sortBy);
        //     // Now it is possible that results sorted on bases on price can have same price , then we can provide another criteria for search
        //     // sort('price ratingsAverage');
        // } else {
        //     query = query.sort('-createdAt'); // if user doesn't specify any criteria ,then sorting on basis of createdAt Date
        //     // putting (- minus sign in front of createdAt) to let mongoose know that we want result in descending order.
        // }

        // 3) Field Limiting
        // if(req.query.fields) {
        //     const fields = req.query.fields.split(',').join(' ');
        //     query = query.select(fields); // this process of selecting few fields is called 'Projection';
        // } else {
        //     query = query.select('-__v'); // Mongoose uses this __v internally and it is not a good practice to exclude these
        //     // here (- Minus sign means we want to exclude this fields and does not want to send it to client).
        // }

        // 4) Pagination

        // const page = req.query.page * 1 || 1;
        // const limit = req.query.limit * 1 || 100;
        // const skip = (page - 1) * limit; 

        // //page=2&limit=10 , (1-10, page 1) (11-20, page 2) ans so on so forth
        // query = query.skip(skip).limit(limit);

        // if(req.query.page) {
        //     const numTours = await Tour.countDocuments(); // Method to find the count of documents and returns a promise
        //     if(skip >= numTours) {
        //         throw new Error('This Page does not exist');
        //     }
        // }

        // 2nd way of filtering data using special methods of mongoose
        // const query =  Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
    
        // Execute Query

        const features = new APIFeatures(Tour.find(),req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
        const tours = await features.query;
        // query.sort().select().skip().limit() (structure of query is like this now after multiple chainings)
        
        
        // Send Response
        res.status(200).json({
        status:'success',
        requestedAt:req.requestTime,
        results: tours.length, // sending in case of array 
        data: {
            // tours:tours
            tours // ES6 way (if key and value is same name, then we can omit it and use single)
        }
    });  // using the JSEND reformatting to send json response

    } catch(err) {
        res.status(404).json({
            status:'fail',
            message:err
        });
    }


    
}

exports.getTour = async (req,res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        // similar to search for a result in mongodb like 
        // Tour.findOne({_id:req.params.id})


        res.status(200).json({
            status:'success',
            data: {
                tour
            }
        });

    } catch(err) {
        res.status(404).json({
            status:'fail',
            message:err
        });
    }


    // old implementation with static data from file
    // const id = req.params.id * 1; // trick to convert a string which is kind of number like '5' or '7'
    // const tour = tours.find(element => element.id === id);

    // res.status(200).json({
    //     status:'success',
    //     data: {
    //         tour
    //     }
    // });
}

exports.createTour = async (req,res) => {

    // old and bit complex way of creating document
    // const newTour = new Tour({});
    // newTour.save();
    try {
        const newTour = await Tour.create(req.body); // returns a promise

    res.status(201).json({
        status:'success',
        data: {
            tour:newTour 
        }
    });
} catch(err) {
        res.status(400).json({
            status:'fail',
            message:err
        });
    }




    // Old implementation when we are storing data into local file 
    // console.log('Request body', req.body);

    // const newId = tours[tours.length - 1].id + 1;
    // console.log(newId);
    // const newTour = Object.assign({id:newId}, req.body);
    // tours.push(newTour);
    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours), err => {
    //     res.status(201).json({
    //         status:'success',
    //         data: {
    //             tour:newTour
    //         }
    //     });
    // });
    // res.send('Done');
}

exports.updateTour = async (req,res) => {

    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({
            status:'success',
            data: {
                tour
            }
        });

    } catch(err) {
        res.status(404).json({
            status:'fail',
            message:err
        });
    }

   
}

exports.deleteTour = async (req,res) => {

    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status:'success',
            data:null
        });

    } catch(err) {
        res.status(404).json({
            status:'fail',
            message:err
        });
    }  
}


exports.getTourStats = async (req,res) => {
    try {
        // So basically here we are configuring our aggregation pipeline and this aggregation pipeline will have stages.
        // so here we pass array of pipeline stages and each stage will run after previous stage is done executing 
        // we can also repeat the stages like done below.(running a match stage again to exclude EASY tour from documents)
        const stats = await Tour.aggregate([
            {
                $match: {ratingsAverage: { $gte:4.5 } }
            },
            {
                $group: {
                    // _id:'$ratingsAverage',
                   _id:{$toUpper:'$difficulty'}, // _id to groupBY the data
                    numTours:{$sum: 1}, // here we setting sum equal to 1, as for each document 1 will be added to the previous sum and we'll get number of tours 
                    numRatings:{$sum:'$ratingsQuantity'},
                    avgRating:{$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice:{$min:'$price'},
                    maxPrice:{$max:'$price'}
                }
            },
            {
                $sort: {
                avgPrice:1  // here 1 means ascending and we used avgPrice because the documents which we'll retrun are formed with these upper fields not with the one in Model, so sorting the data based on these fields only
            }
        },
        // {
        //     $match: {_id: {$ne:'EASY'}}
        // }
        ]);

        res.status(200).json({
            status:'success',
            data:{
                stats
            }
        });

    } catch(err) {
        res.status(404).json({
            status:'fail',
            message:err
        });
    }
}

exports.getMonthlyPlan = async (req,res) => {
    try {
        const year = req.params.year * 1;// 2022
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates' // kind of help in destructring the data in array and returns document again for each element in the array   
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte:new Date (`${year}-12-31`)
                    }
                }
            },
            {
                $group : {
                    _id: {$month: '$startDates'},
                    numToursStarts: {$sum : 1},
                    tours: {$push : '$name'}
                }
            },
            {
                $addFields: {month : '$_id'}
            },
            {
                $project: {
                    _id:0 // zero here means we don't want to send it to the client for end result
                }
            },
            {
                $sort: {numToursStarts : -1} // -1 for descending 
            },
            {
                $limit: 12
            }
        ]);

        res.status(200).json({
            status:'success',
            data:{
                plan
            }
        });

    } catch(err) {
        res.status(404).json({
            status:'fail',
            message:err
        });
    }
}