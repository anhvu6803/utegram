const { validationResult } = require('express-validator');

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

exports.getRepliesByCommentId = getRepliesByCommentId;
exports.createReportPost = createReportPost;
exports.createReportUser = createReportUser;
exports.createReportComment = createReportComment;

