import Rx from 'rxjs'
import { indexOf, isEqual } from 'lodash'

const findCoords = el => {
  const parentRow = el.parentNode
  const parentBody = el.parentNode.parentNode
  const y = indexOf(parentRow.children, el)
  const x = indexOf(parentBody.children, parentRow)
  return { y, x }
}

const isTd = target => target.tagName.toLowerCase() === 'td'

const rxEvent = type => Rx.Observable.fromEvent(document, type)

export default () => {
  const mousedown = rxEvent('mousedown')
  const mousemove = rxEvent('mousemove')
  const mouseup = rxEvent('mouseup')
  const click = rxEvent('click').pluck('target')

  const drag = mousedown.flatMap(() =>
    mousemove.takeUntil(mouseup)
  )
    .pluck('target')
    .distinctUntilChanged(isEqual)
    .merge(click)

  return drag
      .filter(isTd)
      .map(findCoords)
      .map(v => ({ value: v, type: 'click' }))
}
