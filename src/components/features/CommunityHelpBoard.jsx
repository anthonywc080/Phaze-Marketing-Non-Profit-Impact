import React, { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Badge from '../ui/Badge'
import { useToast } from '../../context/ToastContext'

export default function CommunityHelpBoard({ requests, onPostHelp }) {
  const [draft, setDraft] = useState({ type: 'need', title: '', details: '', skills: '' })
  const { showToast } = useToast()

  const handleSubmit = () => {
    if (!draft.title.trim() || !draft.details.trim()) {
      showToast('Please add a title and details for your request', 'warning')
      return
    }
    onPostHelp({
      type: draft.type,
      title: draft.title.trim(),
      details: draft.details.trim(),
      skills: draft.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
    })
    showToast('Community request shared', 'success')
    setDraft({ type: draft.type, title: '', details: '', skills: '' })
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">Community Help Hub</h3>
          <p className="text-sm text-slate-500">A dedicated space for requests, offers, and peer-to-peer support beyond campaign work.</p>
        </div>
        <Badge variant="success">Open community</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <button
              className={`rounded-full px-3 py-1 text-xs font-semibold ${draft.type === 'need' ? 'bg-true-blue text-white' : 'bg-slate-100 text-slate-700'}`}
              onClick={() => setDraft((prev) => ({ ...prev, type: 'need' }))}
            >
              I need help
            </button>
            <button
              className={`rounded-full px-3 py-1 text-xs font-semibold ${draft.type === 'offer' ? 'bg-action-orange text-white' : 'bg-slate-100 text-slate-700'}`}
              onClick={() => setDraft((prev) => ({ ...prev, type: 'offer' }))}
            >
              I can offer
            </button>
          </div>
          <Input label="Title" value={draft.title} onChange={(value) => setDraft((prev) => ({ ...prev, title: value }))} placeholder="I need a ride to the food bank" />
          <Input label="Skills / supplies" value={draft.skills} onChange={(value) => setDraft((prev) => ({ ...prev, skills: value }))} placeholder="e.g. transportation, donated books" />
        </div>
        <Input label="Details" value={draft.details} onChange={(value) => setDraft((prev) => ({ ...prev, details: value }))} textarea className="h-full" placeholder="Share the need or the offer, and how others can connect." />
      </div>

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSubmit}>Share in the community</Button>
      </div>

      <div className="mt-8 space-y-4">
        {requests.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-6 text-center text-slate-500">
            Nothing posted yet — be the first to start the community conversation.
          </div>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="rounded-3xl border border-slate-200 p-5 bg-slate-50">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant={request.type === 'need' ? 'danger' : 'success'}>{request.type === 'need' ? 'Need' : 'Offer'}</Badge>
                    <h4 className="text-lg font-semibold text-slate-900">{request.title}</h4>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">{request.details}</p>
                  {request.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                      {request.skills.map((skill) => (
                        <Badge key={skill} variant="info">{skill}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button variant="secondary" className="text-xs px-3 py-1" onClick={() => showToast('Connection sent! Follow up with the contributor directly.', 'success')}>
                  Connect
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
