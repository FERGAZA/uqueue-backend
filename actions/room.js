const { Room } = require('../models')
const { replaceAll } = require('../utils')

const catchErr = (err, res) => {
  console.error(err)
  res.send(err.message || err).status(500)
}

module.exports = [
  {
    id: 'room/:id',
    type: 'get',
    callback: (req, res) => {
      const { id } = req.params
      Room.findById(id, (err, data) => {
        if (err) catchErr(err, res)
        else res.send(data)
      })
    }
  },
  {
    id: 'room/:id',
    type: 'put',
    callback: (req, res) => {
      const { id } = req.params
      const { queue } = req.body
      const room = { queue: queue && typeof queue ===  'string' ? replaceAll(queue, ' ').split(',') : queue || [] }

      Room.updateOne({ _id: id }, room, (err, result) => {
        if (err) catchErr(err, res)
        else res.send('Ok!').status(200)
      })
    }
  },
  {
    id: 'room',
    type: 'post',
    callback: (req, res) => {
      const { name, queue } = req.body

      const nRoom = new Room()

      nRoom.name = name
      nRoom.queue = queue && typeof queue ===  'string' ? replaceAll(queue, ' ').split(',') : queue || []

      nRoom.save((err, data) => {
        if (err) catchErr(err, res)
        else res.send(`The Room ${data._id} has been created!`).status(200)
      })
    }
  },
]