/** Common settings for auth-api app. */
const LOCAL_DB_PW = require('../../pg-pw-secret')
const env = process.env.NODE_ENV
const pass = process.env.LOCAL_DB_PW || process.env.DB_PW

const DB_CONFIG = {
	database: env == 'test' ? 'auth_demo_test' : 'auth_demo',
	password: pass ? pass : LOCAL_DB_PW,
}

const SECRET_KEY = process.env.SECRET_KEY || "secret";

const BCRYPT_WORK_FACTOR = 12;

module.exports = {
  DB_CONFIG,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR
};
