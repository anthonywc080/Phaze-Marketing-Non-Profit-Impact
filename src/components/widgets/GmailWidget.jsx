import React, { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { useToast } from '../../context/ToastContext'

export default function GmailWidget({ emails = [] }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(null)
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h4 className="font-semibold mb-3">Priority Inbox</h4>
      <div className="space-y-2">
        {emails.map((e) => (
          <div key={e.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={() => { setActive(e); setOpen(true); }}>
            <div>
              <div className="font-medium">{e.from}</div>
              <div className="text-xs text-slate-500">{e.subject}</div>
            </div>
            <div className="text-xs text-slate-400">{e.time}</div>
          </div>
        ))}
        {emails.length === 0 && <div className="text-sm text-slate-500">Inbox empty.</div>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={active ? active.subject : 'Message'}>
        <div className="text-sm text-slate-700 mb-4">{active ? active.body : null}</div>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => { setOpen(false); }}>Close</Button>
          <Button variant="primary" loading={loading} onClick={() => {
            setLoading(true)
            setTimeout(() => {
              setLoading(false)
              showToast('Reply sent', 'success')
              setOpen(false)
            }, 1000)
          }}>Reply</Button>
        </div>
      </Modal>
    </div>
  )
}
