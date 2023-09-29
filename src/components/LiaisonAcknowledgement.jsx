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
      title='Security Liaison Responsibilities Terms and Conditions'
    >
      Per NC State Regulations
      <a
        target='_blank'
        href='https://policies.ncsu.edu/regulation/reg-04-05-04/'
      >
        {' '}
        04.05.04{' '}
      </a>
      A Security Liaison is an individual who has been delegated the authority
      to act on behalf of a College/Unit/Department with the Security
      Applications and Technologies Department (SAT).
      <ul>
        <li>
          The primary point of accountability for their business unit for
          transactions with SAT including:
          <ul>
            <li>Clearance assignment actions</li>
            <li>Building locking schedule changes</li>
            <li>Equipment installation and repair requests</li>
            <li>Video requests</li>
          </ul>
        </li>
        <li>Reviews departmental requests for appropriate business use</li>
        <li>
          Assigns and revokes clearances at the direction of the business unit
        </li>
        <li>
          Receives and reviews transaction and and clearance audit reports and
          makes appropriate changes in a timely fashion
        </li>
        <li>
          Communicates changes in Security Liaisons status to
          College/Unit/Department leadership and SAT
        </li>
      </ul>
      By selecting the button below I acknowledge that I have read and agree
      with my duties and responsibilities as a Security Liaison
    </Dialog>
  )
}
