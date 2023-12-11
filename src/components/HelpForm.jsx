import { useState, useEffect } from 'react'
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

  const sendTicketHandler = () => {
    if (subjectField.length === 0) {
      toaster.danger('A subject is required.')
      return
    } else if (bodyField.length === 0) {
      toaster.danger('A body is required.')
      return
    }

    postHelpTicket({
      subject: subjectField,
      body: bodyField,
    })
      .unwrap()
      .then((response) => {
        toaster.success(
          response?.['message'] || 'A help ticket has been submitted.'
        )
        setShowForm(false)
      })
      .catch((error) => {
        toaster.danger(error || 'There was an error submitting a help ticket.')
        setShowForm(false)
      })
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
        title='Submit a Help Ticket to SAT'
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
