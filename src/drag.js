import Rx from 'rxjs'
import { each, indexOf } from 'lodash'

const findCoords = el => {
  const parentRow = el.parentNode
  const parentBody = el.parentNode.parentNode
  const r = indexOf(parentRow.children, el)
  const c = indexOf(parentBody.children, parentRow)
  return { r, c }
}

const isTd = target => target.tagName.toLowerCase() === 'td'

export default () => {
  const mousedown = Rx.Observable.fromEvent(document, 'mousedown')
  const mousemove = Rx.Observable.fromEvent(document, 'mousemove')
  const mouseup = Rx.Observable.fromEvent(document, 'mouseup')
  const click = Rx.Observable.fromEvent(document, 'click')

  const drag = mousedown.flatMap(() =>
    mousemove.takeUntil(mouseup)
  )
    .distinctUntilChanged((a, b) => a.target === b.target)
    .merge(click)

  return drag
      .pluck('target')
      .filter(isTd)
      .map(findCoords)
      .map(v => ({ value: v, type: 'click' }))
}
