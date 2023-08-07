import './Resizable.scss'

import type { CSSProperties } from 'react'
import { useRef } from 'react'

import { classnames } from '../utils'

export interface ResizableProps {
  className?: string
  style?: CSSProperties & {
    '--border-size'?: string
  }
  children?: React.ReactNode

  resizable?:
    | boolean
    | [LefAndRight?: boolean, TopAndBottom?: boolean]
    | [Left?: boolean, Right?: boolean, Top?: boolean, Bottom?: boolean]
    | {
      left?: boolean
      right?: boolean
      top?: boolean
      bottom?: boolean
    }
}

function resolveResizable(resizable?: ResizableProps['resizable']): [
  Left?: boolean, Right?: boolean, Top?: boolean, Bottom?: boolean
] {
  if (resizable === undefined) return [true, true, true, true]
  if (resizable === false) return [false, false, false, false]
  if (Array.isArray(resizable)) {
    const [left, right, top, bottom] = resizable
    return [left ?? false, right ?? false, top ?? false, bottom ?? false]
  }
  if (typeof resizable === 'object') {
    const { left, right, top, bottom } = resizable
    return [left ?? false, right ?? false, top ?? false, bottom ?? false]
  }
  return [false, false, false, false]
}

const prefix = 'ppd-resizable'

function mountResize(
  ele: HTMLDivElement
) {
  const gets = {
    get MIN_WIDTH() {
      return getComputedStyle(ele, '')
        .getPropertyValue('min-width')
    },
    get MIN_HEIGHT() {
      return getComputedStyle(ele, '')
        .getPropertyValue('min-height')
    }
  }
  let mPos: number
  let isClick = false

  function resize(isVertical: boolean, e: MouseEvent) {
    const [
      field0,
      field1
    ] = [
      isVertical ? 'y' : 'x',
      isVertical ? 'height' : 'width'
    ] as const
    const d = e[field0] - mPos
    const newVal = (parseInt(getComputedStyle(ele, '')[field1]) + d)

    mPos = e[field0]
    ele.style[field1] = newVal + 'px'
  }
  const registerResizeFuncs = [] as Function[]
  function elMouseDown(e: MouseEvent) {
    const target = e.target as HTMLDivElement
    if (
      target?.classList?.contains(
        `${prefix}-border__left`
      ) ||
      target?.classList?.contains(
        `${prefix}-border__right`
      )
    ) {
      mPos = e.pageX
      if (!isClick) {
        isClick = true
        setTimeout(() => isClick = false, 1000)
      } else {
        ele.style.width = gets.MIN_WIDTH
      }
      document
        .querySelectorAll('iframe')
        .forEach(e => e.style.pointerEvents = 'none')
      const _resize = resize.bind(null, false)
      registerResizeFuncs.push(_resize)
      document.addEventListener('mousemove', _resize, false)
      ele.style.userSelect = 'none'
    }
    if (
      target?.classList?.contains(
        `${prefix}-border__top`
      ) ||
      target?.classList?.contains(
        `${prefix}-border__bottom`
      )
    ) {
      mPos = e.pageY
      if (!isClick) {
        isClick = true
        setTimeout(() => isClick = false, 1000)
      } else {
        ele.style.height = gets.MIN_HEIGHT
      }
      document
        .querySelectorAll('iframe')
        .forEach(e => e.style.pointerEvents = 'none')
      const _resize = resize.bind(null, true)
      registerResizeFuncs.push(_resize)
      document.addEventListener('mousemove', _resize, false)
      ele.style.userSelect = 'none'
    }
  }
  function onGlobalMouseUp() {
    registerResizeFuncs
      .forEach(f => document.removeEventListener('mousemove', f, false))
    document
      .querySelectorAll('iframe')
      .forEach(e => e.style.pointerEvents = 'auto')
    ele.style.userSelect = 'auto'
  }

  ele.addEventListener('mousedown', elMouseDown, false)
  document.addEventListener('mouseup', onGlobalMouseUp)
  return () => {
    ele.removeEventListener('mousedown', elMouseDown)
    document.removeEventListener('mouseup', onGlobalMouseUp)
  }
}

export function Resizable({
  className,
  style,
  children,
  ...props
}: ResizableProps) {
  const [left, right, top, bottom] = resolveResizable(props.resizable)

  const dispose = useRef<() => void>()
  return <div
    className={classnames(
      prefix, className,
      left && `${prefix}__left`,
      right && `${prefix}__right`,
      top && `${prefix}__top`,
      bottom && `${prefix}__bottom`
    )}
    style={style}
    ref={async ele => {
      if (!ele) {
        dispose.current?.()
        return
      }

      dispose.current = mountResize(ele)
    }}>
    {children}
    {left && <div
      className={`${prefix}-border ${prefix}-border__left`}
    />}
    {right && <div
      className={`${prefix}-border ${prefix}-border__right`}
    />}
    {top && <div
      className={`${prefix}-border ${prefix}-border__top`}
    />}
    {bottom && <div
      className={`${prefix}-border ${prefix}-border__bottom`}
    />}
  </div>
}
