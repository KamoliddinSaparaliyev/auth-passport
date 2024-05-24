const User = require('../models/User');
const UserPassword = require('../models/UserPassword');

class AuthController {
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            }

            const userPassword = await UserPassword.findOne({ user });

            if (!userPassword || !userPassword.validatePassword(password)) {
                return res.status(401).send({ error: 'Invalid credentials' });
            }

            res.status(200).json({ success: true, result: user });
        } catch (err) {
            next(err);
        }
    }

    async register(req, res, next) {
        const { email, password, username } = req.body;

        // const existingUser = await User.findOne({ email });
        // console.log(existingUser);
        // if (existingUser) {
        //     return res.status(400).send({ error: 'User already exists' });
        // }

        const user = new User({ email, username });

        const userPassword = new UserPassword({ user, password });

        // if (!userPassword) {
        //     await user.remove();
        //     return res.status(500).send({ error: 'Failed to create user' });
        // }

        await user.save();
        await userPassword.save();

        res.status(201).json({ success: true, id: user });
    }
}

module.exports = new AuthController();
