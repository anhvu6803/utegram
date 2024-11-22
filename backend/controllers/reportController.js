const { validationResult } = require('express-validator');
const User = require('../models/UserModel');
const HttpError = require('../models/http-error');

const ReportPost = require('../models/ReportPostModel');
const ReportUser = require('../models/ReportUserModel');
const ReportComment = require('../models/ReportCommentModel');

const getRepliesByCommentId = async (req, res, next) => { }

const createReportPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { senderId, postId, reason } = req.body;

    const createdReportPost = new ReportPost({
        senderId,
        postId,
        reason
    });

    try {
        await createdReportPost.save();
        res.status(201).json({ message: 'Report post created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create report post', error: error.message });
    }
};
const createReportComment = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { senderId, commentId, reason } = req.body;

    const createdReportComment = new ReportComment({
        senderId,
        commentId,
        reason
    });

    try {
        await createdReportComment.save();
        res.status(201).json({ message: 'Report post created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create report post', error: error.message });
    }
};

const createReportUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { senderId, userId, reason } = req.body;

    const createdReportComment = new ReportUser({
        senderId,
        userId,
        reason
    });

    try {
        await createdReportComment.save();
        res.status(201).json({ message: 'Report comment created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create report comment', error: error.message });
    }
};
const ListReport = async (req, res) => {
    try {
      const reportedUserIds = await ReportUser.distinct('userId');
  
      if (!reportedUserIds || reportedUserIds.length === 0) {
        return res.status(404).json({ error: 'No users have been reported' });
      }
  
      const reportedUsers = await User.find({ '_id': { $in: reportedUserIds } });
  
      if (!reportedUsers || reportedUsers.length === 0) {
        return res.status(404).json({ error: 'No users found with the reported userIds' });
      }
  
      res.status(200).json({ reportedUsers });
    } catch (error) {
      console.error('Error fetching reported users:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
exports.getRepliesByCommentId = getRepliesByCommentId;
exports.createReportPost = createReportPost;
exports.createReportUser = createReportUser;
exports.createReportComment = createReportComment;
exports.ListReport = ListReport;

