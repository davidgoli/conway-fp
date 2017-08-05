import {
  compose,
  eq,
  inRange,
  random,
  times,
} from 'lodash/fp'
import { curry, over } from 'lodash'
import Rx from 'rxjs'
import setupRenderer from './setup'
import dragStream from './drag'

const height = 64
const width = 64

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
const wrappedGet = (array, idx) => array[wrappedIndex(array.length, idx)]

export const get = (state, y, x) => wrappedGet(wrappedGet(state, y), x)

const neighborTotal = (a, y, x) =>
  get(a, y-1, x-1) + get(a, y, x-1) + get(a, y+1, x-1) +
    get(a, y-1, x) + /* skip 0,0 */ get(a, y+1, x) +
    get(a, y-1, x+1) + get(a, y, x+1) + get(a, y+1, x+1)

const livingCellNextValue = inRange(2, 4)
const deadCellNextValue = eq(3)

export const previousCellState = over([ get, neighborTotal ])
export const nextCellState = ([ wasAlive, totalNeighbors ]) =>
  (wasAlive ? livingCellNextValue : deadCellNextValue)(totalNeighbors)
export const getNextCellState = compose(
  nextCellState,
  previousCellState
)

export const updateGrid = (width, height) => getVal => times(y => times(getVal(y), width), height)
const updateState = updateGrid(width, height)

const randomizeState = () => updateState(y => x => !!random(0, 1))

const nextState =
  compose(updateState, curry(getNextCellState, get.length))

const eventCoordinatesReached = (y, x, event) => y === event.y && x === event.x

const toggleCellAt = (state, event) =>
  updateState(y => x => eventCoordinatesReached(y, x, event) ^ state[y][x])

export default () => {
  const ticker = Rx.Observable
    .interval(30)
    .mapTo({ type: 'tick' })

  const render = setupRenderer(document.getElementById('game'), height, width)

  return dragStream()
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
}
