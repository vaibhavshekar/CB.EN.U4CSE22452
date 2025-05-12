import axios from 'axios';
import { API_CONFIG } from '../config/api.config.js';
import CacheManager from '../utils/cacheManager.js';
import { calculateAverage } from '../utils/mathUtils.js';

class StockDataService {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            timeout: API_CONFIG.REQUEST_TIMEOUT,
            headers: {
                'Authorization': `${API_CONFIG.AUTH.TOKEN_TYPE} ${API_CONFIG.AUTH.TOKEN}`
            }
        });
    }

    async getStockList() {
        const cacheKey = 'stock_list';
        const cachedData = CacheManager.get(cacheKey);

        if (cachedData) return cachedData;

        try {
            const response = await this.axiosInstance.get(API_CONFIG.ENDPOINTS.STOCKS);
            CacheManager.set(cacheKey, response.data.stocks, API_CONFIG.CACHE_TTL);
            return response.data.stocks;
        } catch (error) {
            console.error('Error fetching stock list:', error);
            throw new Error('Unable to retrieve stock list');
        }
    }

    async getStockPriceHistory(ticker, minutes) {
        const cacheKey = `stock_price_${ticker}_${minutes || 'latest'}`;
        const cachedData = CacheManager.get(cacheKey);

        if (cachedData) return cachedData;

        try {
            const url = API_CONFIG.ENDPOINTS.STOCK_PRICE.replace('{ticker}', ticker);
            const params = minutes ? { minutes } : {};
            const response = await this.axiosInstance.get(url, { params });

            let priceHistory;
            if (minutes) {
                priceHistory = Array.isArray(response.data) ? response.data : [response.data];
            } else {
                priceHistory = response.data.stock ? [response.data.stock] : [response.data];
            }

 
            const sortedHistory = priceHistory.sort((a, b) =>
                new Date(a.lastUpdatedAt).getTime() - new Date(b.lastUpdatedAt).getTime()
            );

            CacheManager.set(cacheKey, sortedHistory, API_CONFIG.CACHE_TTL);
            return sortedHistory;
        } catch (error) {
            console.error(`Error fetching price history for ${ticker}:`, error);
            throw new Error(`Unable to retrieve price history for ${ticker}`);
        }
    }

    async getAverageStockPrice(ticker, minutes) {
        const priceHistory = await this.getStockPriceHistory(ticker, minutes);

        return {
            averagePrice: calculateAverage(priceHistory.map(p => p.price)),
            priceHistory
        };
    }
}

export default new StockDataService();
