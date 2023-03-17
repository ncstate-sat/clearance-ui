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

import usePersonnel from '../hooks/usePersonnel'

export default function ManageClearance() {
  const [
    getAssignments,
    {
      isFetching: isLoadingAssignments,
      data: getAssignmentsData,
      isSuccess: isGetSuccess,
    },
  ] = clearanceService.useLazyGetAssignmentsQuery()

  const [
    revokeAssignments,
    {
      data: revokeAssignmentData,
      isSuccess: isRevokeSuccess,
      isError: isRevokeError,
      originalArgs: revokeArgs,
    },
  ] = clearanceService.useRevokeClearancesMutation()

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

  // Respond to API response to clearance assignment request.
  useEffect(() => {
    if (isGetSuccess) {
      setClearanceAssignments(getAssignmentsData['assignments'])
    }
  }, [isGetSuccess, getAssignmentsData])

  // Respond to API response to revoke request.
  useEffect(() => {
    if (isRevokeSuccess) {
      setClearanceAssignments((prevAssignments) =>
        prevAssignments
          .filter((a) => a['id'] !== revokeArgs['clearanceIDs'][0])
          .map((a) => ({ ...a }))
      )
      setLoadingRevokeRequests((requests) =>
        requests.filter((r) => r !== revokeArgs['clearanceIDs'][0])
      )
      toaster.success('Revoke Succeeded')
    } else if (isRevokeError) {
      setLoadingRevokeRequests((requests) =>
        requests.filter((r) => r !== revokeArgs['clearanceIDs'][0])
      )
      toaster.success('Revoke Failed')
    }
  }, [isRevokeSuccess, isRevokeError, revokeAssignmentData, revokeArgs])

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
  }

  return (
    <>
      <Heading size={800}>Manage Clearances</Heading>
      <Text>View and edit the clearances of an individual</Text>

      <ContentCard>
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

      {selectedPersonnel.length > 0 && (
        <Table>
          <Table.Head>
            <Table.SearchHeaderCell
              flexBasis='65%'
              value={tableFilter}
              onChange={setTableFilter}
            />
            <Table.TextHeaderCell flexShrink={0}>Actions</Table.TextHeaderCell>
          </Table.Head>
          <Table.Body>
            {isLoadingAssignments ? (
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
      )}
    </>
  )
}

ManageClearance.auth = true
