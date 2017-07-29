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
import get from './get'

const rows = 64
const cols = 64

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
const dragStream = drag()

const cellForClick = (r, c, event) => r === event.r && c === event.c

const clickOn = (state, event) =>
  updateState(r => c => cellForClick(r, c, event) ^ state[r][c])

const ticker = Rx.Observable
  .interval(30)
  .mapTo({ type: 'tick' })

dragStream
  .merge(ticker)
  .scan((previousState, event) => {
    switch (event.type) {
      case 'tick':
        return nextState(previousState)
      case 'click':
        return clickOn(previousState, event.value)
    }
  }, randomize())
  .subscribe(render(board, cols))
