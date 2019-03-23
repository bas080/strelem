const { Readable } = require('stream')
const assert = require('assert')
const escape = require('escape-html')
const { isNil, isEmpty } = require('ramda')
const concat = require('./stream-concat')

const attributesToString = attrs =>
  Object.keys(attrs)
    .reduce((acc, key) => {
      const value = attrs[key]

      if (value === false)
        return acc

      return `${acc} ${escape(key)}="${value}"`
    }, '').trim()

module.exports = function tag (tag, closeTag) {
  assert.ok(tag, `Please define a tag: elem(tag)`)

  const open = attrs => isEmpty(attrs)
    ? `<${tag}>`
    : `<${tag} ${attributesToString(attrs)}>`
  const close = isNil(closeTag) ? `</${tag}>` : closeTag

  return function render (elems = [], attrs = {}) {
    const readable = new Readable({
      read () { }
    })

    readable.push(open(attrs))

    const inner = concat(elems)

    inner.on('data', data => readable.push(data))
    inner.on('end', () => {
      readable.push(close)
      readable.push(null)
    })

    return readable
  }
}
