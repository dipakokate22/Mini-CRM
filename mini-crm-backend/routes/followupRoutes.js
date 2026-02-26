const express = require('express');
const { createFollowup, getFollowupsByLead } = require('../controllers/followupController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createFollowup);
router.get('/:leadId', getFollowupsByLead);

module.exports = router;
