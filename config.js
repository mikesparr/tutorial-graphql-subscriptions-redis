/**
 * Wrapper object for ENV var config values (with defaults)
 * @type {Object}
 */
const Config = {
  serverPort: process.env.SERVER_PORT || 3000,
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: process.env.REDIS_PORT || 6379
}

export default Config;