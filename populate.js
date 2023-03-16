require('dotenv').config();
const mockData = require('./mock_data.json');
const Job = require('./models/Job');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const start = async() => {
    try {
        await Job.create(mockData);
        console.log(`Successfull created the data !`);
        process.exit(0);
    } catch (error) {
        console.log(`error !`);
        process.exit(1);
    }
}

start();