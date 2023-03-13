const router = require('express').Router();
const jobsController = require('../controllers/jobs');

router.route('/').get(jobsController.getAllJobs).post(jobsController.createJob);
router.route('/:id').get(jobsController.getJob).patch(jobsController.updateJob).delete(jobsController.deleteJob);

module.exports = router;