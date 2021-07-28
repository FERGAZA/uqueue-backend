const express = require('express')
//const path = require('path')
//const fs = require('fs')
//const https = require('https')
const dotenv = require('dotenv').config()
const server = express()
const http = require('http').Server(server)
const cl1b = require('./cl1b')
const actions = require('./actions')
const { connect_mongo, initIo } = require('./utils')
const app = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost/player',
  port: {
      http: process.env.HTTP_PORT || 3000,
      https: process.env.HTTPS_PORT || 3003
  }
  //ssl: {
    //key: fs.readFileSync('/etc/letsencrypt/live/play.divecrafts.net/privkey.pem', 'utf8'),
    //cert: fs.readFileSync('/etc/letsencrypt/live/play.divecrafts.net/cert.pem', 'utf8')
  //}
}


//TODO: Make a ratelimit
server.use(express.urlencoded({ extended: false }))
server.use(express.json())

actions.forEach(action => {
  switch (action.type.toLowerCase()){
    case 'get':
      cl1b.get(server, action.id, action.callback)
      break
    case 'post':
      cl1b.post(server, action.id, action.callback)
      break
    case 'put':
      cl1b.put(server, action.id, action.callback)
      break
    case 'delete':
      cl1b.delete(server, action.id, action.callback)
      break
    default:
      throw new Error('Unknown action type')            
  }
})

connect_mongo(app.mongoURI)
initIo(http)

server.use('/', express.static('frontend'))

//https.createServer(app.ssl, server)
  //.listen(app.port.https, portHook(app.port.https))
http.listen(app.port.http, cl1b.portHook(app.port.http))
