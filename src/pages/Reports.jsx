import { useState } from 'react'
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
  toaster,
} from 'evergreen-ui'
import styled from 'styled-components'
import clearanceService from '../apis/clearanceService'
import ContentCard from '../components/ContentCard'
import PeoplePicker from '../components/PeoplePicker'
import Timeframe from '../components/Timeframe'
import openInNewTab from '../utils/openInNewTab'

const REPORT_TYPES = ['Door Clearances', 'People Clearances', 'Transactions']
const PEOPLE_PICKER_FILTER = [REPORT_TYPES[1], REPORT_TYPES[2]]
const TIMEFRAME_FILTER = [REPORT_TYPES[2]]

const TRANSACTIONS_REPORT_DATA = [
  {
    date: new Date('9/13/22 4:59 PM'),
    doorName: 'EB1 - 3058 Lab',
    name: 'Ashley Noelle Simpson',
    campusId: '200293592',
    stateCode: 'Admit',
  },
  {
    date: new Date('9/13/22 4:36 PM'),
    doorName: 'EB1 - 3058 Lab',
    name: 'Joseph B. Tracy',
    campusId: '0004056039',
    stateCode: 'Admit',
  },
  {
    date: new Date('9/13/22 4:59 PM'),
    doorName: 'EB1 - 3058 Lab',
    name: null,
    campusId: null,
    stateCode: 'DoorForced',
  },
]

const PEOPLE_REPORT_DATA = [
  {
    clearanceName: 'AS1-PS-Purchasing Doors 24/7-C2',
    personnel: [
      {
        firstName: 'Rhonda',
        lastName: 'Barnes',
        campusId: '000005984',
        department: 'Procurement Services',
        status: 'SPA',
      },
      {
        firstName: 'Elizabeth',
        lastName: 'Milchuck',
        campusId: '200179642',
        department: 'Procurement Services',
        status: 'SPA',
      },
      {
        firstName: 'Jason',
        lastName: 'Walker',
        campusId: '001125976',
        department: 'Housing Facilities Admin',
        status: 'TMP',
      },
    ],
  },
  {
    clearanceName: 'AS1-TRANS-Transportation Staff-C2',
    personnel: [
      {
        firstName: 'Rhonda',
        lastName: 'Barnes',
        campusId: '000005984',
        department: 'Procurement Services',
        status: 'SPA',
      },
      {
        firstName: 'Elizabeth',
        lastName: 'Milchuck',
        campusId: '200179642',
        department: 'Procurement Services',
        status: 'SPA',
      },
      {
        firstName: 'Jason',
        lastName: 'Walker',
        campusId: '001125976',
        department: 'Housing Facilities Admin',
        status: 'TMP',
      },
    ],
  },
  {
    clearanceName:
      'CE Facilities Operations-AS1-01-E1138-Back Loading DockDr-C1',
    personnel: [
      {
        firstName: 'Rhonda',
        lastName: 'Barnes',
        campusId: '000005984',
        department: 'Procurement Services',
        status: 'SPA',
      },
      {
        firstName: 'Elizabeth',
        lastName: 'Milchuck',
        campusId: '200179642',
        department: 'Procurement Services',
        status: 'SPA',
      },
      {
        firstName: 'Jason',
        lastName: 'Walker',
        campusId: '001125976',
        department: 'Housing Facilities Admin',
        status: 'TMP',
      },
    ],
  },
]

const DOOR_REPORT_DATA = [
  {
    clearanceName: 'CE Facilities Operations-Talley-4221-C2',
    doors: [
      {
        name: 'TSU - 1100 South Corridor 1150',
        isElevator: false,
        scheduleName: 'Always',
      },
      {
        name: 'TSU - 4221 Copy and Supply Room',
        isElevator: false,
        scheduleName: 'Always',
      },
      {
        name: 'TSU - Elevator Car Two (2)',
        isElevator: true,
        scheduleName: 'TSU- 6a-1a Access',
      },
    ],
  },
  {
    clearanceName: 'CE Facilities Operations-Talley-Camp Out-C2',
    doors: [
      {
        name: 'TSU - 1100 South Corridor 1150',
        isElevator: false,
        scheduleName: 'Always',
      },
      {
        name: 'TSU - 4221 Copy and Supply Room',
        isElevator: false,
        scheduleName: 'Always',
      },
      {
        name: 'TSU - Elevator Car Two (2)',
        isElevator: true,
        scheduleName: 'TSU- 6a-1a Access',
      },
    ],
  },
  {
    clearanceName:
      'CE Facilities Operations-Talley-Employee Entrance Special Events-C2',
    doors: [
      {
        name: 'TSU - 1100 South Corridor 1150',
        isElevator: false,
        scheduleName: 'Always',
      },
      {
        name: 'TSU - 4221 Copy and Supply Room',
        isElevator: false,
        scheduleName: 'Always',
      },
      {
        name: 'TSU - Elevator Car Two (2)',
        isElevator: true,
        scheduleName: 'TSU- 6a-1a Access',
      },
    ],
  },
]

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
          <Table.TextCell>{d.doorName || ''}</Table.TextCell>
          <Table.TextCell>{d.name || ''}</Table.TextCell>
          <Table.TextCell>{d.campusId || ''}</Table.TextCell>
          <Table.TextCell>{d.stateCode || ''}</Table.TextCell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
)

const PeopleTable = ({ data }) => {
  return (
    <Table marginTop='2rem'>
      <Table.Head>
        <Table.TextHeaderCell>First Name</Table.TextHeaderCell>
        <Table.TextHeaderCell>Last Name</Table.TextHeaderCell>
        <Table.TextHeaderCell>Campus ID</Table.TextHeaderCell>
        <Table.TextHeaderCell>Department</Table.TextHeaderCell>
        <Table.TextHeaderCell>Status</Table.TextHeaderCell>
      </Table.Head>
      <Table.Body>
        {data.map((clearance) => (
          <>
            <Table.Row height={'2.5rem'}>
              <TableSectionHeader>{clearance.clearanceName}</TableSectionHeader>
            </Table.Row>
            {clearance.personnel.map((person) => {
              return (
                <Table.Row>
                  <Table.TextCell>{person.firstName || ''}</Table.TextCell>
                  <Table.TextCell>{person.lastName || ''}</Table.TextCell>
                  <Table.TextCell>{person.campusId || ''}</Table.TextCell>
                  <Table.TextCell>{person.department || ''}</Table.TextCell>
                  <Table.TextCell>{person.status || ''}</Table.TextCell>
                </Table.Row>
              )
            })}
          </>
        ))}
      </Table.Body>
    </Table>
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
        {data.map((clearance) => (
          <>
            <Table.Row height={'2.5rem'}>
              <TableSectionHeader>{clearance.clearanceName}</TableSectionHeader>
            </Table.Row>
            {clearance.doors.map((door) => {
              return (
                <Table.Row>
                  <Table.TextCell>{door.name || ''}</Table.TextCell>
                  <Table.TextCell>
                    {door.isElevator ? 'Elevator' : 'Door'}
                  </Table.TextCell>
                  <Table.TextCell>{door.scheduleName || ''}</Table.TextCell>
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
  const [getReports] = clearanceService.useLazyGetReportsByUserQuery()

  const [reportType, setReportType] = useState(REPORT_TYPES[0])

  // Filter selections
  const [selectedPersonnel, setSelectedPersonnel] = useState([])
  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState()

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
        >
          Liaison Assignments
        </Button>
      </Pane>
      {PEOPLE_PICKER_FILTER.includes(reportType) && (
        <PeoplePicker
          header='Filter by Person'
          selectedPersonnel={selectedPersonnel}
          setSelectedPersonnel={setSelectedPersonnel}
        />
      )}
      {TIMEFRAME_FILTER.includes(reportType) && (
        <ContentCard header='Filter by Timeframe'>
          <Timeframe
            startDateTime={startTime}
            endDateTime={endTime}
            onChangeStartTime={setStartTime}
            onChangeEndTime={setEndTime}
          />
        </ContentCard>
      )}
      {reportType === REPORT_TYPES[0] && <DoorTable data={DOOR_REPORT_DATA} />}
      {reportType === REPORT_TYPES[1] && (
        <PeopleTable data={PEOPLE_REPORT_DATA} />
      )}
      {reportType === REPORT_TYPES[2] && (
        <TransactionTable data={TRANSACTIONS_REPORT_DATA} />
      )}
    </>
  )
}
