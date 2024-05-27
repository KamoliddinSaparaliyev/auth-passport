const UserPassword = require('../models/UserPassword');
const User = require('../models/User');
const passport = require('passport');

class AuthController {
    async login(req, res, next) {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(401).json({ error: info.message });
            }

            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }

                return res.status(200).json({ success: true, message: 'User logged in' });
            });
        })(req, res, next);
    }

    async register(req, res) {
        const { email, password, username } = req.body;

        if (!email || !password) {
            return res.status(400).send({ error: 'Missing required fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ error: 'User already exists' });
        }

        const user = new User({ email, username });
        const userPassword = new UserPassword({ user, password });

        if (!userPassword) {
            await user.remove();
            return res.status(500).send({ error: 'Failed to create user' });
        }

        await user.save();
        await userPassword.save();

        res.status(201).json({ success: true, message: 'User created' });
    }

    async me(req, res) {
        res.status(200).json({ user: req.user });
    }
}

module.exports = new AuthController();
