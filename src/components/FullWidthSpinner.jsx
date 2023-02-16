import { Spinner } from 'evergreen-ui'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
`

export default function FullWidthSpinner() {
  return (
    <Container>
      <Spinner />
    </Container>
  )
}
