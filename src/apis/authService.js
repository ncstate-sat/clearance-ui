import axios from 'axios'
import store from '../store/store'
import { refreshToken } from '../store/slices/auth'

const authService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

authService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response.status === 401 ||
      error.response?.data?.['detail'] === 'Token is expired'
    ) {
      store.dispatch(refreshToken())
      return Promise.reject(error)
    } else {
      return Promise.reject(error)
    }
  }
)

export default authService
