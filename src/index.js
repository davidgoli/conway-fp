import {
  compose,
  curry,
  flatMap,
  flow,
  inRange,
  memoize,
  random,
  sum,
  times,
} from 'lodash/fp'
import setup from './setup'
import render from './render'

const rows = 128
const cols = 128

const wrap = (a, idx) => idx < 0 ? a[a.length + idx] : (idx >= a.length ? a[idx - a.length] : a[idx])

const get = (a, r, c) => wrap(wrap(a, r), c)

const neighborTotal = (a, r, c) =>
  get(a, r-1, c-1) +
    get(a, r, c-1) +
    get(a, r+1, c-1) +
    get(a, r-1, c) +
    get(a, r+1, c) +
    get(a, r-1, c+1) +
    get(a, r, c+1) +
    get(a, r+1, c+1)

const updateState = (getVal) => times(r => times(getVal(r), cols), rows)
const gameBoardEl = memoize(() => document.getElementById('game'))

const randomize = () => updateState(r => c => !!random(0, 1))

const getCellValue = curry((previousState, r, c) => {
  const previousValue = previousState[r][c]

  const total = neighborTotal(previousState, r, c)

  return previousValue ? inRange(2, 4)(total) : total === 3
})

const nextState = compose(updateState, getCellValue)

const schedule = (newState) => setTimeout(() => run(newState), 30)

const board = setup(gameBoardEl(), rows, cols)

const run = flow(
  render(board, cols),
  nextState,
  schedule
)

const initialState = randomize()

run(initialState)
