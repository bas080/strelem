const concat = require('./stream-concat')

module.exports = elements => componentFn =>
  (...data) => concat(componentFn(elements, ...data))
