import { Schema, model } from 'mongoose'
import crypto from 'crypto'

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: 'Username is required',
        unique: 'Username already exists'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please, fill a valid email address'],
        required: 'Email is required'
    },
    first_name: {
        type: String,
        trim: true
    },
    second_name: {
        type: String,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    validated: {
        type: Bool,
        default: false
    },
    role: {
        type: String,
        default: 'Reader',
        required: 'Role is required'
    },
    hashed_password: {
        type: String,
        required: 'Password is required'
    },
    salt: String
})

UserSchema.virtual('password')
          .set(function(password) {
              this._password = password
              this._salt = this.makeSalt()
              this.hashed_password = this.encryptPassword(password) })
          .get(function() { return this._password })

UserSchema.methods = {
    authenticate: (pass) => {
        return this.encryptPassword(pass) === this.hashed_password },
    encryptPassword: (password) => {
        if (!password) return ''
        try {
            return crypto.createHMAC('sha1', this.salt)
                         .update(password)
                         .digest('hex')
        } catch (error) { return '' }
    },
    makeSalt: () => {
        return Math.round(new Date().valueOf() * Math.random()) + '' }
}

export default model('User', UserSchema)
