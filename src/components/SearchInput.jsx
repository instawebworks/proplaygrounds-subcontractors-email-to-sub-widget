export default function SearchInput({ value, onChange, placeholder, label }) {
  return (
    <div className="relative">
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <circle cx="7" cy="7" r="4.5" />
        <path d="M10.5 10.5L14 14" />
      </svg>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="w-56 rounded-lg border border-line-strong bg-card py-2 pr-8 pl-9 text-sm text-ink transition-all duration-150 placeholder:text-muted hover:border-brand focus:border-brand focus:ring-3 focus:ring-brand/20 focus:outline-none"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={`Clear ${label}`}
          className="absolute top-1/2 right-2 flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-line hover:text-soft"
        >
          ×
        </button>
      )}
    </div>
  )
}
