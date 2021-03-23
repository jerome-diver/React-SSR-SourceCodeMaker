import mongoose, { Schema, model } from 'mongoose'

/* Schema for rule for a type and a role 
    collection "rule_of_type_for_role".
    The Rule describe all the accesses abilities
    with a Type.id and for a Role.id concerned.
    So there is one target role 
    for rules concerned with some Type,
    through role_id and type_id fields.
    It is a many to many collection.
*/
const RuleOfTypeForRoleSchema = new Schema({
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Role is required',
        unique: false
    },
    type_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Type is required',
        unique: false
    },
    is_superuser: {
        type: Boolean,
        default: false
    },
    can_read: {
        type: Boolean,
        default: false
    },
    can_create: {
        type: Boolean,
        default: false
    },
    can_write: {
        type: Boolean,
        default: false
    },
    can_modify: {
        type: Boolean,
        default: false
    },
    can_delete: {
        type: Boolean,
        default: false
    },
}, { collection: 'rule_of_type_for_role' } )

RuleOfTypeForRoleSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

/* Export Schema to Model User */
export default model('RulesOfRole', RuleOfTypeForRoleSchema)