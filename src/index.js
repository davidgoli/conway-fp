import fp from 'lodash/fp'
import setup, { render } from './setup'

const rows = 32
const cols = 32

const updateState = (getVal) => fp.times(r => fp.times(getVal(r), cols), rows)
const gameBoardEl = fp.memoize(() => document.getElementById('game'))

const board = setup(gameBoardEl(), rows, cols)

const randomize = () => updateState(r => c => !!fp.random(0, 1))

let initialState = randomize()

const add = (a, b) => a + b
const sub = s => m => m - s

const sum = fp.reduce(add, 0)

const findNeighbors = (r, c) => fp.flow(
    fp.slice(r-1, r+2),
    fp.flatMap(fp.slice(c-1, c+2))
  )

const getCellValue = fp.curry((previousState, r, c) => {
  const previousValue = previousState[r][c]

  const neighborTotal = fp.flow(
    findNeighbors(r, c),
    sum,
    sub(previousValue)
  )(previousState)

  return previousValue ? fp.inRange(2, 4)(neighborTotal) : neighborTotal === 3
})

const nextState = (previousState) => updateState(getCellValue(previousState))

const run = (previousState) => () => {
  render(board, previousState)
  const newState = nextState(previousState)
  setTimeout(run(newState), 20)
}

run(initialState)()
