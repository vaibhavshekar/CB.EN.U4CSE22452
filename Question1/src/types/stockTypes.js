export const StockPrice = {
    price: Number,
    lastUpdatedAt: String
};

export const StockData = {
    averagePrice: Number,
    priceHistory: Array
};

export const AverageStockPriceResponse = {
    averageStockPrice: Number,
    priceHistory: Array
};

export const StockCorrelationResponse = {
    correlation: Number,
    stocks: Object
};

export const StockListResponse = {
    stocks: Object
};
