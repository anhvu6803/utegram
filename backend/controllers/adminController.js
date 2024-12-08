const User = require('../models/UserModel');
const Post = require('../models/PostModel');
const ReportPost = require('../models/ReportPostModel');
const ReportComment = require('../models/ReportCommentModel');
const Notify = require('../models/NotifyModel');
const Comment = require('../models/CommentModel');
const banUser = async (req, res) => {
  const { userId } = req.params; 
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.banned) {
      return res.status(400).json({ message: "User is already banned" });
    }

    user.banned = true;
    await user.save();

    res.status(200).json({ message: "User has been banned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const updatePostByAdmin = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ error: 'ID bài viết không được để trống.' });
    }
    const updatedData = {
      url: ['https://res.cloudinary.com/dbmynlh3f/image/upload/v1732775146/himgbbiyusj4i6rneshk.png'], 
      caption: 'Bài viết bị chặn bởi Quản trị viên', 
      type: 'image' 
    };

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      updatedData, 
      { new: true } 
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Không tìm thấy bài viết với ID đã cung cấp.' });
    }

    res.status(200).json({
      message: 'Bài viết đã được cập nhật thành công.',
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật bài viết.' });
  }
};
const resolve =  async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const reports = await ReportPost.find({ postId: postId });
    if (reports.length > 0) {
      await ReportPost.updateMany(
        { postId: postId },
        { $set: { status: 'resolved' } }
      );
    }

    post.status = 'resolved';
    await post.save();

    const reportIds = reports.map((report) => report._id); 
    res.status(200).json({
      message: 'Post resolved successfully',
      postId: post._id,
      reportIds,
    });
  } catch (err) {
    console.error('Error resolving post:', err);
    res.status(500).json({ message: 'Failed to resolve post' });
  }
};
const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    await ReportComment.deleteMany({ commentId });

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Bình luận không tồn tại.' });
    }

    await Notify.deleteMany({ postId: comment.post, type: 'post' });
    await Notify.deleteMany({ owner: comment.owner });

    await Post.updateOne(
      { _id: comment.post },
      { $pull: { comments: commentId } }
    );

    if (comment.replies && comment.replies.length > 0) {
      await Comment.deleteMany({ _id: { $in: comment.replies } });
    }

    await Comment.findByIdAndDelete(commentId);

    await User.findByIdAndUpdate(comment.owner, {
      $inc: { deletedCommentsCount: 1 }
    });

    res.status(200).json({ message: 'Bình luận và các dữ liệu liên quan đã được xóa thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa bình luận:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa bình luận.' });
  }
};
const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Bài viết không tồn tại.' });
    }

    const comments = post.comments;
    if (comments && comments.length > 0) {
      await Promise.all(comments.map(async (commentId) => {
        await ReportComment.deleteMany({ commentId });

        const comment = await Comment.findById(commentId);
        if (comment && comment.replies && comment.replies.length > 0) {
          await Comment.deleteMany({ _id: { $in: comment.replies } });
        }

        await Comment.findByIdAndDelete(commentId);
      }));
    }

    await ReportPost.deleteMany({ postId });
    await Notify.deleteMany({ postId });

    await User.updateMany(
      { posts: postId },
      { $pull: { posts: postId } }
    );

    await User.updateMany(
      { bookmarks: postId },
      { $pull: { bookmarks: postId } }
    );

    await Post.findByIdAndDelete(postId);

    await User.findByIdAndUpdate(post.owner, {
      $inc: { deletedPostsCount: 1 }
    });

    res.status(200).json({ message: 'Bài viết và các dữ liệu liên quan đã được xóa thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa bài viết:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa bài viết.' });
  }
};
module.exports = { banUser, updatePostByAdmin, resolve, deleteComment, deletePost };