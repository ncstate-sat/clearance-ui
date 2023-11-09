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
  Text,
  Tooltip,
  Spinner,
  majorScale,
  minorScale,
  toaster,
  HelpIcon,
} from 'evergreen-ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import clearanceService from '../apis/clearanceService'
import { AUDIT_FILTERS } from '../components/AuditFilterCard'
import ContentCard from '../components/ContentCard'
import ClearancePicker from '../components/ClearancePicker'
import TagInput, { createTagOption } from '../components/TagInput'
import Timeframe from '../components/Timeframe'
import usePersonnel from '../hooks/usePersonnel'
import openInNewTab from '../utils/openInNewTab'

const QUERY_LIMIT = 50

// FILTER CONSTANTS
const { BY_ASSIGNEE, BY_ASSIGNER, BY_CLEARANCE_NAME, BY_TIMEFRAME } =
  AUDIT_FILTERS

const emptyFilters = {
  [BY_ASSIGNEE]: {
    enabled: false,
    value: null,
  },
  [BY_ASSIGNER]: {
    enabled: false,
    value: null,
  },
  [BY_CLEARANCE_NAME]: {
    enabled: false,
    value: null,
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
    { data: logData, isFetching, isSuccess, isError, error: logError },
  ] = clearanceService.useLazyGetAuditLogQuery()

  // UI STATE
  const [filters, setFilters] = useState(emptyFilters)
  const [log, setLog] = useState([])
  const [page, setPage] = useState(0)
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(true)

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
            value: value,
          },
        }))
      }
    },
    [setFilters]
  )

  const selectedPersonnel = filters[BY_ASSIGNEE].value || null
  const selectedClearances = filters[BY_CLEARANCE_NAME].value || null

  const { personnel, personnelQuery, setPersonnelQuery } = usePersonnel()

  // Suggestion strings for personnel.
  const autocompletePersonnel = useMemo(
    () =>
      personnel
        .map((p) =>
          createTagOption(
            `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`,
            p
          )
        )
        .sort((a, b) => a['first_name'] > b['first_name']),
    [personnel, selectedPersonnel]
  )

  const queryLogs = useCallback((flts, pg, selPsnl, selCls) => {
    const campusId = selPsnl ? selPsnl['raw']['campus_id'] : undefined

    const timeframe = flts[BY_TIMEFRAME].value

    const queryParams = {
      skip: pg * QUERY_LIMIT,
      limit: QUERY_LIMIT + 1,
      clearance_name: selCls?.['text'],
      from_time: timeframe?.startDateTime?.toISOString(),
      to_time: timeframe?.endDateTime?.toISOString(),
      assignee_id: flts[BY_ASSIGNEE].enabled ? campusId : undefined,
      assigner_id: flts[BY_ASSIGNER].enabled ? campusId : undefined,
    }

    getAuditLog({ params: queryParams })
  }, [])

  useEffect(() => {
    if (isSuccess) {
      let newLogs = [...logData['records']]
      if (newLogs.length < QUERY_LIMIT + 1) {
        setShowLoadMoreButton(false)
      } else if (newLogs.length === QUERY_LIMIT + 1) {
        newLogs.pop()
      }
      setLog((prev) => {
        let newData = [...newLogs]
        if (page > 0) {
          newData = [...prev, ...newLogs]
        }
        newData.sort(
          (a, b) => new Date(b['timestamp']) - new Date(a['timestamp'])
        )

        newData = [...new Set(newData.map((d) => JSON.stringify(d)))]
        return newData.map((d) => JSON.parse(d))
      })
    } else if (isError && logError?.['name'] !== 'AbortError') {
      setLog([])
      toaster.danger(logError ?? 'Request Failed')
    }
  }, [isSuccess, isError, logData, logError])

  useEffect(() => {
    setPage(0)
    setShowLoadMoreButton(true)
    queryLogs(filters, 0, selectedPersonnel, selectedClearances)
  }, [filters])

  useEffect(() => {
    queryLogs(filters, page, selectedPersonnel, selectedClearances)
  }, [page])

  return (
    <>
      <Heading size={800}>
        Audit Log
        <Tooltip
          content='Click to view a guide on the Audit Log.'
          position={Position.RIGHT}
        >
          <IconButton
            size='small'
            appearance='none'
            icon={HelpIcon}
            test-id='help-button-page'
            onClick={() =>
              openInNewTab(
                'https://ncstate-sat.github.io/clearance-service/#audit-logs'
              )
            }
          />
        </Tooltip>
      </Heading>
      <Pane display='flex' flexDirection='row' justifyContent='space-between'>
        <Pane>
          <Text>A record of all clearance assignments made by this tool.</Text>
        </Pane>
        <Pane>
          <Button
            marginRight={minorScale(2)}
            onClick={() => {
              setPage(0)
              queryLogs(filters, 0, selectedPersonnel, selectedClearances)
            }}
            isLoading={isFetching}
          >
            Refresh
          </Button>
          <Popover
            position={Position.BOTTOM_RIGHT}
            content={({ close }) => (
              <Menu>
                <Menu.Group>
                  <Menu.Item
                    onSelect={() => {
                      toggleFilter(BY_ASSIGNEE, true)
                      toggleFilter(BY_ASSIGNER, false)
                      handleFilterChange(BY_ASSIGNEE, '', null)
                    }}
                  >
                    Filter on Assigned To
                  </Menu.Item>
                  <Menu.Item
                    onSelect={() => {
                      toggleFilter(BY_ASSIGNER, true)
                      toggleFilter(BY_ASSIGNEE, false)
                      handleFilterChange(BY_ASSIGNER, '', null)
                    }}
                  >
                    Filter on Done By
                  </Menu.Item>
                  <Menu.Item onSelect={() => toggleFilter(BY_CLEARANCE_NAME)}>
                    Filter by Clearance Name
                  </Menu.Item>
                  <Menu.Item onSelect={() => toggleFilter(BY_TIMEFRAME)}>
                    Filter on Date Assigned
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
      </Pane>

      {/** TODO: Refactor these into components (see AuditFilterCard.js) */}
      {(filters[BY_ASSIGNEE].enabled || filters[BY_ASSIGNER].enabled) && (
        <ContentCard
          header={
            filters[BY_ASSIGNEE].enabled
              ? 'Select Person - Assigned To'
              : 'Select Person - Done By'
          }
        >
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
          <TagInput
            inputValue={personnelQuery}
            onInputChange={setPersonnelQuery}
            value={selectedPersonnel}
            onChange={(values) =>
              handleFilterChange(BY_ASSIGNEE, 'input', values)
            }
            suggestions={autocompletePersonnel}
            width='100%'
          />
        </ContentCard>
      )}

      {filters[BY_CLEARANCE_NAME].enabled && (
        <ClearancePicker
          selectedClearances={selectedClearances}
          setSelectedClearances={(values) =>
            handleFilterChange(BY_CLEARANCE_NAME, 'input', values)
          }
          onClose={() => toggleFilter(BY_CLEARANCE_NAME)}
        />
      )}

      {filters[BY_TIMEFRAME].enabled && (
        <ContentCard header='Select Date Assigned'>
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

      <Table marginY={minorScale(6)} test-id='audit-table'>
        <Table.Head>
          <Table.TextHeaderCell
            test-id='table-header'
            flexBasis='18%'
            flexGrow='0'
          >
            Date Assigned
          </Table.TextHeaderCell>
          <Table.TextHeaderCell test-id='table-header' flexBasis='5fr'>
            Action
          </Table.TextHeaderCell>
          <Table.TextHeaderCell
            test-id='table-header'
            flexBasis='20%'
            flexGrow='0'
          >
            Assigned To
          </Table.TextHeaderCell>
          <Table.TextHeaderCell
            test-id='table-header'
            flexBasis='20%'
            flexGrow='0'
          >
            Done By
          </Table.TextHeaderCell>
        </Table.Head>
        <Table.Body>
          {log.map((l) => {
            return (
              <Table.Row key={JSON.stringify(l)} test-id='table-row'>
                <Table.TextCell
                  test-id='table-cell'
                  flexBasis='18%'
                  flexGrow='0'
                >
                  {new Date(l['timestamp']).toLocaleString()}
                </Table.TextCell>
                <Table.TextCell test-id='table-cell' flexBasis='5fr'>
                  {l['action']}
                </Table.TextCell>
                <Table.TextCell
                  test-id='table-cell'
                  flexBasis='20%'
                  flexGrow='0'
                >
                  {l['assignee']}
                </Table.TextCell>
                <Table.TextCell
                  test-id='table-cell'
                  flexBasis='20%'
                  flexGrow='0'
                >
                  {l['assigner']}
                </Table.TextCell>
              </Table.Row>
            )
          })}
          {isFetching ? (
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

      {showLoadMoreButton && (
        <Button
          onClick={() => setPage((p) => p + 1)}
          disabled={log.length === 0 || isFetching}
        >
          Load More
        </Button>
      )}
    </>
  )
}

AuditLog.auth = true
