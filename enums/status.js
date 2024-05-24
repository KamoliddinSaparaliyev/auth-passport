const HttpStatusCode = Object.freeze({
    OK: 200,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    CONFLICT: 409,
});

module.exports = HttpStatusCode;
