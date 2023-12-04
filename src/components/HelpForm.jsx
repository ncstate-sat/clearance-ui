import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Button,
  Dialog,
  TextInput,
  Textarea,
  Label,
  minorScale,
  toaster,
} from 'evergreen-ui'
import styled from 'styled-components'
import clearanceService from '../apis/clearanceService'

const PersistentButton = styled(Button)`
  display: inline-block;
  height: 4rem;
  width: 4rem;
  padding: 0;
  color: white;
  background-color: #cc0000;
  border-radius: 2.5rem;
  position: fixed;
  right: 3rem;
  bottom: 3rem;
  z-index: 15;

  &:hover {
    background-color: transparent;
    color: black;
  }

  &:disabled {
    background-color: transparent;
    color: gray;
  }
`

export default function HelpForm() {
  const email = useSelector((state) => state.auth.email)

  const [showForm, setShowForm] = useState(false)
  const [subjectField, setSubjectField] = useState('')
  const [bodyField, setBodyField] = useState('')

  const [postHelpTicket] = clearanceService.usePostHelpTicketMutation()

  useEffect(() => {
    if (showForm) {
      setSubjectField('')
      setBodyField('')
    }
  }, [showForm])

  const sendTicketHandler = async () => {
    try {
      const response = await postHelpTicket({
        subject: subjectField,
        body: bodyField,
      }).unwrap()

      toaster.success(
        response?.['message'] || 'A help ticket has been submitted.'
      )
    } catch (error) {
      toaster.danger(error || 'There was an error submitting a help ticket.')
    }

    setShowForm(false)
  }

  return (
    <>
      <PersistentButton
        onClick={() => setShowForm(true)}
        disabled={showForm}
        test-id='universal-help-button'
      >
        Help
      </PersistentButton>
      <Dialog
        isShown={showForm}
        title='Get Help'
        confirmLabel='Submit'
        onCloseComplete={() => {
          setShowForm(false)
        }}
        onConfirm={sendTicketHandler}
        zIndex={20}
      >
        <Label
          display='block'
          marginBottom={minorScale(2)}
          marginLeft={minorScale(1)}
        >
          Subject
        </Label>
        <TextInput
          onChange={(e) => setSubjectField(e.target.value)}
          value={subjectField}
          placeholder='Help with something'
          width='100%'
          marginBottom={minorScale(4)}
          test-id='help-subject-field'
        />
        <Label
          display='block'
          marginBottom={minorScale(2)}
          marginLeft={minorScale(1)}
        >
          Description
        </Label>
        <Textarea
          onChange={(e) => setBodyField(e.target.value)}
          value={bodyField}
          placeholder='Description...'
          test-id='help-body-field'
        />
      </Dialog>
    </>
  )
}
