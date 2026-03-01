import React from 'react'

export default function Badge({ children, variant = 'info', className = '' }) {
  const variants = {
    info: 'bg-slate-100 text-slate-800',
    success: 'bg-emerald-100 text-emerald-600',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-600',
    // Channel / Brand accents
    gmail: 'bg-red-100 text-red-600',
    zoom: 'bg-blue-100 text-[#2D8CFF]',
    money: 'bg-emerald-100 text-emerald-600',
    linkedin: 'bg-sky-100 text-sky-600',
    // Priority
    priority-high: 'bg-red-100 text-red-600',
    priority-medium: 'bg-amber-100 text-amber-800',
    priority-low: 'bg-emerald-100 text-emerald-600',
    primary: 'bg-indigo-600 text-white'
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${variants[variant] || variants.info} ${className}`}>
      {children}
    </span>
  )
}
