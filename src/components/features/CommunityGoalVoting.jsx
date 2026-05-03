import React from 'react'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

export default function CommunityGoalVoting({ goals, onVote }) {
  const totalVotes = goals.reduce((sum, goal) => sum + goal.votes, 0) || 1

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">Audience Goal Vote</h3>
          <p className="text-sm text-slate-500">Let the community choose the next big objective and own the strategy together.</p>
        </div>
        <Badge variant="primary">Stakeholder vote</Badge>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => {
          const percent = Math.round((goal.votes / totalVotes) * 100)
          return (
            <div key={goal.id} className="rounded-3xl border border-slate-200 p-4 bg-slate-50">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-slate-900">{goal.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{goal.description}</p>
                </div>
                <Badge variant="info">{goal.votes} votes</Badge>
              </div>
              <div className="mt-3 h-3 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full rounded-full bg-true-blue" style={{ width: `${percent}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>{percent}% support</span>
                <Button variant="action" className="text-xs px-3 py-1" onClick={() => onVote(goal.id)}>Vote</Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
