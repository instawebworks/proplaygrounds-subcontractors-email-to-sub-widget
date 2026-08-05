import { createMockZoho, MOCK_PAGE_LOAD_DATA } from './mockZoho'
import {
  MAX_PAGES,
  MODULES,
  PAGE_SIZE,
  SCOPE_TO_VENDOR_TYPE,
  SEND_EMAIL_FUNCTION,
  VENDOR_TYPE_SUBCONTRACTOR,
  WIDGET_SIZE,
} from './config'

let sdk = null

/** Point the data calls at either the real ZOHO global or the localhost mock. */
export function setActiveSdk(next) {
  sdk = next
}

/** Zoho always renders widgets inside an iframe; a top-level window means localhost. */
export function isEmbedded() {
  try {
    return window.self !== window.top
  } catch {
    // Cross-origin access throws, which itself means we are framed.
    return true
  }
}

export function mockRequested() {
  const flag = new URLSearchParams(window.location.search).get('mock')
  if (flag === '1' || flag === 'true') return true
  if (flag === '0' || flag === 'false') return false
  return !isEmbedded()
}

function requireSdk() {
  if (!sdk) throw new Error('Zoho SDK used before PageLoad.')
  return sdk
}

// Ask CRM to size the widget popup. No-op outside CRM (local browser preview).
//
// Reads window.ZOHO directly rather than any stored reference, so it works at
// the earliest call — before PageLoad has handed us anything. Takes no
// arguments so it can be passed straight to .then() the way the
// merge-accounts widget does.
export function resizeWidget() {
  try {
    const ui = sdk?.__mock ? sdk.CRM?.UI : window.ZOHO?.CRM?.UI
    ui?.Resize?.({
      height: WIDGET_SIZE.height,
      width: WIDGET_SIZE.width,
    })
  } catch {
    /* not running inside CRM — ignore */
  }
}

/** Loads the Sub Contract (RFPS) record the widget is open on. */
export async function fetchSubContract(entityId) {
  const response = await requireSdk().CRM.API.getRecord({
    Entity: MODULES.SUB_CONTRACT,
    RecordID: entityId,
  })
  const record = response?.data?.[0]
  if (!record) {
    throw new Error(`Sub Contract ${entityId} could not be loaded.`)
  }
  return record
}

/** Maps a Sub Contract's Scope onto the vendor installer type we solicit. */
export function vendorTypeForScope(scope) {
  return SCOPE_TO_VENDOR_TYPE[scope] ?? null
}

/**
 * Builds the Vendors search criteria: subcontractors whose primary OR
 * secondary type matches the scope's installer type.
 */
function buildVendorCriteria(installerType) {
  return (
    `((Vendor_Type:equals:${VENDOR_TYPE_SUBCONTRACTOR})` +
    `and((Type:equals:${installerType})or(Secondary_Type:equals:${installerType})))`
  )
}

/**
 * Finds every matching subcontractor vendor, paging until Zoho stops handing
 * back new records.
 *
 * Paging matters here in a way it did not before: "Playground / Shade
 * Installer" alone matches 581 vendors and a page caps at 200, so a single
 * request would silently drop two thirds of the list.
 */
export async function fetchVendorsByType(installerType) {
  const Query = buildVendorCriteria(installerType)
  const seen = new Set()
  const records = []

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const response = await requireSdk().CRM.API.searchRecord({
      Entity: MODULES.VENDORS,
      Type: 'criteria',
      Query,
      page,
      per_page: PAGE_SIZE,
    })

    // searchRecord returns an empty object (not an empty array) on no matches.
    const batch = Array.isArray(response?.data) ? response.data : []
    if (batch.length === 0) break

    // Not every build of the embedded SDK honours `page`. If it ignored us we
    // would get page 1 back forever, so stop as soon as a page adds nothing new.
    const fresh = batch.filter((record) => record?.id && !seen.has(record.id))
    if (fresh.length === 0) break

    fresh.forEach((record) => seen.add(record.id))
    records.push(...fresh)

    if (batch.length < PAGE_SIZE) break
  }

  return records
}

/** Invokes the Deluge function that emails one subcontractor. */
export async function sendEmailToSub({ subsId, subContractId }) {
  const raw = await requireSdk().CRM.HTTP.post({
    url: SEND_EMAIL_FUNCTION.url,
    params: {
      subs_id: subsId,
      sub_cont_id: subContractId,
    },
  })

  let parsed
  try {
    parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
  } catch {
    throw new Error('The send-email function returned an unreadable response.')
  }

  const output = parsed?.details?.output
  if (output === undefined) {
    throw new Error('The send-email function did not report a result.')
  }
  return output
}
