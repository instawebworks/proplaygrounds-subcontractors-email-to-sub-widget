// Zoho CRM module API names this widget talks to.
//
// Heads up: in this org several module labels do not match their API names.
//   RFPS            -> labelled "Sub Contracts"     (CustomModule10)
//   Sub_Contractors -> labelled "Subs and Suppliers" (CustomModule4)  [retired]
//   Vendors         -> labelled "Vendors"            (standard module)
export const MODULES = {
  SUB_CONTRACT: 'RFPS',
  VENDORS: 'Vendors',
}

// Subs and suppliers were migrated into Vendors. Only records of this vendor
// type are RFP candidates.
//
// Careful: the Vendor_Type picklist stores values that differ from their
// labels — "Product Vendor" stores as "Other" and "Supplier" as "Other1".
// "Subcontractor" happens to store as itself, but never assume that for the
// other options.
export const VENDOR_TYPE_SUBCONTRACTOR = 'Subcontractor'

// A Sub Contract's `Scope` decides which installer type we solicit.
// This replaces the old numeric Search_Code lookup; the codes still exist on
// Vendors and line up exactly with these types (verified across all 701
// subcontractor vendors — 111111/222222/333333 map 1:1 with no exceptions).
export const SCOPE_TO_VENDOR_TYPE = {
  Turf: 'Artificial Turf Installer', // was Search_Code 111111
  Installation: 'Playground / Shade Installer', // was Search_Code 222222
  'Poured in Place': 'Poured in Place Rubber Installer', // was Search_Code 333333
}

// Scope values that exist on RFPS but have no installer type to match against.
// Called out separately so the widget can explain itself instead of just
// showing an empty table.
export const UNSUPPORTED_SCOPES = ['Mulch Installation', 'Concrete', 'Other', 'test']

// Zoho caps a search page at 200 records; the largest scope currently matches
// 581 vendors, so paging is required rather than optional.
export const PAGE_SIZE = 200
export const MAX_PAGES = 15

// Size the widget asks Zoho for on load.
//
// ZOHO.CRM.UI.Resize takes CSS dimension strings and percentages are resolved
// by the host against the popup, so pass them straight through — do not convert
// to pixels. Same approach as the merge-accounts widget, which uses "100%".
export const WIDGET_SIZE = {
  width: '60%',
  height: '80%',
}

// Standalone Deluge function that actually composes and sends the email.
//
// SECURITY NOTE: the zapikey below is shipped to the browser, so anyone who can
// open this widget can invoke the function directly with arbitrary arguments.
// Carried over as-is from the original widget; worth replacing with
// ZOHO.CRM.FUNCTIONS.execute (session-authenticated) when convenient.
export const SEND_EMAIL_FUNCTION = {
  name: 'send_email_to_sub',
  url: 'https://crm.zoho.com/crm/v2/functions/send_email_to_sub/actions/execute?auth_type=apikey&zapikey=1003.b358cc534f1f0d212f68ac67f7f15fb7.f0ede0ea26f91f8cf8c0b637e16613c3',
}

// Field API names rendered in the table, in display order.
//
// The email column reads RFP_Email, not Email: after the migration only 2 of
// 701 subcontractor vendors carry a primary Email, while all 701 have an
// RFP_Email. Using Email here would blank out the column.
// `nowrap` keeps a column on one line. The type values ("Playground / Shade
// Installer") otherwise wrap and roughly double every row's height, which is
// costly when a scope matches 500+ vendors.
export const SUB_COLUMNS = [
  { key: 'Vendor_Name', label: 'Vendor Name' },
  { key: 'Type', label: 'Primary Type', nowrap: true },
  { key: 'Secondary_Type', label: 'Secondary Type', nowrap: true },
  { key: 'RFP_Email', label: 'RFP Email', nowrap: true },
]
