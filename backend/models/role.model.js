import { Schema, model } from 'mongoose'

/* Schema for document user for collection "users" */
export const RoleSchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: 'Reader',
        minLength: 4,
        maxLength: 16,
        unique: 'Role name already exists'
    },
    color: {
        type: String,
        enum: ['success', 'light', 'dark', 'primary', 'warning', 'danger', 'info', 'secondary'],
        default: 'primary'
    },
    description: {
        type: String,
        trim: true,
        required: 'Role description is required'
    }
})


RoleSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

/* Export Schema to Model User */
export default model('Role', RoleSchema)