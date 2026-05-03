import React, { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'
import { useToast } from '../../context/ToastContext'

export default function ProjectProposalSystem({ proposals, onSubmitProposal, onVoteProposal }) {
  const [draft, setDraft] = useState({ title: '', description: '', goals: '', timeline: '' })
  const [draftOpen, setDraftOpen] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = () => {
    if (!draft.title.trim() || !draft.description.trim() || !draft.goals.trim()) {
      showToast('Please fill in title, description, and goals', 'warning')
      return
    }
    onSubmitProposal({
      title: draft.title.trim(),
      description: draft.description.trim(),
      goals: draft.goals.split(',').map((goal) => goal.trim()).filter(Boolean),
      timeline: draft.timeline.trim() || 'To be determined',
      votes: 0
    })
    showToast('Proposal submitted! Your idea is now open for community votes.', 'success')
    setDraft({ title: '', description: '', goals: '', timeline: '' })
    setDraftOpen(false)
  }

  const pendingProposals = proposals.filter((p) => p.status === 'pending')
  const approvedProposals = proposals.filter((p) => p.status === 'approved')

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">Community Project Proposals</h3>
          <p className="text-sm text-slate-500">Submit an idea. If it gets enough Connection Votes, it becomes a project!</p>
        </div>
        <Button variant="action" onClick={() => setDraftOpen(true)}>Submit Proposal</Button>
      </div>

      <div className="space-y-4 mb-6">
        <div className="text-sm font-semibold text-slate-800">Pending Review ({pendingProposals.length})</div>
        {pendingProposals.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-6 text-center text-slate-500">
            <p className="text-sm">No pending proposals yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingProposals.map((proposal) => (
              <div key={proposal.id} className="rounded-3xl border border-slate-200 p-4 bg-slate-50">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{proposal.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{proposal.description}</p>
                  </div>
                  <Badge variant="warning">🗳 Voting</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 mb-3">
                  {proposal.goals.map((goal) => (
                    <span key={goal} className="text-xs bg-true-blue/10 text-true-blue rounded-full px-2 py-1">{goal}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-slate-500">
                    <strong className="text-true-blue text-lg">{proposal.votes}</strong> Connection Votes
                  </div>
                  <Button
                    variant="primary"
                    className="text-xs px-3 py-1"
                    onClick={() => {
                      onVoteProposal(proposal.id)
                      showToast('Vote cast! You support this idea.', 'success')
                    }}
                  >
                    Vote (+1)
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {approvedProposals.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm font-semibold text-slate-800">Greenlit Projects ({approvedProposals.length})</div>
          <div className="space-y-3">
            {approvedProposals.map((proposal) => (
              <div key={proposal.id} className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{proposal.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{proposal.description}</p>
                  </div>
                  <Badge variant="success">✓ Approved</Badge>
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  Received {proposal.votes} Connection Votes • Now live as a project
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={draftOpen} onClose={() => setDraftOpen(false)} title="Submit a Project Proposal">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Got an idea that would benefit the community? Share it here.
          </p>
          <Input
            label="Project title"
            value={draft.title}
            onChange={(value) => setDraft((prev) => ({ ...prev, title: value }))}
            placeholder="E.g., Launch a peer mentorship circle"
          />
          <Input
            label="Description"
            value={draft.description}
            onChange={(value) => setDraft((prev) => ({ ...prev, description: value }))}
            textarea
            placeholder="Why does the community need this? What problem does it solve?"
            className="h-20"
          />
          <Input
            label="Goals (comma-separated)"
            value={draft.goals}
            onChange={(value) => setDraft((prev) => ({ ...prev, goals: value }))}
            placeholder="Build trust, share knowledge, increase retention"
          />
          <Input
            label="Proposed timeline"
            value={draft.timeline}
            onChange={(value) => setDraft((prev) => ({ ...prev, timeline: value }))}
            placeholder="E.g., 4 weeks, 8 weeks, ongoing"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDraftOpen(false)}>Cancel</Button>
            <Button variant="action" onClick={handleSubmit}>Submit Proposal</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
