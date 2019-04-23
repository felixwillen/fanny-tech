const socket = new WebSocket('ws://192.168.2.108:2001') // create another websocket? 1 for answering the other?

const image = document.getElementById('image') // gets image from html
const buttonUpload = document.getElementById('upload') // get uplaod button

const options = {
  step: 1, // ?
  palette: [[0, 0, 0], [255, 255, 255]], // color for dither, only black and white
  algorithm: 'atkinson' // choose algorithm
}

const ditherjs = new DitherJS(options) // create dither with defined options

buttonUpload.addEventListener('click', () => {
  const canvas = document.getElementsByTagName('canvas')[0] // creates canvas and send to server ?!
  socket.send(canvas.toDataURL())
})

function handle() {
  const file = document.querySelector('input[typer=file]').files[0] // choose first file?
  const reader = new FileReader()

  if (file) {
    reader.readAsDataURL(file) // if file is there
  }

  reader.addEventListener('load', () => { // load file
    image.src = reader.result 
  })
}

image.addEventListener('load', () => { // dither the loaded file
  ditherjs.dither(image, options)

})

