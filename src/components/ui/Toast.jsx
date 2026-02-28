import React from 'react'

export default function Toast({ toast }) {
  if (!toast) return null
  const { id, message, type = 'info' } = toast
  const colors = {
    info: 'bg-slate-100 text-slate-800',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
  }

  return (
    <div key={id} className={`px-4 py-2 rounded-lg shadow-sm ${colors[type]}`}>
      {message}
    </div>
  )
}
