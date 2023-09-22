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
        try {
          const response = await clearanceAxios.get(
            `/liaison/needs-acknowledgement`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          setShouldShowDialog(response.data['needs_acknowledgement'])
        } catch (error) {
          if (
            !error.response.status === 401 &&
            !error.response?.data?.['detail'] === 'Token is expired'
          ) {
            toaster.danger(error.response.data['needs_acknowledgement'])
          }
        }
      }, 500)

      return () => {
        controller.abort()
        clearTimeout(timeout)
      }
    }
  }, [roles, token])

  const handleAcknowledgement = async () => {
    try {
      await clearanceAxios.put(`/liaison/save-acknowledgement`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

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
      confirmLabel='Acknowledge'
      isShown={shouldShowDialog}
      onCloseComplete={handleAcknowledgement}
      shouldCloseOnEscapePress={false}
    >
      To the best of my knowledge all people listed in the participation reports
      are valid and active members of campus. I certify that I have reviewed the
      list of people and the list of doors that participate in the clearances
      that grant access to the spaces I manage on campus.
    </Dialog>
  )
}
