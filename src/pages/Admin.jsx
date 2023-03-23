import {
  Button,
  Heading,
  minorScale,
  Table,
  TagInput,
  Text,
  toaster,
} from 'evergreen-ui'
import { useMemo, useCallback, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import ContentCard from '../components/ContentCard'
import FullWidthSpinner from '../components/FullWidthSpinner'

import usePersonnel from '../hooks/usePersonnel'
import authService from '../apis/authService'

export default function ManageClearance() {
  const token = useSelector((state) => state.auth.token)

  const [addingRoles, setAddingRoles] = useState([]) // Roles being added to the selected personnel.
  const [removingRoles, setRemovingRoles] = useState([]) // Roles being removed from the clicked personnel.
  const [users, setUsers] = useState([]) // All users in all lists.

  const [selectedPersonnel, setSelectedPersonnel] = useState([]) // Strings selected from the people picker.
  const { personnel, setPersonnelQuery } = usePersonnel() // Query for the people picker and get an array of personnel.

  const [adminSearchQuery, setAdminSearchQuery] = useState('') // Search filter for the admin list.
  const [liaisonSearchQuery, setLiaisonSearchQuery] = useState('') // Search filter for the liaison list.
  const [isLoadingUsers, setIsLoadingUsers] = useState(false) // Is loading users into the lists.

  // The autocomplete strings shown in the people picker (not already picked).
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
  }, [selectedPersonnel, personnel])

  // Get selected people strings as personnel objects.
  const getPersonnel = useCallback(
    (personnelString) => {
      const person = personnel.find((p) => {
        const s = `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`
        return s === personnelString
      })
      return person
    },
    [personnel]
  )

  // Array of email addresses being removed currently.
  const removingEmails = removingRoles.map((r) => r['email'])

  // Give permission to user.
  useEffect(() => {
    // Make sure a person is selected first.
    if (selectedPersonnel.length === 0) {
      if (addingRoles.length > 0) {
        setAddingRoles([])
      }
      return
    }
    const selectedEmail = selectedPersonnel[0]['email']

    const controller = new AbortController()

    authService
      .put(
        '/update-account-roles',
        {
          email: selectedEmail,
          add_roles: addingRoles,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
          signal: controller.signal,
        }
      )
      .then((response) => {
        const account = response.data['account']
        setUsers((prevUsers) => {
          const newUsers = prevUsers.filter(
            (u) => u['email'] !== account['email']
          )
          newUsers.push(account)
          return [...JSON.parse(JSON.stringify(newUsers))]
        })
        setSelectedPersonnel([])
        setAddingRoles([])
      })
      .catch((error) => {
        if (
          !error.response.status === 401 &&
          !error.response?.data?.['detail'] === 'Token is expired'
        ) {
          console.error(error)
          setSelectedPersonnel([])
          setAddingRoles([])
          toaster.danger('There was an error adding the role.')
        }
      })

    return () => {
      controller.abort()
    }
  }, [addingRoles, token])

  // Revoke permission from user.
  useEffect(() => {
    if (removingRoles.length === 0) return

    const controller = new AbortController()

    authService
      .put(
        '/update-account-roles',
        {
          email: removingRoles[0]['email'],
          remove_roles: removingRoles[0]['roles'],
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
          signal: controller.signal,
        }
      )
      .then((response) => {
        const account = response.data['account']
        setUsers((prevUsers) => {
          const newUsers = prevUsers.filter(
            (u) => u['email'] !== account['email']
          )
          newUsers.push(account)
          return [...JSON.parse(JSON.stringify(newUsers))]
        })
        setRemovingRoles((prevRoles) => {
          prevRoles.shift()
          return [...JSON.parse(JSON.stringify(prevRoles))]
        })
      })
      .catch((error) => {
        if (
          !error.response.status === 401 &&
          !error.response?.data?.['detail'] === 'Token is expired'
        ) {
          console.error(error)
          toaster.danger('There was an error removing the role.')
        }
      })

    return () => {
      controller.abort()
    }
  }, [removingRoles, token])

  // Fetch list of existing Admins and Liaisons.
  useEffect(() => {
    setIsLoadingUsers(true)

    const controller = new AbortController()

    const userEmails = {}
    const allUsers = []
    authService
      .get('/role-accounts?role=Admin', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
        signal: controller.signal,
      })
      .then((response) => {
        const adminAccounts = response.data['accounts']
        adminAccounts.forEach((acc) => {
          if (!userEmails[acc['email']]) {
            allUsers.push(acc)
            userEmails[acc['email']] = true
          }
        })

        return authService.get('/role-accounts?role=Liaison', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
      })
      .then((response) => {
        const liaisonAccounts = response.data['accounts']
        liaisonAccounts.forEach((acc) => {
          if (!userEmails[acc['email']]) {
            allUsers.push(acc)
            userEmails[acc['email']] = true
          }
        })

        setUsers(allUsers)
        setIsLoadingUsers(false)
      })
      .catch((error) => {
        if (
          !error.response.status === 401 &&
          !error.response?.data?.['detail'] === 'Token is expired'
        ) {
          console.error(error)
          setUsers([])
          setIsLoadingUsers(false)
          toaster.danger('There was an error querying users.')
        }
      })

    return () => {
      controller.abort()
    }
  }, [token])

  return (
    <>
      <Heading size={800}>Manage Users</Heading>
      <Text>Add or remove accounts with administrative rights</Text>

      <ContentCard>
        <Heading size={600} marginBottom={minorScale(3)}>
          Add Person
        </Heading>
        <TagInput
          tagSubmitKey='enter'
          width='100%'
          values={selectedPersonnel.map(
            (p) =>
              `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`
          )}
          onChange={(p) => {
            if (p.length === 0) {
              setSelectedPersonnel([])
            } else {
              const person = getPersonnel(p[p.length - 1])
              if (person) {
                setSelectedPersonnel([person])
              }
            }
          }}
          autocompleteItems={autocompletePersonnel}
          onInputChange={(e) => setPersonnelQuery(e.target.value)}
          test-id='add-admin-input'
        />
        <Button
          appearance='primary'
          isLoading={addingRoles.length > 0}
          onClick={() => setAddingRoles(['Admin'])}
          marginTop='0.5rem'
          marginRight='0.5rem'
          disabled={selectedPersonnel.length === 0}
          test-id='add-admin-btn'
        >
          Add Admin
        </Button>
        <Button
          appearance='primary'
          isLoading={addingRoles.length > 0}
          onClick={() => setAddingRoles(['Liaison'])}
          marginTop='0.5rem'
          disabled={selectedPersonnel.length === 0}
          test-id='add-liaison-btn'
        >
          Add Liaison
        </Button>
      </ContentCard>

      <Heading size={500} marginTop='2rem' marginBottom='1rem'>
        Admins
      </Heading>
      <Table test-id='admin-table'>
        <Table.Head>
          <Table.SearchHeaderCell
            flexBasis='70%'
            value={adminSearchQuery}
            onChange={(value) => setAdminSearchQuery(value)}
          />
          <Table.TextHeaderCell flexShrink={0}>Actions</Table.TextHeaderCell>
        </Table.Head>
        <Table.Body>
          {users
            .filter((u) => u['roles'].includes('Admin'))
            .filter((a) => a['email'].includes(adminSearchQuery))
            .map((p) => (
              <Table.Row key={p['email']}>
                <Table.TextCell flexBasis='70%'>{p['email']}</Table.TextCell>
                <Table.TextCell flexShrink={0}>
                  <Button
                    appearance='secondary'
                    isLoading={removingEmails.includes(p['email'])}
                    onClick={() => {
                      setRemovingRoles((prevRemoving) => [
                        ...JSON.parse(JSON.stringify(prevRemoving)),
                        { email: p['email'], roles: ['Admin'] },
                      ])
                    }}
                  >
                    Revoke
                  </Button>
                </Table.TextCell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>

      <Heading size={500} marginTop='2rem' marginBottom='1rem'>
        Liaisons
      </Heading>
      <Table test-id='liaison-table'>
        <Table.Head>
          <Table.SearchHeaderCell
            flexBasis='70%'
            value={liaisonSearchQuery}
            onChange={(value) => setLiaisonSearchQuery(value)}
          />
          <Table.TextHeaderCell flexShrink={0}>Actions</Table.TextHeaderCell>
        </Table.Head>
        <Table.Body>
          {users
            .filter((u) => u['roles'].includes('Liaison'))
            .filter((a) => a['email'].includes(liaisonSearchQuery))
            .map((p) => (
              <Table.Row key={p['email']}>
                <Table.TextCell flexBasis='70%'>{p['email']}</Table.TextCell>
                <Table.TextCell flexShrink={0}>
                  <Button
                    appearance='secondary'
                    isLoading={removingEmails.includes(p['email'])}
                    onClick={() => {
                      setRemovingRoles((prevRemoving) => [
                        ...JSON.parse(JSON.stringify(prevRemoving)),
                        { email: p['email'], roles: ['Liaison'] },
                      ])
                    }}
                  >
                    Revoke
                  </Button>
                </Table.TextCell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>

      {(isLoadingUsers || addingRoles.length > 0) && <FullWidthSpinner />}
    </>
  )
}
