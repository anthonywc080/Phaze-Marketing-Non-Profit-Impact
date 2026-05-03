import React from 'react'
import { Info, Phone, Search, Settings, FileText, Users, Sparkles } from 'lucide-react'
import Button from '../ui/Button'
import { useRole } from '../../context/RoleContext'

const quickActions = [
  { label: 'Platform Guide', icon: Info, action: 'guide' },
  { label: 'Schedule a Call', icon: Phone, action: 'call' },
  { label: 'Settings', icon: Settings, action: 'settings' },
  { label: 'Explore Campaigns', icon: Search, action: 'search' },
  { label: 'Impact Reports', icon: FileText, action: 'report' }
]

export default function PlatformSidebar({ onAction }) {
  const { persona } = useRole()

  return (
    <aside className="hidden xl:flex xl:w-80 xl:flex-col xl:border-r xl:border-slate-200 xl:bg-slate-50 xl:pt-6 xl:pb-8 xl:px-4">
      <div className="sticky top-6 flex flex-col gap-6">
        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Workspace</p>
              <h2 className="text-xl font-semibold text-slate-900">Phaze Control Center</h2>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 grid place-items-center">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm text-slate-600">Your personalized command panel for campaign, student, donor, and budget workflows.</p>
          <div className="mt-5 rounded-2xl bg-slate-100 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Persona</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{persona}</p>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Quick actions</h3>
          <div className="space-y-3">
            {quickActions.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.action}
                  onClick={() => onAction(item.action)}
                  className="w-full flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <Icon className="h-4 w-4 text-slate-500" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Need support?</h3>
          <p className="text-sm text-slate-600">Send me a quick message or book time directly for platform onboarding and strategy.</p>
          <Button variant="primary" className="mt-4 w-full" onClick={() => onAction('call')}>Book a Call</Button>
        </div>
      </div>
    </aside>
  )
}