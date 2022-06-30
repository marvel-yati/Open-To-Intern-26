const express = require('express');

const router = express.Router();
const collegeController = require("../controllers/collegeController")
const internController = require("../controllers/internController")


// first api for college creation.

router.post('/colleges', collegeController.createCollege);

// second api for intern creation.

router.post('/interns', internController.internCreate);

// third api for get all interns data for each college.

router.get('/collegeDetails', collegeController.getAllIntern);

module.exports = router;
