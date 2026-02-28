import React from 'react'

export default function Button({ children, onClick, variant = 'primary', className = '', ...props }) {
  const base = 'px-4 py-2 rounded-lg font-medium focus:outline-none transition'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-50',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
  }

  return (
    <button onClick={onClick} className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  )
}
