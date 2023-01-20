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
import clearanceService from '../../apis/clearanceService'
import ContentCard from '../../components/ContentCard'
import Layout from '../../components/document/Layout'

import usePersonnel from '../../hooks/usePersonnel'

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

  const [clearanceAssignments, setClearanceAssignments] = useState([])
  const [loadingRevokeRequests, setLoadingRevokeRequests] = useState([])

  const [selectedPersonnel, setSelectedPersonnel] = useState([])
  const { personnel, setPersonnelQuery } = usePersonnel()
  const personnelStrings = personnel.map(
    (p) =>
      `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`
  )

  const autocompletePersonnel = useMemo(
    () => personnelStrings.filter((i) => !selectedPersonnel.includes(i)),
    [personnelStrings, selectedPersonnel]
  )

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

  useEffect(() => {
    if (isGetSuccess) {
      setClearanceAssignments(getAssignmentsData['assignments'])
    }
  }, [isGetSuccess, getAssignmentsData])

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

  useEffect(() => {
    if (selectedPersonnel.length > 0) {
      const campusId =
        selectedPersonnel.length > 0
          ? personnel.find((p) => {
              return (
                `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]` ===
                selectedPersonnel[0]
              )
            })?.['campus_id']
          : null

      const request = getAssignments({ campusId: campusId })

      return () => {
        request.abort()
      }
    }
  }, [selectedPersonnel])

  const onRevokeClearance = (clearanceId) => {
    setLoadingRevokeRequests((requests) => [...requests, clearanceId])

    const selectedPerson = getPersonnel()

    revokeAssignments({
      assigneeIDs: [selectedPerson[0]['campus_id']],
      clearanceIDs: [clearanceId],
    })
  }

  return (
    <Layout title='Manage'>
      <Heading size={800}>Manage Clearances</Heading>
      <Text>View and edit the clearances of an individual</Text>

      <ContentCard>
        <Heading size={600} marginBottom={minorScale(3)}>
          Select Person
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

      <Table>
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
                  test-id='revoke-clearance-btn'
                  appearance='secondary'
                  onClick={() => onRevokeClearance(cl['id'])}
                  isLoading={loadingRevokeRequests.includes(cl['id'])}
                >
                  Revoke
                </Button>
              </Table.TextCell>
            </Table.Row>
          ))}
          {isLoadingAssignments && (
            <Pane className='center' padding={minorScale(6)}>
              <Spinner size={majorScale(4)} marginX='auto' />
            </Pane>
          )}
        </Table.Body>
      </Table>
    </Layout>
  )
}

ManageClearance.auth = true
