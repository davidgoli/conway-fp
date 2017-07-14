import fp from 'lodash/fp'

const createElement = (type) => document.createElement(type)

const appendChild = fp.curry((el, child) => fp.tap(() => el.appendChild(child), el))

const createElements = fp.curry((type, children) => fp.tap(el =>
  fp.map(appendChild(el))(children)
)(createElement(type)))

const tbody = createElements('tbody')
const tr = createElements('tr')
const td = createElements('td')

const table = (rows, cols) => tbody(
  fp.times(() => tr(
    fp.times(() => td([]), cols)
  ), rows)
)

export default (parent, rows, cols) => appendChild(parent, table(rows, cols))
