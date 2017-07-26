import { compose, concat, curry, reverse, take, takeRight } from 'lodash/fp'

const ident = a => a
const slices = count => a => [ count, a.length - count ]

const rotateAbs = ([ right, left ]) => a => concat(takeRight(right, a), take(left, a))
const rotateNeg = count => a => rotateAbs(reverse(slices(-count)(a)))(a)
const rotatePos = count => a => rotateAbs(slices(count)(a))(a)

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
