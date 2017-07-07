import fp from 'lodash/fp'
import each from 'lodash/each'
import setup, { updateCell } from './setup'

const rows = 32
const cols = 32

const updateState = (val) => fp.times(r => fp.times(val(r), cols), rows)
const gameBoardEl = fp.memoize(() => document.getElementById('game'))

const board = setup(gameBoardEl(), rows, cols)

const randomize = () => updateState(r => c => !!fp.random(0, 1))

let state = randomize()

const render = (board, state) => {
  each(state, (row, r) => {
    each(row, (v, c) => updateCell(board, r, c, v))
  })
}

render(board, state)
