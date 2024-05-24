/**
 * Catch Errors Handler
 *
 * With async/await, you need some way to catch errors.
 * Instead of using try{} catch(e) {} in each controller, we wrap the function in catchErrors(),
 * catch any errors they throw, and pass it along to our express middleware with next()
 *
 * @param {Function} fn - The function to be wrapped
 * @returns {Function} - The wrapped function
 */
exports.catchErrors =
    (fn) =>
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * @param {import("express").NextFunction} next
     * @returns {Promise<import("express").Response>} - The response object
     */
    (req, res, next) =>
        fn(req, res, next).catch(
            /**
             * @param {Error} err
             */
            (err) => next(err)
        );

/**
 * Not Found Error Handler
 *
 * If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
 */
exports.notFound = (req, res, next) => {
    return res.status(404).json({
        success: false,
        message: `Api ${req.method} ${req.originalUrl} doesn't exist `,
    });
};

/**
 * Development Error Handler
 *
 * In development, we show good error messages so if we hit a syntax error or any other previously unhandled error,
 * we can show good info on what happened
 *
 * @param {Error} error
 */
exports.developmentErrors = (error, req, res, next) => {
    error.stack = error.stack || '';
    const errorDetails = {
        message: error.message,
        status: error.status,
        stackHighlighted: error.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>'),
    };

    if (error.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Invalid ${error.path}: ${error.value}`,
        });
    }

    if (error.code === 11000) {
        return res.status(400).json({
            success: false,
            message: `Duplicate ${Object.keys(error.keyValue)} field entered`,
        });
    }

    return res.status(500).json({
        success: false,
        message: error.message,
        error: error,
    });
};

/**
 * Production Error Handler
 *
 * No stacktraces are leaked to admin
 */
exports.productionErrors = (error, req, res, next) => {
    return res.status(500).json({
        success: false,
        message: error.message,
        error: error,
    });
};
