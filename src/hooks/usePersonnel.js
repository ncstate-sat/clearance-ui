import { useEffect, useState } from 'react'
import clearanceService from '../apis/clearanceService'

const usePersonnel = (initialQuery = '') => {
  const [getPersonnel, { data: personnel = [] }] =
    clearanceService.useLazyGetPersonnelQuery()

  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    if (query.length >= 3) {
      let request

      const timeout = setTimeout(async () => {
        request = getPersonnel({ search: query })
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
    personnel: query.length >= 3 ? personnel : [],
    personnelQuery: query,
    setPersonnelQuery: setQuery,
  }
}

export default usePersonnel
