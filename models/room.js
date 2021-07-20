const model = require('mongoose').model

module.exports = model('Room', {
  name: String,
  queue: Array
})