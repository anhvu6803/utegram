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
      const reports = await ReportUser.find({})
        .populate('userId', 'username fullname email avatar') 
        .select('reason'); 
  
      if (reports.length === 0) {
        return res.status(404).json({ message: 'No reports found.' });
      }
      return res.status(200).json(reports);
    } catch (err) {
      console.error('Error fetching reports:', err);
      return res.status(500).json({ message: 'An error occurred while fetching reports.' });
    }
  };
exports.getRepliesByCommentId = getRepliesByCommentId;
exports.createReportPost = createReportPost;
exports.createReportUser = createReportUser;
exports.createReportComment = createReportComment;
exports.ListReport = ListReport;

