const BASE =
  'inline-flex items-center justify-center gap-1.5 rounded-md border border-transparent ' +
  'px-3 py-1 text-[13px] font-semibold whitespace-nowrap transition-all duration-150 ' +
  'focus:outline-none focus-visible:ring-3 focus-visible:ring-brand/20'

const VARIANTS = {
  idle: 'bg-brand text-white shadow-[0_1px_2px_rgb(43_97_158_/_0.35)] hover:bg-brand-dark cursor-pointer',
  sending: 'bg-[#b9c6d8] text-white cursor-wait',
  sent: 'bg-[#2fa36b] text-white shadow-[0_1px_2px_rgb(47_163_107_/_0.35)] cursor-default',
  error: 'bg-card border-line-strong text-[#97302b] hover:bg-[#fdecec] cursor-pointer',
}

const LABELS = {
  idle: 'Send RFP',
  sending: 'Sending…',
  sent: 'Sent',
  error: 'Retry',
}

export default function SendEmailButton({ state, onClick }) {
  const { status, message } = state
  const disabled = status === 'sending' || status === 'sent'

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        className={`${BASE} ${VARIANTS[status]}`}
        disabled={disabled}
        title={status === 'error' ? message : undefined}
        onClick={onClick}
      >
        {status === 'sending' && (
          <span className="size-3 animate-spin rounded-full border-2 border-white/45 border-t-white" />
        )}
        {status === 'sent' && <span aria-hidden="true">✓</span>}
        {LABELS[status]}
      </button>
      {status === 'error' && (
        <span className="max-w-52 text-right text-[11px] leading-tight text-[#97302b]">
          {message}
        </span>
      )}
    </div>
  )
}
