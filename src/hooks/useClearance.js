import { useState, useEffect } from 'react'
import clearanceService from '../apis/clearanceService'

const useClearance = (initialQuery = '') => {
  const [getClearances, { data: clearances = [] }] =
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

  return {
    clearances: query.length >= 3 ? clearances : [],
    clearanceQuery: query,
    setClearanceQuery: setQuery,
  }
}

export default useClearance
