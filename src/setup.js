import {
  curry,
  map,
  tap,
  times,
} from 'lodash/fp'
import render from './render'

const createElement = type => document.createElement(type)

// It'd be nice to have been able to use something like cycle or react so that
// one doesn't need to think about this functional looking, side effecting, UI
// code. That said, you did a good job of building something that is
// declarative. Perhaps if the actual element functions were in their own module
// and this file was only focused on the actual rendering needed for this app it
// would be easier to digest.
const appendChild = curry((el, child) => tap(() => el.appendChild(child), el))

const appendChildren = el => map(appendChild(el))

const createElements = curry((type, children) => tap(el =>
  appendChildren(el)(children)
)(createElement(type)))

const tbody = createElements('tbody')
const tr = createElements('tr')
const td = createElements('td')

const table = (rows, cols) => tbody(
  times(() => tr(
    times(() => td([]), cols)
  ), rows)
)

// Not having types makes all of this much more difficult to comprehend. I think
// that this style of programming benefits and probably necessitates type
// signatures. I find this hard to follow and I'm somewhat familiar w/ pointfree
// style.
export default (parent, rows, cols) => render(appendChild(parent, table(rows, cols)), cols)
