import fp from 'lodash/fp'

const createAndAppendTo = fp.curry((parent, [ childType, children ]) =>
  fp.tap(p => p.appendChild(createElements(childType, children)))(parent)
)

const createElements = (type, children = []) => {
  return fp.tap(el => {
    fp.map(createAndAppendTo(el))(children)
  })(document.createElement(type))
}

export const updateCell = (board, r, c, v) => {
  board.children[0].children[r].children[c].className = v ? 'on' : ''
}

export default (parent, rows, cols) => createAndAppendTo(parent, [
    'tbody',
    fp.times(fp.constant([
      'tr',
      fp.times(fp.constant(['td']), cols)
    ]), rows)
  ]
)
