import { useEffect, useState } from 'react'
import { toaster } from 'evergreen-ui'
import clearanceService from '../apis/clearanceService'

const usePersonnel = (initialQuery = '') => {
  const [
    getPersonnel,
    {
      data = { personnel: [], length: null },
      isError,
      error,
      isLoading,
      isFetching,
    },
  ] = clearanceService.useLazyGetPersonnelQuery()

  const [query, setQuery] = useState(initialQuery)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (query.length >= 3) {
      setIsTyping(true)

      let request

      const timeout = setTimeout(async () => {
        setIsTyping(false)
        request = getPersonnel({ search: query })
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
      toaster.danger('There was an error querying for personnel.')
    }
  }, [isError, error])

  return {
    personnel: query.length >= 3 ? data.personnel : [],
    personnelQuery: query,
    setPersonnelQuery: setQuery,
    length: data.length,
    isTyping,
    isLoading: isLoading || isFetching,
  }
}

export default usePersonnel
