import React from 'react'
import DonationWidget from '../components/widgets/DonationWidget'
import { useToast } from '../context/ToastContext'
import { useApp } from '../context/AppContext'

function PipelineColumn({ title, students, actionText, onAction, emptyText }) {
  return (
    <div className="bg-slate-50 p-3 rounded-xl min-h-[200px]">
      <div className="font-semibold text-sm mb-2">{title}</div>
      <div className="space-y-2">
        {students.map((s) => (
          <div key={s.id} className="p-3 bg-white rounded-lg border flex items-center justify-between">
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-xs text-slate-500">Grade {s.grade}</div>
            </div>
            {onAction && actionText && (
              <div className="flex flex-col gap-2">
                <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm" onClick={() => onAction(s.id)}>{actionText}</button>
              </div>
            )}
          </div>
        ))}
        {students.length === 0 && <div className="p-4 italic text-slate-500 border-2 border-dashed border-slate-200 rounded">{emptyText}</div>}
      </div>
    </div>
  )
}

export default function FinanceDirector(){
  const { donations, setDonations, students, updateStudentPipelineStatus } = useApp()
  const { showToast } = useToast()

  const total = donations.reduce((s, d) => s + (d.amount || 0), 0)

  function handleNewDonation(d) {
    setDonations((prev) => [d, ...prev])
    showToast('Donation added to feed', 'success')
  }

  async function advanceStudent(id) {
    const student = students.find((s) => s.id === id)
    if (!student) return

    const nextStatus = student.pipeline_status === 'applied' ? 'interviewing' : student.pipeline_status === 'interviewing' ? 'accepted' : student.pipeline_status
    if (nextStatus === student.pipeline_status) return

    await updateStudentPipelineStatus(id, nextStatus)
    showToast('Student advanced to ' + nextStatus, 'success')
  }

  const applied = students.filter(s => s.pipeline_status === 'applied')
  const interviewing = students.filter(s => s.pipeline_status === 'interviewing')
  const accepted = students.filter(s => s.pipeline_status === 'accepted')

  // Finance metrics
  const donorCount = new Set(donations.map(d => d.donorName)).size
  const repeatDonors = donations.reduce((acc, d) => {
    const count = donations.filter(d2 => d2.donorName === d.donorName).length
    return count > 1 ? acc + 1 : acc
  }, 0)
  const donorRetention = donorCount > 0 ? Math.round((repeatDonors / donorCount) * 100) : 0

  // ROI: assume $10k annual budget, compare to total raised
  const budgetEstimate = 10000
  const roi = budgetEstimate > 0 ? Math.round(((total - budgetEstimate) / budgetEstimate) * 100) : 0

  // Burn rate: estimate operational cost per accepted student (~$500/month)
  const monthlyBurnPerStudent = 500
  const estimatedMonthlyBurn = accepted.length * monthlyBurnPerStudent
  const runwayMonths = estimatedMonthlyBurn > 0 ? Math.round(total / estimatedMonthlyBurn) : 0

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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium mb-1">ROI</div>
          <div className={`text-2xl font-bold ${roi >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{roi >= 0 ? '+' : ''}{roi}%</div>
          <div className="text-xs text-slate-400 mt-2">vs $10k budget</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium mb-1">Monthly Burn</div>
          <div className="text-2xl font-bold text-slate-900">${estimatedMonthlyBurn}</div>
          <div className="text-xs text-slate-400 mt-2">{accepted.length} students × $500</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium mb-1">Runway</div>
          <div className={`text-2xl font-bold ${runwayMonths >= 6 ? 'text-emerald-600' : runwayMonths >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>{runwayMonths} mo</div>
          <div className="text-xs text-slate-400 mt-2">at current burn</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium mb-1">Donor Retention</div>
          <div className="text-2xl font-bold text-slate-900">{donorRetention}%</div>
          <div className="text-xs text-slate-400 mt-2">{repeatDonors} of {donorCount} repeat</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-semibold mb-3">Student Pipeline</h4>
            <div className="grid grid-cols-3 gap-4">
              <PipelineColumn title="Applied" students={applied} actionText="Move to Interview →" onAction={advanceStudent} emptyText="No applicants" />
              <PipelineColumn title="Interviewing" students={interviewing} actionText="Mark Accepted →" onAction={advanceStudent} emptyText="No interviews scheduled" />
              <PipelineColumn title="Accepted" students={accepted} emptyText="No accepted students" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <DonationWidget initial={donations} onNewDonation={handleNewDonation} />
        </div>
      </div>
    </div>
  )
}
