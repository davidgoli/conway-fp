import {
  get,
  previousCellState,
  getNextCellState,
  nextCellState
} from '../src/game'

test('get', () => {
  const grid = [
    ['a', 'b'],
    ['c', 'd']
  ];
  expect(get(grid, 0, 0)).toEqual('a')
  expect(get(grid, 0, 1)).toEqual('b')
  expect(get(grid, 1, 0)).toEqual('c')
  expect(get(grid, 1, 1)).toEqual('d')
  expect(get(grid, -1, -1)).toEqual('d')
  expect(get(grid, 0, -1)).toEqual('b')
})

test('previousCellState', () => {
  const prevState = [
    [true, false, true],
    [false, true, false],
    [true, false, true],
  ]
  expect(previousCellState(prevState, 1, 1)).toEqual([true, 4])
})

test('nextCellState', () => {
  expect(nextCellState([true, 2])).toEqual(true)
  expect(nextCellState([true, 3])).toEqual(true)
  expect(nextCellState([false, 3])).toEqual(true)
  expect(nextCellState([false, 2])).toEqual(false)
  expect(nextCellState([false, 4])).toEqual(false)
  expect(nextCellState([true, 4])).toEqual(false)
  expect(nextCellState([true, 1])).toEqual(false)
})

test('getNextCellState', () => {
  const prevState = [
    [true, false, true],
    [false, true, false],
    [true, false, true],
  ]
  expect(getNextCellState(prevState, 1, 1)).toEqual(false)

  const prevState2 = [
    [true, false, false],
    [false, false, false],
    [true, false, true],
  ]
  expect(getNextCellState(prevState2, 1, 1)).toEqual(true)
})
