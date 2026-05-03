import React, { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

export default function SettingsModal({ open, onClose }) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    weeklySummary: false,
    donorDiscovery: true,
    allowStudentCollab: true
  })

  if (!open) return null

  return (
    <Modal open={open} onClose={onClose} title="Platform Settings">
      <div className="space-y-5">
        <div className="space-y-4">
          {Object.entries(settings).map(([key, value]) => (
            <label key={key} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                checked={value}
                onChange={() => setSettings((prev) => ({ ...prev, [key]: !prev[key] }))}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <div className="text-sm font-medium text-slate-900">{key === 'emailNotifications' ? 'Email notifications' : key === 'weeklySummary' ? 'Weekly summary report' : key === 'donorDiscovery' ? 'Donor discovery access' : 'Student collaboration enabled'}</div>
                <p className="text-xs text-slate-500">{key === 'emailNotifications' ? 'Receive alerts for new matches, messages, and approvals.' : key === 'weeklySummary' ? 'Get a weekly performance summary email.' : key === 'donorDiscovery' ? 'Let private donors search and message your nonprofit.' : 'Allow students to invite peers to collaborate.'}</p>
              </div>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button variant="primary" onClick={onClose}>Save Settings</Button>
        </div>
      </div>
    </Modal>
  )
}