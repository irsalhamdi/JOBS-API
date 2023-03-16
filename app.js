const express = require('express');
const app = express();
require('express-async-errors');
require('dotenv').config();
const path = require('path');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const authenticateUser = require('./middleware/authentication');

const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

app.set('trust proxy', 1);
app.use(express.static(path.resolve(__dirname, './client/build')));
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT
app.listen(port, console.log(`server is listening on port ${port}`));