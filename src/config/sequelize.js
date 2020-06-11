
require('dotenv').config();

const defaults = {
  username: process.env.PWDKEEPER_DATABASE_USER,
  password: process.env.PWDKEEPER_DATABASE_PASSWORD,
  host: process.env.PWDKEEPER_DATABASE_HOSTNAME,
  dialect: 'postgres'
};

module.exports = {
  development: {
    database: 'pwdkeeper_development',
    username: defaults.username,
    password: defaults.password,
    host: defaults.host,
    dialect: defaults.dialect
  },
  test: {
    database: 'pwdkeeper_test',
    username: defaults.username,
    password: defaults.password,
    host: defaults.host,
    dialect: defaults.dialect
  },
  production: {
    database: 'pwdkeeper_production',
    username: defaults.username,
    password: defaults.password,
    host: defaults.host,
    dialect: defaults.dialect
  }
};
