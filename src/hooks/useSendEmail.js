import { useCallback, useState } from 'react'
import { sendEmailToSub } from '../lib/zoho'

/**
 * Tracks the send state of each row independently.
 * Status per sub id: 'idle' | 'sending' | 'sent' | 'error'
 */
export function useSendEmail(subContractId) {
  const [sendState, setSendState] = useState({})

  const send = useCallback(
    async (subsId) => {
      setSendState((prev) => ({ ...prev, [subsId]: { status: 'sending' } }))
      try {
        const output = await sendEmailToSub({ subsId, subContractId })
        setSendState((prev) => ({ ...prev, [subsId]: { status: 'sent', output } }))
      } catch (error) {
        setSendState((prev) => ({
          ...prev,
          [subsId]: {
            status: 'error',
            message: error instanceof Error ? error.message : String(error),
          },
        }))
      }
    },
    [subContractId],
  )

  const statusFor = useCallback(
    (subsId) => sendState[subsId] ?? { status: 'idle' },
    [sendState],
  )

  return { send, statusFor }
}
