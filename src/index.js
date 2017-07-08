import fp from 'lodash/fp'
import setup, { render } from './setup'

const rows = 64
const cols = 64

const updateState = (getVal) => fp.times(r => fp.times(getVal(r), cols), rows)
const gameBoardEl = fp.memoize(() => document.getElementById('game'))

const randomize = () => updateState(r => c => !!fp.random(0, 1))

const subtract = fp.curry((s, m) => m - s)

const findNeighbors = (r, c) => fp.flow(
    fp.slice(r-1, r+2),
    fp.flatMap(fp.slice(c-1, c+2))
  )

const getCellValue = fp.curry((previousState, r, c) => {
  const previousValue = previousState[r][c]

  const neighborTotal = fp.flow(
    findNeighbors(r, c),
    fp.sum,
    subtract(previousValue)
  )(previousState)

  return previousValue ? fp.inRange(2, 4)(neighborTotal) : neighborTotal === 3
})

const nextState = fp.compose(updateState, getCellValue)

const schedule = (newState) => setTimeout(() => run(newState), 0)

const board = setup(gameBoardEl(), rows, cols)

const run = fp.flow(
  render(board),
  nextState,
  schedule
)

const initialState = randomize()

run(initialState)
