'use client'

import { TData } from '../types'
import { Body } from './body'
import { Header } from './header'
import { Root } from './root'

export function createExpandableTable<T extends TData>() {
  return {
    Root: Root<T>,
    Header: Header<T>,
    Body: Body<T>,
  }
}
