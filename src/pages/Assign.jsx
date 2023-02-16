import {
    Heading,
    minorScale,
    TagInput,
    Text,
    Button,
    toaster,
  } from 'evergreen-ui'
  import { useMemo, useState, useEffect } from 'react'
  import ContentCard from '../components/ContentCard'
  import Layout from '../components/Layout'
  
  import useClearance from '../hooks/useClearance'
  import usePersonnel from '../hooks/usePersonnel'
  
  import clearanceService from '../apis/clearanceService'
  
  export default function AssignClearance() {
    const [assignClearance, { isLoading, isSuccess, isError, data }] =
      clearanceService.useAssignClearancesMutation()
  
    const [selectedClearances, setSelectedClearances] = useState([])
    const { clearances, setClearanceQuery } = useClearance()
    const clearanceNames = clearances.map((c) => c['name'])
  
    const [selectedPersonnel, setSelectedPersonnel] = useState([])
    const { personnel, setPersonnelQuery } = usePersonnel()
    const personnelStrings = personnel.map(
      (p) =>
        `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`
    )
  
    // const [startDate, setStartDate] = useState(null)
    // const [endDate, setEndDate] = useState(null)
  
    const autocompleteClearances = useMemo(
      () => clearanceNames.filter((i) => !selectedClearances.includes(i)),
      [clearanceNames, selectedClearances]
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
  
    const getClearances = () => {
      let clearanceObjects = []
      clearances.forEach((c) => {
        if (selectedClearances.includes(c['name'])) {
          clearanceObjects.push(c)
        }
      })
      return clearanceObjects
    }
  
    useEffect(() => {
      if (isSuccess) {
        setSelectedPersonnel([])
        setSelectedClearances([])
        toaster.success('Request Submitted')
      } else if (isError) {
        toaster.danger('Request Failed')
      }
    }, [isSuccess, isError, data])
  
    const submitRequestHandler = async () => {
      const selectedPersonnelObjects = getPersonnel()
      const selectedClearanceObjects = getClearances()
      const assigneeIds = selectedPersonnelObjects.map((p) => p['campus_id'])
      const clearanceIds = selectedClearanceObjects.map((c) => c['id'])
  
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
  