import React from 'react'

export default function Badge({ children, variant = 'info', className = '' }) {
  const variants = {
    info: 'bg-slate-100 text-slate-800',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${variants[variant] || variants.info} ${className}`}>
      {children}
    </span>
  )
}
