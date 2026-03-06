import React from 'react'

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white border border-slate-200 rounded-2xl shadow-sm w-full max-w-2xl p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button className="text-slate-500" onClick={onClose}>Close</button>
        </div>
        <div className="text-slate-700">{children}</div>
      </div>
    </div>
  )
}
