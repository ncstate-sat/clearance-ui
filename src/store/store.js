import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth'

import clearanceService from '../apis/clearanceService'

export default configureStore({
  reducer: {
    auth: authReducer,
    [clearanceService.reducerPath]: clearanceService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(clearanceService.middleware),
  devTools: true,
})
