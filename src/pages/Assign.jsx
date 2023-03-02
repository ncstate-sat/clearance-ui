import {
  Heading,
  minorScale,
  TagInput,
  Text,
  Button,
  Textarea,
  Table,
  TickCircleIcon,
  WarningSignIcon,
  Pane,
  Switch,
  Spinner,
  Tooltip,
  Position,
  toaster,
} from 'evergreen-ui'
import { useMemo, useState, useEffect } from 'react'
import ContentCard from '../components/ContentCard'
import Layout from '../components/Layout'

import useClearance from '../hooks/useClearance'
import usePersonnel from '../hooks/usePersonnel'

import clearanceService from '../apis/clearanceService'

import axios from 'axios'
import { useSelector } from 'react-redux'
import getEnvVariable from '../utils/getEnvVariable'

export default function AssignClearance() {
  const token = useSelector((state) => state.auth.token)

  const [assignClearance, { isLoading, isSuccess, isError, data }] =
    clearanceService.useAssignClearancesMutation()

  const [bulkAssign, setBulkAssign] = useState(false)
  const [isVerifyingBulkPersonnel, setIsVerifyingBulkPersonnel] =
    useState(false)
  const [bulkPersonnelText, setBulkPersonnelText] = useState('')
  const [bulkPersonnel, setBulkPersonnel] = useState([])

  const [selectedClearances, setSelectedClearances] = useState([])
  const { clearances, setClearanceQuery } = useClearance()

  const [selectedPersonnel, setSelectedPersonnel] = useState([])
  const { personnel, setPersonnelQuery } = usePersonnel()

  // const [startDate, setStartDate] = useState(null)
  // const [endDate, setEndDate] = useState(null)

  // Suggestion strings for clearances.
  const autocompleteClearances = useMemo(() => {
    const clearanceNames = clearances.map((c) => c['name'])
    const selectedClearanceNames = selectedClearances.map((c) => c['name'])
    return clearanceNames.filter((i) => !selectedClearanceNames.includes(i))
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
    return personnelStrings.filter((i) => !selectedPersonnelStrings.includes(i))
  }, [personnel, selectedPersonnel])

  useEffect(() => {
    if (!bulkAssign && bulkPersonnel.length > 0) {
      setBulkPersonnel([])
    }
  }, [bulkAssign])

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

  // Verify that the text matches people in the system.
  const verifyBulkPersonnelData = async () => {
    let strings = bulkPersonnelText.match(/([^\n]+)/g) || []
    strings = [...new Set(strings.map((s) => ({ text: s, isLoading: true })))]
    setBulkPersonnel(strings)
    await inefficientlyVerifyPersonnelData(strings)
  }

  // Submit Assign request.
  const submitRequestHandler = async () => {
    const assigneeIds = selectedPersonnel.map((p) => p['campus_id'])
    const clearanceIds = selectedClearances.map((c) => c['id'])

    assignClearance({ assigneeIDs: assigneeIds, clearanceIDs: clearanceIds })
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
    <Layout title='Assign'>
      <Heading size={800}>Assign Clearances</Heading>
      <Text>Add clearances to an individual</Text>

      <ContentCard>
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
