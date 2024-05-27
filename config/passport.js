const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');
const UserPassword = require('../models/UserPassword');

// Callback function for local strategy
const callback = async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }

        const userPassword = await UserPassword.findOne({ user: user._id });
        console.log(userPassword);
        if (!userPassword || !userPassword.validatePassword(password)) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
};

// Local strategy setup
const strategy = new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, callback);

passport.use(strategy);

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;
