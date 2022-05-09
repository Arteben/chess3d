

export interface pos2d {
  x: number
  y: number
}

export interface pos3d {
  x: number
  y: number
  z: number
}

export interface verticalRow {
  [index: number]: pos3d
}
export interface BoardCellSizes {
  [index: string]: verticalRow
}

export interface BoardSizes {
  prWidth: number
  prBegin: number
  prEnd: number
  beginField: pos2d
  endField: pos2d
  height: number
  horsLine: string[]
  cellCountLine: number
}
