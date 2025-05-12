export const errorHandler = (err, req, res, next) => {
    console.error('Error handling request:', err);
    
    let statusCode = err.statusCode || 500;
    
    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
        statusCode = 503;
    } else if (err.response && err.response.status) {
        statusCode = err.response.status;
    }
    
    // Send error response with appropriate structure
    res.status(statusCode).json({
        success: false,
        error: {
            message: err.message || 'An unexpected error occurred',
            code: err.code || 'INTERNAL_ERROR',
            status: statusCode
        }
    });
};
