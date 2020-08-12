import { Schema, model } from 'mongoose'
import Crypto from 'crypto'

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
    role: {
        type: String,
        default: 'Reader',
        enum: ["Reader", "Writer", "Admin"],
        required: 'Role is required'
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
            })
          .get(function() { return this._password })

UserSchema.methods = {
    authenticate: (pass) => {
        return this.encryptPassword(pass, this.salt) === this.hashed_password },
    encryptPassword: (password, salt) => {
        if (!password) return ''
        try {
            const done = Crypto.createHmac('sha256', salt)
                         .update(password)
                         .digest('hex')
            return done
        } catch (error) { return 'error' }
    },
    makeSalt: () => {
        return Math.round(new Date().valueOf() * Math.random()) + '' }
}

export default model('User', UserSchema)
