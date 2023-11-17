import {
  Button,
  Dialog,
  Heading,
  minorScale,
  Table,
  Text,
  Spinner,
  Pane,
  toaster,
  majorScale,
  IconButton,
  HelpIcon,
  Tooltip,
  Position,
} from 'evergreen-ui'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import authService from '../apis/authService'
import clearanceService from '../apis/clearanceService'
import PeoplePicker from '../components/PeoplePicker'
import ClearancePicker from '../components/ClearancePicker'
import openInNewTab from '../utils/openInNewTab'
import ContentCard from '../components/ContentCard'
import usePersonnel from '../hooks/usePersonnel'

export default function LiaisonPermissions() {
  const token = useSelector((state) => state.auth.token)

  // CALLS TO API
  const [
    getLiaisonPermissions,
    {
      isFetching: isFetchingPermissions,
      data: permissionData,
      isSuccess: isGetPermissionSuccess,
      isError: isGetPermissionError,
      error: permissionError,
    },
  ] = clearanceService.useLazyGetLiaisonPermissionsQuery()

  const [
    assignLiaisonPermission,
    {
      isLoading: isAssigningPermission,
      data: assignData,
      isSuccess: isAssignSuccess,
      isError: isAssignError,
      error: assignError,
    },
  ] = clearanceService.useAssignLiaisonPermissionMutation()

  const [
    revokeLiaisonPermission,
    {
      data: revokeData,
      isSuccess: isRevokeSuccess,
      isError: isRevokeError,
      error: revokeError,
      originalArgs: revokeArgs,
    },
  ] = clearanceService.useRevokeLiaisonPermissionMutation()

  // UI STATE
  const [tableFilter, setTableFilter] = useState('')
  const [shouldProcessRequest, setShouldProcessRequest] = useState(false)
  const [shouldAddLiaisonPermissionModal, setShouldAddLiaisonPermissionModal] =
    useState(false)
  const [shouldAddLiaisonPermission, setShouldAddLiaisonPermission] =
    useState(false)
  const [shouldCopyLiaisonModal, setShouldCopyLiaisonModal] = useState(false)
  const [shouldCopyLiaison, setShouldCopyLiaison] = useState(false)

  const [clearanceAssignments, setClearanceAssignments] = useState([])
  const [loadingRevokeRequests, setLoadingRevokeRequests] = useState([])

  const [selectedClearances, setSelectedClearances] = useState([])
  const [selectedPersonnel, setSelectedPersonnel] = useState(null)
  const [selectedCopyPersonnel, setSelectedCopyPersonnel] = useState([])
  const {
    personnel,
    personnelQuery,
    setPersonnelQuery,
    length: personnelLength,
    isTyping: isTypingPersonnel,
    isLoading: isLoadingPersonnel,
  } = usePersonnel()

  // UPDATES AFTER API RESPONSES
  useEffect(() => {
    if (isGetPermissionSuccess) {
      setClearanceAssignments(permissionData['clearances'])
    } else if (
      isGetPermissionError &&
      permissionError?.['name'] !== 'AbortError'
    ) {
      setClearanceAssignments([])
      toaster.danger(permissionError ?? 'Could Not Get Permission Data')
    }
  }, [
    isGetPermissionSuccess,
    isGetPermissionError,
    permissionData,
    permissionError,
  ])

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
    } else if (isRevokeError && revokeError?.['name'] !== 'AbortError') {
      setLoadingRevokeRequests((requests) =>
        requests.filter((r) => r !== revokeArgs['clearanceIDs'][0])
      )
      toaster.danger(revokeError ?? 'Revoke Failed. Please try again later.')
    }
  }, [isRevokeSuccess, isRevokeError, revokeData, revokeError, revokeArgs])

  useEffect(() => {
    if (isAssignSuccess) {
      setSelectedClearances([])
      if (shouldCopyLiaison) {
        setClearanceAssignments(assignData['record']['clearances'])
      }
      toaster.success('Permissions Assigned')
      setShouldProcessRequest(true)
    } else if (isAssignError && assignError?.['name'] !== 'AbortError') {
      toaster.danger(assignError ?? 'Request Failed')
    }
  }, [isAssignSuccess, isAssignError, assignData, assignError])

  // EVENT HANDLERS
  useEffect(() => {
    if (selectedPersonnel && !isAssigningPermission) {
      const campusId = selectedPersonnel['raw']['campus_id']

      const request = getLiaisonPermissions({ campusId: campusId }, false)

      return () => {
        request.abort()
      }
    }
  }, [selectedPersonnel, isAssigningPermission])

  const onRevokeClearance = (clearanceId) => {
    if (!selectedPersonnel) return

    setLoadingRevokeRequests((requests) => [...requests, clearanceId])

    revokeLiaisonPermission({
      campusId: selectedPersonnel['raw']['campus_id'],
      clearanceIDs: [clearanceId],
    })
  }

  useEffect(() => {
    if (shouldProcessRequest && selectedPersonnel) {
      // Check if this liaison already has access to the tool. If not, add him or her.
      authService
        .get('/role-accounts?role=Liaison', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
        .then((response) => {
          const liaisonAccounts = response.data['accounts']
          const thisLiaison = liaisonAccounts.find(
            (l) => l['email'] === selectedPersonnel['raw']['email']
          )

          if (!thisLiaison) {
            // Ask if we should add this liaison.
            setShouldAddLiaisonPermissionModal(true)
          } else {
            setShouldAddLiaisonPermissionModal(false)
          }
        })
        .catch((error) => {
          if (
            !error.response.status === 401 &&
            !error.response?.data?.['detail'] === 'Token is expired'
          ) {
            console.error(error)
            setShouldAddLiaisonPermissionModal(false)
          }
        })
    }
  }, [shouldProcessRequest, selectedPersonnel, token])

  useEffect(() => {
    if (shouldAddLiaisonPermission && selectedPersonnel) {
      authService
        .put(
          '/update-account-roles',
          {
            email: selectedPersonnel['raw']['email'],
            add_roles: ['Liaison'],
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        )
        .then(() => {
          toaster.success('User has been granted Liaison access.')
          setShouldProcessRequest(false)
          setShouldAddLiaisonPermissionModal(false)
          setShouldAddLiaisonPermission(false)
        })
        .catch((error) => {
          if (
            !error.response.status === 401 &&
            !error.response?.data?.['detail'] === 'Token is expired'
          ) {
            console.error(error)
            setShouldAddLiaisonPermission(false)
            toaster.danger('There was an error granting access.')
          }
        })
    }
  }, [shouldAddLiaisonPermission, selectedPersonnel, token])

  const submitRequestHandler = async () => {
    if (!selectedPersonnel || selectedClearances.length === 0) return

    setShouldProcessRequest(false)
    setShouldAddLiaisonPermissionModal(false)
    setShouldAddLiaisonPermission(false)

    const clearanceIds = selectedClearances.map((c) => c['id'])

    assignLiaisonPermission({
      campusId: selectedPersonnel['raw']['campus_id'],
      clearanceIDs: clearanceIds,
    })
  }

  useEffect(() => {
    if (
      shouldCopyLiaison &&
      selectedPersonnel.length > 0 &&
      selectedCopyPersonnel.length > 0
    ) {
      const controller = new AbortController()

      // Add user to auth DB and clearance_service DB or update existing records
      selectedCopyPersonnel.forEach((p) => {
        authService
          .put(
            '/update-account-roles',
            {
              email: p.email,
              add_roles: ['Liaison'],
            },
            {
              headers: {
                Authorization: 'Bearer ' + token,
              },
              signal: controller.signal,
            }
          )
          .catch((error) => {
            if (
              !error.response.status === 401 &&
              !error.response?.data?.['detail'] === 'Token is expired'
            ) {
              console.error(error)
              setShouldAddLiaisonPermissionModal(false)
            }
          })

        assignLiaisonPermission({
          campusId: p.campus_id,
          clearanceIDs: clearanceAssignments.map((cl) => cl.id),
        })
      })

      setShouldCopyLiaison(false)
    }
  }, [shouldCopyLiaison, selectedCopyPersonnel, token])

  return (
    <>
      <Heading size={800}>
        Liaison Permissions
        <Tooltip
          content={"Click to view a guide on managing Liaisons' permissions."}
          position={Position.RIGHT}
        >
          <IconButton
            size='small'
            appearance='none'
            icon={HelpIcon}
            test-id='help-button-page'
            onClick={() =>
              openInNewTab(
                'https://ncstate-sat.github.io/clearance-service/#liaison-permissions'
              )
            }
          />
        </Tooltip>
      </Heading>
      <Text>View and edit the clearances a liaison can assign</Text>

      <Dialog
        isShown={shouldAddLiaisonPermissionModal}
        title='Grant Access?'
        cancelLabel={"Don't Grant Access"}
        confirmLabel='Grant Access'
        onCloseComplete={() => {
          setShouldAddLiaisonPermissionModal(false)
          setShouldProcessRequest(false)
        }}
        onCancel={(close) => {
          setShouldProcessRequest(false)
          close()
        }}
        onConfirm={(close) => {
          setShouldAddLiaisonPermission(true)
          close()
        }}
      >
        You've just given this person clearances to assign, but this person does
        not currently have access to the tool as a Liaison. Would you like to
        give them access to use this tool?
      </Dialog>

      <Dialog
        isShown={shouldCopyLiaisonModal}
        title='Copy Liaison?'
        cancelLabel={'Cancel'}
        confirmLabel='Copy Liaison'
        onCloseComplete={() => {
          setShouldCopyLiaisonModal(false)
        }}
        onCancel={(close) => {
          close()
        }}
        onConfirm={(close) => {
          setShouldCopyLiaison(true)
          close()
        }}
      >
        Select liaisons to copy permissions to
        <ContentCard header='Select Liaison' isLoading={isLoadingPersonnel}>
          <TagInput
            tagSubmitKey='enter'
            width='100%'
            test-id='dialog-personnel-input'
            values={selectedCopyPersonnel.map((p) =>
              `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`.trim()
            )}
            onChange={(selected) => {
              if (selected.length > 1) {
                selected = [selected[selected.length - 1]]
              }

              const personnelObjects = []
              const allPersonnel = [...personnel, ...selectedCopyPersonnel]
              const personnelStrings = allPersonnel.map((p) =>
                `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`.trim()
              )
              selected.forEach((s) => {
                const i = personnelStrings.indexOf(s)
                if (i >= 0) {
                  personnelObjects.push(allPersonnel[i])
                }
              })
              setSelectedCopyPersonnel(personnelObjects)
            }}
            autocompleteItems={autocompletePersonnel}
            onInputChange={(e) => setPersonnelQuery(e.target.value)}
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
      </Dialog>

      <PeoplePicker
        header='Select Liaison'
        selectedPersonnel={selectedPersonnel}
        setSelectedPersonnel={setSelectedPersonnel}
      />

      <ClearancePicker
        selectedClearances={selectedClearances}
        setSelectedClearances={setSelectedClearances}
      />

      <Button
        appearance='primary'
        intent='success'
        isLoading={isAssigningPermission}
        disabled={selectedClearances.length === 0 || !selectedPersonnel}
        onClick={() => {
          submitRequestHandler()
        }}
        test-id='assign-permission-btn'
      >
        Give Permission
      </Button>

      <Button
        appearance='primary'
        intent='success'
        // isLoading={isAssigningPermission}
        disabled={selectedPersonnel.length === 0}
        onClick={() => {
          setShouldCopyLiaisonModal(true)
        }}
        test-id='copy-liaison-btn'
        marginLeft={minorScale(3)}
      >
        Copy Liaison
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
