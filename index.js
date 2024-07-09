class RateLimiter {
    constructor() {
        this.limits = {};
        this.requests = {};
    }

    /**
     * Sets the rate limit for a specific key.
     * @param {string} key - The identifier for the rate limit.
     * @param {{rate: number, per: number}} param1 - The rate limit settings, where `rate` is the number of requests allowed and `per` is the time frame in milliseconds.
     */
    setLimit(key, {rate, per}) {
        this.limits[key] = {rate, per};
        this.requests[key] = [];
    }

    /**
     * Sets the rate limit for a specific key. If the rate limit already exists, it does not update.
     * @param {string} key - The identifier for the rate limit.
     * @param {{rate: number, per: number}} param1 - The rate limit settings, where `rate` is the number of requests allowed and `per` is the time frame in milliseconds.
     */
    setIfNotExists(key, {rate, per}) {
        if (!this.limits[key]) {
            this.setLimit(key, {rate, per});
        }
    }

    /**
     * Checks if a request can be made under the current rate limit for a specific key. If the limit is reached, it waits until a request can be made.
     * @param {string} key - The identifier for the rate limit to check.
     * @returns {Promise<boolean>} A promise that resolves with `true` if the request can be made, otherwise waits until it can.
     */
    async checkLimit(key) {
        if (!this.canMakeRequest(key)) {
            const {rate, per} = this.limits[key];
            // Wait until a request slot is available
            await new Promise(resolve => {
                const interval = setInterval(() => {
                    const now = Date.now();
                    this.cleanUpOldRequests(key, now - per);
                    if (this.requests[key].length < rate) {
                        this.requests[key].push(now);
                        clearInterval(interval);
                        resolve();
                    }
                }, per / rate); // Check at intervals based on rate
            });
            return true;
        } else {
            return true;
        }
    }

    /**
     * Checks if a request can be made under the current rate limit for a specific key.
     * Optionally records the request attempt if `willMakeRequest` is true.
     * @param {string} key - The identifier for the rate limit to check.
     * @param {boolean} [willMakeRequest=true] - Whether to record the request attempt. Defaults to true.
     * @returns {boolean} - Returns `true` if the request can be made under the current rate limit, otherwise `false`.
     * @throws {Error} - Throws an error if the limit for the specified key is not set.
     */
    canMakeRequest(key, willMakeRequest = true) {
        if (!this.limits[key]) {
            throw new Error(`Limit not set for key: ${key}`);
        }

        const now = Date.now();
        const {rate, per} = this.limits[key];
        this.cleanUpOldRequests(key, now - per);

        if (this.requests[key].length < rate) {
            if (willMakeRequest) {
                this.requests[key].push(now);
            }
            return true;
        }
        return false;
    }

    cleanUpOldRequests(key, threshold) {
        this.requests[key] = this.requests[key].filter(timestamp => timestamp > threshold);
    }
}

module.exports = new RateLimiter();