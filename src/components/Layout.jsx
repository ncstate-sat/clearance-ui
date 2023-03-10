import {
  Button,
  Heading,
  IconButton,
  majorScale,
  MenuIcon,
  minorScale,
  Pane,
  useTheme,
} from 'evergreen-ui'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { LayoutContext } from './LayoutProvider'
import SideNav from './SideNav'
import { logOut } from '../store/slices/auth'

const HeaderContainer = styled(Pane)`
  display: flex;
  border-bottom: 1px solid ${({ borderColor }) => borderColor};
  align-items: center;
  padding: ${minorScale(3)}px ${minorScale(4)}px;
  width: 100%;
  top: 0;
  position: fixed;
  z-index: 2;
`

const HeaderContent = styled(Pane)`
  display: flex;
  width: ${majorScale(120)}px;
  max-width: 100%;
  margin: auto;
`

const ViewContainer = styled(Pane)`
  display: grid;
  grid-template-columns: ${({ $isSidebarOpen }) =>
    $isSidebarOpen ? `${majorScale(32)}px 1fr` : '0 1fr'};
  column-gap: ${({ $isSidebarOpen }) => ($isSidebarOpen ? '16px' : '0')};
  width: ${majorScale(120)}px;
  max-width: 100%;
  margin: auto;
  transition: grid 0.2s ease;
`

const BodyContainer = styled(Pane)`
  margin-top: 100px;
  margin-left: ${({ $isSidebarOpen }) => ($isSidebarOpen ? '36px' : '8px')};
  margin-right: 8px;
`

export default function Layout({ children }) {
  const { colors } = useTheme()
  const { isSidebarOpen, setIsSidebarOpen } = useContext(LayoutContext)
  const isLoggedIn = useSelector((state) => state.auth.token !== null)
  const dispatch = useDispatch()

  return (
    <>
      <HeaderContainer
        backgroundColor={colors.gray50}
        borderColor={colors.gray100}
      >
        <HeaderContent>
          <Pane
            display='flex'
            flexDirection='row'
            justifyContent='flex-start'
            alignItems='center'
          >
            <IconButton
              appearance='none'
              icon={<MenuIcon />}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              paddingRight={minorScale(2)}
            />
            <Heading size={600}>Security Applications Portal</Heading>
          </Pane>
          <Pane display='flex' marginLeft='auto'>
            {isLoggedIn && (
              <Button onClick={() => dispatch(logOut())}>Sign Out</Button>
            )}
          </Pane>
        </HeaderContent>
      </HeaderContainer>
      <SideNav />
      <ViewContainer $isSidebarOpen={isSidebarOpen}>
        <div></div>
        <BodyContainer $isSidebarOpen={isSidebarOpen}>{children}</BodyContainer>
      </ViewContainer>
    </>
  )
}
