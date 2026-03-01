import React from 'react'
import { Loader2 } from 'lucide-react'

export default function Button({ children, onClick, variant = 'primary', className = '', loading = false, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium focus:outline-none transition'
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-50',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
  }

  const cls = `${base} ${variants[variant] || variants.primary} ${loading ? 'opacity-80 cursor-wait' : ''} ${className}`

  return (
    <button onClick={onClick} className={cls} disabled={loading || props.disabled} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
