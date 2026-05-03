import React, { useState, useEffect } from 'react'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useToast } from '../context/ToastContext'
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'

const ITEMS_PER_PAGE = 10

export default function SuperAdmin(){
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [bonusDropEnabled, setBonusDropEnabled] = useState(true)
  const [flashCampaignMode, setFlashCampaignMode] = useState('weekly')
  const [flashCampaignCount, setFlashCampaignCount] = useState(4)
  const { showToast } = useToast()

  // Fetch clients from Firestore on mount
  useEffect(() => {
    setLoading(true)
    try {
      const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'))
      const unsub = onSnapshot(q, (snap) => {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setClients(items)
        setLoading(false)
      }, (error) => {
        console.warn('Error fetching clients:', error)
        setLoading(false)
      })
      return unsub
    } catch (e) {
      console.warn('Firestore not configured', e)
      setLoading(false)
    }
  }, [])

  // Calculate KPIs from actual data
  const kpis = {
    orgs: clients.length,
    students: clients.reduce((sum, c) => sum + (c.users || 0), 0),
    mrr: clients.reduce((sum, c) => {
      const planValue = { 'Pro': 200, 'Plus': 100, 'Free': 0 }
      return sum + (planValue[c.plan] || 0)
    }, 0),
    health: clients.length > 0 ? 'Good' : 'Initializing'
  }

  // Pagination logic
  const totalPages = Math.ceil(clients.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedClients = clients.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  async function handleAddOrg(e) {
    e.preventDefault()
    if (!orgName.trim()) {
      showToast('Organization name is required', 'warning')
      return
    }
    if (orgName.length > 100) {
      showToast('Organization name must be 100 characters or less', 'warning')
      return
    }

    setIsSubmitting(true)
    try {
      await addDoc(collection(db, 'clients'), {
        name: orgName,
        plan: 'Free',
        users: 1,
        status: 'Trial',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      showToast('Organization added successfully', 'success')
      setOrgName('')
      setIsModalOpen(false)
      setCurrentPage(1)
    } catch (e) {
      console.error('Error adding organization:', e)
      showToast('Failed to add organization', 'danger')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-lg">
          <div className="text-sm">Active Nonprofits</div>
          <div className="text-2xl font-bold">{kpis.orgs}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-sm">Total Students</div>
          <div className="text-2xl font-bold">{kpis.students}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-sm">Platform MRR</div>
          <div className="text-2xl font-bold">${kpis.mrr}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-sm">API Health</div>
          <div className="text-2xl font-bold">{kpis.health}</div>
        </div>
      </div>

      {/* Flash Campaign & Bonus Drop Control */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-800 text-white rounded-3xl p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">Bonus Drops & Flash Campaigns</h3>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl">
              Activate surprise bonuses, launch rapid turnaround flash campaigns, and keep the student community energized with curated performance rewards.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm uppercase tracking-[0.18em] text-slate-300">Bonus Drops</span>
            <button
              onClick={() => {
                setBonusDropEnabled(!bonusDropEnabled)
                showToast(
                  `Bonus drops ${bonusDropEnabled ? 'disabled' : 'enabled'}`,
                  'success'
                )
              }}
              className={`px-4 py-2 rounded-full font-semibold transition ${bonusDropEnabled ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}
            >
              {bonusDropEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-slate-950/80 rounded-3xl p-4">
            <div className="text-sm text-slate-400">Flash program cadence</div>
            <div className="mt-2 flex gap-2">
              {['daily', 'weekly', 'monthly'].map(option => (
                <button
                  key={option}
                  onClick={() => {
                    setFlashCampaignMode(option)
                    showToast(`Flash campaigns set to ${option}`, 'success')
                  }}
                  className={`px-3 py-2 rounded-2xl text-sm font-medium transition ${flashCampaignMode === option ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/80 rounded-3xl p-4">
            <div className="text-sm text-slate-400">Active flash campaigns</div>
            <div className="mt-3 text-3xl font-semibold">{flashCampaignCount}</div>
            <div className="text-xs text-slate-500 mt-1">Live sprint campaigns ready to match students</div>
          </div>

          <div className="bg-slate-950/80 rounded-3xl p-4">
            <div className="text-sm text-slate-400">Community clap alert</div>
            <div className="mt-2 text-lg font-semibold">Boost collaboration</div>
            <p className="text-slate-500 text-sm mt-2">Track community energy from student claps and align flash campaigns with trending nominations.</p>
          </div>
        </div>
      </div>

      {/* Client Table Section */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Client License Table</h4>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Organization
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
          </div>
        )}

        {/* Empty State */}
        {!loading && clients.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-500 text-sm">
              <p className="mb-2">No organizations yet</p>
              <p className="text-xs">Click "Add Organization" to get started</p>
            </div>
          </div>
        )}

        {/* Data Table */}
        {!loading && clients.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="p-3 text-sm font-semibold">Name</th>
                    <th className="p-3 text-sm font-semibold">Plan</th>
                    <th className="p-3 text-sm font-semibold">Users</th>
                    <th className="p-3 text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedClients.map(c => (
                    <tr key={c.id} className="border-b hover:bg-slate-50">
                      <td className="p-3">{c.name}</td>
                      <td className="p-3">{c.plan}</td>
                      <td className="p-3">{c.users}</td>
                      <td className="p-3">
                        <Badge variant={c.status === 'Active' ? 'success' : 'info'}>
                          {c.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-slate-600">
                  Showing {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, clients.length)} of {clients.length}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2 py-1 text-sm rounded-lg ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border hover:bg-slate-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Organization Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setOrgName('')
        }}
        title="Add Organization"
      >
        <form onSubmit={handleAddOrg} className="space-y-4">
          <Input
            label="Organization Name"
            value={orgName}
            onChange={setOrgName}
            placeholder="Enter organization name"
            maxLength={100}
            autoFocus
          />
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                setOrgName('')
              }}
              className="px-4 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Organization'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
