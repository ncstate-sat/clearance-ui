import {
  Button,
  Heading,
  minorScale,
  Table,
  TagInput,
  Text,
  Spinner,
  Pane,
  toaster,
  majorScale,
} from 'evergreen-ui'
import { useMemo, useState, useEffect, Fragment } from 'react'
import clearanceService from '../apis/clearanceService'
import ContentCard from '../components/ContentCard'
import NoResultsText from '../components/NoResultsText'

import usePersonnel from '../hooks/usePersonnel'
import useClearance from '../hooks/useClearance'

export default function ManageClearance() {
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
      toaster.success('Clearance(s) Assigned Successfully')
    } else if (isAssignError && assignError?.['name'] !== 'AbortError') {
      toaster.danger(assignError ?? 'Request Failed')
    }
  }, [isAssignSuccess, isAssignError, assignData])

  // Fetch clearance assignments for the selected person.
  useEffect(() => {
    if (selectedPersonnel.length > 0) {
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
          const newValues = JSON.parse(JSON.stringify(selectedClearances))

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

  return (
    <>
      <Heading size={800}>Manage Clearances</Heading>
      <Text>View and edit the clearances of an individual</Text>

      <ContentCard isLoading={isLoadingPersonnel}>
        <Heading size={600} marginBottom={minorScale(3)}>
          Select Person
        </Heading>
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
              {isFetchingAssignments ? (
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
                  .map((cl) => (
                    <Table.Row key={cl['id']}>
                      <Table.TextCell flexBasis='65%'>
                        {cl['name']}
                      </Table.TextCell>
                      <Table.TextCell flexShrink={0} textAlign='right'>
                        <Button
                          test-id='revoke-clearance-btn'
                          appearance='secondary'
                          onClick={() => onRevokeClearance(cl['id'])}
                          isLoading={loadingRevokeRequests.includes(cl['id'])}
                        >
                          Revoke
                        </Button>
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
