import curry from 'lodash/fp/curry'
import visit from './visit'
import flatten from 'lodash/flatten'

const cell = (board, r, c) => board.children[0].children[r].children[c]
const toggleCell = (cell, v) => cell.className = v ? 'on' : ''

const updateCell = curry((board, r, c, v) => toggleCell(cell(board, r, c), v))

export default curry((board, cols, state) => {
  const flatState = flatten(state)
  visit(flatState, cols, updateCell(board))
  return state
})
