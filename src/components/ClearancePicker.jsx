import { useMemo } from 'react'
import { Tooltip, IconButton, CrossIcon } from 'evergreen-ui'
import useClearance from '../hooks/useClearance'
import ContentCard from './ContentCard'
import TagInput, { createTagOption } from './TagInput'
import NoResultsText from './NoResultsText'

export default function ({
  selectedClearances,
  setSelectedClearances,
  onClose,
}) {
  const {
    clearances,
    clearanceQuery,
    setClearanceQuery,
    length: clearancesLength,
    isTyping: isTypingClearances,
    isLoading: isLoadingClearances,
  } = useClearance()

  // Suggestion strings for clearances.
  const autocompleteClearances = useMemo(
    () => clearances.map((c) => createTagOption(c['name'], c)),
    [clearances]
  )

  return (
    <ContentCard header='Select Clearance' isLoading={isLoadingClearances}>
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
        inputValue={clearanceQuery}
        onInputChange={setClearanceQuery}
        value={selectedClearances}
        onChange={setSelectedClearances}
        suggestions={autocompleteClearances}
        width='100%'
      />
      <NoResultsText
        $visible={
          !isLoadingClearances &&
          !isTypingClearances &&
          clearanceQuery.length >= 3 &&
          clearancesLength === 0
        }
      >
        No Clearances Found
      </NoResultsText>
    </ContentCard>
  )
}
