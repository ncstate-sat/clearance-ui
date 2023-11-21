import { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  TextInput,
  Textarea,
  Label,
  minorScale,
} from 'evergreen-ui'
import styled from 'styled-components'

const PersistentButton = styled(Button)`
  display: inline-block;
  height: 5rem;
  width: 5rem;
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

  useEffect(() => {
    if (showForm) {
      setSubjectField('')
      setBodyField('')
    }
  }, [showForm])

  const sendTicketHandler = () => {
    console.log('Sending ticket...')
    setShowForm(false)
  }

  return (
    <>
      <PersistentButton onClick={() => setShowForm(true)} disabled={showForm}>
        Help
      </PersistentButton>
      <Dialog
        isShown={showForm}
        title='Get Help'
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
        />
      </Dialog>
    </>
  )
}
