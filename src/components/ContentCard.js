import { Card, minorScale } from 'evergreen-ui';

export default function ContentCard({ children }) {
    return (
        <Card
            position='relative'
            padding={minorScale(6)}
            backgroundColor='white'
            marginY={minorScale(6)}
            elevation={0}
            border="muted">
            {children}
        </Card>
    )
}