import React, { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { useToast } from '../../context/ToastContext'

export default function ScheduleCallModal({ open, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', topic: '', notes: '' })
  const { showToast } = useToast()

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim() || !form.topic.trim()) {
      showToast('Please complete name, email, and topic', 'warning')
      return
    }
    showToast('Call request submitted — I will follow up shortly', 'success')
    onClose()
    setForm({ name: '', email: '', topic: '', notes: '' })
  }

  if (!open) return null
  return (
    <Modal open={open} onClose={onClose} title="Schedule a Personal Call">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Request a personal onboarding call or campaign review session.</p>
        <Input label="First and Last Name" value={form.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} placeholder="e.g., Jordan Lee" />
        <Input label="Email Address" type="email" value={form.email} onChange={(value) => setForm((prev) => ({ ...prev, email: value }))} placeholder="you@example.org" />
        <Input label="Topic" value={form.topic} onChange={(value) => setForm((prev) => ({ ...prev, topic: value }))} placeholder="Campaign setup, budgets, donor matching..." />
        <Input label="Notes" textarea value={form.notes} onChange={(value) => setForm((prev) => ({ ...prev, notes: value }))} placeholder="Add any context or questions..." />
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Submit Request</Button>
        </div>
      </div>
    </Modal>
  )
}