import each from 'lodash/each'

export default (state, cols, iter) => each(state, (cell, i) => {
  const col = Math.floor(i / cols)
  const row = i % cols
  iter(row, col, cell)
})
