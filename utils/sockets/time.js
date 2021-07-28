const rooms = []

module.exports = (socket, io) => {
  const { sockets } = io

  socket.on('start-video', data => {
    const { room } = data 
    const sRoom = rooms.find(e => e.id === room)
  
    if (sRoom){
      sockets.emit('get-time', sRoom.time)
    }
    else {
      rooms.push({id: room, time: 0})
      sockets.emit('get-time', 0)
    }
  })

  socket.on('send-time', data => {
    const { room } = data 
    const { time } = data
    const sRoom = rooms.find(e => e.id === room)

    if (sRoom && sRoom.time < time) sRoom.time = time
    else rooms.push({id: room, time: 0})
  })
}