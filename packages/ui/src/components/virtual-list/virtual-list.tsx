import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
//TODO: Update react-window to the latest version and remove @types/react-window
import { VariableSizeList as List, VariableSizeListProps } from 'react-window'

import { useWindowResize } from '@workspace/ui/hooks/dom'

//TODO: Create a hook that
/**
 * Get all items
 * Get a ref of the container
 * calculate the height of each item base on width available on the container and
 * save the height of each item in a map indexed by the item id
 * if screen resized check if container changed width
 *      if true - redoo calculations and se a loading state
 */

interface VirtualListProps extends Omit<VariableSizeListProps, 'width' | 'height' | 'itemCount' | 'itemSize'> {
  anchorRef: React.RefObject<HTMLElement>
  allItems: {
    id: string
    content: string
  }[]
  currentItems: {
    id: string
    content: string
  }[]
  extraSpace?: VirtualSizeProviderState['extraSpace']
  filledSpace?: VirtualSizeProviderState['filledSpace']
}

const minItemHeight = 32
const maxheightPix = 224

type VirtualiListContent = 'list' | 'list-placeholder'
export const VirtualList: React.FC<VirtualListProps> = ({
  anchorRef,
  allItems,
  currentItems,
  extraSpace,
  filledSpace,
  ...props
}) => {
  const itemsCountInterval = useRef<ReturnType<typeof setInterval>>(undefined)
  const [itemsCount, setItemsCount] = useState(0)
  const { itemsSize, loading } = useVirtualSize(allItems, anchorRef, { redoOnResize: true, extraSpace, filledSpace })

  const height = useMemo(() => {
    if (itemsSize.size) {
      const height = currentItems.reduce((height, item) => {
        const itemHeight = itemsSize.get(item.id) ?? minItemHeight

        return height + itemHeight
      }, 0)

      return height > maxheightPix ? maxheightPix : height
    }

    return currentItems.length > 6 ? maxheightPix : minItemHeight * currentItems.length
  }, [itemsSize, currentItems])

  const loadingItemsCount = currentItems.length != itemsCount
  const showList = !loading && !!anchorRef.current && !loadingItemsCount
  const content: VirtualiListContent = showList ? 'list' : 'list-placeholder'

  useEffect(() => {
    itemsCountInterval.current = setInterval(() => {
      setItemsCount(currentItems.length)
    }, 300)

    return () => {
      clearInterval(itemsCountInterval.current)
    }
  }, [currentItems])

  const getSize = (index: number) => {
    const itemId = currentItems[index]?.id
    const itemSize = itemId ? itemsSize.get(itemId) : minItemHeight
    return itemSize ? itemSize : minItemHeight
  }

  return (
    <VirtualListProvider loading={!itemsSize.size && loading}>
      {content === 'list' && (
        <List key="list" height={height} itemCount={currentItems.length} itemSize={getSize} width="100%" {...props} />
      )}

      {content === 'list-placeholder' && (
        <List
          key={`loading-list-${currentItems.length}`}
          height={height}
          itemCount={currentItems.length}
          itemSize={getSize}
          width="100%"
          {...props}
        />
      )}

      {/* {content === 'loading-placeholder' && <Skeleton className="w-full" style={{height: maxheightPix}}/>} */}
    </VirtualListProvider>
  )
}

const virtualListContext = createContext({ loading: false })

interface VirtualListProviderProps extends PropsWithChildren {
  loading: boolean
}

export const VirtualListProvider: React.FC<VirtualListProviderProps> = ({ children, loading }) => {
  return <virtualListContext.Provider value={{ loading }}>{children}</virtualListContext.Provider>
}

export const useVirtualList = () => {
  return useContext(virtualListContext)
}

/********************************************************************************************************************************
 *                                                                                                                              *
 *                                   VIRTUAL SIZE HOOK AND PROVIDER                                                             *
 *                                                                                                                              *
 ********************************************************************************************************************************/
interface VirtualSizeProviderState {
  itemsToMeasure: virtualSizeItem[]
  container: RefObject<HTMLElement | null>
  itemsSize: Map<string, number>
  loading: boolean
  extraSpace?: { height: number }
  filledSpace?: { width: number }
  redoOnResize: boolean
}

const SLICE_START = 0
const SLICE_SIZE = 100

export const VirtualSizeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { resizing } = useWindowResize()

  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)
  const containerPlaceholder = useRef<HTMLDivElement>(null)
  const childrenRefs = useRef<Map<string, number>>(new Map())
  const sliceConfig = useRef({ start: SLICE_START, end: SLICE_SIZE })

  const [itemsToMeasure, setItemsToMeasure] = useState<VirtualSizeProviderState['itemsToMeasure']>([])
  const [itemsMeasuring, setItemsMeasuring] = useState<VirtualSizeProviderState['itemsToMeasure']>([])
  const [container, setContainer] = useState<VirtualSizeProviderState['container']>(containerPlaceholder)
  const [itemsSize, setItemsSize] = useState<VirtualSizeProviderState['itemsSize']>(new Map())
  const [extraSpace, setExtraSpace] = useState<VirtualSizeProviderState['extraSpace']>()
  const [filledSpace, setFilledSpace] = useState<VirtualSizeProviderState['filledSpace']>()
  const [redoOnResize, setRedoOnResize] = useState<VirtualSizeProviderState['redoOnResize']>(false)

  const [loading, setLoading] = useState(false)
  const [virtualize, setVirtualize] = useState(false)

  useEffect(() => {
    if (redoOnResize) {
      if (resizing) {
        setLoading(true)
        setItemsSize(new Map())
      } else {
        setItemsToMeasure((old) => [...old])
      }
    }
  }, [redoOnResize, resizing])

  useEffect(() => {
    setItemsSize(new Map())
  }, [itemsToMeasure])

  useEffect(() => {
    if (container.current && itemsToMeasure.length) {
      setLoading(true)
      timeout.current = setTimeout(() => {
        childrenRefs.current.clear()
        setItemsMeasuring([])
        sliceConfig.current = {
          start: SLICE_START,
          end: SLICE_SIZE,
        }
        setVirtualize(true)
      }, 1000)
    }

    return () => {
      clearTimeout(timeout.current)
    }
  }, [container, itemsToMeasure, extraSpace, filledSpace])

  useEffect(() => {
    if (virtualize) {
      const interval = setInterval(() => {
        const enabled = childrenRefs.current.size === sliceConfig.current.start
        if (enabled) {
          const { start, end } = sliceConfig.current
          setItemsMeasuring(itemsToMeasure.slice(start, end))
          sliceConfig.current = {
            start: start + SLICE_SIZE,
            end: end + SLICE_SIZE,
          }
        }
      })

      return () => {
        clearInterval(interval)
      }
    }
  }, [virtualize, itemsToMeasure])

  useEffect(() => {
    if (virtualize) {
      const interval = setInterval(() => {
        if (itemsToMeasure.length === childrenRefs.current.size) {
          setLoading(false)
          setVirtualize(false)
          setItemsSize(childrenRefs.current)
        }
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [virtualize, itemsToMeasure])

  const value = useMemo(() => {
    return {
      setExtraSpace,
      setItemsToMeasure,
      setContainer,
      setFilledSpace,
      setRedoOnResize,
      itemsSize,
      loading,
    }
  }, [setItemsToMeasure, setContainer, setExtraSpace, setFilledSpace, setRedoOnResize, itemsSize, loading])

  const setChildrenRef = (id: string, ref: HTMLElement) => {
    if (!childrenRefs.current.has(id)) {
      childrenRefs.current.set(id, ref.offsetHeight)
    }
  }

  return (
    <virtualSizeContext.Provider value={value}>
      {virtualize && (
        <div aria-hidden className="size-0 overflow-hidden fixed">
          <div
            className="overflow-y-scroll"
            style={{ width: (container.current?.clientWidth ?? 0) - (filledSpace?.width ?? 0) }}
          >
            {itemsMeasuring.map((item) => (
              <div
                className="w-full text-sm"
                ref={(ref) => {
                  if (ref) {
                    setChildrenRef(item.id, ref)
                  }
                }}
                key={item.id}
                data-id={item.id}
                style={{ wordBreak: 'break-word', paddingTop: extraSpace?.height }}
              >
                {item.content}
              </div>
            ))}
          </div>
        </div>
      )}
      {children}
    </virtualSizeContext.Provider>
  )
}

interface virtualSizeItem {
  id: string
  content: string
}

interface VirtualSizeContex {
  loading: VirtualSizeProviderState['loading']
  itemsSize: VirtualSizeProviderState['itemsSize']
  setItemsToMeasure: Dispatch<SetStateAction<VirtualSizeProviderState['itemsToMeasure']>>
  setContainer: Dispatch<SetStateAction<VirtualSizeProviderState['container']>>
  setExtraSpace: Dispatch<SetStateAction<VirtualSizeProviderState['extraSpace']>>
  setFilledSpace: Dispatch<SetStateAction<VirtualSizeProviderState['filledSpace']>>
  setRedoOnResize: Dispatch<SetStateAction<VirtualSizeProviderState['redoOnResize']>>
}

const virtualSizeContext = createContext<VirtualSizeContex | null>(null)

interface UseVirtualizeOptions {
  redoOnResize?: boolean
  extraSpace?: VirtualSizeProviderState['extraSpace']
  filledSpace?: VirtualSizeProviderState['filledSpace']
}

export const useVirtualSize = (
  itemsToMeasure: virtualSizeItem[],
  container: RefObject<HTMLElement>,
  options: UseVirtualizeOptions
) => {
  const { extraSpace, redoOnResize, filledSpace } = options
  const context = useContext(virtualSizeContext)

  if (!context) {
    throw new Error('useVirtualSize should have VirtualSizeProvider wraping it up')
  }

  const { itemsSize, setContainer, setItemsToMeasure, setExtraSpace, setFilledSpace, setRedoOnResize, loading } =
    context

  useEffect(() => {
    setRedoOnResize(!!redoOnResize)
  }, [redoOnResize, setRedoOnResize])

  useEffect(() => {
    setItemsToMeasure(itemsToMeasure)
  }, [itemsToMeasure, setItemsToMeasure])

  useEffect(() => {
    setContainer(container)
  }, [container, setContainer])

  useEffect(() => {
    setExtraSpace(extraSpace)
  }, [extraSpace, setExtraSpace])

  useEffect(() => {
    setFilledSpace(filledSpace)
  }, [filledSpace, setFilledSpace])

  return {
    itemsSize,
    loading,
  }
}
