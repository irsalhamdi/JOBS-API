const router = require('express').Router();
const jobsController = require('../controllers/jobs');
const testUser = require('../middleware/testUser');

router.route('/').get(jobsController.getAllJobs).post(testUser, jobsController.createJob);
router.route('/:id').get(jobsController.getJob).patch(testUser, jobsController.updateJob).delete(testUser, jobsController.deleteJob);
router.route('/stats').get(jobsController.showStats);

module.exports = router;