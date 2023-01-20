import {
  Button,
  FilePicker,
  Heading,
  InlineAlert,
  majorScale,
  minorScale,
  Pane,
  Select,
  Spinner,
  Table,
  Text,
  toaster,
  Tooltip,
} from 'evergreen-ui'
import { useCallback, useState } from 'react'
import ContentCard from '../../components/ContentCard'
import Layout from '../../components/document/Layout'
import Pagination from '../../components/Pagination'

export default function UploadCsv() {
  const [isLoading, setIsLoading] = useState(undefined)
  const [csvFile, setCsvFile] = useState()
  const [page, setPage] = useState(1)
  const [students, setStudents] = useState([])
  const [locations, setLocations] = useState([])

  const onFileChange = useCallback(
    (e) => {
      setCsvFile(e[0])
    },
    [setCsvFile]
  )

  const onFormSubmit = useCallback(
    (e) => {
      e.preventDefault()
      setIsLoading(true)

      // ClearanceService.uploadCsvClearancesUploadCsvPost({
      //   file: csvFile,
      // })
      //   .then((resp) => {
      //     if ('locations' in resp) {
      //       setLocations(resp.locations)
      //     }

      //     if ('students' in resp) {
      //       setStudents(resp.students)
      //     }

      //     toaster.success('File uploaded successfully')
      //   })
      //   .catch((e) => {
      //     toaster.danger(`Error: ${e.message}`)
      //   })
      //   .finally(() => setIsLoading(false))
    },
    [students, locations, csvFile]
  )

  return (
    <Layout title='Upload CSV'>
      <Heading size={800}>Upload CSV</Heading>
      <Text>Automatically update clearances from a CSV</Text>
      <ContentCard>
        <form onSubmit={onFormSubmit}>
          <FilePicker
            onChange={onFileChange}
            placeholder='Select a CSV file...'
            accept='.csv'
            name='file'
          />

          <Pane display='flex' paddingTop={majorScale(2)}>
            <Tooltip
              content='Choose a file first'
              isShown={csvFile ? false : undefined}
            >
              <div>
                <Button
                  type='submit'
                  appearance='primary'
                  isLoading={isLoading}
                  disabled={!csvFile}
                >
                  Submit
                </Button>
              </div>
            </Tooltip>
          </Pane>
        </form>
      </ContentCard>
      <Pane marginY={majorScale(4)}>
        <>
          <Pane marginBottom={minorScale(4)} textAlign='right'>
            <Text size={400} marginRight={minorScale(3)}>
              Show
            </Text>
            <Select>
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </Select>
          </Pane>
          <Table>
            <Table.Head>
              <Table.TextHeaderCell>Name</Table.TextHeaderCell>
              <Table.TextHeaderCell>ID #</Table.TextHeaderCell>
              <Table.TextHeaderCell>Location</Table.TextHeaderCell>
              <Table.TextHeaderCell>Clearance</Table.TextHeaderCell>
            </Table.Head>
            <Table.Body>
              {Object.keys(students).length > 0 ? (
                Object.keys(students).map((studentNum) => {
                  const { name, location } = students[studentNum]

                  return (
                    <Table.Row key={studentNum}>
                      <Table.TextCell>{name}</Table.TextCell>
                      <Table.TextCell isNumber>{studentNum}</Table.TextCell>
                      <Table.TextCell>{location}</Table.TextCell>
                      <Table.TextCell>
                        <Select>
                          {location in locations ? (
                            locations[location].map((suggestedClearance) => (
                              <option
                                key={suggestedClearance.clearance_guid}
                                value={suggestedClearance.clearance_guid}
                              >
                                {suggestedClearance.clearance_name}
                              </option>
                            ))
                          ) : (
                            <option value='N/A'>N/A</option>
                          )}
                        </Select>
                      </Table.TextCell>
                    </Table.Row>
                  )
                })
              ) : (
                <Pane className='center' padding={minorScale(6)}>
                  {isLoading ? (
                    <Spinner size={majorScale(4)} marginX='auto' />
                  ) : (
                    <Text>No data available</Text>
                  )}
                </Pane>
              )}
            </Table.Body>
          </Table>
          <Pagination
            float='right'
            page={page}
            totalPages={4}
            onPageChange={setPage}
            onNextPage={() => setPage(page + 1)}
            onPreviousPage={() => setPage(page - 1)}
          />
        </>
      </Pane>
    </Layout>
  )
}

UploadCsv.auth = true
