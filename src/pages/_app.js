import { defaultTheme, mergeTheme, ThemeProvider } from 'evergreen-ui'
import LayoutProvider from '../components/LayoutProvider'
import Auth from '../components/document/Auth'
import 'react-datepicker/dist/react-datepicker.css'
import '../styles/styles.css'

import { Provider } from 'react-redux'
import store from '../store/store'

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
          _disabled: {
            backgroundColor: '#e68080',
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

        _current: {
          backgroundColor: '#cc0000 !important',
        },
      },
      appearances: {
        primary: {
          borderRadius: '3px',
          paddingX: '18px',
          paddingY: '8px',
          color: 'black',

          _before: {
            backgroundColor: 'transparent',
          },
          _current: {
            color: '#ffffff !important',
            borderBottom: 'none',
          },
          _hover: {
            color: 'black',
            backgroundColor: '#e5e5e5',
          },
        },
      },
    },
    MenuItem: {
      baseStyle: {
        _focus: {
          '&:before': {
            backgroundColor: '#cc0000',
          },
        },
      },
    },
  },
})

function MyApp({ Component, pageProps: { ...pageProps } }) {
  return (
    <ThemeProvider value={myTheme}>
      <Provider store={store}>
        <LayoutProvider>
          <Auth>
            <Component {...pageProps} />
          </Auth>
        </LayoutProvider>
      </Provider>
    </ThemeProvider>
  )
}

export default MyApp
