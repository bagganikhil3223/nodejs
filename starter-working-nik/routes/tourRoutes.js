const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// router.param('id',tourController.checkID); //special middleware (param middleware which gets executed when we have certain param in the request)

router.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/')
.get(tourController.getAllTours).
post(tourController.createTour)

// .post(tourController.checkRequestBody,tourController.createTour); // chaining multiple middleware


router.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(tourController.deleteTour);

module.exports = router;