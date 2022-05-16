import { cellCoards } from '@/types/common'

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
