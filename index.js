module.exports = process.env.DIRTYBLOG_COV
  ? require('./lib-cov/app')
  : require('./lib/app');