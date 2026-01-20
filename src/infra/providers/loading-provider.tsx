'use client'

import { Loading } from '@/components/loading'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

interface ILoading {
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

const LoadingContext = createContext<ILoading>({} as ILoading)

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const TIME_OUT = 100

  useEffect(() => {
    if (loading) {
      timeoutRef.current = setTimeout(() => {
        setShowLoading(true)
      }, TIME_OUT)
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setShowLoading(false)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [loading])

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {showLoading && <Loading />}
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => {
  const { setLoading, loading } = useContext(LoadingContext)

  const withLoading = async <T,>(asyncFunction: () => Promise<T>): Promise<T> => {
    setLoading(true)
    try {
      return await asyncFunction()
    } finally {
      setLoading(false)
    }
  }

  return { setLoading: withLoading, loading }
}
