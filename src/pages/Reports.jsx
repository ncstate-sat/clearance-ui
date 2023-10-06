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
  Position,
  minorScale,
  toaster,
} from 'evergreen-ui'
import styled from 'styled-components'
import clearanceService from '../apis/clearanceService'
import ContentCard from '../components/ContentCard'
import PeoplePicker from '../components/PeoplePicker'
import Timeframe from '../components/Timeframe'
import Pagination from '../components/Pagination'
import openInNewTab from '../utils/openInNewTab'

const REPORT_TYPES = ['Door Clearances', 'People Clearances', 'Transactions']
const PEOPLE_PICKER_FILTER = [REPORT_TYPES[1], REPORT_TYPES[2]]
const TIMEFRAME_FILTER = [REPORT_TYPES[2]]

const TRANSACTIONS_REPORT_DATA = [
  {
    date: new Date('9/13/22 4:59 PM'),
    door_name: 'EB1 - 3058 Lab',
    name: 'Ashley Noelle Simpson',
    campus_id: '200293592',
    state_code: 'Admit',
  },
  {
    date: new Date('9/13/22 4:36 PM'),
    door_name: 'EB1 - 3058 Lab',
    name: 'Joseph B. Tracy',
    campus_id: '0004056039',
    state_code: 'Admit',
  },
  {
    date: new Date('9/13/22 4:59 PM'),
    door_name: 'EB1 - 3058 Lab',
    name: null,
    campus_id: null,
    state_code: 'DoorForced',
  },
]

const DOOR_REPORT_DATA = {
  'VTE-G-NA-TAU Finger Barn Gate 24/7-DEPT': {
    door_count: 3,
    doors: [
      {
        name: 'TSU - 1100 South Corridor 1150',
        is_elevator: false,
        schedule_name: 'Always',
      },
      {
        name: 'TSU - 4221 Copy and Supply Room',
        is_elevator: false,
        schedule_name: 'Always',
      },
      {
        name: 'TSU - Elevator Car Two (2)',
        is_elevator: true,
        schedule_name: 'TSU- 6a-1a Access',
      },
    ],
  },
}

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

const TransactionTable = ({ data }) => (
  <Table marginTop='2rem'>
    <Table.Head>
      <Table.TextHeaderCell>Date</Table.TextHeaderCell>
      <Table.TextHeaderCell>Door Name</Table.TextHeaderCell>
      <Table.TextHeaderCell>Name</Table.TextHeaderCell>
      <Table.TextHeaderCell>Campus ID</Table.TextHeaderCell>
      <Table.TextHeaderCell>State Code</Table.TextHeaderCell>
    </Table.Head>
    <Table.Body>
      {data.map((d) => (
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
)

const PeopleTable = ({ selectedPersonnel }) => {
  const CLEARANCES_LIMIT = 10
  const ASSIGNEE_LIMIT = 50
  const [page, setPage] = useState(0)
  const [assigneePage, setAssigneePage] = useState(0)
  const [assigneeCount, setAssigneeCount] = useState()
  const [selectedClearanceId, setSelectedClearanceId] = useState()

  const { data, error, isError, isLoading } =
    clearanceService.useGetReportsByPersonsQuery({
      assignee_name:
        selectedPersonnel.length > 0
          ? `${selectedPersonnel[0]['first_name']} ${selectedPersonnel[0]['last_name']}`
          : undefined,
      clearances_limit: CLEARANCES_LIMIT,
      clearances_skip: page * CLEARANCES_LIMIT,
      clearance_id: selectedClearanceId,
      assignees_page: selectedClearanceId ? page : undefined,
      assignees_page_size: selectedClearanceId ? ASSIGNEE_LIMIT : undefined,
    })

  useEffect(() => {
    if (isError) {
      toaster.danger(error ?? 'There was an error querying person reports.')
    }
  }, [error, isError])

  return (
    <>
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

const DoorTable = ({ data }) => {
  return (
    <Table marginTop='2rem'>
      <Table.Head>
        <Table.TextHeaderCell>Door Name</Table.TextHeaderCell>
        <Table.TextHeaderCell>Type</Table.TextHeaderCell>
        <Table.TextHeaderCell>Schedule</Table.TextHeaderCell>
      </Table.Head>
      <Table.Body>
        {Object.keys(data).map((key) => (
          <>
            <Table.Row height={'2.5rem'} key={key}>
              <TableSectionHeader>{key}</TableSectionHeader>
            </Table.Row>
            {data[key].doors.map((door) => {
              return (
                <Table.Row>
                  <Table.TextCell>{door['name'] || ''}</Table.TextCell>
                  <Table.TextCell>
                    {door['is_elevator'] ? 'Elevator' : 'Door'}
                  </Table.TextCell>
                  <Table.TextCell>{door['schedule_name'] || ''}</Table.TextCell>
                </Table.Row>
              )
            })}
          </>
        ))}
      </Table.Body>
    </Table>
  )
}

export default function Reports() {
  // Current location in the section
  const [reportType, setReportType] = useState(REPORT_TYPES[0])
  const [activeReports, setActiveReports] = useState([])

  // Filter selections
  const [selectedPersonnel, setSelectedPersonnel] = useState([])
  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState()

  const [getReports] = clearanceService.useLazyGetReportsByUserQuery()
  const {
    data: doorReportData,
    error: doorReportError,
    isSuccess: isDoorReportSuccess,
    isError: isDoorReportError,
    isLoading: isDoorReportLoading,
  } = clearanceService.useGetReportsByDoorsQuery()
  const {
    data: transactionsReportData,
    error: transactionsReportError,
    isSuccess: isTransactionsReportSuccess,
    isError: isTransactionsReportError,
    isLoading: isTransactionsReportLoading,
  } = clearanceService.useGetReportsByTransactionsQuery()

  useEffect(() => {
    const active = [REPORT_TYPES[1]]
    if (isDoorReportSuccess) active.push(REPORT_TYPES[0])
    if (isTransactionsReportSuccess) active.push(REPORT_TYPES[2])

    setActiveReports(active)
  }, [isDoorReportSuccess, isTransactionsReportSuccess])

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
                  'https://pages.github.ncsu.edu/SAT/clearance-service-mirror/#admin-manage-users'
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
      {PEOPLE_PICKER_FILTER.includes(reportType) &&
        activeReports.includes(reportType) && (
          <PeoplePicker
            header='Filter by Person'
            selectedPersonnel={selectedPersonnel}
            setSelectedPersonnel={setSelectedPersonnel}
          />
        )}
      {TIMEFRAME_FILTER.includes(reportType) &&
        activeReports.includes(reportType) && (
          <ContentCard header='Filter by Timeframe'>
            <Timeframe
              startDateTime={startTime}
              endDateTime={endTime}
              onChangeStartTime={setStartTime}
              onChangeEndTime={setEndTime}
            />
          </ContentCard>
        )}
      {reportType === REPORT_TYPES[0] &&
        (activeReports.includes(reportType) ? (
          <DoorTable data={isDoorReportSuccess ? doorReportData : {}} />
        ) : (
          <FeatureNotImplemented />
        ))}
      {reportType === REPORT_TYPES[1] &&
        (activeReports.includes(reportType) ? (
          <PeopleTable selectedPersonnel={selectedPersonnel} />
        ) : (
          <FeatureNotImplemented />
        ))}
      {reportType === REPORT_TYPES[2] &&
        (activeReports.includes(reportType) ? (
          <TransactionTable
            data={isTransactionsReportSuccess ? transactionsReportData : []}
          />
        ) : (
          <FeatureNotImplemented />
        ))}
    </>
  )
}
