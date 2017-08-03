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

// Ugh, this bothers me. I get it, but it's annoying. (I've opened an issue
// about this and he closed it, heh)
const eachWithI = each.convert({ cap: false })

// It seems odd to flatten and then reverse engineer row and col. There's
// probably a nested each way of doing this cleanly.
const visit = (cols, iter) => compose(
  eachWithI((cell, i) => {
    const col = Math.floor(i / cols)
    const row = i % cols
    iter(row, col, cell)
  }),
  flatten
)

export default (board, cols) => visit(cols, updateCell(board))
