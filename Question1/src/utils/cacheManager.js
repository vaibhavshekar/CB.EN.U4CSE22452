// src/utils/cacheManager.js

class CacheManager {
    constructor() {
        this.cache = new Map();
    }

    set(key, data, ttl = 60000) {
        this.cache.set(key, {
            data,
            timestamp: Date.now() + ttl
        });
    }

    get(key) {
        const entry = this.cache.get(key);
        
        if (!entry) return null;
        
        // Check if cache has expired
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
}

export default new CacheManager();
