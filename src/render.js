import curry from 'lodash/fp/curry'
import visit from './visit'

const cell = (board, r, c) => board.children[0].children[r].children[c]
const toggleCell = (cell, v) => cell.className = v ? 'on' : ''

const updateCell = curry((board, r, c, v) => toggleCell(cell(board, r, c), v))

export default curry((board, cols, state) => {
  visit(state, cols, updateCell(board))
  return state
})
