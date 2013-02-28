module.exports = process.env.EXPRESS_COV
  ? require('./lib-cov/app')
  : require('./lib/app');