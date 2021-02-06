import mongoose, { Schema, model } from 'mongoose'

/* Schema for document user for collection "subjects" */
const ContainerSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: 'Container title is required',
        minLength: 3,
        maxLength: 32,
        unique: 'Container already exists'
    },
    content: {
        type: String,
        trim: true,
        required: "content is required"
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        unique: false
    },
    type_id: {
        type: mongoose.Schema.Types.ObjectId,
        unique: false
    },
    author_id: {  // a user
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
        type: Date    }
}, { collection: 'containers' } )

ContainerSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

/* Export Schema to Model User */
export default model('Container', ContainerSchema)
