const express = require('express');
const { userRouter } = require('./routes/userRoutes');
const app = express();

app.use('/user', userRouter);



app.listen(3000);