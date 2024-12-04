const readFile = require('../utils/writeFileHastag');
const HttpError = require('../models/http-error');

const getTags = async (req, res) => {

    let tags;
    try {
        tags = await readFile.readFileHastag();
    } catch (err) {
        const error = new HttpError(
            'Fetching tags failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({ tags: tags });
};

const updateTags = async (req, res) => {
    const { tags } = req.body;

    try {
        readFile.writeFileHastag(tags);
    } catch (err) {
        const error = new HttpError(
            'Add tags failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({ msg: 'Add tags complete' });
};

module.exports = { getTags, updateTags };