import {
  CrossIcon,
  Heading,
  IconButton,
  minorScale,
  TagInput,
  Text,
  Tooltip,
} from 'evergreen-ui'
import PropTypes from 'prop-types'
import ContentCard from './ContentCard'
import Timeframe from './Timeframe'

export const AUDIT_FILTERS = {
  BY_ASSIGNER: 'BY_ASSIGNER',
  BY_ASSIGNEE: 'BY_ASSIGNEE',
  BY_CLEARANCE_NAME: 'BY_CLEARANCE_NAME',
  BY_TIMEFRAME: 'BY_TIMEFRAME',
}

export default function AuditFilterCard({
  title,
  filterType,
  value = [],
  onRemove,
  onChange,
  autocompleteItems,
}) {
  const startDateTime = value['startDateTime']
  const endDateTime = value['endDateTime']

  let defaultTitle

  switch (filterType) {
    case AUDIT_FILTERS.BY_ASSIGNEE:
      defaultTitle = 'Filter by Person'
      break
    case AUDIT_FILTERS.BY_ASSIGNER:
      defaultTitle = 'Filter by Assigner'
      break
    case AUDIT_FILTERS.BY_CLEARANCE_NAME:
      defaultTitle = 'Filter by Clearance Name'
      break
    case AUDIT_FILTERS.BY_TIMEFRAME:
      defaultTitle = 'Filter by Timeframe'
      break
  }

  let timelineText = 'Search for all records regardless of date.'
  if (startDateTime && !endDateTime) {
    timelineText = `Search all records after ${startDateTime.toLocaleString(
      'en-US',
      dateStringConfig
    )}.`
  } else if (!startDateTime && endDateTime) {
    timelineText = `Search all records before ${endDateTime.toLocaleString(
      'en-US',
      dateStringConfig
    )}.`
  } else if (startDateTime && endDateTime) {
    timelineText = `Search all records after ${startDateTime.toLocaleString(
      'en-US',
      dateStringConfig
    )} but before ${endDateTime.toLocaleString('en-US', dateStringConfig)}.`
  }

  const dateStringConfig = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }

  return (
    <ContentCard header={title || defaultTitle}>
      <Tooltip content='Remove'>
        <IconButton
          onClick={onRemove}
          icon={<CrossIcon size={20} />}
          border='none'
          position='absolute'
          top={0}
          right={0}
          test-id='remove-filter-btn'
        />
      </Tooltip>
      {filterType === AUDIT_FILTERS.BY_TIMEFRAME && <Text>{timelineText}</Text>}
      {filterType !== AUDIT_FILTERS.BY_TIMEFRAME && (
        <TagInput
          tagSubmitKey='enter'
          width='100%'
          values={value['input']}
          onChange={(value) => onChange('input', value)}
          autocompleteItems={autocompleteItems}
        />
      )}
      {filterType === AUDIT_FILTERS.BY_TIMEFRAME && (
        <Timeframe
          startDateTime={startDateTime}
          endDateTime={endDateTime}
          onChangeStartTime={(date) => onChange('startDateTime', date)}
          onChangeEndTime={(date) => onChange('endDateTime', date)}
        />
      )}
    </ContentCard>
  )
}

AuditFilterCard.propTypes = {
  title: PropTypes.string,
  filterType: PropTypes.oneOf(Object.keys(AUDIT_FILTERS)).isRequired,
  value: PropTypes.object,
  onRemove: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  autocompleteItems: PropTypes.array,
}
