import { useState, useEffect } from 'react'
import { toaster } from 'evergreen-ui'
import clearanceService from '../apis/clearanceService'

const useClearance = (initialQuery = '') => {
  const [getClearances, { data: clearances = [], isError }] =
    clearanceService.useLazyGetClearancesQuery()

  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    if (query.length >= 3) {
      let request

      const timeout = setTimeout(async () => {
        request = getClearances({ search: query })
      }, 500)

      return () => {
        if (request) {
          request.abort()
        }
        clearTimeout(timeout)
      }
    }
  }, [query])

  useEffect(() => {
    if (isError) {
      toaster.danger('There was an error querying for clearances.')
    }
  }, [isError])

  return {
    clearances: query.length >= 3 ? clearances : [],
    clearanceQuery: query,
    setClearanceQuery: setQuery,
  }
}

export default useClearance
