import React, { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'

const SAMPLE_CAMPAIGNS = [
  { id: 'c1', title: 'Local Food Bank Outreach', region: '94103', ageRange: [16, 22], category: 'Food Security' },
  { id: 'c2', title: 'Youth Mentorship Social Campaign', region: '94110', ageRange: [17, 24], category: 'Education' },
  { id: 'c3', title: 'Neighborhood Clean-Up Storytelling', region: '94133', ageRange: [14, 20], category: 'Community Building' },
  { id: 'c4', title: 'Housing Support Fundraising', region: '94109', ageRange: [18, 26], category: 'Homelessness' }
]

export default function StudentSurvey({ onMatchChoose }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', age: '', gender: '', race: '', region: '', zipcode: '' })
  const [matches, setMatches] = useState([])

  const handleSubmit = () => {
    const age = Number(form.age)
    const filtered = SAMPLE_CAMPAIGNS.filter((campaign) => {
      const matchesAge = age >= campaign.ageRange[0] && age <= campaign.ageRange[1]
      const matchesZip = form.zipcode && campaign.region.startsWith(form.zipcode.slice(0, 3))
      return matchesAge || matchesZip
    })
    setMatches(filtered.length ? filtered : SAMPLE_CAMPAIGNS.slice(0, 2))
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">Quick Student Match Survey</h3>
          <p className="text-sm text-slate-500">Answer a few questions so we can match you to campaigns faster.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input label="First Name" value={form.firstName} onChange={(value) => setForm((prev) => ({ ...prev, firstName: value }))} placeholder="First name" />
        <Input label="Last Name" value={form.lastName} onChange={(value) => setForm((prev) => ({ ...prev, lastName: value }))} placeholder="Last name" />
        <Input label="Age" type="number" value={form.age} onChange={(value) => setForm((prev) => ({ ...prev, age: value }))} placeholder="Age" />
        <Input label="Zip code" value={form.zipcode} onChange={(value) => setForm((prev) => ({ ...prev, zipcode: value }))} placeholder="Zip code" />
        <Input label="Region / City" value={form.region} onChange={(value) => setForm((prev) => ({ ...prev, region: value }))} placeholder="Region or city" />
        <Input label="Gender" value={form.gender} onChange={(value) => setForm((prev) => ({ ...prev, gender: value }))} placeholder="Gender" />
        <Input label="Race / Identity" value={form.race} onChange={(value) => setForm((prev) => ({ ...prev, race: value }))} placeholder="Race or identity" />
      </div>

      <div className="mt-5 flex justify-end">
        <Button variant="primary" onClick={handleSubmit}>Match Me</Button>
      </div>

      {matches.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="text-lg font-semibold">Recommended campaigns</h4>
          <div className="grid gap-3">
            {matches.map((campaign) => (
              <div key={campaign.id} className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{campaign.title}</p>
                    <p className="text-sm text-slate-500">Category: {campaign.category}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-white px-2 py-1 border">Region: {campaign.region}</span>
                  <span className="rounded-full bg-white px-2 py-1 border">Age range: {campaign.ageRange[0]}–{campaign.ageRange[1]}</span>
                </div>
                <div className="mt-3 text-right">
                  <Button variant="secondary" onClick={() => onMatchChoose?.(campaign)}>View campaign</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}