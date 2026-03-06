import React from 'react'

export default function Input({ label, value, onChange, placeholder = '', className = '', type = 'text', textarea = false }) {
  if (textarea) {
    return (
      <label className="block">
        {label && <div className="text-sm font-medium text-slate-700 mb-1">{label}</div>}
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-900 ${className}`} />
      </label>
    )
  }

  return (
    <label className="block">
      {label && <div className="text-sm font-medium text-slate-700 mb-1">{label}</div>}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-900 ${className}`} />
    </label>
  )
}
