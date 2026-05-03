import React from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

const steps = [
  { title: 'Match students to campaigns', detail: 'Students fill out a quick survey, then the platform recommends open campaigns that match their region and skills.' },
  { title: 'Search extra campaigns', detail: 'Students can browse campaigns beyond their matched assignments and join opportunities with one click.' },
  { title: 'Review submissions', detail: 'Nonprofits review student work in the approval dashboard and approve tasks to release payment.' },
  { title: 'Budget & escrow', detail: 'Nonprofits deposit funds, allocate budgets, and hold payments in escrow until work is verified.' },
  { title: 'Generate reports', detail: 'Download impact summaries, see hours worked, community reached, stipends paid, and export a platform-ready report.' }
]

export default function HelpGuideModal({ open, onClose }) {
  if (!open) return null
  return (
    <Modal open={open} onClose={onClose} title="Quick Phaze Guide">
      <div className="space-y-5">
        <div className="text-sm text-slate-600">
          This guide explains the most important buttons and workflow points across the Phaze platform.
        </div>
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="font-semibold text-slate-900">{step.title}</h4>
              <p className="text-sm text-slate-600 mt-1">{step.detail}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-white border border-slate-200 p-4">
          <h4 className="font-semibold text-slate-900">Button reference</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><strong>Create Campaign:</strong> opens the campaign builder for launching paid or volunteer-driven opportunities.</li>
            <li><strong>Review Submissions:</strong> opens the approval dashboard so nonprofits can verify student work and release funds.</li>
            <li><strong>View Impact:</strong> opens the analytics dashboard for performance metrics and report exports.</li>
            <li><strong>Collab:</strong> lets students invite another student by email to help with an open campaign.</li>
            <li><strong>Schedule a Call:</strong> books a personal session with the platform operator for setup or support.</li>
          </ul>
        </div>
        <div className="flex justify-end">
          <Button variant="primary" onClick={onClose}>Got it</Button>
        </div>
      </div>
    </Modal>
  )
}