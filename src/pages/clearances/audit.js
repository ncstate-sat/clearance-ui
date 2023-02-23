import {
  Button,
  CrossIcon,
  Heading,
  IconButton,
  Menu,
  Pane,
  Popover,
  Position,
  Table,
  TagInput,
  Text,
  Tooltip,
  Spinner,
  majorScale,
  minorScale,
} from 'evergreen-ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import clearanceService from '../../apis/clearanceService'
import { AUDIT_FILTERS } from '../../components/AuditFilterCard'
import ContentCard from '../../components/ContentCard'
import Layout from '../../components/document/Layout'
import Timeframe from '../../components/Timeframe'
import useClearance from '../../hooks/useClearance'
import usePersonnel from '../../hooks/usePersonnel'

// FILTER CONSTANTS
const { BY_ASSIGNEE, BY_ASSIGNER, BY_CLEARANCE_NAME, BY_TIMEFRAME } =
  AUDIT_FILTERS

const emptyFilters = {
  [BY_ASSIGNEE]: {
    enabled: false,
    value: [],
  },
  [BY_ASSIGNER]: {
    enabled: false,
    value: [],
  },
  [BY_CLEARANCE_NAME]: {
    enabled: false,
    value: [],
  },
  [BY_TIMEFRAME]: {
    enabled: false,
    value: {
      startDateTime: null,
      endDateTime: null,
    },
  },
}

export default function AuditLog() {
  // CALLS TO API
  const [
    getAuditLog,
    { data: logData, isFetching: isLoading, isSuccess, isError, error },
  ] = clearanceService.useLazyGetAuditLogQuery()

  // UI STATE
  const [filters, setFilters] = useState(emptyFilters)
  const [log, setLog] = useState([])
  const [page, setPage] = useState(0)

  const toggleFilter = useCallback(
    (type, value) => {
      setFilters((prev) => ({
        ...prev,
        [type]: {
          ...prev.value,
          enabled: value ?? !prev[type].enabled,
        },
      }))
    },
    [setFilters]
  )

  const { personnel, setPersonnelQuery } = usePersonnel()
  const { clearances, setClearanceQuery } = useClearance()

  const personnelStrings = useMemo(
    () =>
      personnel.map(
        (p) =>
          `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`
      ),
    [personnel]
  )

  const clearanceNames = useMemo(
    () => clearances.map((c) => c['name']),
    [clearances]
  )

  const selectedPersonnel = filters[BY_ASSIGNEE].value
  const selectedClearances = filters[BY_CLEARANCE_NAME].value
  const autocompletePersonnel = useMemo(() => {
    return personnelStrings.filter((i) => !selectedPersonnel?.includes(i))
  }, [personnelStrings, selectedPersonnel])

  const autocompleteClearances = useMemo(() => {
    return clearanceNames.filter((i) => !selectedClearances?.includes(i))
  }, [clearanceNames, selectedClearances])

  const handleFilterChange = useCallback(
    (filter, key, value) => {
      if (key === 'startDateTime' || key === 'endDateTime') {
        setFilters((prev) => ({
          ...prev,
          [filter]: {
            ...prev[filter],
            value: {
              ...prev[filter].value,
              [key]: value,
            },
          },
        }))
      } else {
        setFilters((prev) => ({
          ...prev,
          [filter]: {
            ...prev[filter],
            value: [...value],
          },
        }))
      }
    },
    [setFilters]
  )

  const queryLogs = useCallback((flts, pg, psnl, selPsnl, cls, selCls) => {
    const campusId = psnl.find((p) => {
      return (
        `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]` ===
        selPsnl?.[0]
      )
    })?.['campus_id']

    const clearance = cls.find((c) => c['name'] === selCls?.[0])

    const timeframe = flts[BY_TIMEFRAME].value

    const queryParams = {
      page: pg,
      limit: 10,
      clearance_id: cls?.['id'],
      from_time: timeframe?.startDateTime?.toISOString(),
      to_time: timeframe?.endDateTime?.toISOString(),
      assignee_id: flts[BY_ASSIGNEE].enabled ? campusId : undefined,
      assigner_id: flts[BY_ASSIGNER].enabled ? campusId : undefined,
    }

    getAuditLog({ params: queryParams })
  }, [])

  useEffect(() => {
    if (isSuccess) {
      setLog((prev) => {
        let newData = [...logData['assignments']]
        if (page > 0) {
          newData = [...prev, ...logData['assignments']]
        }
        newData.sort(
          (a, b) => new Date(b['timestamp']) - new Date(a['timestamp'])
        )

        newData = [...new Set(newData.map((d) => JSON.stringify(d)))]
        return newData.map((d) => JSON.parse(d))
      })
    } else if (isError) {
      setLog([])
    }
  }, [isSuccess, isError, logData])

  useEffect(() => {
    setPage(0)
    queryLogs(
      filters,
      0,
      personnel,
      selectedPersonnel,
      clearances,
      selectedClearances
    )
  }, [filters])

  useEffect(() => {
    queryLogs(
      filters,
      page,
      personnel,
      selectedPersonnel,
      clearances,
      selectedClearances
    )
  }, [page])

  return (
    <Layout title='Audit Log'>
      <Heading size={800}>Audit Log</Heading>
      <Pane display='flex' flexDirection='row' justifyContent='space-between'>
        <Pane>
          <Text>A record of all clearance assignments made by this tool.</Text>
        </Pane>
        <Popover
          position={Position.BOTTOM_RIGHT}
          content={({ close }) => (
            <Menu>
              <Menu.Group>
                <Menu.Item
                  onSelect={() => {
                    toggleFilter(BY_ASSIGNEE, true)
                    toggleFilter(BY_ASSIGNER, false)
                    handleFilterChange(BY_ASSIGNEE, '', [])
                  }}
                >
                  Filter by Person
                </Menu.Item>
                <Menu.Item
                  onSelect={() => {
                    toggleFilter(BY_ASSIGNER, true)
                    toggleFilter(BY_ASSIGNEE, false)
                    handleFilterChange(BY_ASSIGNER, '', [])
                  }}
                >
                  Filter by Assigner
                </Menu.Item>
                <Menu.Item onSelect={() => toggleFilter(BY_CLEARANCE_NAME)}>
                  Filter by Clearance Name
                </Menu.Item>
                <Menu.Item onSelect={() => toggleFilter(BY_TIMEFRAME)}>
                  Filter by Timeframe
                </Menu.Item>
              </Menu.Group>
              <Menu.Divider />
              <Menu.Group>
                <Menu.Item
                  intent='danger'
                  onSelect={() => {
                    setFilters(emptyFilters)
                    close()
                  }}
                >
                  Clear Filters
                </Menu.Item>
              </Menu.Group>
            </Menu>
          )}
        >
          <Button test-id='add-filter-btn'>Add Filter</Button>
        </Popover>
      </Pane>

      {/** TODO: Refactor these into components (see AuditFilterCard.js) */}
      {(filters[BY_ASSIGNEE].enabled || filters[BY_ASSIGNER].enabled) && (
        <ContentCard>
          <Tooltip content='Remove'>
            <IconButton
              onClick={() => {
                toggleFilter(BY_ASSIGNER, false)
                toggleFilter(BY_ASSIGNEE, false)
              }}
              icon={<CrossIcon size={20} />}
              border='none'
              position='absolute'
              top={0}
              right={0}
              test-id='remove-filter-btn'
            />
          </Tooltip>
          <Heading size={600} marginBottom={minorScale(3)}>
            {filters[BY_ASSIGNEE].enabled ? 'Select Person' : 'Select Assigner'}
          </Heading>
          <TagInput
            tagSubmitKey='enter'
            width='100%'
            values={selectedPersonnel}
            onChange={(values) =>
              handleFilterChange(BY_ASSIGNEE, 'input', values)
            }
            autocompleteItems={autocompletePersonnel}
            onInputChange={(e) => setPersonnelQuery(e.target.value)}
          />
        </ContentCard>
      )}

      {filters[BY_CLEARANCE_NAME].enabled && (
        <ContentCard>
          <Tooltip content='Remove'>
            <IconButton
              onClick={() => toggleFilter(BY_CLEARANCE_NAME)}
              icon={<CrossIcon size={20} />}
              border='none'
              position='absolute'
              top={0}
              right={0}
              test-id='remove-filter-btn'
            />
          </Tooltip>
          <Heading size={600} marginBottom={minorScale(3)}>
            Search Clearances
          </Heading>
          <TagInput
            tagSubmitKey='enter'
            width='100%'
            values={selectedClearances}
            onChange={(values) =>
              handleFilterChange(BY_CLEARANCE_NAME, 'input', values)
            }
            autocompleteItems={autocompleteClearances}
            onInputChange={(e) => setClearanceQuery(e.target.value)}
          />
        </ContentCard>
      )}

      {filters[BY_TIMEFRAME].enabled && (
        <ContentCard>
          <Tooltip content='Remove'>
            <IconButton
              onClick={() => toggleFilter(BY_TIMEFRAME)}
              icon={<CrossIcon size={20} />}
              border='none'
              position='absolute'
              top={0}
              right={0}
              test-id='remove-filter-btn'
            />
          </Tooltip>
          <Heading size={600} marginBottom={minorScale(3)}>
            Search Timeframe
          </Heading>
          <Timeframe
            startDateTime={filters[BY_TIMEFRAME].value?.startDateTime}
            endDateTime={filters[BY_TIMEFRAME].value?.endDateTime}
            onChangeStartTime={(date) =>
              handleFilterChange(BY_TIMEFRAME, 'startDateTime', date)
            }
            onChangeEndTime={(date) =>
              handleFilterChange(BY_TIMEFRAME, 'endDateTime', date)
            }
          />
        </ContentCard>
      )}

      <Table marginY={minorScale(6)}>
        <Table.Head>
          <Table.TextHeaderCell>Date Assigned</Table.TextHeaderCell>
          <Table.TextHeaderCell>Action</Table.TextHeaderCell>
          <Table.TextHeaderCell>Assigned To</Table.TextHeaderCell>
          <Table.TextHeaderCell>Done By</Table.TextHeaderCell>
        </Table.Head>
        <Table.Body>
          {log.map((l) => {
            return (
              <Table.Row key={JSON.stringify(l)}>
                <Table.TextCell>
                  {new Date(l['timestamp']).toLocaleString()}
                </Table.TextCell>
                <Table.TextCell>{l['message']}</Table.TextCell>
                <Table.TextCell>{l['assignee_name']}</Table.TextCell>
                <Table.TextCell>{l['assigner_name']}</Table.TextCell>
              </Table.Row>
            )
          })}
          {isLoading ? (
            <Pane className='center' padding={minorScale(6)}>
              <Spinner size={majorScale(4)} marginX='auto' />
            </Pane>
          ) : (
            log.length === 0 && (
              <Pane className='center' padding={minorScale(6)}>
                <Text>No Records</Text>
              </Pane>
            )
          )}
        </Table.Body>
      </Table>

      <Button
        onClick={() => setPage((p) => p + 1)}
        disabled={log.length === 0 || isLoading}
      >
        Load More
      </Button>
    </Layout>
  )
}

AuditLog.auth = true
