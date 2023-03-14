import {
  Pane,
  Heading,
  minorScale,
  TagInput,
  Text,
  Button,
  toaster,
} from 'evergreen-ui'
import { useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import ContentCard from '../components/ContentCard'
import Layout from '../components/Layout'

import useClearance from '../hooks/useClearance'
import usePersonnel from '../hooks/usePersonnel'

import clearanceService from '../apis/clearanceService'

const NoResultsText = styled(Pane)`
  display: ${({ $visible }) => ($visible ? 'block' : 'none')};
  position: absolute;
  bottom: 4px;
  left: 0;
  right: 0;
  text-align: center;
  color: #cccccc;
  font-size: 0.8rem;
`

export default function AssignClearance() {
  const [assignClearance, { isLoading, isSuccess, isError, data }] =
    clearanceService.useAssignClearancesMutation()

  const [selectedClearances, setSelectedClearances] = useState([])
  const {
    clearances,
    setClearanceQuery,
    length: clearancesLength,
    isTyping: isTypingClearances,
    isLoading: isLoadingClearances,
  } = useClearance()

  const [selectedPersonnel, setSelectedPersonnel] = useState([])
  const {
    personnel,
    setPersonnelQuery,
    length: personnelLength,
    isTyping: isTypingPersonnel,
    isLoading: isLoadingPersonnel,
  } = usePersonnel()

  // const [startDate, setStartDate] = useState(null)
  // const [endDate, setEndDate] = useState(null)

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

  // Handle response from Assign call.
  useEffect(() => {
    if (isSuccess) {
      setSelectedPersonnel([])
      setSelectedClearances([])
      toaster.success('Request Submitted')
    } else if (isError) {
      toaster.danger('Request Failed')
    }
  }, [isSuccess, isError, data])

  // Submit Assign request.
  const submitRequestHandler = async () => {
    const assigneeIds = selectedPersonnel.map((p) => p['campus_id'])
    const clearanceIds = selectedClearances.map((c) => c['id'])

    assignClearance({ assigneeIDs: assigneeIds, clearanceIDs: clearanceIds })
  }

  return (
    <Layout title='Assign'>
      <Heading size={800}>Assign Clearances</Heading>
      <Text>Add clearances to an individual</Text>

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
            !isLoadingPersonnel && !isTypingPersonnel && personnelLength === 0
          }
        >
          No Personnel Found
        </NoResultsText>
      </ContentCard>

      <ContentCard>
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
            clearancesLength === 0
          }
        >
          No Clearances Found
        </NoResultsText>
      </ContentCard>

      {/* <ContentCard>
          <Heading size={600} marginBottom={minorScale(3)}>
            Set Start & End Times
          </Heading>
          <Timeframe
            startDateTime={startDate}
            endDateTime={endDate}
            onChangeStartTime={setStartDate}
            onChangeEndTime={setEndDate}
          />
        </ContentCard> */}

      <Button
        appearance='primary'
        intent='success'
        isLoading={isLoading}
        disabled={
          selectedClearances.length === 0 || selectedPersonnel.length === 0
        }
        onClick={submitRequestHandler}
        test-id='assign-clearance-btn'
      >
        Assign
      </Button>
    </Layout>
  )
}

AssignClearance.auth = true
