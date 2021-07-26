const mongoose = require('mongoose')
const socket = require('socket.io')
const { Room } = require('../models')
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
    io.on('connection', socket => socket.on('modify-queue', data => {
      const { queue } = data 
      const { isSkiping } = data
      const room = { queue: queue && typeof queue === 'string' ? replaceAll(queue, ' ').split(',') : queue || [] }
    
      Room.updateOne({ _id: id }, room, (err, res) => {
        if (err) catchErr(err, res)
        else {
          const { sockets } = io
          sockets.emit('send-queue', queue)
          if (isSkiping) sockets.emit('skip', 'skip!')
        }
      })
    }))
  },
  getIo: () => io,
}
