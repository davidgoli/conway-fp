import fp from 'lodash/fp'
import setup, { render } from './setup'

const rows = 32
const cols = 32

const updateState = (getVal) => fp.times(r => fp.times(getVal(r), cols), rows)
const gameBoardEl = fp.memoize(() => document.getElementById('game'))

const board = setup(gameBoardEl(), rows, cols)

const randomize = () => updateState(r => c => !!fp.random(0, 1))

let initialState = randomize()

const add = (a, b) => a + b

const getCellValue = (previousState, r, c) => {
  const previousValue = previousState[r][c]
  const neighborRows = fp.slice(r-1, r+2)(previousState)
  const neighbors = fp.flatMap(fp.slice(c-1, c+2))(neighborRows)
  const neighborTotal = fp.reduce(add, 0)(neighbors) - previousValue
  return previousValue ? fp.inRange(2, 4)(neighborTotal) : neighborTotal === 3
}

const nextState = (previousState) => updateState(r => c => getCellValue(previousState, r, c))

const run = (previousState) => () => {
  const newState = nextState(previousState)
  render(board, newState)
  setTimeout(run(newState), 20)
}

render(board, initialState)

run(initialState)()
