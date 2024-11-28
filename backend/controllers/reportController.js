const { validationResult } = require('express-validator');
const User = require('../models/UserModel');
const HttpError = require('../models/http-error');
const Post = require('../models/PostModel');
const Comment = require('../models/CommentModel');
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
      const users = await User.aggregate([
          {
              $lookup: {
                  from: 'reportusers',
                  localField: '_id',
                  foreignField: 'userId',
                  as: 'reports',
              },
          },
          {
              $addFields: {
                  isReport: { $gt: [{ $size: '$reports' }, 0] }, 
                  latestReportDate: {
                      $max: '$reports.createdAt', 
                  },
              },
          },
          {
              $addFields: {
                  sortField: {
                      $cond: {
                          if: '$isReport',
                          then: { $ifNull: ['$latestReportDate', '$createdAt'] },
                          else: '$createdAt',
                      },
                  },
              },
          },
          {
              $sort: {
                  isReport: -1, 
                  sortField: -1, 
              },
          },
          {
              $project: {
                  fullname: 1,
                  username: 1,
                  email: 1,
                  banned: 1,
                  isActive: 1,
                  isAdmin: 1,
                  createdAt: {
                      $dateToString: {
                          format: '%d/%m/%Y',
                          date: '$createdAt',
                      },
                  },
                  bornDay: {
                      $dateToString: {
                          format: '%d/%m/%Y',
                          date: '$bornDay',
                      },
                  },
                  reports: {
                      $map: {
                          input: '$reports',
                          as: 'report',
                          in: {
                              senderId: '$$report.senderId',
                              reason: '$$report.reason',
                              createdAt: {
                                  $dateToString: {
                                      format: '%d/%m/%Y', 
                                      date: '$$report.createdAt',
                                  },
                              },
                          },
                      },
                  },
                  isReport: 1,
              },
          },
      ]);

      res.status(200).json({
          success: true,
          data: users,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          success: false,
          message: 'Lỗi khi lấy danh sách user',
          error: error.message,
      });
  }
};
const ListPostReport = async (req, res) => {
    try {
      const posts = await Post.find()
        .populate('author', 'username fullname email avatar bio')
        .populate('comments')
        .populate('likes', 'username email')
        .lean();
  
      const reports = await ReportPost.find()
        .populate('senderId', 'username fullname email avatar bio')
        .populate('postId', '_id')
        .lean();
  
      const reportMap = {};
  
      reports.forEach((report) => {
        if (!reportMap[report.postId._id]) {
          reportMap[report.postId._id] = [];
        }
        reportMap[report.postId._id].push(report);
      });
  
      const postsWithReports = posts
        .map((post) => {
          const postReports = reportMap[post._id] || [];
          const latestReportTime = postReports.length
            ? Math.max(...postReports.map((r) => new Date(r.createdAt).getTime()))
            : null;
  
          return {
            ...post,
            reports: postReports.map((report) => ({
              ...report,
              id: report._id,  
              status: report.status, 
            })),
            reportCount: postReports.length,
            latestReportTime,
          };
        })
        .sort((a, b) => {
          if (b.latestReportTime && a.latestReportTime) {
            return b.latestReportTime - a.latestReportTime;
          }
          if (!a.latestReportTime) return 1;
          if (!b.latestReportTime) return -1;
          return 0;
        });
  
      res.status(200).json(postsWithReports);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách bài viết.' });
    }
};
  

const deleteReportUser = async (req, res) => {
  const { userId } = req.params;
  try {
      const reports = await ReportUser.find({ userId });

      if (reports.length === 0) {
          return res.status(404).json({ message: 'No reports found for this user' });
      }
      await ReportUser.deleteMany({ userId });

      return res.status(200).json({ message: 'All reports for the user have been deleted successfully' });
  } catch (error) {
      console.error('Error deleting reports:', error);
      return res.status(500).json({ message: 'An error occurred while deleting the reports' });
  }
};

  
exports.getRepliesByCommentId = getRepliesByCommentId;
exports.createReportPost = createReportPost;
exports.createReportUser = createReportUser;
exports.createReportComment = createReportComment;
exports.ListReport = ListReport;
exports.ListPostReport = ListPostReport;
exports.deleteReportUser=deleteReportUser;
