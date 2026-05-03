import React, { useState } from 'react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function ProjectTimeline({ history, horizon }) {
  const [activeTab, setActiveTab] = useState('history')

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">Community Journey</h3>
          <p className="text-sm text-slate-500">See what we've accomplished and where we're headed.</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 font-semibold text-sm border-b-2 transition ${activeTab === 'history' ? 'border-true-blue text-true-blue' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          History
        </button>
        <button
          onClick={() => setActiveTab('horizon')}
          className={`pb-3 px-4 font-semibold text-sm border-b-2 transition ${activeTab === 'horizon' ? 'border-action-orange text-action-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Horizon
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'history' ? (
          history.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p className="text-sm">No completed projects yet. Be the first to make history!</p>
            </div>
          ) : (
            history.map((project, idx) => (
              <div key={idx} className="rounded-3xl border border-slate-200 p-5 bg-slate-50 hover:bg-white transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="success">✓ Completed</Badge>
                      <span className="text-xs text-slate-500">{project.completedDate}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900">{project.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                    {project.impact && (
                      <div className="mt-3 rounded-2xl bg-white p-3 border border-true-blue/20">
                        <p className="text-xs font-semibold text-true-blue uppercase tracking-[0.18em] mb-1">Impact</p>
                        <p className="text-sm text-slate-700">{project.impact}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          horizon.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p className="text-sm">No upcoming projects yet. Submit a proposal to shape the future!</p>
            </div>
          ) : (
            horizon.map((project, idx) => (
              <div key={idx} className="rounded-3xl border border-slate-200 p-5 bg-slate-50 hover:bg-white transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="warning">→ Planned</Badge>
                      <span className="text-xs text-slate-500">{project.timeline}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900">{project.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.goals.map((goal) => (
                        <span key={goal} className="text-xs bg-action-orange/10 text-action-orange rounded-full px-2 py-1">{goal}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  )
}
