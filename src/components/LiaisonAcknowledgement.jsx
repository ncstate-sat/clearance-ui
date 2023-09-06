import { useState, useEffect } from 'react'
import { Dialog, toaster } from 'evergreen-ui'
import { useSelector } from 'react-redux'
import clearanceAxios from '../apis/clearanceAxios'

export default function () {
  const token = useSelector((state) => state.auth.token)
  const roles = useSelector((state) => state.auth.roles)
  const [shouldShowDialog, setShouldShowDialog] = useState(false)

  useEffect(() => {
    if (roles.includes('Liaison')) {
      const controller = new AbortController()

      const timeout = setTimeout(async () => {
        const response = await clearanceAxios.get(
          `/liaison/needs-acknowledgement/${'200103374'}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setShouldShowDialog(response.data['needs_acknowledgement'])
      }, 500)

      return () => {
        controller.abort()
        clearTimeout(timeout)
      }
    }
  }, [roles, token])

  const handleAcknowledgement = async () => {
    try {
      await clearanceAxios.put(
        `/liaison/save-acknowledgement/${'200103374'}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setShouldShowDialog(false)
    } catch (error) {
      if (
        !error.response.status === 401 &&
        !error.response?.data?.['detail'] === 'Token is expired'
      ) {
        console.error(error)
        setShouldShowDialog(true)
        toaster.danger(
          'There was an error while confirming your acknowledgement.'
        )
      }
    }
  }

  return (
    <Dialog
      hasClose={false}
      hasCancel={false}
      shouldCloseOnOverlayClick={false}
      isShown={shouldShowDialog}
      onCloseComplete={handleAcknowledgement}
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et
      pulvinar nisi, rhoncus lobortis quam. Nunc hendrerit auctor consectetur.
      Integer ante nisl, dignissim sit amet bibendum id, malesuada vel ligula.
      Duis scelerisque maximus scelerisque. Etiam eget volutpat urna, ac tempus
      massa. Etiam sollicitudin diam ut porttitor semper. In massa dolor,
      iaculis non congue quis, tempor a odio. Mauris eget urna pellentesque,
      vulputate metus scelerisque, pharetra mauris. Integer nec erat ut lorem
      volutpat lacinia. Nullam volutpat tellus ac gravida dignissim.
    </Dialog>
  )
}
