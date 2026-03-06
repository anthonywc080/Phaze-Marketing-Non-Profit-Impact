import React, { useState } from 'react'
import ZoomWidget from '../components/widgets/ZoomWidget'
import DonationWidget from '../components/widgets/DonationWidget'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useToast } from '../context/ToastContext'
import { useApp } from '../context/AppContext'

export default function StudentPortal() {
  const { students, donations, addTask } = useApp()
  const student = students[0] || { name: 'Student', pipeline_status: 'applied' }
  const sessions = [] // sessions can be derived from tasks or external integrations later
  const campaigns = Array.from(new Map((donations || []).map(d => [d.campaign || d.donorName, d])).values())

  const { showToast } = useToast()
  const [appOpen, setAppOpen] = useState(false)
  const [appTitle, setAppTitle] = useState('')

  function startApplication() {
    setAppOpen(true)
  }

  function submitApplication() {
    if (!appTitle) {
      showToast('Please enter a title', 'warning')
      return
    }
    addTask({ title: appTitle, channel: 'gmail', status: 'idea', priority: 'medium' })
    setAppOpen(false)
    setAppTitle('')
    showToast('Application started', 'success')
  }

  function shareCampaign(c) {
    showToast('Shared to LinkedIn', 'success')
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-900">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-bold">Welcome back, {student.name}!</h2>
        <p className="text-sm text-slate-100">Quick actions to join sessions and apply for opportunities.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-semibold mb-3">Upcoming Sessions</h4>
            <div className="space-y-3">
              <div className="p-3 rounded-lg border flex items-center justify-between">
                <div>
                  <div className="font-medium">Mentor: {student.mentorId || 'Unassigned'}</div>
                  <div className="text-xs text-slate-500">Next session: --</div>
                </div>
                <Button variant="primary" onClick={() => { showToast('Joining Zoom...', 'info'); setTimeout(()=>showToast('Joined session', 'success'), 1000) }}>Join Zoom</Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-semibold mb-3">My Applications</h4>
            <div className="space-y-2">
              <div className="p-3 rounded-lg border flex items-center justify-between">
                <div>
                  <div className="font-medium">Laptop Grant</div>
                  <div className="text-xs text-slate-500">Under Review</div>
                </div>
                <Badge variant="info">Under Review</Badge>
              </div>
              <div className="p-3 rounded-lg border flex items-center justify-between">
                <div>
                  <div className="font-medium">Mentorship</div>
                  <div className="text-xs text-slate-500">Accepted</div>
                </div>
                <Badge variant="success">Accepted</Badge>
              </div>
              <div className="flex justify-end">
                <Button variant="primary" onClick={startApplication}>Start Application</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-semibold mb-3">Organization Campaigns</h4>
            <div className="space-y-3">
              {campaigns.map((c, idx) => (
                <div key={idx} className="p-3 rounded-lg border">
                  <div className="font-medium">{c.campaign || c.donorName}</div>
                  <div className="text-xs text-slate-500 mb-2">Raised ${c.amount || 0}</div>
                  <div className="w-full bg-slate-100 h-2 rounded-full mb-2">
                    <div className="h-2 rounded-full bg-emerald-600" style={{width:`${Math.min(100, ((c.amount||0)/1000)*100)}%`}} />
                  </div>
                  <button className="text-sm text-sky-600" onClick={() => shareCampaign(c)}>Share to LinkedIn</button>
                </div>
              ))}
            </div>
          </div>

          <DonationWidget initial={donations} />
        </div>
      </div>

      <Modal open={appOpen} onClose={() => setAppOpen(false)} title="Start Application">
        <Input label="Application Title" value={appTitle} onChange={setAppTitle} placeholder="e.g., Laptop Grant" />
        <div className="flex justify-end mt-4">
          <Button variant="secondary" onClick={() => setAppOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={submitApplication}>Submit</Button>
        </div>
      </Modal>
    </div>
  )
}
