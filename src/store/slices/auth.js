import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toaster } from 'evergreen-ui'
import getEnvVariable from '../../utils/getEnvVariable'

const initialState = {
  token: null,
  refreshToken: null,
  email: null,
  roles: [],
  isValidUser: false,
  unityId: null,
  campusId: null,
  message: null,
  isLoading: false,
}

export const ALLOWED_ROLES = ['Admin', 'Liaison']

export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (credential, _) => {
    const googleSignInResponse = await axios.post(
      getEnvVariable('VITE_AUTH_SERVICE_URL') + '/google-sign-in',
      {
        token: credential,
      }
    )
    const token = googleSignInResponse.data['token']
    const refreshToken = googleSignInResponse.data['refresh_token']
    const payload = googleSignInResponse.data['payload']

    const isValidUser = payload.roles.some((r) => ALLOWED_ROLES.indexOf(r) >= 0)
    if (!isValidUser) {
      toaster.danger('You do not have permission to use this tool.')
    }

    localStorage.setItem('refresh-token', refreshToken)
    return { token, refreshToken, payload, isValidUser }
  }
)

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, __) => {
    const refreshToken = localStorage.getItem('refresh-token')
    const refreshResponse = await axios.post(
      getEnvVariable('VITE_AUTH_SERVICE_URL') + '/refresh-token',
      {
        token: refreshToken,
      }
    )
    const newToken = refreshResponse.data['token']
    const newRefreshToken = refreshResponse.data['refresh_token']
    const payload = refreshResponse.data['payload']

    const isValidUser = payload.roles.some((r) => ALLOWED_ROLES.indexOf(r) >= 0)

    localStorage.setItem('refresh-token', newRefreshToken)
    return {
      token: newToken,
      refreshToken: newRefreshToken,
      payload,
      isValidUser,
    }
  }
)

export const logOut = createAsyncThunk('auth/logOut', async (_, __) => {
  return localStorage.removeItem('refresh-token')
})

const logInStateChange = (state, action) => {
  state.token = action.payload.token
  state.refreshToken = action.payload.refreshToken
  state.email = action.payload.payload['email']
  state.unityId = action.payload.payload['email'].split('@')[0]
  state.campusId = action.payload.payload['campus_id']
  state.roles = action.payload.payload['roles']
  state.isValidUser = action.payload.isValidUser
  state.message = null
  state.isLoading = true
}

const logInFailedStateChange = (state) => {
  state.token = null
  state.refreshToken = null
  state.email = null
  state.roles = []
  state.isValidUser = false
  state.unityId = null
  state.campusId = null
  state.message = 'Failed to Log In'
  state.isLoading = false
}

const logOutStateChange = (state) => {
  state.token = null
  state.refreshToken = null
  state.email = null
  state.roles = []
  state.isValidUser = false
  state.unityId = null
  state.campusId = null
  state.message = null
  state.isLoading = false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action) {
      logInStateChange(state, action)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signInWithGoogle.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(signInWithGoogle.rejected, logInFailedStateChange)
    builder.addCase(signInWithGoogle.fulfilled, logInStateChange)
    builder.addCase(refreshToken.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(refreshToken.rejected, logInFailedStateChange)
    builder.addCase(refreshToken.fulfilled, logInStateChange)
    builder.addCase(logOut.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(logOut.rejected, logOutStateChange)
    builder.addCase(logOut.fulfilled, logOutStateChange)
  },
})

export const { setToken } = authSlice.actions
export default authSlice.reducer
