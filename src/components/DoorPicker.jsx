import { useMemo } from 'react'
import { Tooltip, IconButton, CrossIcon } from 'evergreen-ui'
import ContentCard from './ContentCard'
import useDoor from '../hooks/useDoor'
import TagInput, { createTagOption } from './TagInput'

export default function ({ selectedDoors, setSelectedDoors, header, onClose }) {
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
    <ContentCard header={header || 'Select Door'} isLoading={isLoadingDoors}>
      {onClose && (
        <Tooltip content='Remove'>
          <IconButton
            onClick={onClose}
            icon={<CrossIcon size={20} />}
            border='none'
            position='absolute'
            top={0}
            right={0}
            test-id='remove-filter-btn'
          />
        </Tooltip>
      )}
      <TagInput
        inputValue={doorQuery}
        onInputChange={setDoorQuery}
        value={selectedDoors}
        onChange={setSelectedDoors}
        suggestions={autocompleteDoors}
        width='100%'
      />
    </ContentCard>
  )
}
