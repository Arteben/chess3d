
// const menuOptions = ['game', 'settings'] as string[]
const menuOptions = ['game'] as string[]
type menuOptionsType = typeof menuOptions[number]

const games = ['white', 'black'] as string[]
type gameOptionsType = typeof menuOptions[number]

type findElement = menuOptionsType | gameOptionsType | undefined

const getElements = function (_findElement: findElement, _elements: string[]) {
  if (_findElement) {
    return _elements.includes(_findElement) && _findElement || ''
  } else {
    return _elements
  }
}

export const getMainMenuBtns = function (_findElement: menuOptionsType | undefined) {
  return getElements(_findElement, menuOptions)
}

export const getGameTypes = function (_findElement: gameOptionsType | undefined) {
  return getElements(_findElement, games)
}
