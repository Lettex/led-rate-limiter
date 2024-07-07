# Rate Limiter

Dead simple, efficient rate limiting class. This class allows you to set rate limits for various keys (identifiers) and
ensures that the rate of requests does not exceed the specified limits within a given time frame.

## Features

- **Set Rate Limits**: Easily set rate limits for different keys with specific request rates and time frames.
- **Conditional Rate Limit Setting**: Set a rate limit for a key only if it hasn't been set already.
- **Request Checking**: Check if a request can be made under the current rate limit for a specific key, with automatic
  waiting if the limit is reached.
- **Automatic Cleanup**: Old requests that are outside the rate limit's time frame are automatically cleaned up.

## Functions

- `setLimit(key, { rate, per })`: Sets the rate limit for a specific key.
- `setIfNotExists(key, { rate, per })`: Sets the rate limit for a specific key if it does not already exist.
- `checkLimit(key)`: Checks if a request can be made under the current rate limit for a specific key. Waits if the limit
  is reached.

## Installation

```shell
npm install led-rate-limiter
```

## Usage

```javascript
const rateLimiter = new RateLimiter();
rateLimiter.setLimit('myKey', {rate: 100, per: 60000}); // 100 requests per minute
async function makeRequest() {
    await rateLimiter.checkLimit('myKey');
    // Proceed with the request
}
```
