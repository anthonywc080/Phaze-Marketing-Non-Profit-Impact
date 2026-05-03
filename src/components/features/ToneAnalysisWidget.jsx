import React from 'react'
import Badge from '../ui/Badge'

export default function ToneAnalysisWidget({ tone }) {
  const sentimentColor = tone.sentiment === 'Inspired' ? 'success' : tone.sentiment === 'Frustrated' ? 'danger' : 'warning'

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">Community Tone AI</h3>
          <p className="text-sm text-slate-500">A quick emotional pulse to help the organization pivot communications and lead with the right tone.</p>
        </div>
        <Badge variant={sentimentColor}>{tone.sentiment}</Badge>
      </div>
      <div className="space-y-4 text-sm text-slate-600">
        <div>
          <p className="font-semibold text-slate-900">Insight</p>
          <p>{tone.insight}</p>
        </div>
        <div>
          <p className="font-semibold text-slate-900">Recommendation</p>
          <p>{tone.recommendation}</p>
        </div>
      </div>
    </div>
  )
}
