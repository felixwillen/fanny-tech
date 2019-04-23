const path = require('path')
const fs = require('fs') // whats that?
const express = require('express') // serve static files
const WebSocket = require('ws') // creates bidirectional connection client <-> server
const epd = require('epd4in2') // libery for epaper screen

const app = express() // creates express app
const port = 2000 // asign port

app.use('/', express.static(path.join(__dirname, 'publuc'))) // express root
app.listen(port) // use asigned port

const wss = new WebSocket.Server({ port: 2001 }) // create websocket server on por 2001

wss.on('connection', ws => {
  ws.on('message', message => { // sending and receiving data
    save(message)
  })
})

const dir = path.join(__dirname, 'archive') //create archive

function save(base64) {
  const data = base64.replace(/^data:image\/png;base64,/, '') // remove part of array because info not needed
  const timestamp = Date.now() // create timestamp
  
  fs.writeFile(`${ dir }/${ timestamp }.png`, data, 'base64', err => { // save .png file in archive with timestamp as file name
    if (err) console.log(err)
    console.log(`${ timestamp }.png saved^^`)
    display()
  })
}

function display() {
  const read = fs.readdirSync(dir)

  const files = []
  read.forEach(file => {
    if (file.endsWith('.png')) files.push(file) // if png file created push to screen
  })
  refreshDisplay(`${ dir }/${ files[files.length - 1] }`) // why -1?
}

async function refreshDisplay(path) {
  await epd.init()

  const img = epd.gd.createFromFile(path) // load img if its dithered
 
  await epd.displayImageBuffer(img)
  await epd.sleep()
}