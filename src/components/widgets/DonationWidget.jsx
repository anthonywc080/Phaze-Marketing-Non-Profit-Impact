import React, { useState, useEffect } from 'react'
import Button from '../ui/Button'
import { useToast } from '../../context/ToastContext'
import { listenDonations, addDonation as addDonationToFS } from '../../firebase/firestore'

export default function DonationWidget({ initial = [] }) {
  const [donations, setDonations] = useState(initial)
  const { showToast } = useToast()
  const useFirestore = Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID)

  useEffect(() => {
    if (!useFirestore) return
    const unsub = listenDonations((items) => {
      // map Firestore docs into the donations shape
      setDonations(items.map(i => ({ id: i.id, donor: i.donor || 'Donor', amount: i.amount || 0, time: i.time || '' })))
    })
    return unsub
  }, [])

  const total = donations.reduce((s, d) => s + d.amount, 0)

  async function refresh() {
    const newDonation = { donor: 'New Donor', amount: Math.floor(Math.random() * 500) + 5, time: new Date().toLocaleTimeString() }
    if (useFirestore) {
      try {
        await addDonationToFS(newDonation)
        showToast('Donation Synced!', 'success')
        return
      } catch (e) {
        showToast('Failed to sync donation', 'danger')
      }
    }
    setDonations((d) => [{ id: Date.now(), ...newDonation }, ...d])
    showToast('Donation Synced!', 'success')
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">Live Donation Feed</h4>
        <div className="flex items-center gap-2">
          <div className="text-sm text-slate-500">Total: <span className="font-semibold">${total}</span></div>
          <Button variant="ghost" onClick={refresh}>Refresh</Button>
        </div>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {donations.map((d) => (
          <div key={d.id} className="p-2 rounded-lg border border-slate-100 flex items-center justify-between">
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
