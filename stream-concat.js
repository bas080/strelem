const { Readable } = require('stream')
const { isNil, isEmpty } = require('ramda')
const castStream = require('./stream-cast')

function castArray (value) {
  return Array.isArray(value)
    ? value
    : [value]
}

module.exports = function streamConcat (elems) {
  const readable = new Readable({
    read (a) { }
  })

  const recur = ([head, ...rest]) => {
    if (isNil(head) && isEmpty(rest)) {
      return readable.push(null)
    }

    if (Array.isArray(head)) { return recur([...head, ...rest]) }

    const stream = castStream(head)

    stream.on('end', () => recur(rest))
    stream.on('data', data => readable.push(data))
  }

  recur(castArray(elems || []))

  return readable
}
