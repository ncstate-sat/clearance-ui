import { Pane } from 'evergreen-ui'
import styled from 'styled-components'

const NoResultsText = styled(Pane)`
  display: ${({ $visible }) => ($visible ? 'block' : 'none')};
  position: absolute;
  bottom: 4px;
  left: 0;
  right: 0;
  text-align: center;
  color: #cccccc;
  font-size: 0.8rem;
`

export default NoResultsText
