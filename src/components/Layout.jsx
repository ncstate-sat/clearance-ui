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
import { Outlet } from 'react-router-dom'
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
  transition: transform 0.2s ease;
  transform: ${({ $isHidden }) =>
    $isHidden ? 'translateY(-64px)' : 'translateY(0)'};
  z-index: 2;
`

const HeaderContent = styled(Pane)`
  display: flex;
  width: ${majorScale(160)}px;
  max-width: 100%;
  margin: auto;
`

const ViewContainer = styled(Pane)`
  display: grid;
  grid-template-columns: ${({ $isHidden, $isSidebarOpen }) =>
    $isHidden
      ? `${majorScale(60)}px minmax(0, 1fr)`
      : $isSidebarOpen
      ? `${majorScale(32)}px minmax(0, 1fr)`
      : '0 minmax(0, 1fr)'};
  column-gap: ${({ $isSidebarOpen }) => ($isSidebarOpen ? '16px' : '0')};
  width: ${majorScale(160)}px;
  max-width: 100%;
  margin: auto;
  transition: grid 0.2s ease;
`

const BodyContainer = styled(Pane)`
  margin-top: ${({ $isHidden }) => ($isHidden ? '0' : '100px')};
  margin-left: ${({ $isHidden, $isSidebarOpen }) =>
    $isHidden ? '0' : $isSidebarOpen ? '36px' : '8px'};
  margin-right: ${({ $isHidden }) => ($isHidden ? '0' : '8px')};
  margin-bottom: ${({ $isHidden }) => ($isHidden ? '0' : '100px')};
`

export default function Layout({ sidebarContent, hideApp, children }) {
  const { colors } = useTheme()
  const { isSidebarOpen, setIsSidebarOpen } = useContext(LayoutContext)
  const isLoggedIn = useSelector((state) => state.auth.token !== null)
  const dispatch = useDispatch()

  return (
    <>
      <HeaderContainer
        backgroundColor={colors.gray50}
        borderColor={colors.gray100}
        $isHidden={hideApp}
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
            <Heading size={600}>Security Applications</Heading>
          </Pane>
          <Pane display='flex' marginLeft='auto'>
            <Button
              appearance='none'
              test-id='help-button-main'
              onClick={() =>
                window.open(
                  'https://pages.github.ncsu.edu/SAT/clearance-service-mirror/',
                  '_blank',
                  'noreferrer'
                )
              }
            >
              Help
            </Button>
            {isLoggedIn && (
              <Button onClick={() => dispatch(logOut())}>Sign Out</Button>
            )}
          </Pane>
        </HeaderContent>
      </HeaderContainer>
      <SideNav sidebarContent={sidebarContent} />
      <ViewContainer $isSidebarOpen={isSidebarOpen} $isHidden={hideApp}>
        <div></div>
        <BodyContainer $isSidebarOpen={isSidebarOpen} $isHidden={hideApp}>
          {hideApp ? children : <Outlet />}
        </BodyContainer>
      </ViewContainer>
    </>
  )
}
