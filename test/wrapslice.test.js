import wrapslice from '../src/wrapslice'
import { rotate } from '../src/wrapslice'

test('rotate', () => {
  const a = [1,2,3,4]

  expect(rotate(0, a)).toEqual([1,2,3,4])
  expect(rotate(1, a)).toEqual([4,1,2,3])
  expect(rotate(-1, a)).toEqual([2,3,4,1])
  expect(rotate(-2, a)).toEqual([3,4,1,2])
  expect(rotate(2, a)).toEqual([3,4,1,2])
  expect(rotate(4, a)).toEqual([1,2,3,4])
  expect(rotate(8, a)).toEqual([1,2,3,4])
  expect(rotate(-4, a)).toEqual([1,2,3,4])
})

test('wrapslice', () => {
  const a = [1,2,3,4]

  expect(wrapslice(0, 4, a)).toEqual([1,2,3,4])
  expect(wrapslice(-1, 3, a)).toEqual([4,1,2,3])
  expect(wrapslice(-2, 2, a)).toEqual([3,4,1,2])
  expect(wrapslice(-3, 1, a)).toEqual([2,3,4,1])
  expect(wrapslice(-4, 0, a)).toEqual([1,2,3,4])

  expect(wrapslice(0, 3, a)).toEqual([1,2,3])
  expect(wrapslice(-1, 2, a)).toEqual([4,1,2])
  expect(wrapslice(-2, 1, a)).toEqual([3,4,1])

  expect(wrapslice(1, 3, a)).toEqual([2,3])
  expect(wrapslice(-2, 0, a)).toEqual([3,4])
  expect(wrapslice(-3, -1, a)).toEqual([2,3])
  expect(wrapslice(-3, -2, a)).toEqual([2])

  expect(wrapslice(1, 5, a)).toEqual([2,3,4,1])
})
