import fp from 'lodash/fp'

const createElement = (type) => document.createElement(type)
const appendNew = (parent, type) => parent.appendChild(createElement(type))

const parent = fp.memoize(() => document.getElementById('parent'))

const initialState = []
const rows = 32
const cols = 32

const setup = (parent) => fp.times(() => {
  const row = appendNew(parent, 'tr')
  fp.times(() => appendNew(row, 'td'), cols)
}, rows)

const step = (state) => {

}

setup(parent())
step(initialState)
