import { useMemo } from 'react'
import {
  Pane,
  Card,
  Heading,
  Button,
  minorScale,
  Tooltip,
  Position,
} from 'evergreen-ui'
import TagInput, { createTagOption } from './TagInput'
import createTagInputString from '../utils/createTagInputString'

import usePersonnel from '../hooks/usePersonnel'

export default function PeoplePicker({
  header,
  selectedPersonnel,
  setSelectedPersonnel,
  buttonName,
  onButtonClick,
  buttonTooltip,
}) {
  const { personnel, personnelQuery, setPersonnelQuery } = usePersonnel()

  // Suggestion strings for personnel.
  const autocompletePersonnel = useMemo(
    () =>
      personnel
        .map((p) => createTagOption(createTagInputString(p), p))
        .sort((a, b) => a['first_name'] > b['first_name']),
    [personnel, selectedPersonnel]
  )

  const buttonComponent = buttonName ? (
    <Tooltip content={buttonTooltip} position={Position.RIGHT}>
      <Button
        onClick={onButtonClick}
        marginLeft='1em'
        disabled={!selectedPersonnel}
      >
        {buttonName}
      </Button>
    </Tooltip>
  ) : null

  console.log(buttonComponent)

  return (
    <Card
      position='relative'
      padding={minorScale(6)}
      backgroundColor='white'
      marginY={minorScale(6)}
      elevation={0}
      border='muted'
    >
      <Pane display='flex' flexDirection='row' justifyContent='space-between'>
        <Heading size={600} marginBottom={minorScale(3)}>
          {header}
        </Heading>
        <Button
          onClick={() => {
            if (Array.isArray(selectedPersonnel)) {
              setSelectedPersonnel([])
            } else {
              setSelectedPersonnel()
            }
            setPersonnelQuery('')
          }}
        >
          Clear
        </Button>
      </Pane>
      <Pane
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        marginTop='10'
      >
        <TagInput
          inputValue={personnelQuery}
          onInputChange={setPersonnelQuery}
          value={selectedPersonnel}
          onChange={setSelectedPersonnel}
          suggestions={autocompletePersonnel}
          width='100%'
        />
        {buttonComponent}
      </Pane>
    </Card>
  )
}
