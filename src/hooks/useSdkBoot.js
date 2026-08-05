import { useEffect, useRef, useState } from 'react'
import { isEmbedded, mockRequested, resizeWidget, setActiveSdk } from '../lib/zoho'
import { createMockZoho, MOCK_PAGE_LOAD_DATA } from '../lib/mockZoho'

// How long to wait for CRM before deciding we are not inside it.
const NOT_IN_CRM_HINT_MS = 3000

// Module-level, not a ref: StrictMode mounts the effect twice in development
// and init() must only ever run once.
let sdkStarted = false

/**
 * Starts the Zoho Embedded App SDK and reports the record the widget opened on.
 *
 * Deliberately mirrors the merge-accounts widget's boot sequence, which is the
 * arrangement known to make ZOHO.CRM.UI.Resize take effect:
 *   - register PageLoad, then call init()
 *   - resize once when init() resolves, and again inside the PageLoad handler
 *   - read window.ZOHO directly, never a cached reference
 */
export function useSdkBoot() {
  const [state, setState] = useState({ entityId: null, isMock: false, ready: false })
  const receivedRef = useRef(false)

  useEffect(() => {
    const startMock = () => {
      setActiveSdk(createMockZoho())
      resizeWidget()
      setState({ entityId: MOCK_PAGE_LOAD_DATA.EntityId[0], isMock: true, ready: true })
    }

    // On localhost there is no CRM to wait for, so skip straight to fixtures.
    if (mockRequested()) {
      startMock()
      return undefined
    }

    const handlePageLoad = (data) => {
      receivedRef.current = true
      setActiveSdk(window.ZOHO)
      resizeWidget()
      const raw = Array.isArray(data?.EntityId) ? data.EntityId[0] : data?.EntityId
      setState({ entityId: raw ? String(raw) : null, isMock: false, ready: true })
    }

    const ZOHO = window.ZOHO

    if (ZOHO?.embeddedApp && !sdkStarted) {
      sdkStarted = true
      ZOHO.embeddedApp.on('PageLoad', handlePageLoad)
      ZOHO.embeddedApp.init().then(resizeWidget)
    }

    // Framed but nothing came back — surface it rather than spin forever.
    const timer = setTimeout(() => {
      if (receivedRef.current) return
      if (isEmbedded()) {
        setState({ entityId: null, isMock: false, ready: true })
      } else {
        startMock()
      }
    }, NOT_IN_CRM_HINT_MS)

    return () => clearTimeout(timer)
  }, [])

  return state
}
