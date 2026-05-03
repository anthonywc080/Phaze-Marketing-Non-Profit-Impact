import React, { useMemo, useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import { useToast } from '../../context/ToastContext'

const SAMPLE_CAMPAIGNS = [
  { id: 'c1', title: 'Food Bank Fundraiser', category: 'Food Security', region: 'Bay Area', status: 'Open', description: 'Help us promote a weekend food drive in your community.' },
  { id: 'c2', title: 'Youth Leadership Awareness', category: 'Education', region: 'San Francisco', status: 'Open', description: 'Create social content to highlight youth leadership opportunities.' },
  { id: 'c3', title: 'Clean Energy Storytelling', category: 'Environment', region: 'Oakland', status: 'Open', description: 'Share why local solar access matters and how people can support.' },
  { id: 'c4', title: 'Animal Rescue Drive', category: 'Animal Welfare', region: 'Berkeley', status: 'Open', description: 'Promote adoption events and fundraising for rescue shelters.' }
]

export default function CampaignSearch() {
  const { showToast } = useToast()
  const [query, setQuery] = useState('')
  const [collabOpen, setCollabOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [email, setEmail] = useState('')

  const filtered = useMemo(() => {
    return SAMPLE_CAMPAIGNS.filter((campaign) =>
      campaign.title.toLowerCase().includes(query.toLowerCase()) ||
      campaign.category.toLowerCase().includes(query.toLowerCase()) ||
      campaign.region.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  const handleCollab = (campaign) => {
    setSelectedCampaign(campaign)
    setEmail('')
    setCollabOpen(true)
  }

  const submitCollabInvite = () => {
    if (!email.trim()) {
      showToast('Please provide an email to invite', 'warning')
      return
    }
    showToast(`Collab invite sent to ${email} for ${selectedCampaign.title}`, 'success')
    setCollabOpen(false)
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">Explore More Campaigns</h3>
          <p className="text-sm text-slate-500">Search campaigns beyond your matched assignments and connect with new opportunities.</p>
        </div>
        <div className="w-full max-w-sm">
          <Input value={query} onChange={setQuery} placeholder="Search by cause, region, or keyword" />
        </div>
      </div>
      <div className="space-y-4">
        {filtered.map((campaign) => (
          <div key={campaign.id} className="rounded-3xl border border-slate-200 p-4 hover:border-indigo-400 transition">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">{campaign.title}</p>
                <p className="text-sm text-slate-500 mt-1">{campaign.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-full border border-slate-300 bg-white px-2 py-1">{campaign.category}</span>
                  <span className="rounded-full border border-slate-300 bg-white px-2 py-1">{campaign.region}</span>
                  <span className="rounded-full border border-slate-300 bg-white px-2 py-1">{campaign.status}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button variant="secondary" onClick={() => handleCollab(campaign)}>Collab</Button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-sm text-slate-500 text-center py-8">No campaigns matched your search. Try broader keywords.</div>
        )}
      </div>

      <Modal open={collabOpen} onClose={() => setCollabOpen(false)} title={selectedCampaign ? `Invite student to collab on ${selectedCampaign.title}` : 'Invite collaborator'}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Enter the email address of another student who can support this open campaign.</p>
          <Input label="Student email" type="email" value={email} onChange={setEmail} placeholder="collaborator@example.com" />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setCollabOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={submitCollabInvite}>Send Invite</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}