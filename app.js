const express = require('express');
const app = express();
require('express-async-errors');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const authenticateUser = require('./middleware/authentication');

const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

app.set('trust proxy', 1);
app.use(rateLimiter({windowMs: 15 * 60 * 1000, max: 100}));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


app.get('/', (req, res) => {
    res.send(`jobs API`);
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT
app.listen(port, console.log(`server is listening on port ${port}`));