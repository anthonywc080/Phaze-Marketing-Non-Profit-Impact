import React from 'react'
import { Loader2 } from 'lucide-react'

function triggerSuccessHaptic() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate([50, 30, 50])
  }
}

export default function Button({ children, onClick, variant = 'primary', className = '', loading = false, haptic = false, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium focus:outline-none transition'
  const variants = {
    primary: 'bg-true-blue text-white hover:bg-blue-700',
    secondary: 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-50',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    action: 'bg-action-orange text-white hover:bg-opacity-90'
  }

  const handleClick = (event) => {
    if (haptic) triggerSuccessHaptic()
    if (onClick) onClick(event)
  }

  const cls = `${base} ${variants[variant] || variants.primary} ${loading ? 'opacity-80 cursor-wait' : ''} ${className}`

  return (
    <button onClick={handleClick} className={cls} disabled={loading || props.disabled} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
