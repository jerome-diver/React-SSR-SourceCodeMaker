import mongoose, { Schema, model } from 'mongoose'

/* Schema for document user for collection "articles" */
const ArticleSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: 'Article name is required',
        minLength: 3,
        maxLength: 64,
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
    container_id: {
        type: mongoose.Schema.Types.ObjectId,
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
        type: Date    },
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
