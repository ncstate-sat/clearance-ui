import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Heading } from 'evergreen-ui'
import Layout from '../components/document/Layout'
import { signInWithGoogle } from '../store/slices/auth'

export default function Login() {
  const isLoggedIn = useSelector((state) => state.auth.token)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_IDENTITY_CLIENT_ID,
      callback: (response) =>
        dispatch(signInWithGoogle(response['credential'])),
    })
    window.google.accounts.id.renderButton(
      document.getElementById('login-button-div'),
      { theme: 'outline', size: 'large' }
    )
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/')
    }
  }, [isLoggedIn])

  return (
    <Layout title=''>
      <Heading size={800}>Login</Heading>
      <div id='login-button-div'></div>
    </Layout>
  )
}
