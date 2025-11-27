'use client'

import { useEffect, useState } from 'react'

//TODO: SHOULD ADD THIS UNDER A PROVIDER. To many places using it woul cause multiple listeners with same porpouse problem
export const useWindowResize = () => {
  const [resizing, setResizing] = useState(false)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined

    function onResize() {
      setResizing(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        setResizing(false)
      }, 1000)
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return { resizing }
}
