const socket = new WebSocket('ws://192.168.2.108:2001')

const image = document.getElementById('image')
const buttonUpload = document.getElementById('upload')

const options = {
  step: 1,
  palette: [[0, 0, 0], [255, 255, 255]],
  algorithm: 'atkinson'
}

const ditherjs = new DitherJS(options)

buttonUpload.addEventListener('click', () => {
  const canvas = document.getElementsByTagName('canvas')[0]
  socket.send(canvas.toDataURL())
})

function handle() {
  const file = document.querySelector('input[typer=file]').files[0]
  const reader = new FileReader()

  if (file) {
    reader.readAsDataURL(file)
  }

  reader.addEventListener('load', () => {
    image.src = reader.result 
  })
}

image.addEventListener('load', () => {
  ditherjs.dither(image, options)

})

