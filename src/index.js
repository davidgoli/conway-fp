import {
  compose,
  eq,
  flatMap,
  flow,
  inRange,
  memoize,
  random,
  rearg,
  sum,
  times,
} from 'lodash/fp'
import { curry, over, spread } from 'lodash'
import Rx from 'rxjs'
import setup from './setup'
import render from './render'
import drag from './drag'
import get from './get'

const rows = 64
const cols = 64

const neighborTotal = (a, r, c) =>
  get(a, r-1, c-1) + get(a, r, c-1) + get(a, r+1, c-1) +
    get(a, r-1, c) + /* skip 0,0 */ get(a, r+1, c) +
    get(a, r-1, c+1) + get(a, r, c+1) + get(a, r+1, c+1)

const livingCellNextValue = inRange(2, 4)
const deadCellNextValue = eq(3)

const nextCellValue = (wasAlive, total) => (wasAlive ? livingCellNextValue : deadCellNextValue)(total)
const cellState = over([ get, neighborTotal ])
const getCellValue = curry((previousState, r, c) => nextCellValue(...cellState(previousState, r, c)))

const updateState = getVal => times(r => times(getVal(r), cols), rows)

const randomize = () => updateState(r => c => !!random(0, 1))

const firstArg = rearg(0)

const nextState =
  firstArg(compose(updateState, getCellValue))

const dragStream = drag()

const cellForClick = (r, c, event) => r === event.r && c === event.c

const clickOn = (state, event) =>
  updateState(r => c => cellForClick(r, c, event) ^ state[r][c])

const ticker = Rx.Observable
  .interval(30)
  .mapTo({ type: 'tick' })

const board = setup(document.getElementById('game'), rows, cols)

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
