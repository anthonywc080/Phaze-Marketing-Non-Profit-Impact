import React from 'react'
import DonationWidget from '../components/widgets/DonationWidget'
import { useToast } from '../context/ToastContext'
import { useApp } from '../context/AppContext'

export default function FinanceDirector(){
  const { donations, setDonations, students, setStudents } = useApp()
  const { showToast } = useToast()

  const total = donations.reduce((s, d) => s + (d.amount || 0), 0)

  function handleNewDonation(d) {
    setDonations((prev) => [d, ...prev])
    showToast('Donation added to feed', 'success')
  }

  function advanceStudent(id) {
    setStudents((prev) => prev.map((s) => {
      if (s.id !== id) return s
      if (s.pipeline_status === 'applied') return { ...s, pipeline_status: 'interviewing' }
      if (s.pipeline_status === 'interviewing') return { ...s, pipeline_status: 'accepted' }
      return s
    }))
    showToast('Student advanced', 'success')
  }

  const applied = students.filter(s => s.pipeline_status === 'applied')
  const interviewing = students.filter(s => s.pipeline_status === 'interviewing')
  const accepted = students.filter(s => s.pipeline_status === 'accepted')

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-900">
      <div className="mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Total Raised YTD</div>
            <div className="text-3xl font-bold text-emerald-600">${total}</div>
          </div>
          <div className="text-sm text-slate-500">Live updates from donations</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-semibold mb-3">Student Pipeline</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 p-3 rounded-xl min-h-[200px]">
                <div className="font-semibold text-sm mb-2">Applied</div>
                <div className="space-y-2">
                  {applied.map((s) => (
                    <div key={s.id} className="p-3 bg-white rounded-lg border flex items-center justify-between">
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-slate-500">Grade {s.grade}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm" onClick={() => advanceStudent(s.id)}>Move to Interview →</button>
                      </div>
                    </div>
                  ))}
                  {applied.length === 0 && <div className="p-4 italic text-slate-500 border-2 border-dashed border-slate-200 rounded">No applicants</div>}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl min-h-[200px]">
                <div className="font-semibold text-sm mb-2">Interviewing</div>
                <div className="space-y-2">
                  {interviewing.map((s) => (
                    <div key={s.id} className="p-3 bg-white rounded-lg border flex items-center justify-between">
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-slate-500">Grade {s.grade}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm" onClick={() => advanceStudent(s.id)}>Mark Accepted →</button>
                      </div>
                    </div>
                  ))}
                  {interviewing.length === 0 && <div className="p-4 italic text-slate-500 border-2 border-dashed border-slate-200 rounded">No interviews scheduled</div>}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl min-h-[200px]">
                <div className="font-semibold text-sm mb-2">Accepted</div>
                <div className="space-y-2">
                  {accepted.map((s) => (
                    <div key={s.id} className="p-3 bg-white rounded-lg border flex items-center justify-between">
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-slate-500">Grade {s.grade}</div>
                      </div>
                    </div>
                  ))}
                  {accepted.length === 0 && <div className="p-4 italic text-slate-500 border-2 border-dashed border-slate-200 rounded">No accepted students</div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <DonationWidget items={donations} onNewDonation={handleNewDonation} />
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Audit Log</h4>
            <div className="space-y-2">
              {/* Inline timeline */}
              {donations.slice(0,8).map(d => (
                <div key={d.id} className="flex items-center justify-between p-2 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                    <div className="text-sm">{d.donor} donated <span className="font-semibold text-emerald-600">${d.amount}</span></div>
                  </div>
                  <div className="text-xs text-slate-500">{d.time || d.timestamp}</div>
                </div>
              ))}
              {donations.length === 0 && <div className="text-sm text-slate-500">No donation events</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
