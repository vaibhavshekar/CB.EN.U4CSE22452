// src/utils/cacheManager.js

class CacheManager {
    constructor() {
        this.cache = new Map();
        this.defaultTTL = 30000;
    }

    set(key, data, ttl = this.defaultTTL) {
        this.cache.set(key, {
            data,
            timestamp: Date.now() + ttl
        });
    }

    get(key) {
        const entry = this.cache.get(key);
        
        if (!entry) return null;
        
        if (Date.now() > entry.timestamp) {
            this.cache.delete(key);
            return null;
        }
        
        return entry.data;
    }

    clear(key) {
        if (key) {
            this.cache.delete(key);
        } else {
            this.cache.clear();
        }
    }

    async refreshIfStale(key, fetchFunction, maxAge = 60000) {
        const entry = this.cache.get(key);
        
        if (!entry) {
            const data = await fetchFunction();
            this.set(key, data);
            return data;
        }
        
        if (Date.now() > (entry.timestamp - this.defaultTTL + maxAge)) {
            fetchFunction().then(data => this.set(key, data));
        }
        
        return entry.data;
    }
}

export default new CacheManager();
