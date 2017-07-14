import fp from 'lodash/fp'
import each from 'lodash/each'

const cell = (board, r, c) => board.children[0].children[r].children[c]
const toggleCell = (cell, v) => cell.className = v ? 'on' : ''

const updateCell = (board, r, c, v) => toggleCell(cell(board, r, c), v)

export default fp.curry((board, state) => {
  each(state, (row, r) => {
    each(row, (v, c) => updateCell(board, r, c, v))
  })
  return state
})
