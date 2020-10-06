import mongoose, { Schema, model } from 'mongoose'

/* Schema for document user for collection "comments" */
const CommentSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: 'Comment name is required',
        minLength: 3,
        maxLength: 32,
        unique: 'Comment already exists'
    },
    content: {
        type: String,
        trim: true,
        required: "Description is required"
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        unique: false
    },
    article_id: {
        type: mongoose.Schema.Types.ObjectId,
        unique: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        unique: false
    }
}, { collection: 'comments' } )

CommentSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

/* Export Schema to Model User */
export default model('Comment', CommentSchema)
