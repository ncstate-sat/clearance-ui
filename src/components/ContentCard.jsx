import { Card, Spinner, minorScale } from 'evergreen-ui'

export default function ContentCard({ isLoading, children }) {
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
      {children}
    </Card>
  )
}
