import React from 'react'
import Badge from '../ui/Badge'

export default function P2PEngagementDashboard({ taskMetrics }) {
  const topTasks = taskMetrics
    .sort((a, b) => (b.clapCount + b.shareCount + b.commentCount) - (a.clapCount + a.shareCount + a.commentCount))
    .slice(0, 5)

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">Peer Interaction Report</h3>
          <p className="text-sm text-slate-500">Discover which projects spark the most community connection.</p>
        </div>
        <Badge variant="primary">Engagement data</Badge>
      </div>

      <div className="space-y-4">
        {topTasks.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p className="text-sm">No engagement data yet. Wait for the community to interact.</p>
          </div>
        ) : (
          topTasks.map((task) => {
            const total = task.clapCount + task.shareCount + task.commentCount
            return (
              <div key={task.id} className="rounded-3xl border border-slate-200 p-4 bg-slate-50">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h4 className="font-semibold text-slate-900">{task.title}</h4>
                  <span className="text-2xl font-bold text-true-blue">{total}</span>
                </div>
                <p className="text-sm text-slate-600 mb-3">{task.description}</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-white px-3 py-2 border border-slate-200">
                    <div className="text-xs text-slate-500 mb-1">Claps</div>
                    <div className="text-2xl font-bold text-action-orange">👏 {task.clapCount}</div>
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-2 border border-slate-200">
                    <div className="text-xs text-slate-500 mb-1">Shares</div>
                    <div className="text-2xl font-bold text-true-blue">↗ {task.shareCount}</div>
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-2 border border-slate-200">
                    <div className="text-xs text-slate-500 mb-1">Comments</div>
                    <div className="text-2xl font-bold text-emerald-600">💬 {task.commentCount}</div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="mt-6 rounded-3xl bg-slate-100 p-4">
        <p className="text-sm text-slate-700">
          <strong>Insight:</strong> Projects with high clap counts feel socially fulfilling. Consider creating more of these. Low engagement may signal that tasks feel isolating or unclear.
        </p>
      </div>
    </div>
  )
}
