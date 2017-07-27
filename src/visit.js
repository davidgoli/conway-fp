import each from 'lodash/each'
import flatten from 'lodash/flatten'

export default (state, cols, iter) => each(flatten(state), (cell, i) => {
  const col = Math.floor(i / cols)
  const row = i % cols
  iter(row, col, cell)
})
