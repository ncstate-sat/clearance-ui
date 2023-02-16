import {
    Button,
    Heading,
    minorScale,
    Table,
    TagInput,
    Text,
  } from 'evergreen-ui'
  import { useMemo, useState, useEffect } from 'react'
  import { useSelector } from 'react-redux'
  import ContentCard from '../components/ContentCard'
  import FullWidthSpinner from '../components/FullWidthSpinner'
  import Layout from '../components/Layout'
  
  import usePersonnel from '../hooks/usePersonnel'
  import authService from '../apis/authService'
  
  export default function ManageClearance() {
    const token = useSelector((state) => state.auth.token)
  
    const [isAddingUsers, setIsAddingUsers] = useState(false)
    const [isRemovingUsers, setIsRemovingUsers] = useState(false)
    const [users, setUsers] = useState([])
  
    const [selectedPersonnel, setSelectedPersonnel] = useState([])
    const { personnel, setPersonnelQuery } = usePersonnel()
  
    const [adminSearchQuery, setAdminSearchQuery] = useState('')
    const [liaisonSearchQuery, setLiaisonSearchQuery] = useState('')
    const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  
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
  
    const addUserHandler = (roles) => {
      setIsAddingUsers(true)
  
      const addUsers = async (emails) => {
        const added = []
        const errors = []
  
        for await (let email of emails) {
          try {
            const response = await authService.put(
              '/update-account-roles',
              {
                email: email,
                add_roles: roles,
              },
              {
                headers: {
                  Authorization: 'Bearer ' + token,
                },
              }
            )
  
            added.push({ email: email, campus_id: null, ...response.data })
          } catch (error) {
            console.error(error)
            errors.push(email)
          }
        }
  
        return { added, errors }
      }
  
      const selected = getPersonnel()
      const emailsToAdd = selected.map((s) => s['email'])
  
      addUsers(emailsToAdd)
        .then((result) => {
          setUsers((prevUsers) => [
            ...JSON.parse(JSON.stringify(prevUsers)),
            ...result.added.map((a) => ({
              email: a['email'],
              campus_id: a['campus_id'],
              roles: roles,
            })),
          ])
          setSelectedPersonnel([])
          setIsAddingUsers(false)
        })
        .catch((error) => {
          console.error(error)
          setSelectedPersonnel([])
          setIsAddingUsers(false)
        })
    }
  
    const revokeUserHandler = (email, roles) => {
      setIsRemovingUsers(true)
  
      authService
        .put(
          '/update-account-roles',
          {
            email: email,
            remove_roles: roles,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        )
        .then(() => {
          setUsers((prevUsers) =>
            JSON.parse(JSON.stringify(prevUsers)).filter(
              (u) => u['email'] !== email
            )
          )
          setIsRemovingUsers(false)
        })
        .catch((error) => {
          console.error(error)
          setIsRemovingUsers(false)
        })
    }
  
    useEffect(() => {
      setIsLoadingUsers(true)
  
      let allUsers = []
      authService
        .get('/role-accounts?role=SAT', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
        .then((response) => {
          allUsers = [...allUsers, ...response.data['accounts']]
  
          return authService.get('/role-accounts?role=Liaison', {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          })
        })
        .then((response) => {
          allUsers = [...allUsers, ...response.data['accounts']]
          setUsers(allUsers)
          setIsLoadingUsers(false)
        })
        .catch((error) => {
          setUsers([])
          setIsLoadingUsers(false)
        })
    }, [token])
  
    return (
      <Layout title='Manage Admins'>
        <Heading size={800}>Manage Admins</Heading>
        <Text>Add or remove accounts with administrative rights</Text>
  
        <ContentCard>
          <Heading size={600} marginBottom={minorScale(3)}>
            Add Person(s)
          </Heading>
          <TagInput
            tagSubmitKey='enter'
            width='100%'
            values={selectedPersonnel}
            onChange={setSelectedPersonnel}
            autocompleteItems={autocompletePersonnel}
            onInputChange={(e) => setPersonnelQuery(e.target.value)}
            test-id='add-admin-input'
          />
          <Button
            appearance='primary'
            isLoading={isAddingUsers}
            onClick={addUserHandler.bind(self, ['SAT'])}
            marginTop='0.5rem'
            test-id='add-admin-btn'
          >
            Add Admin
          </Button>
          <Button
            appearance='primary'
            isLoading={isAddingUsers}
            onClick={addUserHandler.bind(self, ['Liaison'])}
            marginTop='0.5rem'
            test-id='add-liaison-btn'
          >
            Add Liaison
          </Button>
        </ContentCard>
  
        <Heading size={500} marginTop='2rem' marginBottom='1rem'>
          SAT Admins
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
              .filter((u) => u['roles'].includes('SAT'))
              .filter((a) => a['email'].includes(adminSearchQuery))
              .map((p) => (
                <Table.Row key={p['campus_id']}>
                  <Table.TextCell flexBasis='70%'>{p['email']}</Table.TextCell>
                  <Table.TextCell flexShrink={0}>
                    <Button
                      appearance='secondary'
                      onClick={() => revokeUserHandler(p['email'], ['SAT'])}
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
                <Table.Row key={p['campus_id']}>
                  <Table.TextCell flexBasis='70%'>{p['email']}</Table.TextCell>
                  <Table.TextCell flexShrink={0}>
                    <Button
                      appearance='secondary'
                      onClick={() => revokeUserHandler(p['email'], ['Liaison'])}
                    >
                      Revoke
                    </Button>
                  </Table.TextCell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
  
        {(isLoadingUsers || isRemovingUsers) && <FullWidthSpinner />}
      </Layout>
    )
  }
  