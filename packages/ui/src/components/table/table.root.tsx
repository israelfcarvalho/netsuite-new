'use client'

import { Body } from './body'
import { Header } from './header'
import { Root } from './table'
import { TData } from './table.types'

export function createTable<T extends TData>() {
  return {
    Root: Root<T>,
    Header: Header<T>,
    Body: Body<T>,
  }
}
