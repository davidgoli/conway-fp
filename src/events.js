import Rx from 'rxjs'
import { each, indexOf } from 'lodash'
import { property } from 'lodash/fp'

const findCoords = el => {
  const parentRow = el.parentNode
  const parentBody = el.parentNode.parentNode
  const c = indexOf(parentRow.children, el)
  const r = indexOf(parentBody.children, parentRow)
  return { r, c }
}

const isTd = e => e.target.tagName.toLowerCase() === 'td'

export default listener => {
  const mousedown = Rx.Observable.fromEvent(document, 'mousedown')
  const mousemove = Rx.Observable.fromEvent(document, 'mousemove')
  const mouseup = Rx.Observable.fromEvent(document, 'mouseup')
  const click = Rx.Observable.fromEvent(document, 'click')

  const drag = mousedown.flatMap(() =>
    mousemove.takeUntil(mouseup)
  )

  drag.filter(isTd)
      .map(property('target'))
      .map(findCoords)
      .subscribe((pos) => {
    console.log('pos', pos)
  })
}
