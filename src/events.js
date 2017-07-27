import { each, indexOf } from 'lodash'

const addEvents = (el, events) => each(events, (handler, event) => el.addEventListener(event, handler))

const findCoords = el => {
  const parentRow = el.parentNode
  const parentBody = el.parentNode.parentNode
  const c = indexOf(parentRow.children, el)
  const r = indexOf(parentBody.children, parentRow)
  return { r, c }
}

export default listener => {
  let mouseDown = false
  const elClicked = (e) => {
    const { target } = e
    if (e.target.nodeName.toLowerCase() != 'td') return

    listener(findCoords(target))
  }

  addEvents(document.body, {
    click: elClicked,

    mousedown(e) {
      mouseDown = true
    },

    mouseup(e) {
      mouseDown = false
    },

    mousemove(e) {
      if (mouseDown) {
        elClicked(e)
      }
    },
  })
}
