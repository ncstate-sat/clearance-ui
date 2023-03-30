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
import { useMemo, useState, useEffect } from 'react'
import clearanceService from '../apis/clearanceService'
import ContentCard from '../components/ContentCard'
import NoResultsText from '../components/NoResultsText'

import useClearance from '../hooks/useClearance'
import usePersonnel from '../hooks/usePersonnel'

export default function LiaisonPermissions() {
  // CALLS TO API
  const [
    getLiaisonPermissions,
    {
      isFetching: isFetchingPermissions,
      data: permissionData,
      isSuccess: getPermissionSuccess,
      isError: getPermissionError,
    },
  ] = clearanceService.useLazyGetLiaisonPermissionsQuery()

  const [
    assignLiaisonPermission,
    {
      isLoading: isAssigningPermission,
      data: assignData,
      isSuccess: assignSuccess,
      isError: assignError,
    },
  ] = clearanceService.useAssignLiaisonPermissionMutation()

  const [
    revokeLiaisonPermission,
    {
      data: revokeData,
      isSuccess: revokeSuccess,
      isError: revokeError,
      originalArgs: revokeArgs,
    },
  ] = clearanceService.useRevokeLiaisonPermissionMutation()

  // UI STATE
  const [tableFilter, setTableFilter] = useState('')

  const [clearanceAssignments, setClearanceAssignments] = useState([])
  const [loadingRevokeRequests, setLoadingRevokeRequests] = useState([])

  const [selectedClearances, setSelectedClearances] = useState([])
  const {
    clearances,
    clearanceQuery,
    setClearanceQuery,
    length: clearancesLength,
    isTyping: isTypingClearances,
    isLoading: isLoadingClearances,
  } = useClearance()

  const [selectedPersonnel, setSelectedPersonnel] = useState([])
  const {
    personnel,
    personnelQuery,
    setPersonnelQuery,
    length: personnelLength,
    isTyping: isTypingPersonnel,
    isLoading: isLoadingPersonnel,
  } = usePersonnel()

  // Suggestion strings for clearances.
  const autocompleteClearances = useMemo(() => {
    const clearanceNames = clearances.map((c) => c['name'])
    const selectedClearanceNames = selectedClearances.map((c) => c['name'])
    return clearanceNames
      .filter((i) => !selectedClearanceNames.includes(i))
      .sort()
  }, [clearances, selectedClearances])

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

  // UPDATES AFTER API RESPONSES
  useEffect(() => {
    if (getPermissionSuccess) {
      setClearanceAssignments(permissionData['clearances'])
    } else if (getPermissionError) {
      setClearanceAssignments([])
    }
  }, [getPermissionSuccess, getPermissionError, permissionData])

  useEffect(() => {
    if (revokeSuccess) {
      setClearanceAssignments((prevAssignments) =>
        prevAssignments
          .filter((a) => a['id'] !== revokeArgs['clearanceIDs'][0])
          .map((a) => ({ ...a }))
      )
      setLoadingRevokeRequests((requests) =>
        requests.filter((r) => r !== revokeArgs['clearanceIDs'][0])
      )
      toaster.success('Revoke Succeeded')
    } else if (revokeError) {
      setLoadingRevokeRequests((requests) =>
        requests.filter((r) => r !== revokeArgs['clearanceIDs'][0])
      )
      toaster.success('Revoke Failed')
    }
  }, [revokeSuccess, revokeError, revokeData, revokeArgs])

  useEffect(() => {
    if (assignSuccess) {
      setSelectedClearances([])
      toaster.success('Permissions Assigned')
    } else if (assignError) {
      toaster.danger('Request Failed')
    }
  }, [assignSuccess, assignError, assignData])

  // EVENT HANDLERS
  useEffect(() => {
    if (selectedPersonnel.length > 0 && !isAssigningPermission) {
      const campusId = selectedPersonnel[0]['campus_id']

      const request = getLiaisonPermissions({ campusId: campusId }, false)

      return () => {
        request.abort()
      }
    }
  }, [selectedPersonnel, isAssigningPermission])

  const onRevokeClearance = (clearanceId) => {
    if (selectedPersonnel.length === 0) return

    setLoadingRevokeRequests((requests) => [...requests, clearanceId])

    revokeLiaisonPermission({
      campusId: selectedPersonnel[0]['campus_id'],
      clearanceIDs: [clearanceId],
    })
  }

  const submitRequestHandler = () => {
    if (selectedPersonnel.length === 0 || selectedClearances.length === 0)
      return

    const clearanceIds = selectedClearances.map((c) => c['id'])

    assignLiaisonPermission({
      campusId: selectedPersonnel[0]['campus_id'],
      clearanceIDs: clearanceIds,
    })
  }

  return (
    <>
      <Heading size={800}>Manage Liaison Permissions</Heading>
      <Text>View and edit the clearances a liaison can assign</Text>

      <ContentCard isLoading={isLoadingPersonnel}>
        <Heading size={600} marginBottom={minorScale(3)}>
          Select Liaison
        </Heading>
        <TagInput
          tagSubmitKey='enter'
          width='100%'
          values={selectedPersonnel.map(
            (p) =>
              `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`
          )}
          onChange={(selected) => {
            if (selected.length > 1) {
              selected = [selected[selected.length - 1]]
            }

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
            const clearanceStrings = allClearances.map((c) => `${c['name']}`)
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
        isLoading={isAssigningPermission}
        disabled={
          selectedClearances.length === 0 || selectedPersonnel.length === 0
        }
        onClick={submitRequestHandler}
        test-id='assign-permission-btn'
      >
        Give Permission
      </Button>

      <Table marginTop={minorScale(6)}>
        <Table.Head>
          <Table.SearchHeaderCell
            flexBasis='65%'
            value={tableFilter}
            onChange={setTableFilter}
          />
          <Table.TextHeaderCell flexShrink={0}>Actions</Table.TextHeaderCell>
        </Table.Head>
        <Table.Body>
          {isFetchingPermissions ? (
            <Pane className='center' padding={minorScale(6)}>
              <Spinner size={majorScale(4)} marginX='auto' />
            </Pane>
          ) : clearanceAssignments.length === 0 ? (
            <Pane className='center' padding={minorScale(6)}>
              <Text>No Permissions</Text>
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
                  <Table.TextCell flexBasis='65%'>{cl['name']}</Table.TextCell>
                  <Table.TextCell flexShrink={0} textAlign='right'>
                    <Button
                      test-id='revoke-permission-btn'
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
    </>
  )
}

LiaisonPermissions.auth = true
