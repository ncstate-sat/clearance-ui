import {
  Button,
  Heading,
  minorScale,
  Table,
  TagInput,
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
import ClearancePicker from '../components/ClearancePicker'
import NoResultsText from '../components/NoResultsText'
import openInNewTab from '../utils/openInNewTab'

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
      .catch((error) => {
        setLoadingRevokeRequests((requests) =>
          requests.filter((r) => r !== clearanceId)
        )
        toaster.danger(error ?? 'Revoke Failed. Please try again later.')
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
          tagSubmitKey='enter'
          width='100%'
          values={selectedPersonnel.map((p) =>
            `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`.trim()
          )}
          onChange={(selected) => {
            const personnelObjects = []
            const allPersonnel = [...personnel, ...selectedPersonnel]
            const personnelStrings = allPersonnel.map((p) =>
              `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`.trim()
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
