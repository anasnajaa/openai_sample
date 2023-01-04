const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        prompt: { type: String },
        pictures: [
            {
                url: { type: String }
            }
        ],
        answers: [
            {
                text: { type: String },
                correct: { type: Boolean },
            }
        ]
    },
    {
        collection: 'picture',
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
    }
);

exports.picModel = mongoose.model('picture', schema);