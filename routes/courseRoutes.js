const { Router } = require('express');
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { courseModel } = require('../db');
const courseRouter = Router();




module.exports = {
    courseRouter: courseRouter
};