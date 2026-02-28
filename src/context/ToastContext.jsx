import React, { createContext, useContext, useState, useCallback } from 'react'
import Toast from '../components/ui/Toast'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', timeout = 3000) => {
    const id = Date.now() + Math.random()
    const toast = { id, message, type }
    setToasts((t) => [toast, ...t])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, timeout)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 space-y-2 z-50">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
