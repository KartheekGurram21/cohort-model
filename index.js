const express = require('express');
const { userRouter } = require('./routes/userRoutes');
const { courseRouter } = require('./routes/courseRoutes');
const { adminRouter } = require('./routes/adminRoutes');
const app = express();

app.use('/api/user', userRouter);
app.use('/api/course', courseRouter);
app.use('/api/admin', adminRouter);


app.listen(3000);