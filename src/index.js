import {
  compose,
  curry,
  flatMap,
  flow,
  inRange,
  memoize,
  random,
  slice,
  sum,
  times,
} from 'lodash/fp'
import setup from './setup'
import render from './render'

const rows = 64
const cols = 64

const updateState = (getVal) => times(r => times(getVal(r), cols), rows)
const gameBoardEl = memoize(() => document.getElementById('game'))

const randomize = () => updateState(r => c => !!random(0, 1))

const subtract = curry((s, m) => m - s)

const findNeighbors = (r, c) => flow(
    slice(r-1, r+2),
    flatMap(slice(c-1, c+2))
  )

const getCellValue = curry((previousState, r, c) => {
  const previousValue = previousState[r][c]

  const neighborTotal = flow(
    findNeighbors(r, c),
    sum,
    subtract(previousValue)
  )(previousState)

  return previousValue ? inRange(2, 4)(neighborTotal) : neighborTotal === 3
})

const nextState = compose(updateState, getCellValue)

const schedule = (newState) => setTimeout(() => run(newState), 0)

const board = setup(gameBoardEl(), rows, cols)

const run = flow(
  render(board, cols),
  nextState,
  schedule
)

const initialState = randomize()

run(initialState)
