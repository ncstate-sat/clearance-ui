import { useMemo } from 'react'
import { Pane, Card, Heading, Button, Spinner, minorScale } from 'evergreen-ui'
import useDoor from '../hooks/useDoor'
import TagInput, { createTagOption } from './TagInput'

export default function ({ selectedDoors, setSelectedDoors, header }) {
  const {
    doors,
    doorQuery,
    setDoorQuery,
    isLoading: isLoadingDoors,
  } = useDoor()

  const autocompleteDoors = useMemo(
    () => doors.map((d) => createTagOption(d['name'], d)),
    [doors]
  )

  return (
    <Card
      position='relative'
      padding={minorScale(6)}
      backgroundColor='white'
      marginY={minorScale(6)}
      elevation={0}
      border='muted'
    >
      {isLoadingDoors && (
        <Spinner size={16} position='absolute' top='4px' right='4px' />
      )}
      <Pane display='flex' flexDirection='row' justifyContent='space-between'>
        <Heading size={600} marginBottom={minorScale(3)}>
          {header}
        </Heading>
        <Button
          onClick={() => {
            if (Array.isArray(selectedDoors)) {
              setSelectedDoors([])
            } else {
              setSelectedDoors()
            }
            setDoorQuery('')
          }}
        >
          Clear
        </Button>
      </Pane>
      <TagInput
        inputValue={doorQuery}
        onInputChange={setDoorQuery}
        value={selectedDoors}
        onChange={setSelectedDoors}
        suggestions={autocompleteDoors}
        width='100%'
      />
    </Card>
  )
}
