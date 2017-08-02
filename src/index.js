import {
  compose,
  eq,
  inRange,
  random,
  times,
} from 'lodash/fp'
import { curry, over, spread } from 'lodash'
import Rx from 'rxjs'
import setupRenderer from './setup'
import dragStream from './drag'

const rows = 64
const cols = 64

/**************************
 *
 * Each "frame" state of Conway is calculated
 * as a function of the previous state.
 *
 * Each cell exists in a binary state (living or dead).
 * Each cell has 8 neighbors. Its next state depends on:
 *  1. the number of living neighbors
 *  2. whether it was previously living
 *
 * If the cell was living, it remains living if it has 2 or 3 living neighbors.
 * If it was not living, it comes alive if it has exactly 3 living neighbors.
 * Otherwise, the cell dies (whether from starvation or overcrowding.)
 *
 * To avoid dead zones on the periphery, the board wraps around on both axes.
 *
 * The board is initialized to a random state and allowed to play out.
 * Mouse click & drag input from the user toggles cells.
 *
 ***************************
 */

const wrappedIndex = (length, idx) => idx < 0 ? length + idx : (idx >= length ? idx - length : idx)
const wrappedGet = (a, idx) => a[wrappedIndex(a.length, idx)]

const get = (a, r, c) => wrappedGet(wrappedGet(a, r), c)

const neighborTotal = (a, r, c) =>
  get(a, r-1, c-1) + get(a, r, c-1) + get(a, r+1, c-1) +
    get(a, r-1, c) + /* skip 0,0 */ get(a, r+1, c) +
    get(a, r-1, c+1) + get(a, r, c+1) + get(a, r+1, c+1)

const livingCellNextValue = inRange(2, 4)
const deadCellNextValue = eq(3)

const nextCellState = (wasAlive, total) =>
  (wasAlive ? livingCellNextValue : deadCellNextValue)(total)
const previousCellState = over([ get, neighborTotal ])
const getNextCellState = curry((previousBoardState, r, c) => nextCellState(...previousCellState(previousBoardState, r, c)))

const updateState = getVal => times(r => times(getVal(r), cols), rows)

const randomizeState = () => updateState(r => c => !!random(0, 1))

const nextState =
  compose(updateState, getNextCellState)

const eventCoordinatesReached = (r, c, event) => r === event.r && c === event.c

const toggleCellAt = (state, event) =>
  updateState(r => c => eventCoordinatesReached(r, c, event) ^ state[r][c])

const ticker = Rx.Observable
  .interval(30)
  .mapTo({ type: 'tick' })

const render = setupRenderer(document.getElementById('game'), rows, cols)

dragStream()
  .merge(ticker)
  .scan((previousBoardState, event) => {
    switch (event.type) {
      case 'tick':
        return nextState(previousBoardState)
      case 'click':
        return toggleCellAt(previousBoardState, event.value)
    }
  }, randomizeState())
  .subscribe(render)
