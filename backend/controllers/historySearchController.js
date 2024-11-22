const HistorySearch = require('../models/HistorySearchModel');
const HttpError = require('../models/http-error');

const getHistorySearchByOwnerId = async (req, res, next) => {
    const ownerId = req.params.oid;

    // let places;
    let historysWithOwner;
    try {
        historysWithOwner = await HistorySearch.find({ owner: ownerId }) // Filter by ownerId
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .limit(5) // Limit the results to 5
            .populate({
                path: 'userId',
                select: 'username fullname avatar'
            });
    } catch (err) {
        const error = new HttpError(
            'Fetching historys failed, please try again later.',
            500
        );
        return next(error);
    }

    // if (!places || places.length === 0) {
    if (!historysWithOwner || historysWithOwner.length === 0) {
        return next(
            new HttpError('Could not find history for the provided user id.', 404)
        );
    }

    res.json({ history: historysWithOwner.map(history => history.toObject({ getters: true })) });
}

const createHistorySearch = async (req, res, next) => {
    const { type, owner, userId, tag } = req.body;

    const createdHistorySearch = new HistorySearch({
        type,
        owner,
        userId,
        tag
    });

    try {
        let existingRecord;
        if (type === 'user') {
            existingRecord = await HistorySearch.findOne({ userId });
        }
        else {
            existingRecord = await HistorySearch.findOne({ tag });
        }

        if (!existingRecord) {
            // Chỉ lưu khi không có bản ghi nào tồn tại
            await createdHistorySearch.save();
            res.status(201).json({ message: 'History search created successfully' });
        } else {
            res.status(400).json({ message: 'History search already exists with the same userId or tag' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to create history search', error: error.message });
    }
};

const deleteHistorySearch = async (req, res, next) => {
    const historyId = req.params.hid;
    try {
        await HistorySearch.findByIdAndDelete(historyId);
        res.status(201).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting history search', error: error.message });
        console.error('Error deleting History Search');
    }
};

exports.getHistorySearchByOwnerId = getHistorySearchByOwnerId;
exports.createHistorySearch = createHistorySearch;
exports.deleteHistorySearch = deleteHistorySearch;


