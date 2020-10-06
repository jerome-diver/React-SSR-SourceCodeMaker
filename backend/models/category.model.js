
import mongoose, { Schema, model } from 'mongoose'

/* Schema for document user for collection "categories" */
const CategorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Category name is required',
        minLength: 3,
        maxLength: 32,
        unique: 'Category already exists'
    },
    description: {
        type: String,
        trim: true,
        required: "Description is required"
    },
    parent_id: {
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
}, { collection: 'categories' } )

CategorySchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

/* Export Schema to Model User */
export default model('Role', CategorySchema)