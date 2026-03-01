import React from 'react'

export default function DonationTimeline({ donations = [] }) {
  if (!donations || donations.length === 0) return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h4 className="font-semibold mb-2">Donation Timeline</h4>
      <div className="text-sm text-slate-500">No donation activity yet.</div>
    </div>
  )

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h4 className="font-semibold mb-3">Donation Timeline</h4>
      <div className="space-y-3">
        {donations.map((d) => (
          <div key={d.id} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <div className="h-full w-px bg-slate-100 mt-1" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">${d.amount} — {d.donor}</div>
              <div className="text-xs text-slate-500">{d.campaign ? `${d.campaign} • ` : ''}{d.time || d.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
