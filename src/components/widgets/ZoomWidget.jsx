import React from 'react'
import Button from '../ui/Button'
import { useToast } from '../../context/ToastContext'

export default function ZoomWidget({ sessions = [] }) {
  const { showToast } = useToast()

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h4 className="font-semibold mb-3">Upcoming Sessions</h4>
      <div className="space-y-3">
        {sessions.map((s) => (
          <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
            <div>
              <div className="font-medium">{s.title}</div>
              <div className="text-xs text-slate-500">{s.time}</div>
            </div>
            <Button variant="primary" onClick={() => showToast('Opening Zoom...')}>Start Meeting</Button>
          </div>
        ))}
        {sessions.length === 0 && <div className="text-sm text-slate-500">No sessions scheduled.</div>}
      </div>
    </div>
  )
}
