import { useState } from 'react'

// Custom debounce hook
export function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null)

  const debounce = (...args: any[]) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }
    setDebounceTimeout(
      setTimeout(() => {
        callback(...args)
      }, delay)
    )
  }

  return debounce
}
