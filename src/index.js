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

// In terms of module structure I'd prefer to see the code related to
// manipulating board state in one place and not here in the index.
const wrappedIndex = (length, idx) => idx < 0 ? length + idx : (idx >= length ? idx - length : idx)
const wrappedGet = (a, idx) => a[wrappedIndex(a.length, idx)]

// Nit: It wasn't immediately obvious to me what r and c represent. x and y are
// more common, otherwise I'd spell out row and col. Oh, and I still don't know
// what a is. Array? It's a board in some functions and an array in others.
export const get = (a, r, c) => wrappedGet(wrappedGet(a, r), c)

// Nice. One thing that prettier would probably butcher :)
const neighborTotal = (a, r, c) =>
  get(a, r-1, c-1) + get(a, r, c-1) + get(a, r+1, c-1) +
    get(a, r-1, c) + /* skip 0,0 */ get(a, r+1, c) +
    get(a, r-1, c+1) + get(a, r, c+1) + get(a, r+1, c+1)

// I've mentioned it elsewhere, but without typedefs it's hard to know what this
// is. I think that naming these as boolean functions may make it easier to
// understand at first: willLiveNext or something along those lines. That
// doesn't quite capture it since it's about mapping a neighbor count...
const livingCellNextValue = inRange(2, 4)
const deadCellNextValue = eq(3)

export const previousCellState = over([ get, neighborTotal ])
// This would be a good place for pattern matching... if only!
export const nextCellState = ([ wasAlive, totalNeighbors ]) =>
  (wasAlive ? livingCellNextValue : deadCellNextValue)(totalNeighbors)
// I think that in general many of these function names are suffering from a
// lack of verb. Maybe that's more normal in point-free style, but it's
// unsettling to me especially when they're so often used as values.
export const getNextCellState = compose(
  nextCellState,
  previousCellState
)

export const updateGrid = (cols, rows) => getVal => times(r => times(getVal(r), cols), rows)
const updateState = updateGrid(cols, rows)

const randomizeState = () => updateState(r => c => !!random(0, 1))

// Why use get.length here? tbh I don't even know if that's 2 or 3.
const nextState =
  compose(updateState, curry(getNextCellState, get.length))

const eventCoordinatesReached = (r, c, event) => r === event.r && c === event.c

// Clever use of ^, maybe too clever? also, I believe it returns 0 or 1, so if
// you want to maintain bools, you'll need !!.
const toggleCellAt = (state, event) =>
  updateState(r => c => eventCoordinatesReached(r, c, event) ^ state[r][c])

export default () => {
  const ticker = Rx.Observable
    .interval(30)
    .mapTo({ type: 'tick' })

  const render = setupRenderer(document.getElementById('game'), rows, cols)

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
