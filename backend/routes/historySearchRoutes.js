const express = require('express');

const historySearchControllers = require('../controllers/historySearchController');

const router = express.Router();

router.get('/:oid', historySearchControllers.getHistorySearchByOwnerId);
router.post('/', historySearchControllers.createHistorySearch);
router.delete('/:hid', historySearchControllers.deleteHistorySearch);

module.exports = router;