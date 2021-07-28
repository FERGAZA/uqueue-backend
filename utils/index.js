const mongoose = require('mongoose')
const socket = require('socket.io')
const queue = require('./sockets/queue')
const time = require('./sockets/time')
var io

module.exports = {
  connect_mongo: async uri => {
    return await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }).
    then(() => console.log('MongoDB connected! 💾'))
    .catch(err => {
      console.error(`MongoDB ❌💾: ${err.message}`)
      process.exit(err.code)
    })
  },
  replaceAll: (w, toReplace, newChar = '') => {
    while (w.includes(toReplace)) w = w.replace(toReplace, newChar)
    return w
  },
  initIo: server => {
    io = socket(server)
    io.on('connection', socket => {
      queue(socket, io)
      time(socket, io)
    })
  },
  getIo: () => io,
}
