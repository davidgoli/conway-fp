import {
  compose,
  curry,
  each,
  flatten,
} from 'lodash/fp'

const cell = (board, y, x) => board.children[0].children[y].children[x]
const toggleCell = (cell, v) => cell.className = v ? 'on' : ''

const updateCell = curry((board, y, x, v) => toggleCell(cell(board, y, x), v))

// lodash/fp "caps" iteratee methods at 1 arg unless this is turned off
const eachWithI = each.convert({ cap: false })

const visit = (width, iter) => compose(
  eachWithI((cell, i) => {
    const x = Math.floor(i / width)
    const y = i % width
    iter(y, x, cell)
  }),
  flatten
)

export default (board, width) => visit(width, updateCell(board))
