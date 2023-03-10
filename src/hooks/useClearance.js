import { useState, useEffect } from 'react'
import { toaster } from 'evergreen-ui'
import clearanceService from '../apis/clearanceService'

const useClearance = (initialQuery = '') => {
  const [
    getClearances,
    { data = { clearances: [], length: null }, isError, error, isLoading },
  ] = clearanceService.useLazyGetClearancesQuery()

  const [query, setQuery] = useState(initialQuery)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (query.length >= 3) {
      setIsTyping(true)

      let request

      const timeout = setTimeout(async () => {
        setIsTyping(false)
        request = getClearances({ search: query })
        request
          .unwrap()
          .then((payload) => setResultLength(payload.length))
          .catch(() => {})
      }, 500)

      return () => {
        if (request) {
          request.abort()
        }
        clearTimeout(timeout)
      }
    } else {
      setIsTyping(false)
    }
  }, [query])

  useEffect(() => {
    if (isError && error?.['name'] !== 'AbortError') {
      toaster.danger('There was an error querying for clearances.')
    }
  }, [isError, error])

  return {
    clearances: query.length >= 3 ? data.clearances : [],
    clearanceQuery: query,
    setClearanceQuery: setQuery,
    length: data.length,
    isTyping,
    isLoading,
  }
}

export default useClearance
