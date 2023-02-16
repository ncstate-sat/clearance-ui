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
  import Layout from '../components/Layout'
  
  import useClearance from '../hooks/useClearance'
  import usePersonnel from '../hooks/usePersonnel'
  
  export default function LiaisonPermissions() {
    // CALLS TO API
    const [
      getLiaisonPermissions,
      {
        isFetching: isLoadingPermissions,
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
    const [clearanceAssignments, setClearanceAssignments] = useState([])
    const [loadingRevokeRequests, setLoadingRevokeRequests] = useState([])
  
    const [selectedClearances, setSelectedClearances] = useState([])
    const { clearances, setClearanceQuery } = useClearance()
    const clearanceNames = clearances.map((c) => c['name'])
  
    const [selectedPersonnel, setSelectedPersonnel] = useState([])
    const { personnel, setPersonnelQuery } = usePersonnel()
    const personnelStrings = personnel.map(
      (p) =>
        `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`
    )
  
    const autocompleteClearances = useMemo(
      () => clearanceNames.filter((i) => !selectedClearances.includes(i)),
      [clearanceNames, selectedClearances]
    )
  
    const autocompletePersonnel = useMemo(
      () => personnelStrings.filter((i) => !selectedPersonnel.includes(i)),
      [personnelStrings, selectedPersonnel]
    )
  
    // UTILITY FUNCTIONS
    const getClearances = () => {
      let clearanceObjects = []
      clearances.forEach((c) => {
        if (selectedClearances.includes(c['name'])) {
          clearanceObjects.push(c)
        }
      })
      return clearanceObjects
    }
  
    const getPersonnel = () => {
      let personnelObjects = []
      personnel.forEach((p) => {
        const personString = `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`
        if (selectedPersonnel.includes(personString)) {
          personnelObjects.push(p)
        }
      })
      return personnelObjects
    }
  
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
        const campusId =
          selectedPersonnel.length > 0
            ? personnel.find((p) => {
                return (
                  `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]` ===
                  selectedPersonnel[0]
                )
              })?.['campus_id']
            : null
  
        const request = getLiaisonPermissions({ campusId: campusId }, false)
  
        return () => {
          request.abort()
        }
      }
    }, [selectedPersonnel, isAssigningPermission])
  
    const onRevokeClearance = (clearanceId) => {
      setLoadingRevokeRequests((requests) => [...requests, clearanceId])
  
      const selectedPerson = getPersonnel()
  
      revokeLiaisonPermission({
        campusId: selectedPerson[0]['campus_id'],
        clearanceIDs: [clearanceId],
      })
    }
  
    const submitRequestHandler = () => {
      const selectedClearanceObjects = getClearances()
      const clearanceIds = selectedClearanceObjects.map((c) => c['id'])
      const selectedPerson = getPersonnel()
  
      assignLiaisonPermission({
        campusId: selectedPerson[0]['campus_id'],
        clearanceIDs: clearanceIds,
      })
    }
  
    return (
      <Layout title='Liaison Permissions'>
        <Heading size={800}>Manage Liaison Permissions</Heading>
        <Text>View and edit the clearances a liaison can assign</Text>
  
        <ContentCard>
          <Heading size={600} marginBottom={minorScale(3)}>
            Select Liaison
          </Heading>
          <TagInput
            tagSubmitKey='enter'
            width='100%'
            values={selectedPersonnel}
            onChange={setSelectedPersonnel}
            autocompleteItems={autocompletePersonnel}
            onInputChange={(e) => setPersonnelQuery(e.target.value)}
            test-id='personnel-input'
          />
        </ContentCard>
  
        <ContentCard>
          <Heading size={600} marginBottom={minorScale(3)}>
            Select Clearance
          </Heading>
          <TagInput
            tagSubmitKey='enter'
            width='100%'
            values={selectedClearances}
            onChange={setSelectedClearances}
            autocompleteItems={autocompleteClearances}
            onInputChange={(e) => setClearanceQuery(e.target.value)}
            test-id='clearance-input'
          />
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
            <Table.SearchHeaderCell flexBasis='65%' />
            <Table.TextHeaderCell flexShrink={0}>Actions</Table.TextHeaderCell>
          </Table.Head>
          <Table.Body>
            {clearanceAssignments.map((cl) => (
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
            ))}
            {isLoadingPermissions && (
              <Pane className='center' padding={minorScale(6)}>
                <Spinner size={majorScale(4)} marginX='auto' />
              </Pane>
            )}
          </Table.Body>
        </Table>
      </Layout>
    )
  }
  
  LiaisonPermissions.auth = true
  