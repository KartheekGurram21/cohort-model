const { Router } = require('express');
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { userMiddleware } = require('../middlewares/userMiddleware');
const { purchaseModel, courseModel } = require('../db');
const courseRouter = Router();

courseRouter.post('/purchase', userMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const courseId = req.body.courseId;
        await purchaseModel.create({
            userId: userId,
            courseId: courseId
        });
        res.json({
            message: "course purchased successfully"
        });
    } catch(err) {
        console.log(err);
    }
});

courseRouter.get('/preview', async (req, res) => {
    try {
        const courses = await courseModel.find();
        res.json({
            courses: courses
        });
    } catch(err) {
        console.log(err);
    }
});


module.exports = {
    courseRouter: courseRouter
};