const router = require('express').Router();
const passport = require('passport');

const authController = require('../controllers/auth');
const { catchErrors } = require('../handler/errorHandlers');

router.post('/login', passport.authenticate('local'));
router.post('/register', catchErrors(authController.register));

module.exports = router;
