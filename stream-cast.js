const { Readable } = require('stream')

function isReadableStream (value) {
  return (typeof value.pipe === 'function')
}

module.exports = function castStream (value) {
  if (isReadableStream(value)) { return value }

  const readable = new Readable({ read () { } })

  readable.push(value)
  readable.push(null)

  return readable
}
