export const errorHandler = (err, req, res, next) => {
    console.error('Unhandled Error:', err);

    if (err.message.includes('Unable to retrieve')) {
        return res.status(503).json({
            error: 'Service Unavailable',
            message: err.message
        });
    }

    if (err.message.includes('Maximum tickers')) {
        return res.status(400).json({
            error: 'Bad Request',
            message: err.message
        });
    }

    res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
    });
};
