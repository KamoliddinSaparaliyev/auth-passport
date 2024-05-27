const router = require('express').Router();

const authController = require('../controllers/auth');
const { catchErrors } = require('../handler/errorHandlers');
const { isAuth } = require('../middlewares/auth');

router.post('/login', catchErrors(authController.login));
router.post('/register', catchErrors(authController.register));
router.get('/me', isAuth, catchErrors(authController.me));

module.exports = router;
