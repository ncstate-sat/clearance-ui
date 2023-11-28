import {
  Button,
  Heading,
  minorScale,
  Table,
  Text,
  Spinner,
  Pane,
  WarningSignIcon,
  Tooltip,
  toaster,
  majorScale,
  Position,
  IconButton,
  HelpIcon,
} from 'evergreen-ui'
import { useMemo, useState, useEffect, useRef, Fragment } from 'react'
import clearanceService from '../apis/clearanceService'
import ContentCard from '../components/ContentCard'
import TagInput, { createTagOption } from '../components/TagInput'
import ClearancePicker from '../components/ClearancePicker'
import NoResultsText from '../components/NoResultsText'
import openInNewTab from '../utils/openInNewTab'
import createTagInputString from '../utils/createTagInputString'
import SplitButton from '../components/SplitButton'
import Timeframe from '../components/Timeframe'

import usePersonnel from '../hooks/usePersonnel'
import useBulkUpload from '../hooks/useBulkUpload'

export default function ManageClearance() {
  const uploadRef = useRef()

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

  const [
    getBulkPersonnel,
    {
      isLoading: isBulkPersonnelLoading,
      isSuccess: isBulkPersonnelSuccess,
      isError: isBulkPersonnelError,
      data: bulkPersonnelData,
      error: bulkPersonnelError,
    },
  ] = clearanceService.useGetBulkPersonnelMutation()

  const [tableFilter, setTableFilter] = useState('')
  const [showTimeframePicker, setShowTimeframePicker] = useState(false)
  const [startTime, setStartTime] = useState()

  const [clearanceAssignments, setClearanceAssignments] = useState([])
  const [loadingRevokeRequests, setLoadingRevokeRequests] = useState([])

  const [bulkPersonnelNotFound, setBulkPersonnelNotFound] = useState([])
  const {
    setFile,
    data: bulkUploadData,
    error: bulkUploadError,
  } = useBulkUpload()

  useEffect(() => {
    if (bulkUploadError) toaster.warning(bulkUploadError)
  }, [bulkUploadError])

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

  // Suggestion strings for personnel.
  const autocompletePersonnel = useMemo(
    () =>
      personnel
        .map((p) => createTagOption(createTagInputString(p), p))
        .sort((a, b) => a['first_name'] > b['first_name']),
    [personnel, selectedPersonnel]
  )

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
      setBulkPersonnelNotFound([])
      toaster.success('Clearance(s) Assigned Successfully')
    } else if (isAssignError && assignError?.['name'] !== 'AbortError') {
      toaster.danger(assignError ?? 'Request Failed')
    }
  }, [isAssignSuccess, isAssignError, assignData])

  // Fetch clearance assignments for the selected person.
  useEffect(() => {
    if (selectedPersonnel.length === 1) {
      const campusId = selectedPersonnel[0]['raw']['campus_id']

      const request = getAssignments({ campusId: campusId })

      return () => {
        request.abort()
      }
    }
  }, [selectedPersonnel])

  const onRevokeClearance = (clearanceId) => {
    setLoadingRevokeRequests((requests) => [...requests, clearanceId])

    revokeAssignments({
      assigneeIDs: [selectedPersonnel[0]['raw']['campus_id']],
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
      .catch((error) => {
        setLoadingRevokeRequests((requests) =>
          requests.filter((r) => r !== clearanceId)
        )
        toaster.danger(error ?? 'Revoke Failed. Please try again later.')
      })
  }

  // Submit Assign request.
  const onAssignClearance = async () => {
    const assigneeIds = selectedPersonnel.map((p) => p['raw']['campus_id'])
    const clearanceIds = selectedClearances.map((c) => c['raw']['id'])

    assignClearance({
      assigneeIDs: assigneeIds,
      clearanceIDs: clearanceIds,
      startTime: startTime ? startTime.toISOString() : null,
    })
      .unwrap()
      .then(() => {
        if (!startTime || startTime <= new Date()) {
          setClearanceAssignments((prev) => {
            const oldValues = JSON.parse(JSON.stringify(prev))
            const newValues = selectedClearances.map((cl) => ({
              ...cl['raw'],
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
        }
      })
  }

  useEffect(() => {
    if (isBulkPersonnelSuccess) {
      const personnel = bulkPersonnelData['personnel']
      const notFound = bulkPersonnelData['not_found']
      setSelectedPersonnel(personnel)
      setBulkPersonnelNotFound(notFound)
    } else if (
      isBulkPersonnelError &&
      bulkPersonnelError?.['name'] !== 'AbortError'
    ) {
      toaster.danger(bulkPersonnelError ?? 'Request Failed')
    }
  }, [
    isBulkPersonnelSuccess,
    isBulkPersonnelError,
    bulkPersonnelData,
    bulkPersonnelError,
  ])

  useEffect(() => {
    if (bulkUploadData.length > 0) {
      const parsedInput = [
        ...new Set(bulkUploadData.map((s) => ({ text: s, isLoading: true }))),
      ]
      setBulkPersonnelNotFound([])
      getBulkPersonnel({ values: parsedInput.map((i) => i['text']) })
    }
  }, [bulkUploadData])

  const onDownloadTemplate = () => {
    const a = document.createElement('a')
    a.href = '/personnel.csv'
    a.target = '_blank'
    a.download = 'personnel_template'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const bulkUploadTable = useMemo(() => {
    if (bulkPersonnelNotFound.length === 0) return null

    return (
      <Table marginTop='1rem' test-id='bulk-upload-table'>
        <Table.Body>
          {bulkPersonnelNotFound.map((n) => (
            <Table.Row key={JSON.stringify(n)}>
              <Table.TextCell>{n}</Table.TextCell>
              <Table.TextCell textAlign='right' flexBasis={100} flexGrow={0}>
                <Tooltip
                  position={Position.RIGHT}
                  content='This person is not in the system and will not be assigned any clearances.'
                >
                  <WarningSignIcon color='danger' />
                </Tooltip>
              </Table.TextCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }, [bulkPersonnelNotFound])

  return (
    <>
      <Heading size={800}>
        Assign & Manage Clearances
        <Tooltip
          content={'Click to view a guide on managing clearances.'}
          position={Position.RIGHT}
        >
          <IconButton
            size='small'
            appearance='none'
            icon={HelpIcon}
            test-id='help-button-page'
            onClick={() =>
              openInNewTab(
                'https://ncstate-sat.github.io/clearance-service/#assign-and-manage-clearances'
              )
            }
          />
        </Tooltip>
      </Heading>
      <Text>View and edit the clearances of an individual</Text>

      <ContentCard
        isLoading={isLoadingPersonnel}
        helpLink={'https://ncstate-sat.github.io/clearance-service/'}
      >
        <Pane
          display='flex'
          flexDirection='row'
          justifyContent='space-between'
          marginBottom={minorScale(3)}
        >
          <Heading size={600} display='inline-block'>
            Select Person
          </Heading>
          <input
            style={{ display: 'none' }}
            ref={uploadRef}
            type='file'
            test-id='file-upload'
            onChange={(event) => setFile(event.target.files[0])}
          />
          <Pane>
            <Button
              onClick={onDownloadTemplate}
              marginRight='0.5rem'
              appearance='minimal'
            >
              Download Template CSV
            </Button>
            <Tooltip
              content='Up to 20 people can be added via CSV.'
              position={Position.TOP_RIGHT}
            >
              <Button
                onClick={() => uploadRef?.current?.click()}
                isLoading={isBulkPersonnelLoading}
                test-id='choose-csv-btn'
              >
                Choose CSV
              </Button>
            </Tooltip>
          </Pane>
        </Pane>
        <TagInput
          inputValue={personnelQuery}
          onInputChange={setPersonnelQuery}
          value={selectedPersonnel}
          onChange={setSelectedPersonnel}
          suggestions={autocompletePersonnel}
          width='100%'
        />
        {bulkUploadTable}
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
          <ClearancePicker
            selectedClearances={selectedClearances}
            setSelectedClearances={setSelectedClearances}
          />

          {showTimeframePicker && (
            <ContentCard header='Select Timeframe'>
              <Timeframe
                startDateTime={startTime}
                onChangeStartTime={setStartTime}
              />
            </ContentCard>
          )}

          <SplitButton
            options={['Assign', 'Assign Future']}
            onClick={onAssignClearance}
            onChangeMode={(mode) => {
              if (mode === 'Assign Future') {
                setShowTimeframePicker(true)
              } else {
                setShowTimeframePicker(false)
              }
            }}
            width='10rem'
            marginTop='1rem'
            marginBottom='1.5rem'
            isLoading={isAssignLoading}
          />

          <Table test-id='clearances-table'>
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
                          <div style={{ display: 'inline-block' }}>
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
