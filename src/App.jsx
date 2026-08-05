import { useMemo, useState } from 'react'
import { useSdkBoot } from './hooks/useSdkBoot'
import { useSubsData } from './hooks/useSubsData'
import { useSendEmail } from './hooks/useSendEmail'
import SubsTable from './components/SubsTable'
import SearchInput from './components/SearchInput'
import {
  EmptyState,
  ErrorState,
  InfoNotice,
  LoadingState,
  NoMatchesState,
  WarnNotice,
} from './components/StateMessage'

const norm = (value) => (value ?? '').toString().toLowerCase().trim()

export default function App() {
  const { entityId, isMock, ready } = useSdkBoot()
  const { status, installerType, subs, error, reload } = useSubsData(entityId, ready)
  const { send, statusFor } = useSendEmail(entityId)

  const [nameQuery, setNameQuery] = useState('')
  const [emailQuery, setEmailQuery] = useState('')

  const loading = !ready || status === 'loading'
  const searching = Boolean(nameQuery.trim() || emailQuery.trim())

  // Both boxes narrow the same list, so filling in both means "name matches
  // AND email matches" rather than either on its own.
  const visibleSubs = useMemo(() => {
    const name = norm(nameQuery)
    const email = norm(emailQuery)
    if (!name && !email) return subs
    return subs.filter(
      (sub) =>
        (!name || norm(sub.Vendor_Name).includes(name)) &&
        (!email || norm(sub.RFP_Email).includes(email)),
    )
  }, [subs, nameQuery, emailQuery])

  const clearSearch = () => {
    setNameQuery('')
    setEmailQuery('')
  }

  const subtitle = () => {
    if (status !== 'ready' || !installerType) {
      return 'Subcontractor vendors related to this Sub Contract'
    }
    if (searching) {
      return `${visibleSubs.length} of ${subs.length} subcontractor vendors match your search`
    }
    return `${subs.length} subcontractor vendor${subs.length === 1 ? '' : 's'} · request pricing for this Sub Contract`
  }

  return (
    <div className="min-h-full w-full bg-surface px-8 pt-7 pb-10">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
        <div>
          <h1 className="relative m-0 pb-2.5 text-[22px] font-bold tracking-[-0.01em] text-ink after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-11 after:rounded-sm after:bg-brand after:content-['']">
            Subs &amp; Suppliers
          </h1>
          <p className="mt-1 text-[13px] text-muted">{subtitle()}</p>
        </div>

        {status === 'ready' && subs.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput
              value={nameQuery}
              onChange={setNameQuery}
              placeholder="Search by name"
              label="Search by vendor name"
            />
            <SearchInput
              value={emailQuery}
              onChange={setEmailQuery}
              placeholder="Search by email"
              label="Search by RFP email"
            />
          </div>
        )}
      </header>

      {isMock && (
        <WarnNotice>
          <strong className="font-bold">Mock data.</strong> The Zoho SDK is unavailable outside
          CRM, so these vendors are fixtures and nothing is actually sent.
        </WarnNotice>
      )}

      {status === 'ready' && installerType && (
        <InfoNotice>
          Showing vendors whose <strong className="font-bold">Primary</strong> or{' '}
          <strong className="font-bold">Secondary Type</strong> is{' '}
          <strong className="font-bold">{installerType}</strong>. Vendors flagged Do Not Use are
          hidden. Each RFP is sent individually.
        </InfoNotice>
      )}

      {loading && <LoadingState />}
      {!loading && status === 'error' && <ErrorState message={error} onRetry={reload} />}
      {!loading &&
        status === 'ready' &&
        (subs.length === 0 ? (
          <EmptyState installerType={installerType} />
        ) : visibleSubs.length === 0 ? (
          <NoMatchesState total={subs.length} onClear={clearSearch} />
        ) : (
          <SubsTable subs={visibleSubs} statusFor={statusFor} onSend={send} />
        ))}
    </div>
  )
}
