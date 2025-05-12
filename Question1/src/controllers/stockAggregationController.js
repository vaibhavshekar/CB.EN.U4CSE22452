import StockDataService from '../services/stockDataService.js';
import CorrelationService from '../services/correlationService.js';

class StockAggregationController {
    async getAverageStockPrice(req, res, next) {
        try {
            const { ticker } = req.params;
            const minutes = req.query.minutes 
                ? parseInt(req.query.minutes) 
                : undefined;

            const stockData = await StockDataService.getAverageStockPrice(ticker, minutes);

            res.json({
                averageStockPrice: stockData.averagePrice,
                priceHistory: stockData.priceHistory
            });
        } catch (error) {
            next(error);
        }
    }

    async getStockCorrelation(req, res, next) {
        try {
            const tickers = req.query.ticker;
            const minutes = req.query.minutes 
                ? parseInt(req.query.minutes) 
                : undefined;

            const correlationData = await CorrelationService.calculateStockCorrelation(
                tickers, 
                minutes
            );

            res.json(correlationData);
        } catch (error) {
            next(error);
        }
    }

    async getStockList(req, res, next) {
        try {
            const stockList = await StockDataService.getStockList();
            res.json(stockList);
        } catch (error) {
            next(error);
        }
    }
}

export default new StockAggregationController();
