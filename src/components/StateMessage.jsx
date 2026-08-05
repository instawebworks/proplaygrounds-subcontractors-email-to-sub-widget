import { SUB_COLUMNS } from '../lib/config'

/** Skeleton rows inside the same card the real table lands in, so the layout
 *  does not jump once the vendors arrive. */
export function LoadingState() {
  const cols = SUB_COLUMNS.length + 2
  return (
    <div
      className="overflow-hidden rounded-xl border border-line border-t-[3px] border-t-brand bg-card shadow-card"
      aria-busy="true"
      aria-label="Loading vendors"
    >
      <div className="flex gap-[18px] border-b border-line bg-head px-[18px] py-3">
        {Array.from({ length: cols }, (_, i) => (
          <span key={i} className="skeleton h-3 flex-1" />
        ))}
      </div>
      {[0, 1, 2, 3, 4].map((row) => (
        <div key={row} className="flex items-center gap-[18px] border-b border-line px-[18px] py-4 last:border-b-0">
          <span className="skeleton h-8 w-[110px] rounded-lg" />
          {Array.from({ length: cols - 1 }, (_, i) => (
            <span key={i} className="skeleton h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-[10px] border border-[#f6c9c9] bg-[#fdecec] px-4 py-3.5 text-[13.5px] leading-relaxed text-[#97302b]">
      <strong className="font-bold">Could not load vendors.</strong> {message}
      {onRetry && (
        <div>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 cursor-pointer rounded-lg border border-[#e2b4b4] bg-card px-4 py-2 text-sm font-semibold text-[#97302b] transition-colors hover:bg-white"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}

export function EmptyState({ installerType }) {
  return (
    <div className="rounded-xl border border-dashed border-line-strong bg-card p-8 text-center text-sm leading-relaxed text-muted">
      No subcontractor vendors matched
      {installerType ? ` “${installerType}”` : ' this Sub Contract'}.
    </div>
  )
}

/** Shown when the vendors loaded fine but the search narrowed them to nothing. */
export function NoMatchesState({ total, onClear }) {
  return (
    <div className="rounded-xl border border-dashed border-line-strong bg-card p-8 text-center text-sm leading-relaxed text-muted">
      No vendors match your search. {total} are available for this Sub Contract.
      <div>
        <button
          type="button"
          onClick={onClear}
          className="mt-3 cursor-pointer rounded-lg border border-line-strong bg-card px-4 py-2 text-sm font-semibold text-soft transition-colors hover:border-brand hover:text-brand-dark"
        >
          Clear search
        </button>
      </div>
    </div>
  )
}

export function InfoNotice({ children }) {
  return (
    <div className="mb-3.5 rounded-[10px] border border-[#c5dcf3] bg-brand-tint px-4 py-3.5 text-[13.5px] leading-relaxed text-brand-dark">
      {children}
    </div>
  )
}

export function WarnNotice({ children }) {
  return (
    <div className="mb-3.5 rounded-[10px] border border-[#f0d9a8] bg-[#fff7e8] px-4 py-3.5 text-[13.5px] leading-relaxed text-[#8a5a00]">
      {children}
    </div>
  )
}
