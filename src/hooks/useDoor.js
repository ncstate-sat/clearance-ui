import { useState, useEffect } from 'react'
import { toaster } from 'evergreen-ui'
import clearanceService from '../apis/clearanceService'

const useDoor = (initialQuery = '') => {
  const [
    getDoors,
    {
      data = { doors: [], length: null },
      isError,
      error,
      isLoading,
      isFetching,
    },
  ] = clearanceService.useLazyGetDoorsQuery()

  const [query, setQuery] = useState(initialQuery)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (query.length >= 3) {
      setIsTyping(true)

      let request

      const timeout = setTimeout(async () => {
        setIsTyping(false)
        request = getDoors({ search: query })
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
      toaster.danger(error ?? 'There was an error querying for doors.')
    }
  }, [isError, error])

  return {
    doors: query.length >= 3 ? data.doors : [],
    doorQuery: query,
    setDoorQuery: setQuery,
    length: data.length,
    isTyping,
    isLoading: isLoading || isFetching,
  }
}

export default useDoor
