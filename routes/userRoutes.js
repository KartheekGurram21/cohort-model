const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userMiddleware } = require('../middlewares/userMiddleware');
const { userModel, purchaseModel } = require('../db');

const userRouter = Router();

userRouter.post('/signup', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.create({
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

userRouter.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({
        email: email
    });
    if(!user) {
        return res.status(404).json({
            message: "No user found with that email"
        });
    }
    const matchedPassword = await bcrypt.compare(password, user.password);
    if(!matchedPassword) {
        return res.status(403).json({
            message: "Invalid credentials"
        });
    }
    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET);
    res.json({
        token: token
    });
});

userRouter.get('/purchases', userMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const purchasedCourses = await purchaseModel.find({
            userId: userId
        }); 
        res.json({
            purchasedCourses
        });
    } catch(err) {
        console.log(err);
    }
});


module.exports = {
    userRouter: userRouter
};