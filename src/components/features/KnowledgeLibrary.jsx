import React, { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Badge from '../ui/Badge'
import { useToast } from '../../context/ToastContext'

export default function KnowledgeLibrary({ assets, onAddAsset }) {
  const [draft, setDraft] = useState({ title: '', description: '', type: 'guide', url: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const { showToast } = useToast()

  const assetTypes = [
    { value: 'guide', label: 'How-to Guide', icon: '📖' },
    { value: 'template', label: 'Template', icon: '📋' },
    { value: 'asset', label: 'Design Asset', icon: '🎨' },
    { value: 'tool', label: 'Tool Link', icon: '🔧' }
  ]

  const handleSubmit = () => {
    if (!draft.title.trim() || !draft.url.trim()) {
      showToast('Please fill in all fields', 'warning')
      return
    }
    onAddAsset({
      title: draft.title.trim(),
      description: draft.description.trim(),
      type: draft.type,
      url: draft.url.trim()
    })
    showToast('Resource added to the library!', 'success')
    setDraft({ title: '', description: '', type: 'guide', url: '' })
  }

  const filteredAssets = assets.filter((asset) =>
    asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">Knowledge Library</h3>
          <p className="text-sm text-slate-500">Share guides, templates, and assets that help the community succeed.</p>
        </div>
        <Badge variant="primary">Shared ecosystem</Badge>
      </div>

      <div className="bg-slate-50 rounded-3xl p-5 mb-6">
        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <Input
            label="Resource title"
            value={draft.title}
            onChange={(value) => setDraft((prev) => ({ ...prev, title: value }))}
            placeholder="E.g., Event Planning Checklist"
          />
          <div>
            <div className="text-sm font-medium text-slate-700 mb-2">Type</div>
            <div className="flex gap-2">
              {assetTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setDraft((prev) => ({ ...prev, type: type.value }))}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${draft.type === type.value ? 'bg-true-blue text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                >
                  {type.icon} {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Input
          label="Description"
          value={draft.description}
          onChange={(value) => setDraft((prev) => ({ ...prev, description: value }))}
          placeholder="What is this resource and how does it help?"
          textarea
          className="h-20"
        />
        <Input
          label="Link or file"
          value={draft.url}
          onChange={(value) => setDraft((prev) => ({ ...prev, url: value }))}
          placeholder="https://docs.google.com/... or file path"
          className="mt-3"
        />
        <div className="mt-4 flex justify-end">
          <Button variant="action" onClick={handleSubmit}>Share Resource</Button>
        </div>
      </div>

      <div className="mb-4">
        <Input
          label="Search library"
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Find guides, templates, or tools..."
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filteredAssets.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-slate-500">
            <p className="text-sm">No resources yet. Be the first to contribute!</p>
          </div>
        ) : (
          filteredAssets.map((asset) => {
            const typeInfo = assetTypes.find((type) => type.value === asset.type)
            return (
              <div key={asset.id} className="rounded-3xl border border-slate-200 p-4 bg-slate-50">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-2xl">{typeInfo?.icon}</span>
                  <Badge variant="info">{typeInfo?.label}</Badge>
                </div>
                <h4 className="font-semibold text-slate-900">{asset.title}</h4>
                <p className="text-sm text-slate-600 mt-1">{asset.description}</p>
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-true-blue hover:underline mt-3 inline-block"
                >
                  View resource →
                </a>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
