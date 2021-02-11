
import mongoose, { Schema, model } from 'mongoose'

/* Schema for document user for collection "types"
    A Type describe a container 
    by types rules relations between them.
    The name of the type should indicate 
    the rules to apply by deduction
*/
const TypeSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Type name is required',
        minLength: 3,
        maxLength: 32,
        unique: 'Type already exists'
    },
    description: {
        type: String,
        trim: true,
        required: "Description is required"
    },
    rules: {
        type: String,
        trim: true,
        required: 'Type rules is/are required',
        minLength: 3,
        maxLength: 32,
    },
    enable: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
}, { collection: 'types' } )

TypeSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

/* Export Schema to Model User */
export default model('Type', TypeSchema)