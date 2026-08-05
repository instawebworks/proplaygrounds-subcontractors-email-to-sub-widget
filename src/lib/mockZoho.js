// A stand-in for the Zoho Embedded App SDK so the widget can be developed and
// styled on localhost, where there is no CRM record and no plugin sandbox.
// Only the four calls this widget makes are implemented.
//
// Field shapes mirror the real Vendors module (Vendor_Name / Type /
// Secondary_Type / RFP_Email), not the retired Sub_Contractors module.

const MOCK_ENTITY_ID = '4876000000123456'

const MOCK_SUB_CONTRACT = {
  id: MOCK_ENTITY_ID,
  Name: 'Riverside Park Playground - Phase 2',
  Scope: 'Turf', // -> "Artificial Turf Installer"
}

const MOCK_VENDORS = [
  {
    id: '4876000000900001',
    Vendor_Name: 'Apex Turf Installers',
    Vendor_Type: 'Subcontractor',
    Type: 'Artificial Turf Installer',
    Secondary_Type: '',
    RFP_Email: 'estimating@apexturf.example',
    Do_Not_Use: false,
    Previous_Module: 'Subs and Suppliers',
  },
  {
    id: '4876000000900002',
    Vendor_Name: 'Greenfield Surfacing Co.',
    Vendor_Type: 'Subcontractor',
    Type: 'Playground / Shade Installer',
    Secondary_Type: 'Artificial Turf Installer',
    RFP_Email: 'bids@greenfieldsurfacing.example',
    Do_Not_Use: false,
    Previous_Module: 'Subs and Suppliers',
  },
  {
    id: '4876000000900003',
    Vendor_Name: 'Northline Site Works',
    Vendor_Type: 'Subcontractor',
    Type: 'Artificial Turf Installer',
    Secondary_Type: '',
    RFP_Email: 'office@northlinesite.example',
    Do_Not_Use: false,
    Previous_Module: 'Subs and Suppliers',
  },
  {
    id: '4876000000900004',
    Vendor_Name: 'Do Not Contact Contracting',
    Vendor_Type: 'Subcontractor',
    Type: 'Artificial Turf Installer',
    Secondary_Type: 'Poured in Place Rubber Installer',
    RFP_Email: 'nope@dnc.example',
    Do_Not_Use: true, // filtered out of the table
    Previous_Module: 'Subs and Suppliers',
  },
  {
    id: '4876000000900005',
    Vendor_Name: 'Cascade Recreation Supply',
    Vendor_Type: 'Subcontractor',
    Type: 'Artificial Turf Installer',
    Secondary_Type: 'Playground / Shade Installer',
    RFP_Email: 'sales@cascaderec.example',
    Do_Not_Use: false,
    Previous_Module: 'Subs and Suppliers',
  },
]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export function createMockZoho() {
  return {
    __mock: true,
    embeddedApp: {
      on: () => {},
      init: () => Promise.resolve(),
    },
    CRM: {
      // Localhost has no popup to resize, so the requested size is applied to
      // #root instead. Values arrive as CSS strings ("60%"), so they can be set
      // directly and preview the proportion the widget occupies in CRM.
      UI: {
        Resize: async ({ width, height }) => {
          const root = document.getElementById('root')
          if (root) {
            root.style.width = width
            root.style.height = height
            root.style.margin = '0 auto'
            root.style.outline = '1px dashed rgb(217 119 6 / 0.5)'
          }
          return { status: 'success', width, height }
        },
      },
      CONFIG: {
        getCurrentUser: async () => {
          await delay(120)
          return { users: [{ id: '1', full_name: 'Local Dev User', email: 'dev@localhost' }] }
        },
      },
      API: {
        getRecord: async () => {
          await delay(200)
          return { data: [MOCK_SUB_CONTRACT] }
        },
        // Honours `page` so the paging loop is exercised locally too.
        searchRecord: async ({ page = 1 } = {}) => {
          await delay(300)
          return { data: page === 1 ? MOCK_VENDORS : [] }
        },
      },
      HTTP: {
        post: async () => {
          await delay(700)
          return JSON.stringify({ details: { output: 'Mock RFP queued.' } })
        },
      },
    },
  }
}

export const MOCK_PAGE_LOAD_DATA = { EntityId: [MOCK_ENTITY_ID], Entity: 'RFPS' }
