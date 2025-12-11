const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if (err.name === 'CastError') {
        message = 'Resource not found';
        statusCode = 404;
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        message = 'Duplicate field value entered';
        statusCode = 400;
    }

    if (err.name === 'ValidationError') {
        message = Object.values(err.errors).map(val => val.message).join(', ');
        statusCode = 400;
    }

    if(err.name === 'JsonWebTokenError') {
        message = 'Invalid token. Please log in again.';
        statusCode = 401;
    }

    if(err.name === "LIMIT_FILE_SIZE") {
        message = 'File size is too large. Maximum limit is 10MB.';
        statusCode = 400;
    }

    if(err.name === "TokenExpiredError") {
        message = 'Your token has expired. Please log in again.';
        statusCode = 401;
    }

    console.error('Error:', {
        message: err.message,
        error: err,
    });

    res.status(statusCode).json({
        success: false,
        error: message
    });
}

export default errorHandler;