import { compose, concat, curry, take, takeRight } from 'lodash/fp'

const ident = (a) => a
const rotateNeg = count => a => concat(takeRight(a.length + count, a), take(-count, a))
const rotatePos = count => a => concat(takeRight(count, a), take(a.length - count, a))

const rotatefn = (count) => {
  if (count === 0) return ident
  if (count < 0) {
    return rotateNeg(count)
  } else {
    return rotatePos(count)
  }
}

export const rotate = curry((count, a) => {
  return rotatefn(count % a.length)(a)
})

export default curry((start, end, a) => compose(
    take(end-start),
    rotate(-start)
  )(a)
)
