// src/app.js
import express from 'express';
import { errorHandler } from './middleware/errorHandler.js';
import StockAggregationController from './controllers/stockAggregationController.js';
import axios from 'axios';
import { API_CONFIG } from './config/api.config.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Test the API connection directly on startup
const testApiConnection = async () => {
    try {
        console.log('Testing API connection...');
        // Make sure the authorization header is properly formatted
        const authHeader = `${API_CONFIG.AUTH.TOKEN_TYPE} ${API_CONFIG.AUTH.TOKEN}`;
        console.log('Using auth header:', authHeader);
        
        const response = await axios.get(`${API_CONFIG.BASE_URL}/stocks`, {
            headers: {
                'Authorization': authHeader
            }
        });
        console.log('API connection successful!');
        if (response.data && response.data.stocks) {
            console.log('Retrieved', Object.keys(response.data.stocks).length, 'stocks');
        }
    } catch (error) {
        console.error('API connection test failed!');
        console.error('Error message:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data));
        }
    }
};

// Run the test when the server starts
testApiConnection();

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
