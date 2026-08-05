import { SUB_COLUMNS } from '../lib/config'
import SendEmailButton from './SendEmailButton'

const TH =
  'text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted ' +
  'bg-head px-4 py-2.5 border-b border-line whitespace-nowrap'

const TD = 'px-4 py-1.5 border-b border-line text-soft align-middle leading-snug'

export default function SubsTable({ subs, statusFor, onSend }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line border-t-[3px] border-t-brand bg-card shadow-card">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr>
            <th className={`${TH} w-11`}>#</th>
            {SUB_COLUMNS.map((column) => (
              <th key={column.key} className={TH}>
                {column.label}
              </th>
            ))}
            <th className={`${TH} w-[150px] text-right`}>Action</th>
          </tr>
        </thead>
        <tbody>
          {subs.map((sub, index) => (
            <tr
              key={sub.id}
              className="transition-colors duration-100 last:[&>td]:border-b-0 hover:bg-brand-tint"
            >
              <td className={`${TD} tabular-nums text-muted`}>{index + 1}</td>
              {SUB_COLUMNS.map((column) => (
                <td
                  key={column.key}
                  className={`${TD} ${column.nowrap ? 'whitespace-nowrap' : ''} ${
                    column.key === 'Vendor_Name' ? 'font-semibold text-ink' : ''
                  }`}
                >
                  {sub[column.key] || <span className="text-muted">—</span>}
                </td>
              ))}
              <td className={TD}>
                <SendEmailButton state={statusFor(sub.id)} onClick={() => onSend(sub.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
