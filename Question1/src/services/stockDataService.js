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
        
        try {
            return await CacheManager.refreshIfStale(
                cacheKey,
                async () => {
                    const response = await this.axiosInstance.get(API_CONFIG.ENDPOINTS.STOCKS);
                    return response.data.stocks;
                }
            );
        } catch (error) {
            console.error('Error fetching stock list:', error);
            
            const cachedData = CacheManager.get(cacheKey);
            if (cachedData) {
                console.log('Using expired cache data as fallback');
                return cachedData;
            }
            
            throw new Error('Unable to retrieve stock list');
        }
    }

    async getStockPriceHistory(ticker, minutes) {
        const cacheKey = `stock_price_${ticker}_${minutes || 'latest'}`;
        const cacheTime = minutes ? Math.min(minutes * 1000 / 2, 30000) : 15000;
        
        try {
            return await CacheManager.refreshIfStale(
                cacheKey,
                async () => {
                    const url = API_CONFIG.ENDPOINTS.STOCK_PRICE.replace('{ticker}', ticker);
                    const params = minutes ? { minutes } : {};
                    const response = await this.axiosInstance.get(url, { params });


                    let priceHistory;
                    
                    if (response.data === null || response.data === undefined) {
                        return [];
                    }
                    
                    if (Array.isArray(response.data)) {
                        priceHistory = response.data;
                    } else if (response.data.stock) {
                        priceHistory = [response.data.stock];
                    } else {
                        const possiblePriceObjects = Object.values(response.data)
                            .filter(item => 
                                item && typeof item === 'object' && 
                                'price' in item && 'lastUpdatedAt' in item
                            );
                            
                        if (possiblePriceObjects.length > 0) {
                            priceHistory = possiblePriceObjects;
                        } else {
                            priceHistory = [response.data]; // Last resort
                        }
                    }

                    // Ensure all items have price and timestamp
                    priceHistory = priceHistory.filter(item => 
                        item && typeof item.price === 'number' && item.lastUpdatedAt
                    );
                    
                    return this.stableSortPriceHistory(priceHistory);
                },
                cacheTime
            );
        } catch (error) {
            console.error(`Error fetching price history for ${ticker}:`, error);
            
            const cachedData = CacheManager.get(cacheKey);
            if (cachedData && cachedData.length > 0) {
                console.log('Using expired cache data as fallback');
                return cachedData;
            }
            
            throw new Error(`Unable to retrieve price history for ${ticker}`);
        }
    }

    stableSortPriceHistory(priceHistory) {
        const indexed = priceHistory.map((item, index) => [index, item]);
        

        indexed.sort((a, b) => {
            const timeA = new Date(a[1].lastUpdatedAt).getTime();
            const timeB = new Date(b[1].lastUpdatedAt).getTime();
            
            if (timeA === timeB) {
                return a[0] - b[0]; 
            }
            return timeA - timeB;
        });
        
        return indexed.map(pair => pair[1]);
    }

    async getAverageStockPrice(ticker, minutes) {
        const priceHistory = await this.getStockPriceHistory(ticker, minutes);
        
        // Handle empty price history gracefully
        if (!priceHistory || priceHistory.length === 0) {
            return {
                averagePrice: null,
                priceHistory: []
            };
        }

        return {
            averagePrice: calculateAverage(priceHistory.map(p => p.price)),
            priceHistory
        };
    }
}

export default new StockDataService();
