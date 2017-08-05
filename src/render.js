import {
  compose,
  curry,
  each,
} from 'lodash/fp'

const cell = (board, y, x) => board.children[0].children[y].children[x]
const toggleCell = (cell, v) => cell.className = v ? 'on' : ''

const updateCell = curry((board, y, x, v) => toggleCell(cell(board, y, x), v))

// lodash/fp "caps" iteratee methods at 1 arg unless this is turned off
const eachWithI = each.convert({ cap: false })

const visit = iter => eachWithI((row, y) =>
  eachWithI((cell, x) =>
    iter(y, x, cell)
  )(row)
)

export default compose(visit, updateCell)
