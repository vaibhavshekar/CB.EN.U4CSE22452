import StockDataService from './stockDataService.js';
import { calculateCorrelation } from '../utils/mathUtils.js';
import { API_CONFIG } from '../config/api.config.js';

class CorrelationService {
    async calculateStockCorrelation(tickers, minutes) {
        if (tickers.length > API_CONFIG.MAX_CORRELATION_TICKERS) {
            throw new Error(`Maximum ${API_CONFIG.MAX_CORRELATION_TICKERS} tickers allowed for correlation`);
        }

        const stockDataPromises = tickers.map(ticker => 
            StockDataService.getAverageStockPrice(ticker, minutes)
        );

        const stocksData = await Promise.all(stockDataPromises);

        const stocksResponse = {};
        tickers.forEach((ticker, index) => {
            stocksResponse[ticker] = stocksData[index];
        });

        const alignedPrices = this.alignPriceHistories(stocksData);

        const correlation = alignedPrices 
            ? calculateCorrelation(
                alignedPrices.map(p => p.x), 
                alignedPrices.map(p => p.y)
            )
            : 0;

        return {
            correlation,
            stocks: stocksResponse
        };
    }

    alignPriceHistories(stocksData) {
        if (stocksData.length !== 2 || 
            stocksData.some(data => data.priceHistory.length === 0)) {
            return null;
        }

        const [stock1, stock2] = stocksData;


        const alignedPrices = [];

        stock1.priceHistory.forEach(price1 => {

            const matchingPrice = stock2.priceHistory.find(price2 => 
                Math.abs(new Date(price1.lastUpdatedAt).getTime() - 
                         new Date(price2.lastUpdatedAt).getTime()) < 60000 // within 1 minute
            );

            if (matchingPrice) {
                alignedPrices.push({
                    x: price1.price,
                    y: matchingPrice.price
                });
            }
        });

        return alignedPrices.length > 0 ? alignedPrices : null;
    }
}

export default new CorrelationService();
