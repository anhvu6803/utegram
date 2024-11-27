const mongoose = require('mongoose');
const notifySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['user', 'post'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: function () { return this.type === 'post'; }
    },
    isViewed: {
        type: Boolean,
        required: true,
        default: false,
    }
}, { timestamps: true });

const Notify = mongoose.model('Notify', notifySchema);
module.exports = Notify;
