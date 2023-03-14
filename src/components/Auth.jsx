import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { Heading, Pane, minorScale } from 'evergreen-ui'
import { refreshToken, signInWithGoogle } from '../store/slices/auth'
import Layout from './Layout'
import getEnvVariable from '../utils/getEnvVariable'

import github from '../assets/github.svg'

const SidebarContent = styled(Pane)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  height: 100%;
  padding: ${minorScale(8)}px;
  padding-top: 25vh;
`

const DescriptionContainer = styled(Pane)`
  position: absolute;
  right: 0;
  height: 100vh;
  width: 50vw;
  display: grid;
  grid-template-rows: 1fr 24px;
  padding: ${minorScale(4)}px;
`

const DescriptionContent = styled(Pane)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`

const DescriptionCell = styled(Pane)`
  padding: ${minorScale(4)}px 0;
`

const Footer = styled(Pane)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Auth = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.token !== null)
  const isValidUser = useSelector((state) => state.auth.isValidUser)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshToken())

    if (!isLoggedIn) {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: getEnvVariable('VITE_GOOGLE_IDENTITY_CLIENT_ID'),
          callback: (response) =>
            dispatch(signInWithGoogle(response['credential'])),
        })
        window.google.accounts.id.renderButton(
          document.getElementById('login-button-div'),
          { theme: 'outline', size: 'large' }
        )
      } else {
        window.location.reload()
      }
    }
  }, [isLoggedIn])

  if (isLoggedIn && isValidUser) {
    return <Layout />
  } else {
    return (
      <Layout
        sidebarContent={
          <SidebarContent>
            <Pane marginBottom={minorScale(6)} textAlign='right'>
              <Heading size={900}>Security Applications</Heading>
              <Heading size={400}>Assign, Revoke, and View Clearances</Heading>
            </Pane>
            <div id='login-button-div'></div>
          </SidebarContent>
        }
        hideApp={true}
      >
        <DescriptionContainer>
          <DescriptionContent></DescriptionContent>
          <Footer>
            <Heading size={200}>© 2023 North Carolina State University</Heading>
            <a
              href='https://github.com/ncstate-sat/clearance-ui'
              target='_blank'
              rel='noopener noreferrer'
            >
              <img
                src={github}
                alt='Github'
                style={{ width: '2rem', height: '2rem', opacity: '0.5' }}
              />
            </a>
          </Footer>
        </DescriptionContainer>
      </Layout>
    )
  }
}

export default Auth
