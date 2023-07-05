import {
  Card,
  Heading,
  Spinner,
  IconButton,
  HelpIcon,
  minorScale,
} from 'evergreen-ui'
import openInNewTab from '../utils/openInNewTab'

export default function ContentCard({ header, isLoading, helpLink, children }) {
  return (
    <Card
      position='relative'
      padding={minorScale(6)}
      backgroundColor='white'
      marginY={minorScale(6)}
      elevation={0}
      border='muted'
    >
      {isLoading && (
        <Spinner size={16} position='absolute' top='4px' right='4px' />
      )}
      {header && (
        <Heading size={600} marginBottom={minorScale(3)}>
          {header}
          {helpLink && (
            <IconButton
              size='small'
              appearance='none'
              icon={HelpIcon}
              onClick={() => openInNewTab(helpLink)}
            />
          )}
        </Heading>
      )}
      {children}
    </Card>
  )
}
