import fp from 'lodash/fp'
import each from 'lodash/each'

const createAndAppendTo = fp.curry((parent, [ childType, children ]) =>
  fp.tap(p => p.appendChild(createElements(childType, children)))(parent)
)

const createElements = (type, children = []) => {
  return fp.tap(el => {
    fp.map(createAndAppendTo(el))(children)
  })(document.createElement(type))
}

const updateCell = (board, r, c, v) => {
  board.children[0].children[r].children[c].className = v ? 'on' : ''
}

export const render = (board, state) => {
  each(state, (row, r) => {
    each(row, (v, c) => updateCell(board, r, c, v))
  })
}

export default (parent, rows, cols) => createAndAppendTo(parent, [
    'tbody',
    fp.times(fp.constant([
      'tr',
      fp.times(fp.constant(['td']), cols)
    ]), rows)
  ]
)
