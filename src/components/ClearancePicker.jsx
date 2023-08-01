import { useMemo } from 'react'
import { TagInput, Tooltip, IconButton, CrossIcon } from 'evergreen-ui'
import useClearance from '../hooks/useClearance'
import ContentCard from './ContentCard'
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
  const autocompleteClearances = useMemo(() => {
    const clearanceNames = clearances.map((c) => c['name'].replace(/,/g, ''))
    const selectedClearanceNames = selectedClearances.map((c) =>
      c['name'].replace(/,/g, '')
    )
    return clearanceNames
      .filter((i) => !selectedClearanceNames.includes(i))
      .sort()
  }, [clearances, selectedClearances])

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
        tagSubmitKey='enter'
        width='100%'
        values={selectedClearances.map((c) => c['name'].replace(/,/g, ''))}
        onChange={(selected) => {
          const clearanceObjects = []
          const allClearances = [...clearances, ...selectedClearances]
          const clearanceStrings = allClearances.map(
            (c) => `${c['name'].replace(/,/g, '')}`
          )
          selected.forEach((s) => {
            const i = clearanceStrings.indexOf(s)
            if (i >= 0) {
              clearanceObjects.push(allClearances[i])
            }
          })
          setSelectedClearances(clearanceObjects)
        }}
        autocompleteItems={autocompleteClearances}
        onInputChange={(e) => setClearanceQuery(e.target.value)}
        test-id='clearance-input'
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
