import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Heading } from 'evergreen-ui'
import Layout from './Layout'
import { refreshToken, signInWithGoogle } from '../../store/slices/auth'

const Auth = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.token !== null)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshToken())

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_IDENTITY_CLIENT_ID,
      callback: (response) =>
        dispatch(signInWithGoogle(response['credential'])),
    })
    window.google.accounts.id.renderButton(
      document.getElementById('login-button-div'),
      { theme: 'outline', size: 'large' }
    )
  }, [isLoggedIn])

  if (isLoggedIn) {
    return children
  } else {
    return (
      <Layout>
        <Heading size={800}>Login</Heading>
        <div id='login-button-div'></div>
      </Layout>
    )
  }
}

export default Auth
