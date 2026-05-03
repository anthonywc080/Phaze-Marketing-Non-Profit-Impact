import React from 'react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

const SKILL_SUGGESTIONS = ['carpentry', 'coding', 'public speaking', 'design', 'fundraising', 'video production', 'community outreach']

export default function SkillTagEditor({ selectedSkills, onToggleSkill }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">My Skill Tags</h3>
          <p className="text-sm text-slate-500">Tag your profile so Phaze can ping you for the right opportunities.</p>
        </div>
        <Badge variant="info">Profile signal</Badge>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {selectedSkills.length === 0 ? (
          <span className="text-sm text-slate-500">No skills selected yet</span>
        ) : (
          selectedSkills.map((skill) => (
            <Badge key={skill} variant="primary">{skill}</Badge>
          ))
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {SKILL_SUGGESTIONS.map((skill) => {
          const selected = selectedSkills.includes(skill)
          return (
            <Button
              key={skill}
              variant={selected ? 'success' : 'secondary'}
              className="text-sm px-3 py-2"
              onClick={() => onToggleSkill(skill)}
            >
              {selected ? `✓ ${skill}` : skill}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
