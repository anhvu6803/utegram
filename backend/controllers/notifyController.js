const Notify = require('../models/NotifyModel');
const HttpError = require('../models/http-error');

const getNotifyByOwnerId = async (req, res, next) => {
    const ownerId = req.params.oid;

    // let places;
    let notifyWithOwner;
    try {
        notifyWithOwner = await Notify.find({ owner: ownerId })
            .sort({ createdAt: -1 }) // Sắp xếp theo createdAt giảm dần
            .limit(5)
            .populate({
                path: 'owner',
                select: 'followings'
            })
            .populate({
                path: 'userId', // Liên kết với userId
                select: '_id avatar username', // Chỉ lấy các trường cần thiết
            })
            .populate({
                path: 'postId', // Liên kết với postId nếu có
                select: '_id url type', // Chỉ lấy các trường cần thiết
            });

    } catch (err) {
        const error = new HttpError(
            'Fetching notifies failed, please try again later.',
            500
        );
        return next(error);
    }

    // if (!places || places.length === 0) {
    if (!notifyWithOwner || notifyWithOwner.length === 0) {
        return next(
            new HttpError('Could not find notifies for the provided user id.', 404)
        );
    }

    res.json({ notify: notifyWithOwner.map(notify => notify.toObject({ getters: true })) });
}

const createNotify = async (req, res, next) => {
    const { type, content, owner, userId, postId } = req.body;

    const createdNotify = new Notify({
        type,
        content,
        owner,
        userId,
        postId
    });
    try {
        let existingRecord;
        if (type === 'user') {
            existingRecord = await Notify.findOne({ userId });
        }

        if (!existingRecord) {
            await createdNotify.save();
            res.status(201).json({ message: 'Notify created successfully' });
        } else {
            res.status(400).json({ message: 'Notify already exists with the same userId' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to create Notify', error: error.message });
    }
};

const updateNotify = async (req, res, next) => {
    const { isViewed } = req.body;
    const notifyId = req.params.nid;

    let notify;
    try {
        notify = await Notify.findById(notifyId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update notify.',
            500
        );
        return next(error);
    }
    notify.isViewed = isViewed;

    try {
        await notify.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update notify.',
            500
        );
        return next(error);
    }

    res.status(200).json({ notify: notify.toObject({ getters: true }) });
};

const deleteNotifyByPostId = async (req, res, next) => {
    const postId = req.params.pid;

    // let places;
    let notifyWithPost;
    try {
        notifyWithPost = await Notify.find({ postId });

        // if (!places || places.length === 0) {
        if (!notifyWithPost || notifyWithPost.length === 0) {
            return next(
                new HttpError('Could not find notifies for the provided post id.', 404)
            );
        }

        await Notify.deleteMany({ postId })

    } catch (err) {
        const error = new HttpError(
            'Fetching notifies failed, please try again later.',
            500
        );
        return next(error);
    }

    res.json({ message: 'Deleted all notifies for the given post id.' });
}

exports.getNotifyByOwnerId = getNotifyByOwnerId;
exports.createNotify = createNotify;
exports.updateNotify = updateNotify;
exports.deleteNotifyByPostId = deleteNotifyByPostId;


