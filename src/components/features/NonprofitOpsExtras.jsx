import React, { useMemo, useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'

const DONOR_LIST = [
  { id: 'd1', name: 'Harbor Family Trust', cause: 'Food Security', location: 'Bay Area', score: 94 },
  { id: 'd2', name: 'Green Impact Fund', cause: 'Environment', location: 'Northern California', score: 88 },
  { id: 'd3', name: 'TeachForward Network', cause: 'Education', location: 'San Francisco', score: 91 }
]

export default function NonprofitOpsExtras() {
  const { campaigns, campaignTasks, donations } = useApp()
  const { showToast } = useToast()
  const [budget, setBudget] = useState({ total: 12000, allocated: 5700, volunteerPool: 3000, stipendPool: 2700 })
  const [allocation, setAllocation] = useState({ category: 'cash', amount: '' })
  const [escrowBalance, setEscrowBalance] = useState(6800)
  const [reportLink, setReportLink] = useState('')
  const [donorSearch, setDonorSearch] = useState('')
  const [selectedDonor, setSelectedDonor] = useState(null)
  const [impactMetrics, setImpactMetrics] = useState({ mealsServed: 1200, animalsHelped: 240, impressionsGenerated: 23600 })
  const [crowdfundInvites, setCrowdfundInvites] = useState([])

  const pendingApprovals = campaignTasks.filter((task) => task.status === 'pending_verification').length
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === 'active').length
  const totalPaid = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0)

  const filteredDonors = useMemo(() => {
    return DONOR_LIST.filter((donor) =>
      donor.name.toLowerCase().includes(donorSearch.toLowerCase()) || donor.cause.toLowerCase().includes(donorSearch.toLowerCase()) || donor.location.toLowerCase().includes(donorSearch.toLowerCase())
    )
  }, [donorSearch])

  const handleAllocate = () => {
    const amount = Number(allocation.amount)
    if (!amount || amount <= 0) {
      showToast('Enter a valid allocation amount', 'warning')
      return
    }
    if (amount > budget.total - budget.allocated) {
      showToast('Allocation exceeds available budget', 'danger')
      return
    }
    setBudget((prev) => ({ ...prev, allocated: prev.allocated + amount }))
    setAllocation({ ...allocation, amount: '' })
    showToast('Budget allocated successfully', 'success')
  }

  const handleGenerateReport = () => {
    const reportPayload = {
      timestamp: new Date().toISOString(),
      totalPaid,
      activeCampaigns,
      pendingApprovals,
      impactMetrics,
      budget
    }
    const blob = new Blob([JSON.stringify(reportPayload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    setReportLink(url)
    showToast('Report created. Download or share the link.', 'success')
  }

  const handleEscrowRelease = () => {
    if (escrowBalance <= 0) {
      showToast('No funds are currently held in escrow', 'warning')
      return
    }
    setEscrowBalance(0)
    showToast('Escrow funds released after verification', 'success')
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Approval dashboard</h4>
          <p className="text-4xl font-bold text-slate-900">{pendingApprovals}</p>
          <p className="text-sm text-slate-500 mt-2">Pending campaign submissions awaiting nonprofit review.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Escrow balance</h4>
          <p className="text-4xl font-bold text-slate-900">${escrowBalance.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-2">Funds held securely until student work is approved.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Crowdfunded opportunities</h4>
          <p className="text-4xl font-bold text-slate-900">{crowdfundInvites.length}</p>
          <p className="text-sm text-slate-500 mt-2">Pending campaigns that donors can fund as micro-grants.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-slate-900">Budget & allocation</h4>
              <p className="text-sm text-slate-500">Allocate cash, gift cards, or volunteer hours before launch.</p>
            </div>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <p>Total budget: <strong>${budget.total.toLocaleString()}</strong></p>
            <p>Allocated: <strong>${budget.allocated.toLocaleString()}</strong></p>
            <p>Volunteer pool: <strong>${budget.volunteerPool.toLocaleString()}</strong></p>
            <p>Stipend pool: <strong>${budget.stipendPool.toLocaleString()}</strong></p>
          </div>
          <div className="mt-4 space-y-3">
            <Input label="Allocation type" value={allocation.category} onChange={(value) => setAllocation((prev) => ({ ...prev, category: value }))} placeholder="cash, check, gift cards..." />
            <Input label="Amount" type="number" value={allocation.amount} onChange={(value) => setAllocation((prev) => ({ ...prev, amount: value }))} placeholder="0" />
            <Button variant="primary" onClick={handleAllocate}>Allocate Funds</Button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-slate-900">Impact report</h4>
              <p className="text-sm text-slate-500">Compile hours, reach, and payouts into a shareable report link.</p>
            </div>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <p>Active campaigns: <strong>{activeCampaigns}</strong></p>
            <p>Total paid: <strong>${totalPaid.toLocaleString()}</strong></p>
            <p>Meals served: <strong>{impactMetrics.mealsServed}</strong></p>
            <p>Impressions generated: <strong>{impactMetrics.impressionsGenerated}</strong></p>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <Button variant="primary" onClick={handleGenerateReport}>Generate Report</Button>
            {reportLink && (
              <a href={reportLink} download="phaze-impact-report.json" className="text-sm text-indigo-600 hover:text-indigo-800">
                Download report file
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-3">Donor discovery</h4>
          <Input value={donorSearch} onChange={setDonorSearch} placeholder="Search by donor, cause, or location" />
          <div className="mt-4 space-y-3 max-h-72 overflow-y-auto">
            {filteredDonors.map((donor) => (
              <div key={donor.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{donor.name}</p>
                    <p className="text-sm text-slate-500">{donor.cause} • {donor.location}</p>
                  </div>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800" onClick={() => setSelectedDonor(donor)}>Message</button>
                </div>
                <p className="mt-2 text-xs text-slate-500">Performance score: {donor.score}</p>
              </div>
            ))}
            {filteredDonors.length === 0 && <div className="text-sm text-slate-500">No donors found.</div>}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-3">Impact survey</h4>
          <p className="text-sm text-slate-500 mb-4">Define your nonprofit impact metrics so student work can be tied back to real outcomes.</p>
          <div className="space-y-3 text-sm text-slate-600">
            <p><strong>Meals served:</strong> {impactMetrics.mealsServed}</p>
            <p><strong>Animals helped:</strong> {impactMetrics.animalsHelped}</p>
            <p><strong>Community impressions:</strong> {impactMetrics.impressionsGenerated}</p>
          </div>
          <Button variant="secondary" className="mt-4" onClick={() => showToast('Impact survey updated', 'success')}>Update Impact Metrics</Button>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold">Impact narrative</p>
            <p className="mt-2">By investing $500 in student stipends, the local food bank generated 10,000 impressions and increased weekend donations by 20%.</p>
          </div>
        </div>
      </div>

      <Modal open={!!selectedDonor} onClose={() => setSelectedDonor(null)} title={selectedDonor ? `Message ${selectedDonor.name}` : 'Message donor'}>
        {selectedDonor && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Compose a secure message to start the grant application process.</p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p><strong>To:</strong> {selectedDonor.name}</p>
              <p><strong>Cause:</strong> {selectedDonor.cause}</p>
            </div>
            <Input label="Subject" value={`Grant inquiry for ${selectedDonor.name}`} onChange={() => {}} disabled />
            <Input label="Message" textarea value={`Hello ${selectedDonor.name}, we'd like to connect about a campaign supporting ${selectedDonor.cause}.`} onChange={() => {}} disabled />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setSelectedDonor(null)}>Close</Button>
              <Button variant="primary" onClick={() => { showToast('Message sent to donor', 'success'); setSelectedDonor(null) }}>Send Message</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}