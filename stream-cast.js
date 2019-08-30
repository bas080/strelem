const { Readable } = require('stream')

function isReadableStream (value) {
  return (typeof value.pipe === 'function')
}

function isThennable (value) {
  return (typeof value.then === 'function')
}

module.exports = function castStream (value) {
  if (isReadableStream(value)) { return value }

  const readable = new Readable({ read () { } })

  if (isThennable(value)) {
    value.then(v => {
      readable.push(v)
      readable.push(null)
    })

    return readable
  }

  readable.push(value)
  readable.push(null)

  return readable
}
