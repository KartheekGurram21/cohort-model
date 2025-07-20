const express = require('express');
const mongoose = require('mongoose');
const { userRouter } = require('./routes/userRoutes');
const { courseRouter } = require('./routes/courseRoutes');
const { adminRouter } = require('./routes/adminRoutes');
require('dotenv').config();

const app = express();
mongoose.connect(process.env.MONGO_URI).then(() => console.log('connected to db')).catch(err => console.log(err));

app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/course', courseRouter);
app.use('/api/admin/course', adminRouter);


app.listen(3000); 