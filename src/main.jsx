import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { defaultTheme, mergeTheme, ThemeProvider } from 'evergreen-ui'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import LayoutProvider from './components/LayoutProvider'
import Auth from './components/Auth'
import store from './store/store'
import 'react-datepicker/dist/react-datepicker.css'
import './index.css'

import ManageClearance from './pages/Manage'
import LiaisonPermissions from './pages/LiaisonPermissions'
import AuditLog from './pages/Audit'
import Admin from './pages/Admin'

const myTheme = mergeTheme(defaultTheme, {
  colors: {
    red100: '#ea1500',
    red200: '#cc0000',
    gray50: '#F9FAFC',
    gray100: '#e5e5e5',
  },
  components: {
    Button: {
      appearances: {
        primary: {
          backgroundColor: '#cc0000',
          color: 'white',
          selectors: {
            _disabled: {
              backgroundColor: '#e68080',
            },
          },
        },
        secondary: {
          background: 'none',
          border: '1px solid #cc0000',
          color: '#cc0000',
        },
        minimal: {
          _hover: {
            backgroundColor: '#ea1500',
            color: 'white',
          },
          _focusAndActive: {
            backgroundColor: '#cc0000',
            color: 'white',
          },
        },
        none: {
          background: 'none',
          _focus: {
            boxShadow: 'none',
          },
        },
      },
    },
    Tab: {
      baseStyle: {
        display: 'inline-table',
      },
      appearances: {
        secondary: {
          borderRadius: '3px',
          paddingX: '18px',
          paddingY: '8px',
          color: 'black',

          selectors: {
            _before: {
              backgroundColor: 'transparent',
            },
            _current: {
              color: 'white !important',
              backgroundColor: '#cc0000 !important',
            },
            _hover: {
              color: 'black',
              backgroundColor: '#e5e5e5',
            },
          },
        },
      },
    },
    MenuItem: {
      baseStyle: {
        selectors: {
          _focus: {
            '&:before': {
              backgroundColor: '#cc0000',
            },
          },
        },
      },
    },
  },
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <Auth />,
    children: [
      {
        path: 'manage',
        element: <ManageClearance />,
      },
      {
        path: 'liaison-permissions',
        element: <LiaisonPermissions />,
      },
      {
        path: 'audit',
        element: <AuditLog />,
      },
      {
        path: 'admin',
        element: <Admin />,
      },
      {
        path: '',
        element: <Navigate to='/manage' />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider value={myTheme}>
      <Provider store={store}>
        <LayoutProvider>
          <RouterProvider router={router} />
        </LayoutProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
)
