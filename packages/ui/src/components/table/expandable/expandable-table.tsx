'use client'

import { TData } from '../types'
import { Body } from './body'
import { Header } from './header'
import { Root } from './root'
import { Table } from './table'

export function createExpandableTable<T extends TData>() {
  return {
    Root: Root<T>,
    Table: Table<T>,
    Header: Header<T>,
    Body: Body<T>,
  }
}
