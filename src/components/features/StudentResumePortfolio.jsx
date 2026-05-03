import React, { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Badge from '../ui/Badge'

const sampleCategories = [
  { title: 'Professional Experience', items: ['Social media copywriting', 'Campaign performance reporting', 'Stakeholder outreach'] },
  { title: 'Hard Skills', items: ['Graphic design', 'Copywriting', 'Video editing'] },
  { title: 'Civic Engagement', items: ['Volunteer hours', 'Community outreach', 'Fundraising support'] }
]

export default function StudentResumePortfolio() {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [generated, setGenerated] = useState(false)

  const handleUpload = (event) => {
    const file = event.target.files[0]
    if (file) setUploadedFile(file)
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">Resume Builder & Portfolio</h3>
          <p className="text-sm text-slate-500">Build verified student resumes grouped by experience, skills, and civic service.</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Phaze verified</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-4">
          <h4 className="font-semibold text-slate-900 mb-3">Upload portfolio asset</h4>
          <p className="text-sm text-slate-500 mb-4">Add a finished flyer, blog post, or campaign asset that can live inside the generated resume.</p>
          <input type="file" accept="image/*,.pdf,.docx" onChange={handleUpload} className="w-full text-sm text-slate-700" />
          {uploadedFile && <p className="text-sm text-slate-600 mt-3">Uploaded: {uploadedFile.name}</p>}
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <h4 className="font-semibold text-slate-900 mb-3">Resume preview</h4>
          {generated ? (
            <div className="space-y-3">
              {sampleCategories.map((section) => (
                <div key={section.title} className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900">{section.title}</p>
                    <Badge variant="success">Verified</Badge>
                  </div>
                  <ul className="mt-3 list-disc pl-5 text-sm text-slate-600 space-y-1">
                    {section.items.map((item) => (<li key={item}>{item}</li>))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Generate a resume summary to see your verified impact broken into professional experience, hard skills, and community service.</p>
          )}
          <Button variant="primary" className="mt-4" onClick={() => setGenerated(true)}>
            Generate Resume
          </Button>
        </div>
      </div>
    </div>
  )
}