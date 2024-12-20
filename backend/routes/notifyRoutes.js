const express = require('express');

const notifyController = require('../controllers/notifyController');

const router = express.Router();

router.get('/:oid', notifyController.getNotifyByOwnerId);
router.post('/', notifyController.createNotify);
router.patch('/:nid', notifyController.updateNotify);
router.delete('/post/:pid', notifyController.deleteNotifyByPostId);

module.exports = router;