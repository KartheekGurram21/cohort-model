const { Router } = require('express');
const { adminModel, courseModel } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const adminRouter = Router();

adminRouter.post('/signup', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await adminModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        });
        res.json({
            message: "sign up succeeded"
        });
    } catch(err) {
        console.log(err);
    }
});

adminRouter.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({
        email: email
    });
    if(!admin) {
        return res.status(404).json({
            message: "No user found with that email"
        });
    }
    const matchedPassword = await bcrypt.compare(password, admin.password);
    if(!matchedPassword) {
        return res.status(403).json({
            message: "Invalid credentials"
        });
    }
    const token = jwt.sign({
        id: admin._id
    }, process.env.JWT_ADMIN_SECRET);
    res.json({
        token: token
    });
});


adminRouter.post('/courses', adminMiddleware, async (req, res) => {
    const adminId = req.adminId;
    const { title, description, imageUrl, price } = req.body;
    const course = await courseModel.create({
        title,
        description,
        price,
        imageUrl,
        creatorId: adminId
    });
    res.json({
        message: "course created",
        courseId : course._id
    });
});

adminRouter.put('/course', adminMiddleware, async (req, res) => {
    try {
        const adminId = req.adminId;
        const { courseId, title, description, price, imageUrl } = req.body;
        const course = await courseModel.updateOne({
            _id: courseId,
            creatorId: adminId
        }, {
            title: title, 
            description: description, 
            price: price, 
            imageUrl: imageUrl
        }, { new : true });
        res.json({
            message: "course is updated"
        });
    } catch(err) {
        console.log(err);
    }
});

adminRouter.get('/course/bulk', adminMiddleware, async (req, res) => {
    try {
        const adminId = req.adminId;
        const courses = await courseModel.find({ creatorId: adminId});
        res.json({
            courses: courses
        });
    } catch(err) {
        console.log(err);
    }
});

module.exports = {
    adminRouter: adminRouter
};