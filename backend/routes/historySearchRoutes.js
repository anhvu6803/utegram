const express = require('express');

const historySearchControllers = require('../controllers/historySearchController');

const router = express.Router();

router.get('/:oid', historySearchControllers.getHistorySearchByOwnerId);
router.post('/', historySearchControllers.createHistorySearch);

module.exports = router;