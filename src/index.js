import {
  compose,
  curry,
  eq,
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
import subscribe from './events'

const rows = 128
const cols = 128

const wrappedIndex = (length, idx) => idx < 0 ? length + idx : (idx >= length ? idx - length : idx)
const wrappedGet = (a, idx) => a[wrappedIndex(a.length, idx)]

const get = (a, r, c) => wrappedGet(wrappedGet(a, r), c)

const neighborTotal = (a, r, c) =>
  get(a, r-1, c-1) + get(a, r, c-1) + get(a, r+1, c-1) +
    get(a, r-1, c) + get(a, r+1, c) +
    get(a, r-1, c+1) + get(a, r, c+1) + get(a, r+1, c+1)

const livingCellNextValue = inRange(2, 4)
const deadCellNextValue = eq(3)
const nextCellValue = wasAlive => wasAlive ? livingCellNextValue : deadCellNextValue

const getCellValue = curry((previousState, r, c) => {
  const wasAlive = get(previousState, r, c)

  const total = neighborTotal(previousState, r, c)

  return nextCellValue(wasAlive)(total)
})

const updateState = getVal => times(r => times(getVal(r), cols), rows)

const randomize = () => updateState(r => c => !!random(0, 1))

const nextState = compose(updateState, getCellValue)

const schedule = newState => setTimeout(() => run(newState), 30)

const gameBoardEl = memoize(() => document.getElementById('game'))
const board = setup(gameBoardEl(), rows, cols)

subscribe(({ r, c }) => {
  console.log('clicked', r, c)
})

const run = flow(
  render(board, cols),
  nextState,
  schedule
)

const initialState = randomize()

run(initialState)
