const { compare } = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const userPasswordSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        salt: { type: String },
        password: { type: String, required: true },
    },
    {
        timestamps: false,
        versionKey: false,
    }
);

compare;
userPasswordSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next();

    this.salt = crypto.randomBytes(32).toString('hex');
    this.password = crypto.pbkdf2Sync(this.password, this.salt, 10000, 64, 'sha512').toString('hex');
});

userPasswordSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
    return this.password === hash;
};

const UserPassword = mongoose.model('UserPassword', userPasswordSchema);
module.exports = UserPassword;
