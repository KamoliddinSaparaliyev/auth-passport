const router = require('express').Router();

/**
 * Authentication routes
 */
router.use('/auth', require('./auth'));

module.exports = router;
