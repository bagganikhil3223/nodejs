class APIFeatures {
    constructor(query,queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // Build Query 
        // 1A) Filtering
        const queryObj = {...this.queryString};
        const excludedFields = ['page','sort','limit','fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 1B) Advanced Filtering 
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // {difficulty:'easy', duration: {$gte:5}};
        // { duration: { gte: '5' }, difficulty: 'easy' } received from postman while sending with gte operator
        // gte,gt,lte,lt
        // console.log(req.query); // will have all the query parameters in an object 
        this.query = this.query.find(JSON.parse(queryStr));
        return this;// we are returning it because it has access to all the method and objects and helps in chaining of methods.
    }

    sort() {
        if(this.queryString.sort) { // if we are sorting it in ascending then in postman sort=price or any other field.
            // if we want to sort in descending then in postman sort=-price and mongoose will automatically detect it for us.
            
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
            // Now it is possible that results sorted on bases on price can have same price , then we can provide another criteria for search
            // sort('price ratingsAverage');
        } else {
            this.query = this.query.sort('-createdAt'); // if user doesn't specify any criteria ,then sorting on basis of createdAt Date
            // putting (- minus sign in front of createdAt) to let mongoose know that we want result in descending order.
        }
        return this;
    }

    limitFields() {
        if(this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields); // this process of selecting few fields is called 'Projection';
        } else {
            this.query = this.query.select('-__v'); // Mongoose uses this __v internally and it is not a good practice to exclude these
            // here (- Minus sign means we want to exclude this fields and does not want to send it to client).
        }
        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit; 

        //page=2&limit=10 , (1-10, page 1) (11-20, page 2) ans so on so forth
        this.query = this.query.skip(skip).limit(limit);

        // if(this.queryString.page) {
        //     const numTours = await Tour.countDocuments(); // Method to find the count of documents and returns a promise
        //     if(skip >= numTours) {
        //         throw new Error('This Page does not exist');
        //     }
        // }
        return this;
    }
}

module.exports = APIFeatures;