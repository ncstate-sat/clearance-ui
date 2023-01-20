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
import PropTypes from 'prop-types'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { devices } from '../../utils/breakpoints'
import { LayoutContext } from '../LayoutProvider'
import SideNav from '../SideNav'
import Head from './Head'
import { logOut } from '../../store/slices/auth'

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const HeaderContainer = styled(Pane)`
  display: flex;
  border-bottom: 1px solid ${({ borderColor }) => borderColor};
  align-items: center;
  padding: ${minorScale(3)}px ${majorScale(4)}px;

  @media ${devices.desktop} {
    padding-left: ${minorScale(4)}vw;
    padding-right: ${minorScale(4)}vw;
  }
`

const BodyContainer = styled(Pane)`
  flex: 1;
  height: 100%;
  padding-top: ${minorScale(12)}px;
  padding-bottom: ${minorScale(12)}px;
  max-width: ${majorScale(80)}px;
  margin-left: ${minorScale(12)}px;
  margin-right: ${minorScale(12)}px;

  @media ${devices.desktop} {
    margin-left: ${minorScale(24)}px;
    margin-right: ${minorScale(24)}px;
  }
`

export default function Layout({ title, children }) {
  const { colors } = useTheme()
  const { isSidebarOpen, setIsSidebarOpen } = useContext(LayoutContext)
  const isLoggedIn = useSelector((state) => state.auth.token !== null)
  const dispatch = useDispatch()

  return (
    <div>
      <Head title={`Clearance Assignment ${title ? '| ' + title : ''}`} />
      <HeaderContainer
        $isSidebarOpen={isSidebarOpen}
        backgroundColor={colors.gray50}
        borderColor={colors.gray100}
      >
        <Pane paddingRight={minorScale(2)}>
          <IconButton
            appearance='none'
            icon={<MenuIcon />}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </Pane>
        <Pane display='flex'>
          <Heading size={600}>Clearance Assignment Portal</Heading>
        </Pane>
        <Pane display='flex' marginLeft='auto'>
          {isLoggedIn && (
            <Button onClick={() => dispatch(logOut())}>Sign Out</Button>
          )}
        </Pane>
      </HeaderContainer>
      <LayoutContainer>
        <Pane display='flex' flex={1}>
          <SideNav />
          <Pane
            width='100%'
            display='flex'
            flexDirection='row'
            justifyContent={isSidebarOpen ? 'flex-start' : 'center'}
            alignItems='flex-start'
          >
            <BodyContainer>{children}</BodyContainer>
          </Pane>
        </Pane>
      </LayoutContainer>
    </div>
  )
}

Layout.propTypes = {
  title: PropTypes.string,
}
