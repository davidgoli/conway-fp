import {
  curry,
  map,
  tap,
  times,
} from 'lodash/fp'
import render from './render'

const createElement = type => document.createElement(type)

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

export default (parent, rows, cols) => render(appendChild(parent, table(rows, cols)), cols)
