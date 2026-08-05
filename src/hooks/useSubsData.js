import { useCallback, useEffect, useState } from 'react'
import { fetchSubContract, fetchVendorsByType, vendorTypeForScope } from '../lib/zoho'
import { UNSUPPORTED_SCOPES } from '../lib/config'

const INITIAL_STATE = {
  status: 'loading', // 'loading' | 'ready' | 'error'
  subContract: null,
  installerType: null,
  subs: [],
  error: null,
}

/**
 * Loads the Sub Contract the widget is open on and pulls the subcontractor
 * vendors whose type matches its Scope.
 *
 * Takes the record id from useSdkBoot rather than starting the SDK itself, so
 * the boot sequence stays in one place.
 */
export function useSubsData(entityId, ready) {
  const [state, setState] = useState(INITIAL_STATE)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => setReloadKey((n) => n + 1), [])

  useEffect(() => {
    if (!ready) return undefined

    let cancelled = false

    async function load() {
      setState(INITIAL_STATE)

      try {
        if (!entityId) {
          throw new Error('No record id came back from CRM. Open this widget from a Sub Contract.')
        }

        const subContract = await fetchSubContract(entityId)
        if (cancelled) return

        const installerType = vendorTypeForScope(subContract.Scope)
        if (!installerType) {
          const scope = subContract.Scope
          if (!scope || scope === '-None-') {
            throw new Error('This Sub Contract has no Scope set, so no vendors can be matched.')
          }
          throw new Error(
            UNSUPPORTED_SCOPES.includes(scope)
              ? `Scope "${scope}" has no matching subcontractor type in Vendors, so RFPs cannot be sent from here yet.`
              : `Scope "${scope}" is not mapped to a vendor type.`,
          )
        }

        const vendors = await fetchVendorsByType(installerType)
        if (cancelled) return

        setState({
          status: 'ready',
          subContract,
          installerType,
          // Vendors flagged Do Not Use are never shown, matching the original widget.
          subs: vendors.filter((vendor) => !vendor.Do_Not_Use),
          error: null,
        })
      } catch (error) {
        if (cancelled) return
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: error instanceof Error ? error.message : String(error),
        }))
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [entityId, ready, reloadKey])

  return { ...state, reload }
}
