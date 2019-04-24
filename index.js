const path = require('path')
const fs = require('fs')
const express = require('express')
const WebSocket = require('ws')
const epd = require('epd4in2')

const app = express()
const port = 2000

app.use('/', express.static(path.join(__dirname, 'publuc')))
app.listen(port)

const wss = new WebSocket.Server({ port: 2001 })

wss.on('connection', ws => {
  ws.on('message', message => {
    save(message)
  })
})

const dir = path.join(__dirname, 'archive')

function save(base64) {
  const data = base64.replace(/^data:image\/png;base64,/, '')
  const timestamp = Date.now()
  
  fs.writeFile(`${ dir }/${ timestamp }.png`, data, 'base64', err => {
    if (err) console.log(err)
    console.log(`${ timestamp }.png saved^^`)
    display()
  })
}

function display() {
  const read = fs.readdirSync(dir)

  const files = []
  read.forEach(file => {
    if (file.endsWith('.png')) files.push(file)
  })
  refreshDisplay(`${ dir }/${ files[files.length - 1] }`)
}

async function refreshDisplay(path) {
  await epd.init()

  const img = epd.gd.createFromFile(path)
 
  await epd.displayImageBuffer(img)
  await epd.sleep()
}