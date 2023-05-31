import { useState, useEffect } from 'react'
import Papa from 'papaparse'

const useBulkUpload = (initialFile) => {
  const [file, setFile] = useState(initialFile)
  const [data, setData] = useState([])
  const [error, setError] = useState()

  useEffect(() => {
    if (file && file.type === 'text/csv') {
      console.log(file)
      Papa.parse(file, {
        delimiter: ',',
        skipEmptyLines: true,
        header: true,
        comments: '#',
        complete: (results) => {
          setFile()
          if (results?.data?.length > 20) {
            setData([])
            setError('There is a limit of 20 people when uploading via CSV.')
          } else if (results?.data?.length > 0) {
            setData(results.data.map((row) => row['ID']))
            setError()
          } else {
            setData([])
            setError('This file is incompatible.')
          }
        },
        error: () => {
          setData([])
          setError('This file is incompatible.')
        },
      })
    } else if (file) {
      setData([])
      setError('This file is incompatible.')
    } else {
      setData([])
      setError()
    }
  }, [file])

  return {
    setFile,
    data,
    error,
  }
}

export default useBulkUpload
