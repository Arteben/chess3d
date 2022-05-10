
import * as THREE from 'three'
import { Piece } from '@/utils/piece'
export interface pos2d {
  x: number
  y: number
}

export interface pos3d {
  x: number
  y: number
  z: number
}

export interface fieldCellType {
  center: pos3d
  select: THREE.Mesh
  piece?: Piece

}
export interface verticalRow {
  [index: number]: fieldCellType
}
export interface fieldCellsType {
  [index: string]: verticalRow
}

export interface BoardSizesType {
  prWidth: number
  prBegin: number
  prEnd: number
  beginField: pos2d
  endField: pos2d
  height: number
  horsLine: string[]
  cellCountLine: number
}

export interface cellCoards {
  i: string
  j: number
}