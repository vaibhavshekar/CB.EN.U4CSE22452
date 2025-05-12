import StockDataService from './stockDataService.js';
import { calculateCorrelation } from '../utils/mathUtils.js';
import { API_CONFIG } from '../config/api.config.js';

class CorrelationService {
    async calculateStockCorrelation(tickers, minutes) {

        if (!tickers || !Array.isArray(tickers) || tickers.length < 2) {
            throw new Error('At least two valid stock tickers are required for correlation');
        }
        
        const tickersToCompare = tickers.slice(0, API_CONFIG.MAX_CORRELATION_TICKERS);
        if (tickers.length > API_CONFIG.MAX_CORRELATION_TICKERS) {
            console.warn(`Only the first ${API_CONFIG.MAX_CORRELATION_TICKERS} tickers will be compared`);
        }

        try {

            const stockDataPromises = tickersToCompare.map(ticker => 
                StockDataService.getAverageStockPrice(ticker, minutes)
                    .catch(err => {
                        console.error(`Error fetching data for ${ticker}:`, err);
                        return { averagePrice: null, priceHistory: [] };
                    })
            );

            const stocksData = await Promise.all(stockDataPromises);

            const stocksResponse = {};
            tickersToCompare.forEach((ticker, index) => {
                stocksResponse[ticker] = stocksData[index];
            });

            let correlation = 0;
            

            const validStocks = stocksData.filter(data => 
                data && data.priceHistory && data.priceHistory.length > 0
            );
            
            if (validStocks.length >= 2) {
                const alignedPrices = this.alignPriceHistories(stocksData[0], stocksData[1]);
                
                if (alignedPrices && alignedPrices.length > 1) {
                    correlation = calculateCorrelation(
                        alignedPrices.map(p => p.x), 
                        alignedPrices.map(p => p.y)
                    );
                }
            }

            return {
                correlation,
                stocks: stocksResponse
            };
        } catch (error) {
            console.error('Error calculating stock correlation:', error);
            throw new Error('Failed to calculate stock correlation');
        }
    }

    alignPriceHistories(stock1Data, stock2Data) {
        if (!stock1Data || !stock2Data || 
            !stock1Data.priceHistory || !stock2Data.priceHistory ||
            stock1Data.priceHistory.length === 0 || stock2Data.priceHistory.length === 0) {
            return null;
        }

        const alignedPrices = [];
        const timeWindowMs = 60000; 

        for (const price1 of stock1Data.priceHistory) {
            const time1 = new Date(price1.lastUpdatedAt).getTime();
            
            let bestMatch = null;
            let minTimeDiff = Number.MAX_SAFE_INTEGER;
            
            for (const price2 of stock2Data.priceHistory) {
                const time2 = new Date(price2.lastUpdatedAt).getTime();
                const timeDiff = Math.abs(time1 - time2);
                
                if (timeDiff < minTimeDiff && timeDiff < timeWindowMs) {
                    minTimeDiff = timeDiff;
                    bestMatch = price2;
                }
            }
            
            if (bestMatch) {
                alignedPrices.push({
                    x: price1.price,
                    y: bestMatch.price,
                    time1: price1.lastUpdatedAt,
                    time2: bestMatch.lastUpdatedAt
                });
            }
        }

        return alignedPrices.length > 1 ? alignedPrices : null;
    }
}

export default new CorrelationService();