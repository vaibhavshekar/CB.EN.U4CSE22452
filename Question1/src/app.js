// src/app.js
import express from 'express';
import { errorHandler } from './middleware/errorHandler.js';
import StockAggregationController from './controllers/stockAggregationController.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
// Get average stock price
app.get('/stocks/:ticker', StockAggregationController.getAverageStockPrice);

// Get stock correlation
app.get('/stockcorrelation', StockAggregationController.getStockCorrelation);

// Get stock list
app.get('/stocks', StockAggregationController.getStockList);

// Error handling middleware
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
    console.log(`Stock Price Aggregation Microservice running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

export default app;
