import { cellCoards, coordsMesh } from '@/types/common'

export const getCoordsStr = (_str: string) => {
  return <cellCoards>{
    i: _str[0],
    j: Number(_str[1]),
  }
}

export const cachingDecoratorSimple = function (func: any) {
  const hash = function (...args: any[]) {
    return String([].join.call(args))
  }

  const cache = new Map()

  return function(...args: any[]) {

    const key = hash(args)
    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = func(...args)

    cache.clear()
    cache.set(key, result)

    return result
  }
}

export const getMeshCoords = (_meshCoords: coordsMesh) => {
    return <cellCoards>{
      i: <string>_meshCoords.iCoord || 'A',
      j: <number>_meshCoords.jCoord || 1,
    }
}

export const getStringFromCoords = (_coords: cellCoards) => {
  return `${_coords.i}${_coords.j}`
}

export const getPointerParams = (_event: MouseEvent,
                                  _el: HTMLElement,
                                  _width: number,
                                  _height: number) => {
  const boundRect = _el.getBoundingClientRect()
  const xParam = ((_event.clientX - boundRect.x) / _width) * 2 - 1
  const yParam = - ((_event.clientY - boundRect.y) / _height) * 2 + 1
  return { x: xParam, y: yParam }
}

export const hasUpperCase = (_str: string) => {
  return String(_str).toUpperCase() == _str
}
