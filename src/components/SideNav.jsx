import {
  Heading,
  majorScale,
  minorScale,
  Pane,
  Tablist,
  useTheme,
} from 'evergreen-ui'
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import { LayoutContext } from './LayoutProvider'
import SideTab from './SideTab'

const SidebarContainer = styled(Pane)`
  background-color: ${({ backgroundColor }) => backgroundColor};
  width: calc((100vw - ${majorScale(120)}px) / 2 + ${majorScale(32)}px);
  height: 100%;
  position: fixed;
  zindex: 1;
  transform: translateX(0);
  transition: transform 0.2s ease;

  ${({ $isOpen }) =>
    !$isOpen &&
    css`
      transform: translateX(
        calc((100vw - ${majorScale(120)}px) / -2 - ${majorScale(32)}px)
      );
    `}

  @media (max-width: ${majorScale(120)}px) {
    width: ${majorScale(32)}px;

    ${({ $isOpen }) =>
      !$isOpen &&
      css`
        transform: translateX(-${majorScale(32)}px);
      `}
  }
`

const SidebarContent = styled(Pane)`
  float: right;
  padding-left: ${minorScale(3)}px;
  padding-right: ${minorScale(3)}px;
  width: ${majorScale(32)}px;
`

const SidebarHeading = styled(Heading)`
  padding-bottom: ${minorScale(2)}px;
`

export default function SideNav() {
  const isLoggedIn = useSelector((state) => state.auth.token !== null)
  const roles = useSelector((state) => state.auth.roles)
  const { colors } = useTheme()

  const { isSidebarOpen } = useContext(LayoutContext)

  return isLoggedIn ? (
    <SidebarContainer
      backgroundColor={colors.gray50}
      borderRight='muted'
      $isOpen={isSidebarOpen}
    >
      <SidebarContent>
        <Tablist width='100%' marginTop='100px'>
          <SidebarHeading size={600}>Clearance Assignment</SidebarHeading>
          <SideTab title='Assign' href='/assign' useAnchor={false} />
          <SideTab title='Manage' href='/manage' useAnchor={false} />
          {roles.includes('Admin') && (
            <SideTab
              title='Liaison Permissions'
              href='/liaison-permissions'
              useAnchor={false}
            />
          )}
          <SideTab title='Audit Log' href='/audit' useAnchor={false} />
          {roles.includes('Admin') && (
            <SideTab title='Admin' href='/admin' useAnchor={false} />
          )}
        </Tablist>
      </SidebarContent>
    </SidebarContainer>
  ) : null
}
