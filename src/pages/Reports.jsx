import { useEffect, useState, memo } from 'react'
import {
  Pane,
  Heading,
  Text,
  Group,
  Button,
  DownloadIcon,
  Tooltip,
  Table,
  IconButton,
  HelpIcon,
  Spinner,
  Position,
  minorScale,
  toaster,
} from 'evergreen-ui'
import styled from 'styled-components'
import clearanceService from '../apis/clearanceService'
import ContentCard from '../components/ContentCard'
import PeoplePicker from '../components/PeoplePicker'
import DoorPicker from '../components/DoorPicker'
import Timeframe from '../components/Timeframe'
import Pagination from '../components/Pagination'
import openInNewTab from '../utils/openInNewTab'

const REPORT_TYPES = ['Door Clearances', 'People Clearances', 'Transactions']

const TableSectionHeader = styled(Pane)`
  background-color: #f9fafc;
  border-color: #e6e8f0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 12px;
  width: 100%;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: #696f8c;
`

const FeatureNotImplemented = () => (
  <Pane textAlign='center' paddingTop='40px'>
    <Text fontSize={minorScale(4)} fontWeight='700'>
      This feature is not yet implemented.
    </Text>
  </Pane>
)

const TransactionTable = () => {
  const [selectedPersonnel, setSelectedPersonnel] = useState(null)
  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState()
  const [notAvailable, setNotAvailable] = useState(false)

  const { data, error, isError, isLoading } =
    clearanceService.useGetReportsByTransactionsQuery({
      from_time: startTime?.toISOString(),
      to_time: endTime?.toISOString(),
      assignee_name: selectedPersonnel
        ? `${selectedPersonnel['raw']['first_name']} ${selectedPersonnel['raw']['last_name']}`
        : undefined,
    })

  useEffect(() => {
    if (isError && (typeof error === 'object' || error !== 'Not Found')) {
      const defaultMessage = 'There was an error querying transaction reports.'
      if (typeof error === 'object') {
        toaster.danger(defaultMessage)
      } else {
        toaster.danger(error ?? defaultMessage)
      }
    } else if (isError && error === 'Not Found') {
      setNotAvailable(true)
    }
  }, [error, isError])

  if (isLoading)
    return (
      <Pane>
        <Spinner margin='auto' />
      </Pane>
    )
  if (notAvailable) return <FeatureNotImplemented />

  return (
    <>
      <PeoplePicker
        header='Filter by Person'
        selectedPersonnel={selectedPersonnel}
        setSelectedPersonnel={setSelectedPersonnel}
      />
      <ContentCard header='Filter by Timeframe'>
        <Timeframe
          startDateTime={startTime}
          endDateTime={endTime}
          onChangeStartTime={setStartTime}
          onChangeEndTime={setEndTime}
        />
      </ContentCard>
      <Table marginTop='2rem'>
        <Table.Head>
          <Table.TextHeaderCell>Date</Table.TextHeaderCell>
          <Table.TextHeaderCell>Door Name</Table.TextHeaderCell>
          <Table.TextHeaderCell>Name</Table.TextHeaderCell>
          <Table.TextHeaderCell>Campus ID</Table.TextHeaderCell>
          <Table.TextHeaderCell>State Code</Table.TextHeaderCell>
        </Table.Head>
        <Table.Body>
          {data &&
            data.map((d) => (
              <Table.Row>
                <Table.TextCell>
                  {d.date ? d.date.toLocaleString() : ''}
                </Table.TextCell>
                <Table.TextCell>{d.door_name || ''}</Table.TextCell>
                <Table.TextCell>{d.name || ''}</Table.TextCell>
                <Table.TextCell>{d.campus_id || ''}</Table.TextCell>
                <Table.TextCell>{d.state_code || ''}</Table.TextCell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </>
  )
}

const PeopleTable = () => {
  const CLEARANCES_LIMIT = 10
  const ASSIGNEE_LIMIT = 50
  const [page, setPage] = useState(0)
  const [assigneePage, setAssigneePage] = useState(0)
  const [assigneeCount, setAssigneeCount] = useState()
  const [selectedClearanceId, setSelectedClearanceId] = useState()
  const [selectedPersonnel, setSelectedPersonnel] = useState(null)
  const [notAvailable, setNotAvailable] = useState(false)

  const { data, error, isError, isLoading } =
    clearanceService.useGetReportsByPersonsQuery({
      assignee_name: selectedPersonnel
        ? `${selectedPersonnel['raw']['first_name']} ${selectedPersonnel['raw']['last_name']}`
        : undefined,
      clearances_limit: CLEARANCES_LIMIT,
      clearances_skip: page * CLEARANCES_LIMIT,
      clearance_id: selectedClearanceId,
      assignees_page: selectedClearanceId ? assigneePage + 1 : undefined,
      assignees_page_size: selectedClearanceId ? ASSIGNEE_LIMIT : undefined,
    })

  useEffect(() => {
    if (isError && (typeof error === 'object' || error !== 'Not Found')) {
      const defaultMessage = 'There was an error querying person reports.'
      if (typeof error === 'object') {
        toaster.danger(defaultMessage)
      } else {
        toaster.danger(error ?? defaultMessage)
      }
    } else if (isError && error === 'Not Found') {
      setNotAvailable(true)
    }
  }, [error, isError])

  if (isLoading)
    return (
      <Pane>
        <Spinner margin='auto' />
      </Pane>
    )
  if (notAvailable) return <FeatureNotImplemented />

  return (
    <>
      <PeoplePicker
        header='Filter by Person'
        selectedPersonnel={selectedPersonnel}
        setSelectedPersonnel={setSelectedPersonnel}
      />
      <Table marginTop='2rem'>
        <Table.Head>
          <Table.TextHeaderCell>First Name</Table.TextHeaderCell>
          <Table.TextHeaderCell>Last Name</Table.TextHeaderCell>
          <Table.TextHeaderCell>Campus ID</Table.TextHeaderCell>
          <Table.TextHeaderCell>Department</Table.TextHeaderCell>
          <Table.TextHeaderCell>Status</Table.TextHeaderCell>
        </Table.Head>
        <Table.Body>
          {Object.keys(data?.['clearances'] || []).map((key) => (
            <>
              <Table.Row height={'2.5rem'} key={key}>
                <TableSectionHeader>
                  <Pane
                    display='flex'
                    flexDirection='row'
                    justifyContent='space-between'
                    alignItems='center'
                    width='100%'
                  >
                    {key}
                    <Button
                      appearance='minimal'
                      disabled={isLoading}
                      onClick={() => {
                        if (selectedClearanceId) {
                          setAssigneeCount()
                          setSelectedClearanceId()
                        } else {
                          setAssigneeCount(
                            data?.['clearances'][key]['assignee_count']
                          )
                          setSelectedClearanceId(
                            data?.['clearances'][key]['clearance_id']
                          )
                        }
                      }}
                    >
                      {selectedClearanceId ? 'Collapse' : 'Expand'}
                    </Button>
                  </Pane>
                </TableSectionHeader>
              </Table.Row>
              {data?.['clearances']?.[key].assignees.map((person) => {
                return (
                  <Table.Row key={person['campus_id'] || ''}>
                    <Table.TextCell>{person['first'] || ''}</Table.TextCell>
                    <Table.TextCell>{person['last'] || ''}</Table.TextCell>
                    <Table.TextCell>{person['campus_id'] || ''}</Table.TextCell>
                    <Table.TextCell>
                      {person['department'] || ''}
                    </Table.TextCell>
                    <Table.TextCell>{person['status'] || ''}</Table.TextCell>
                  </Table.Row>
                )
              })}
            </>
          ))}
        </Table.Body>
      </Table>
      <Pane
        justifyContent='flex-end'
        display='flex'
        alignItems='center'
        gap={minorScale(3)}
      >
        {selectedClearanceId ? (
          <>
            <Text color='muted'>Assignees Page {assigneePage + 1}</Text>
            <Pagination
              page={assigneePage + 1}
              totalPages={Math.ceil(assigneeCount / ASSIGNEE_LIMIT)}
              onNextPage={() =>
                setAssigneePage((currentPage) => currentPage + 1)
              }
              onPreviousPage={() =>
                setAssigneePage((currentPage) => currentPage - 1)
              }
              onPageChange={(p) => setAssigneePage(p - 1)}
            />
          </>
        ) : (
          <>
            <Text color='muted'>Page {page + 1}</Text>
            <Pagination
              page={page + 1}
              totalPages={Math.ceil(
                data?.['total_clearances'] / CLEARANCES_LIMIT
              )}
              onNextPage={() => setPage((currentPage) => currentPage + 1)}
              onPreviousPage={() => setPage((currentPage) => currentPage - 1)}
              onPageChange={(p) => setPage(p - 1)}
            />
          </>
        )}
      </Pane>
    </>
  )
}

const DoorTable = () => {
  const CLEARANCES_LIMIT = 10
  const DOOR_LIMIT = 50
  const [page, setPage] = useState(0)
  const [doorPage, setDoorPage] = useState(0)
  const [doorCount, setDoorCount] = useState()
  const [selectedClearanceId, setSelectedClearanceId] = useState()
  const [selectedDoors, setSelectedDoors] = useState([])
  const [notAvailable, setNotAvailable] = useState(false)

  const { data, error, isError, isLoading } =
    clearanceService.useGetReportsByDoorsQuery({
      clearances_limit: CLEARANCES_LIMIT,
      clearances_skip: page * CLEARANCES_LIMIT,
      clearance_id: selectedClearanceId,
      doors_page: selectedClearanceId ? doorPage + 1 : undefined,
      doors_page_size: selectedClearanceId ? DOOR_LIMIT : undefined,
    })

  useEffect(() => {
    if (isError && (typeof error === 'object' || error !== 'Not Found')) {
      const defaultMessage = 'There was an error querying door reports.'
      if (typeof error === 'object') {
        toaster.danger(defaultMessage)
      } else {
        toaster.danger(error ?? defaultMessage)
      }
    } else if (isError && error === 'Not Found') {
      setNotAvailable(true)
    }
  }, [error, isError])

  if (isLoading)
    return (
      <Pane>
        <Spinner margin='auto' />
      </Pane>
    )
  if (notAvailable) return <FeatureNotImplemented />

  return (
    <>
      <DoorPicker
        header='Filter by Door'
        selectedDoors={selectedDoors}
        setSelectedDoors={setSelectedDoors}
      />
      <Table marginTop='2rem'>
        <Table.Head>
          <Table.TextHeaderCell>Door Name</Table.TextHeaderCell>
          <Table.TextHeaderCell>Type</Table.TextHeaderCell>
          <Table.TextHeaderCell>Schedule</Table.TextHeaderCell>
        </Table.Head>
        <Table.Body>
          {Object.keys(data?.['clearances'] || []).map((key) => (
            <>
              <Table.Row height={'2.5rem'} key={key}>
                <TableSectionHeader>
                  <Pane
                    display='flex'
                    flexDirection='row'
                    justifyContent='space-between'
                    alignItems='center'
                    width='100%'
                  >
                    {key}
                    <Button
                      appearance='minimal'
                      disabled={isLoading}
                      onClick={() => {
                        if (selectedClearanceId) {
                          setDoorCount()
                          setSelectedClearanceId()
                        } else {
                          setDoorCount(data?.['clearances'][key]['door_count'])
                          setSelectedClearanceId(
                            data?.['clearances'][key]['clearance_id']
                          )
                        }
                      }}
                    >
                      {selectedClearanceId ? 'Collapse' : 'Expand'}
                    </Button>
                  </Pane>
                </TableSectionHeader>
              </Table.Row>
              {data?.['clearances']?.[key].doors.map((door) => {
                return (
                  <Table.Row>
                    <Table.TextCell>{door['name'] || ''}</Table.TextCell>
                    <Table.TextCell>
                      {door['is_elevator'] ? 'Elevator' : 'Door'}
                    </Table.TextCell>
                    <Table.TextCell>
                      {door['schedule_name'] || ''}
                    </Table.TextCell>
                  </Table.Row>
                )
              })}
            </>
          ))}
        </Table.Body>
      </Table>
      <Pane
        justifyContent='flex-end'
        display='flex'
        alignItems='center'
        gap={minorScale(3)}
      >
        {selectedClearanceId ? (
          <>
            <Text color='muted'>Doors Page {doorPage + 1}</Text>
            <Pagination
              page={doorPage + 1}
              totalPages={Math.ceil(doorCount / DOOR_LIMIT)}
              onNextPage={() => setDoorPage((currentPage) => currentPage + 1)}
              onPreviousPage={() =>
                setDoorPage((currentPage) => currentPage - 1)
              }
              onPageChange={(p) => setDoorPage(p - 1)}
            />
          </>
        ) : (
          <>
            <Text color='muted'>Page {page + 1}</Text>
            <Pagination
              page={page + 1}
              totalPages={Math.ceil(
                data?.['total_clearances'] / CLEARANCES_LIMIT
              )}
              onNextPage={() => setPage((currentPage) => currentPage + 1)}
              onPreviousPage={() => setPage((currentPage) => currentPage - 1)}
              onPageChange={(p) => setPage(p - 1)}
            />
          </>
        )}
      </Pane>
    </>
  )
}

export default function Reports() {
  // Current location in the section
  const [reportType, setReportType] = useState(REPORT_TYPES[0])

  const [getReports] = clearanceService.useLazyGetReportsByUserQuery()

  const downloadLiaisonAssignmentsReportHandler = async () => {
    try {
      const payload = await getReports().unwrap()

      const blob = new Blob([payload], { type: 'text/csv' })
      const a = document.createElement('a')
      a.href = window.URL.createObjectURL(blob)
      a.setAttribute('download', 'liaison-assignments.csv')
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (error) {
      toaster.danger(error ?? 'There was an error downloading the file.')
    }
  }

  return (
    <>
      <Pane marginBottom='2rem'>
        <Heading size={800}>
          Reports
          <Tooltip
            content='Click to view a guide on viewing reports.'
            position={Position.RIGHT}
          >
            <IconButton
              size='small'
              appearance='none'
              icon={HelpIcon}
              test-id='help-button-page'
              onClick={() =>
                openInNewTab(
                  'https://ncstate-sat.github.io/clearance-service/#admin-manage-users'
                )
              }
            />
          </Tooltip>
        </Heading>
        <Text>View who has clearances and who uses them.</Text>
      </Pane>
      <Pane display='flex' flexDirection='row' justifyContent='space-between'>
        <Group>
          {REPORT_TYPES.map((t) => (
            <Button
              onClick={() => setReportType(t)}
              isActive={reportType === t}
              test-id={`${t.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {t}
            </Button>
          ))}
        </Group>
        <Button
          iconAfter={DownloadIcon}
          onClick={downloadLiaisonAssignmentsReportHandler}
          test-id='liaison-assignments-download-btn'
        >
          Liaison Assignments
        </Button>
      </Pane>
      {reportType === REPORT_TYPES[0] && <DoorTable />}
      {reportType === REPORT_TYPES[1] && <PeopleTable />}
      {reportType === REPORT_TYPES[2] && <TransactionTable />}
    </>
  )
}
