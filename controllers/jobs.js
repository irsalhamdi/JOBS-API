const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors');
const mongoose = require('mongoose');
const moment = require('moment');

module.exports = {
    getAllJobs: async(req, res) => {
        const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt');
        res.status(StatusCodes.OK).json({jobs, count: jobs.length});
    },
    getJob: async(req, res) => {
        const job = await Job.findOne({createdBy: req.user.userId, _id:req.params.id});

        if(!job){
            throw new NotFoundError(`No job with id ${req.params.id}`);
        }

        res.status(StatusCodes.OK).json({job});
    },
    createJob: async(req, res) => {
        req.body.createdBy = req.user.userId;
        const job = await Job.create(req.body);

        res.status(StatusCodes.CREATED).json({job});
    },
    updateJob: async(req, res) => {
        const {company, position} = req.body;

        if(company === '' || position === ''){
            throw new BadRequestError(`Company or position fields can't be empty`);
        }

        const id = await Job.findOne({_id: req.params.id});

        if(!id){
            throw new NotFoundError(`job with id ${id} not found`);
        }

        const job = await Job.findOneAndUpdate({_id:id, createdBy: req.user.userId}, req.body, {new: true, runValidators: true});

        res.status(StatusCodes.OK).json({job});

    },
    deleteJob: async(req, res) => {
        const job = await Job.findOne({_id:req.params.id, createdBy:req.user.userId}); 
        
        if(!job){
            throw new NotFoundError(`No job with id ${req.params.id}`);
        }

        await Job.deleteOne({_id: job.id});
        res.status(StatusCodes.OK).send();
    },
    showStats: async(req, res) => {
        let stats = await Job.aggregate([
            {$match: {createdBy: mongoose.Types.ObjectId(req.user.userId)}},
            {$group:{_id: '$status', count: {$sum:1}}}
        ]);

        stats = stats.reduce((acc, curr) => {
            const {_id: title, count} = curr;
            acc[title] = count;
            return acc;
        }, {});

        const defaultStats = {
            pending: stats.pending || 0,
            interview: stats.interview || 0,
            decline: stats.decline || 0,
        };

        let monthlyApplications = await Job.aggregate([
            {$match: {createdBy: mongoose.Types.ObjectId(req.user.userId)}},
            {$group: {
                _id: {year: {$year: '$createdAt'}, month: {$month: '$createdAt'}},
                count: { $sum: 1}
            }},
            {$sort: {'_id.year': -1, '_id.month': -1}},
            {$limit: 6}
        ]);

        monthlyApplications = monthlyApplications.map((item) => {
            const {_id:{year, month}, count} = item;
            const date = moment().month(month - 1).year(year).format('MMM Y');
            return {date, count};
        });

        res.status(StatusCodes.OK).json({defaultStats, monthlyApplications});
    }
}