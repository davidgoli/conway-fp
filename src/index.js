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
import Rx from 'rxjs'
import setup from './setup'
import render from './render'
import drag from './drag'

const rows = 64
const cols = 64

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

const nextState = (state) =>
  compose(updateState, getCellValue)(state)

const board = setup(document.getElementById('game'), rows, cols)

let lastClick = undefined

Rx.Observable
  .interval(30)
  .scan(nextState, randomize())
  .withLatestFrom(drag(), (state, event) => {
    if (event && event !== lastClick) {
      state[event.c][event.r] = !state[event.c][event.r]
      lastClick = event
    }

    return state
  })
  .subscribe(render(board, cols))

