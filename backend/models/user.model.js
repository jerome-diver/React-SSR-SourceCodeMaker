import mongoose, { Schema, model } from 'mongoose'
import Role, { RoleSchema } from './role.model'
import Crypto from 'crypto'

/* Schema for document user for collection "users" */
const UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: 'Username is required',
        minLength: 4,
        maxLength: 16,
        unique: 'Username already exists'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please, fill a valid email address'],
        required: 'Email is required'
    },
    first_name: {
        type: String,
        minLength: 2,
        maxLength: 32,
        trim: true
    },
    second_name: {
        type: String,
        minLength: 2,
        maxLength: 24,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    validated: {
        type: Boolean,
        default: false
    },
    ticket: {
        type: String,
        trim: true
    },
/*     role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: 'Role is required'
    }, */
    role: {
        type: RoleSchema,
        set: (value) => {
            if(!value) {
                return Role.findOne({name: "Reader"})
            }
        }
        //default: () => ({})
    },
    hashed_password: {
        type: String,
        required: 'Password is required'
    },
    salt: String
}, { collection: 'users' } )

UserSchema.virtual('password')
          .set(function(password) {
              this._password = password
              this.salt = this.makeSalt()
              this.hashed_password = this.encryptPassword(password, this.salt) 
              this.ticket = this.makeTicket(this.hashed_password)
            })
          .get(function() { return this._password })

UserSchema.methods = {
    authenticate: function(pass) {
        return this.encryptPassword(pass, this.salt) === this.hashed_password },
    encryptPassword: function(password, salt) {
        if (!password) return ''
        try {
            const done = Crypto.createHmac('sha256', salt)
                         .update(password)
                         .digest('hex')
            return done
        } catch (error) { return 'error' }
    },
    makeTicket: function(hashed_password) {
        return Crypto.createHash('md5').update(hashed_password).digest('hex')
    },
    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random()) + '' }
}

UserSchema.options.toJSON = {   // return only what is required for safety reason
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.salt;
        delete ret.hashed_password;
        delete ret.ticket;
        return ret;
    }
};

/* Export Schema to Model User */
export default model('User', UserSchema)
