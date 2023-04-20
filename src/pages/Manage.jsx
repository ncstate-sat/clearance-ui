import {
  Button,
  Heading,
  minorScale,
  Table,
  TagInput,
  Text,
  Spinner,
  Pane,
  Textarea,
  TickCircleIcon,
  WarningSignIcon,
  Switch,
  Tooltip,
  toaster,
  majorScale,
  Position,
} from 'evergreen-ui'
import { useMemo, useState, useEffect, Fragment } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import clearanceService from '../apis/clearanceService'
import ContentCard from '../components/ContentCard'
import NoResultsText from '../components/NoResultsText'
import getEnvVariable from '../utils/getEnvVariable'

import usePersonnel from '../hooks/usePersonnel'
import useClearance from '../hooks/useClearance'

export default function ManageClearance() {
  const token = useSelector((state) => state.auth.token)

  const [
    getAssignments,
    {
      isFetching: isFetchingAssignments,
      isSuccess: isGetSuccess,
      isError: isGetError,
      data: getAssignmentsData,
      error: getAssignmentsError,
    },
  ] = clearanceService.useLazyGetAssignmentsQuery()

  const [revokeAssignments] = clearanceService.useRevokeClearancesMutation()
  const [
    assignClearance,
    {
      isLoading: isAssignLoading,
      isSuccess: isAssignSuccess,
      isError: isAssignError,
      data: assignData,
      error: assignError,
    },
  ] = clearanceService.useAssignClearancesMutation()

  const [tableFilter, setTableFilter] = useState('')

  const [clearanceAssignments, setClearanceAssignments] = useState([])
  const [loadingRevokeRequests, setLoadingRevokeRequests] = useState([])

  const [bulkAssign, setBulkAssign] = useState(false)
  const [isVerifyingBulkPersonnel, setIsVerifyingBulkPersonnel] =
    useState(false)
  const [bulkPersonnelText, setBulkPersonnelText] = useState('')
  const [bulkPersonnel, setBulkPersonnel] = useState([])

  const [selectedPersonnel, setSelectedPersonnel] = useState([])
  const {
    personnel,
    personnelQuery,
    setPersonnelQuery,
    length: personnelLength,
    isTyping: isTypingPersonnel,
    isLoading: isLoadingPersonnel,
  } = usePersonnel()

  const [selectedClearances, setSelectedClearances] = useState([])
  const {
    clearances,
    clearanceQuery,
    setClearanceQuery,
    length: clearancesLength,
    isTyping: isTypingClearances,
    isLoading: isLoadingClearances,
  } = useClearance()

  // Suggestion strings for personnel.
  const autocompletePersonnel = useMemo(() => {
    const personnelStrings = personnel.map(
      (p) =>
        `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`
    )
    const selectedPersonnelStrings = selectedPersonnel.map(
      (p) =>
        `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`
    )
    return personnelStrings
      .filter((i) => !selectedPersonnelStrings.includes(i))
      .sort()
  }, [personnel, selectedPersonnel])

  // Suggestion strings for clearances.
  const autocompleteClearances = useMemo(() => {
    const clearanceNames = clearances.map((c) => c['name'])
    const selectedClearanceNames = selectedClearances.map((c) => c['name'])
    return clearanceNames
      .filter((i) => !selectedClearanceNames.includes(i))
      .sort()
  }, [clearances, selectedClearances])

  // Respond to API response to clearance assignment request.
  useEffect(() => {
    if (isGetSuccess) {
      setClearanceAssignments(getAssignmentsData['assignments'])
    } else if (isGetError && getAssignmentsError?.['name'] !== 'AbortError') {
      toaster.danger(getAssignmentsError ?? 'Request Failed')
    }
  }, [isGetSuccess, isGetError, getAssignmentsData, getAssignmentsError])

  // Handle response from Assign call.
  useEffect(() => {
    if (isAssignSuccess) {
      setBulkPersonnel([])
      toaster.success('Clearance(s) Assigned Successfully')
    } else if (isAssignError && assignError?.['name'] !== 'AbortError') {
      toaster.danger(assignError ?? 'Request Failed')
    }
  }, [isAssignSuccess, isAssignError, assignData])

  // Fetch clearance assignments for the selected person.
  useEffect(() => {
    if (selectedPersonnel.length === 1) {
      const campusId = selectedPersonnel[0]['campus_id']

      const request = getAssignments({ campusId: campusId })

      return () => {
        request.abort()
      }
    }
  }, [selectedPersonnel])

  const onRevokeClearance = (clearanceId) => {
    setLoadingRevokeRequests((requests) => [...requests, clearanceId])

    revokeAssignments({
      assigneeIDs: [selectedPersonnel[0]['campus_id']],
      clearanceIDs: [clearanceId],
    })
      .unwrap()
      .then(() => {
        setClearanceAssignments((prevAssignments) =>
          prevAssignments
            .filter((a) => a['id'] !== clearanceId)
            .map((a) => ({ ...a }))
        )
        setLoadingRevokeRequests((requests) =>
          requests.filter((r) => r !== clearanceId)
        )
        toaster.success('Revoke Succeeded')
      })
      .catch(() => {
        setLoadingRevokeRequests((requests) =>
          requests.filter((r) => r !== clearanceId)
        )
        toaster.success('Revoke Failed')
      })
  }

  // Submit Assign request.
  const onAssignClearance = async () => {
    const assigneeIds = selectedPersonnel.map((p) => p['campus_id'])
    const clearanceIds = selectedClearances.map((c) => c['id'])

    assignClearance({ assigneeIDs: assigneeIds, clearanceIDs: clearanceIds })
      .unwrap()
      .then(() => {
        setClearanceAssignments((prev) => {
          const oldValues = JSON.parse(JSON.stringify(prev))
          const newValues = selectedClearances.map((cl) => ({
            ...cl,
            can_revoke: true,
          }))

          const clearanceIDs = {}
          const newClearances = []
          for (const c of [...oldValues, ...newValues]) {
            if (!clearanceIDs[c['id']]) {
              newClearances.push(c)
              clearanceIDs[c['id']] = true
            }
          }

          return newClearances
        })
      })
  }

  // Temporary function to do the job of the new API endpoint until that endpoint is done.
  const inefficientlyVerifyPersonnelData = async (strings) => {
    setIsVerifyingBulkPersonnel(true)
    setSelectedPersonnel([])

    for await (const s of strings) {
      let response
      let personnel
      try {
        response = await axios.get(
          getEnvVariable('VITE_CLEARANCE_SERVICE_URL') +
            `/personnel?search=${s['text']}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        personnel = response.data['personnel']
      } catch (error) {
        personnel = []
      }

      if (personnel.length === 1) {
        setSelectedPersonnel((prev) => [
          ...JSON.parse(JSON.stringify(prev)),
          personnel[0],
        ])
      }
      setBulkPersonnel((prev) => {
        const prevCopy = JSON.parse(JSON.stringify(prev))
        const index = prevCopy.findIndex((p) => p['text'] === s['text'])

        if (personnel.length === 1) {
          const text = `${personnel[0]['first_name']} ${personnel[0]['last_name']} (${personnel[0]['email']}) [${personnel[0]['campus_id']}]`
          prevCopy[index] = { text: text, isVerified: true }
        } else {
          prevCopy[index] = { text: s['text'], isVerified: false }
        }

        return prevCopy
      })
    }
    setIsVerifyingBulkPersonnel(false)
  }

  // Verify that the text matches people in the system.
  const verifyBulkPersonnelData = async () => {
    let strings = bulkPersonnelText.match(/([^\n]+)/g) || []
    strings = [...new Set(strings.map((s) => ({ text: s, isLoading: true })))]
    setBulkPersonnel(strings)
    await inefficientlyVerifyPersonnelData(strings)
  }

  const bulkUploadTable = useMemo(() => {
    if (bulkPersonnel.length === 0) return null

    return (
      <Table>
        <Table.Body>
          {bulkPersonnel.map((r) => (
            <Table.Row key={JSON.stringify(r)}>
              <Table.TextCell>{r['text']}</Table.TextCell>
              <Table.TextCell textAlign='right' flexBasis={100} flexGrow={0}>
                {r['isLoading'] ? (
                  <Spinner size={16} float='right' />
                ) : r['isVerified'] ? (
                  <Tooltip
                    position={Position.RIGHT}
                    content='This person is verified and will be given all selected clearances.'
                  >
                    <TickCircleIcon
                      color='success'
                      test-id='verify-success-icon'
                    />
                  </Tooltip>
                ) : (
                  <Tooltip
                    position={Position.RIGHT}
                    content='This person is not in the system and will not be assigned any clearances.'
                  >
                    <WarningSignIcon color='danger' />
                  </Tooltip>
                )}
              </Table.TextCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }, [bulkPersonnel])

  return (
    <>
      <Heading size={800}>Manage Clearances</Heading>
      <Text>View and edit the clearances of an individual</Text>

      <ContentCard isLoading={isLoadingPersonnel}>
        <Pane
          display='flex'
          flexDirection='row'
          justifyContent='space-between'
          marginBottom={minorScale(3)}
        >
          <Heading size={600} display='inline-block'>
            Select Person
          </Heading>
          <Pane display='inline-flex' flexDirection='row' alignItems='center'>
            <Text>Bulk</Text>
            <Switch
              display='inline-block'
              marginLeft='0.5rem'
              checked={bulkAssign}
              onChange={(e) => setBulkAssign(e.target.checked)}
              test-id='bulk-select-switch'
            />
          </Pane>
        </Pane>
        {!bulkAssign ? (
          <>
            <TagInput
              tagSubmitKey='enter'
              width='100%'
              values={selectedPersonnel.map(
                (p) =>
                  `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`
              )}
              onChange={(selected) => {
                const personnelObjects = []
                const allPersonnel = [...personnel, ...selectedPersonnel]
                const personnelStrings = allPersonnel.map(
                  (p) =>
                    `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`
                )
                selected.forEach((s) => {
                  const i = personnelStrings.indexOf(s)
                  if (i >= 0) {
                    personnelObjects.push(allPersonnel[i])
                  }
                })
                setSelectedPersonnel(personnelObjects)
              }}
              autocompleteItems={autocompletePersonnel}
              onInputChange={(e) => setPersonnelQuery(e.target.value)}
              test-id='personnel-input'
            />
            <NoResultsText
              $visible={
                !isLoadingPersonnel &&
                !isTypingPersonnel &&
                personnelQuery.length >= 3 &&
                personnelLength === 0
              }
            >
              No Personnel Found
            </NoResultsText>
          </>
        ) : (
          <>
            <Textarea
              marginY='1rem'
              placeholder='Paste a list of Campus IDs or Unity IDs separated by new lines.'
              resize='vertical'
              value={bulkPersonnelText}
              onChange={(e) => setBulkPersonnelText(e.target.value)}
              test-id='bulk-personnel-textarea'
            />
            <Button
              marginBottom='1rem'
              onClick={verifyBulkPersonnelData}
              isLoading={isVerifyingBulkPersonnel}
              disabled={isVerifyingBulkPersonnel}
              test-id='bulk-verify-btn'
            >
              Verify
            </Button>
            {bulkUploadTable}
          </>
        )}
      </ContentCard>

      {selectedPersonnel.length > 0 && (
        <Fragment>
          <ContentCard isLoading={isLoadingClearances}>
            <Heading size={600} marginBottom={minorScale(3)}>
              Select Clearance
            </Heading>
            <TagInput
              tagSubmitKey='enter'
              width='100%'
              values={selectedClearances.map((c) => c['name'])}
              onChange={(selected) => {
                const clearanceObjects = []
                const allClearances = [...clearances, ...selectedClearances]
                const clearanceStrings = allClearances.map(
                  (c) => `${c['name']}`
                )
                selected.forEach((s) => {
                  const i = clearanceStrings.indexOf(s)
                  if (i >= 0) {
                    clearanceObjects.push(allClearances[i])
                  }
                })
                setSelectedClearances(clearanceObjects)
              }}
              autocompleteItems={autocompleteClearances}
              onInputChange={(e) => setClearanceQuery(e.target.value)}
              test-id='clearance-input'
            />
            <NoResultsText
              $visible={
                !isLoadingClearances &&
                !isTypingClearances &&
                clearanceQuery.length >= 3 &&
                clearancesLength === 0
              }
            >
              No Clearances Found
            </NoResultsText>
          </ContentCard>

          <Button
            appearance='primary'
            intent='success'
            isLoading={isAssignLoading}
            disabled={
              selectedClearances.length === 0 || selectedPersonnel.length === 0
            }
            onClick={onAssignClearance}
            marginBottom={minorScale(6)}
            test-id='assign-clearance-btn'
          >
            Assign
          </Button>

          <Table>
            <Table.Head>
              <Table.SearchHeaderCell
                flexBasis='65%'
                value={tableFilter}
                onChange={setTableFilter}
              />
              <Table.TextHeaderCell flexShrink={0}>
                Actions
              </Table.TextHeaderCell>
            </Table.Head>
            <Table.Body>
              {selectedPersonnel.length > 1 ? (
                <Pane className='center' padding={minorScale(6)}>
                  <Text>
                    Clearances cannot be shown when more than one person is
                    selected.
                  </Text>
                </Pane>
              ) : isFetchingAssignments ? (
                <Pane className='center' padding={minorScale(6)}>
                  <Spinner size={majorScale(4)} marginX='auto' />
                </Pane>
              ) : clearanceAssignments.length === 0 ? (
                <Pane className='center' padding={minorScale(6)}>
                  <Text>No Clearances</Text>
                </Pane>
              ) : (
                clearanceAssignments
                  .filter((cl) => {
                    return cl['name']
                      .toLowerCase()
                      .includes(tableFilter.toLowerCase())
                  })
                  .sort((a, b) => (a['name'] > b['name'] ? 1 : -1))
                  .map((cl) => (
                    <Table.Row key={cl['id']}>
                      <Table.TextCell flexBasis='65%'>
                        {cl['name']}
                      </Table.TextCell>
                      <Table.TextCell flexShrink={0} textAlign='right'>
                        <Tooltip
                          isShown={cl['can_revoke'] ? false : undefined}
                          content='You do not have permission to revoke this clearance.'
                          position={Position.RIGHT}
                        >
                          <div>
                            <Button
                              test-id='revoke-clearance-btn'
                              appearance='secondary'
                              disabled={!cl['can_revoke']}
                              onClick={() => onRevokeClearance(cl['id'])}
                              isLoading={loadingRevokeRequests.includes(
                                cl['id']
                              )}
                            >
                              Revoke
                            </Button>
                          </div>
                        </Tooltip>
                      </Table.TextCell>
                    </Table.Row>
                  ))
              )}
            </Table.Body>
          </Table>
        </Fragment>
      )}
    </>
  )
}

ManageClearance.auth = true
