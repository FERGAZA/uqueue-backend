const { Room } = require('../../models')

module.exports = (socket, io) => {
  socket.on('modify-queue', data => {
    const { sockets } = io
    const { queue } = data
    const { id } = data 
    const room = { queue: queue && typeof queue === 'string' ? replaceAll(queue, ' ').split(',') : queue || [] }
  
    Room.updateOne({ _id: id }, room, (err, res) => {
      if (err) catchErr(err, res)
      else sockets.emit('send-queue', { queue, id })
    })
  })
  socket.on('add-queue', data => {
    const { sockets } = io
    const { queue } = data
    const { id } = data 
    const room = { queue: queue && typeof queue === 'string' ? replaceAll(queue, ' ').split(',') : queue || [] }
  
    Room.updateOne({ _id: id }, room, (err, res) => {
      if (err) catchErr(err, res)
      else sockets.emit('update-queue', { queue, id })
    })
  })
}