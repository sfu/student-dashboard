module.exports = class RedisStore {
  constructor(
    client = undefined,
    options = {
      prefix: 'PGT:::',
      expiry: 3600, // seconds
    }
  ) {
    if (!client) {
      throw new Error('You must supply a Redis client to RedisStore');
    }
    this.client = client;
    this.prefix = options.prefix;
    this.expiry = options.expiry;
  }

  get(pgtiou) {
    const key = `${this.prefix}${pgtiou}`;
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  set(pgtiou, pgt) {
    const key = `${this.prefix}${pgtiou}`;
    return new Promise((resolve, reject) => {
      this.client.setex(key, this.expiry, pgt, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  del(pgtiou) {
    const key = `${this.prefix}${pgtiou}`;
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
};
