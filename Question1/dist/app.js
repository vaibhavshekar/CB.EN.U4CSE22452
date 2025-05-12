"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.js
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("./middleware/errorHandler");
const stockAggregationController_1 = __importDefault(require("./controllers/stockAggregationController"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
// Routes
// Get average stock price
app.get('/stocks/:ticker', stockAggregationController_1.default.getAverageStockPrice);
// Get stock correlation
app.get('/stockcorrelation', stockAggregationController_1.default.getStockCorrelation);
// Get stock list
app.get('/stocks', stockAggregationController_1.default.getStockList);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
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
exports.default = app;
