import React, { useState, useEffect, useRef } from 'react'
import Button from '../ui/Button'
import { useToast } from '../../context/ToastContext'
import { listenDonations, addDonation as addDonationToFS } from '../../firebase/firestore'

export default function DonationWidget({ initial = [], items, onNewDonation }) {
  const [donations, setDonations] = useState(initial)
  const [newId, setNewId] = useState(null)
  const containerRef = useRef(null)
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const useFirestore = Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID)

  useEffect(() => {
    if (!useFirestore) return
    const unsub = listenDonations((items) => {
      setDonations(items.map(i => ({ id: i.id, donor: i.donor || i.donorName || 'Donor', amount: i.amount || 0, time: i.time || i.timestamp || '' })))
    })
    return unsub
  }, [])

  // allow controlled items prop (e.g., from AppContext)
  useEffect(() => {
    if (!items) return
    const prevIds = donations.map(d => d.id)
    setDonations(items)
    const firstNew = items.find(i => !prevIds.includes(i.id))
    if (firstNew) {
      setNewId(firstNew.id)
      setTimeout(() => setNewId(null), 3000)
      if (containerRef.current) containerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [items])

  const total = donations.reduce((s, d) => s + (d.amount || 0), 0)

  async function refresh() {
    setLoading(true)
    const newDonation = { donor: 'New Donor', amount: Math.floor(Math.random() * 500) + 5, time: new Date().toLocaleTimeString() }
    await new Promise((r) => setTimeout(r, 1500))
    if (useFirestore) {
      try {
        await addDonationToFS(newDonation)
        setLoading(false)
        if (typeof onNewDonation === 'function') onNewDonation(newDonation)
        showToast('Donation Synced!', 'success')
        return
      } catch (e) {
        setLoading(false)
        showToast('Failed to sync donation', 'danger')
        return
      }
    }
    const created = { id: Date.now(), ...newDonation }
    setDonations((d) => [created, ...d])
    setNewId(created.id)
    if (typeof onNewDonation === 'function') onNewDonation(created)
    setLoading(false)
    if (containerRef.current) containerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    showToast('Donation Synced!', 'success')
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">Live Donation Feed</h4>
        <div className="flex items-center gap-2">
          <div className="text-sm text-slate-500">Total: <span className="font-semibold">${total}</span></div>
          <Button variant="ghost" loading={loading} onClick={refresh}>Refresh</Button>
        </div>
      </div>
      <div ref={containerRef} className="space-y-2 max-h-40 overflow-y-auto">
        {donations.map((d) => (
          <div key={d.id} className={`p-2 rounded-lg border border-slate-100 flex items-center justify-between ${newId === d.id ? 'bg-emerald-50 ring-2 ring-emerald-200' : ''}`}>
            <div>
              <div className="text-sm font-medium">{d.donor}</div>
              <div className="text-xs text-slate-500">{d.time}</div>
            </div>
            <div className="text-sm font-semibold text-emerald-600">${d.amount}</div>
          </div>
        ))}
        {donations.length === 0 && <div className="text-sm text-slate-500">No donations yet.</div>}
      </div>
    </div>
  )
}
