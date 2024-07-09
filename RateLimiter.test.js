const rateLimiter = require('./index.js');

describe('RateLimiter', () => {

    test('should be a class', () => {
        expect(typeof rateLimiter).toBe('object');
    });

    test('should set limits correctly', () => {
        rateLimiter.setLimit('test', {rate: 1, per: 1000});
        expect(rateLimiter.limits['test']).toEqual({rate: 1, per: 1000});
    });

    test('canMakeRequest should return true if under limit', () => {
        rateLimiter.setLimit('test', {rate: 2, per: 1000});
        expect(rateLimiter.canMakeRequest('test')).toBe(true);
    });

    test('canMakeRequest should return false if limit is reached', () => {
        rateLimiter.setLimit('test', {rate: 1, per: 1000});
        rateLimiter.canMakeRequest('test'); // First request
        expect(rateLimiter.canMakeRequest('test')).toBe(false);
    });

    test('checkLimit should resolve immediately if under limit', async () => {
        rateLimiter.setLimit('asyncTest', {rate: 2, per: 1000});
        const result = await rateLimiter.checkLimit('asyncTest');
        expect(result).toBe(true);
    });

    test('checkLimit should wait and resolve if limit is reached', async () => {
        jest.setTimeout(3000); // Extend default timeout for this test
        rateLimiter.setLimit('asyncTest', {rate: 1, per: 1000});
        rateLimiter.canMakeRequest('asyncTest'); // First request to reach the limit

        const startTime = Date.now();
        const result = await rateLimiter.checkLimit('asyncTest');
        const endTime = Date.now();

        expect(result).toBe(true);
        expect(endTime - startTime).toBeGreaterThanOrEqual(1000); // Ensure it waited at least 1 second
    });

});