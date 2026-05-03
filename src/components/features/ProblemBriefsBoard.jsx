import React, { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Badge from '../ui/Badge'
import { useToast } from '../../context/ToastContext'

export default function ProblemBriefsBoard({ briefs, onAddBrief, onVote, onRemix }) {
  const [draft, setDraft] = useState({ title: '', description: '', tags: '' })
  const { showToast } = useToast()

  const handleSubmit = () => {
    if (!draft.title.trim() || !draft.description.trim()) {
      showToast('Please add a title and description for your brief', 'warning')
      return
    }
    onAddBrief({
      title: draft.title.trim(),
      description: draft.description.trim(),
      tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
    })
    showToast('Problem brief posted successfully', 'success')
    setDraft({ title: '', description: '', tags: '' })
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">Problem Briefs & Remix Lab</h3>
          <p className="text-sm text-slate-500">Post a real challenge, gather ideas, and let the community vote for the next direction.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Input
          label="Problem headline"
          value={draft.title}
          onChange={(value) => setDraft((prev) => ({ ...prev, title: value }))}
          placeholder="We need a new mural design for the community center"
        />
        <Input
          label="Tags"
          value={draft.tags}
          onChange={(value) => setDraft((prev) => ({ ...prev, tags: value }))}
          placeholder="carpentry, design, community art"
        />
      </div>
      <Input
        label="Brief details"
        value={draft.description}
        onChange={(value) => setDraft((prev) => ({ ...prev, description: value }))}
        placeholder="Describe the objective, timeline, and why this matters."
        textarea
        className="h-32"
      />
      <div className="mt-4 flex justify-end">
        <Button variant="action" onClick={handleSubmit}>Post Brief</Button>
      </div>

      <div className="mt-8 space-y-4">
        {briefs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-6 text-center text-slate-500">
            No active briefs yet. Community ideas will appear here once someone posts a challenge.
          </div>
        ) : (
          briefs.map((brief) => (
            <div key={brief.id} className="rounded-3xl border border-slate-200 p-5 bg-slate-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">{brief.title}</h4>
                  <p className="text-sm text-slate-600 mt-1">{brief.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {brief.tags.map((tag) => (
                      <Badge key={tag} variant="info">#{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-slate-500">Ideas: {brief.ideaCount}</span>
                  <span className="text-xs text-slate-500">Votes: {brief.votes}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="secondary" className="text-xs px-3 py-1" onClick={() => onVote(brief.id)}>Vote Idea</Button>
                <Button variant="primary" className="text-xs px-3 py-1" onClick={() => onRemix(brief.id)}>Remix Idea</Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
