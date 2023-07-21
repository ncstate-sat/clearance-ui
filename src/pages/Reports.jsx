import { useState } from 'react'
import {
  Pane,
  Heading,
  Text,
  Group,
  Button,
  Tooltip,
  Table,
  IconButton,
  HelpIcon,
  Position,
} from 'evergreen-ui'
import styled from 'styled-components'
import openInNewTab from '../utils/openInNewTab'

const REPORT_TYPES = ['Doors', 'People', 'Transactions']

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
    name: 'AS1-PS-Purchasing Doors 24/7-C2',
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
    name: 'AS1-TRANS-Transportation Staff-C2',
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
    name: 'CE Facilities Operations-AS1-01-E1138-Back Loading DockDr-C1',
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
              <TableSectionHeader>{clearance['name']}</TableSectionHeader>
            </Table.Row>
            {clearance['personnel'].map((person) => {
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

export default function Reports() {
  const [reportType, setReportType] = useState('Doors')

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
      <Group>
        {REPORT_TYPES.map((t) => (
          <Button onClick={() => setReportType(t)} isActive={reportType === t}>
            {t}
          </Button>
        ))}
      </Group>
      {/* {reportType === 'Doors' && <TransactionTable data={TRANSACTIONS_REPORT_DATA} />} */}
      {reportType === 'People' && <PeopleTable data={PEOPLE_REPORT_DATA} />}
      {reportType === 'Transactions' && (
        <TransactionTable data={TRANSACTIONS_REPORT_DATA} />
      )}
    </>
  )
}
