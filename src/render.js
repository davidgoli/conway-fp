import {
  compose,
  curry,
  each,
  flatten,
} from 'lodash/fp'

const cell = (board, r, c) => board.children[0].children[r].children[c]
const toggleCell = (cell, v) => cell.className = v ? 'on' : ''

const updateCell = curry((board, r, c, v) => toggleCell(cell(board, r, c), v))

// lodash/fp "caps" iteratee methods at 1 arg unless this is turned off
const eachWithI = each.convert({ cap: false })

const visit = (cols, iter) => compose(
  eachWithI((cell, i) => {
    const col = Math.floor(i / cols)
    const row = i % cols
    iter(row, col, cell)
  }),
  flatten
)

export default (board, cols) => visit(cols, updateCell(board))
