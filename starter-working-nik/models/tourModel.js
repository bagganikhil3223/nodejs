
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A tour must have a name'],
        unique:true,
        trim:true
    },
    duration: {
    type:Number,
    required:[true,'A tour must have a duration']
    },
    maxGroupSize: {
        type:Number,
        required:[true,'A tour must have a group size']
    },
    difficulty: {
        type:String,
        required:[true,'A tour must have a difficulty']
    },
    ratingsAverage: {
        type:Number,
        default:4.5 // setting the default value in case we don't provide rating value
    },
    ratingsQuantity: {
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,'A tour must have a price'] // here in required array (1st argument is for requireness and 2nd is for error if this field is not provided) 
    },
    priceDiscount: Number,
    summary:{
        type:String,
        trim:true, // only works for strings and will remove whitespaces from beginning and end.
        required:[true,'A tour must have a description']
    },
    description: {
        type:String,
        trim:true
    },
    imageCover: {
        type:String,
        required:[true,'A tour must have a cover image']
    },
    images:[String],
    createdAt: {
        type:Date,
        default:Date.now(),
        select:false // now if we don't want to expose some confidential details to the client, we set the select property to false on them
    },
    startDates:[Date]

});

const Tour = mongoose.model('Tour',tourSchema);

module.exports = Tour;


// For Testing purpose

// const testTour = new Tour({
//     name:"The Park Camper",
//     price:997
// });

// testTour.save().then(doc => {
//     console.log("Saved Data", doc);
// }).catch(err => {
//     console.log("ERROR ---> ", err);
// })