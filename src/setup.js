import {
  curry,
  map,
  tap,
  times,
} from 'lodash/fp'

const createElement = (type) => document.createElement(type)

const appendChild = curry((el, child) => tap(() => el.appendChild(child), el))

const createElements = curry((type, children) => tap(el =>
  map(appendChild(el))(children)
)(createElement(type)))

const tbody = createElements('tbody')
const tr = createElements('tr')
const td = createElements('td')

const table = (rows, cols) => tbody(
  times(() => tr(
    times(() => td([]), cols)
  ), rows)
)

export default (parent, rows, cols) => appendChild(parent, table(rows, cols))
