'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { environments } from '@/lib/environments'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.push(environments.path_home)
  }, [router])

  return null
}
