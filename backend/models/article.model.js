import { Schema, model } from 'mongoose'

/* Schema for document user for collection "articles" */
const ArticleSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: 'Article name is required',
        minLength: 3,
        maxLength: 32,
        unique: 'Article already exists'
    },
    description: {
        type: String,
        trim: true,
        required: "Description is required"
    },
    content: {
        type: String,
        trim: true,
        unique: false
    },
    enable: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
        default: Date.now
    },
}, { collection: 'articles' } )

ArticleSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

/* Export Schema to Model User */
export default model('Article', ArticleSchema)
