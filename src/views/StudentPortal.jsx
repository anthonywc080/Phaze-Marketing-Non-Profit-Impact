import React, { useState } from 'react'
import ZoomWidget from '../components/widgets/ZoomWidget'
import DonationWidget from '../components/widgets/DonationWidget'
import Badge from '../components/ui/Badge'
import { useToast } from '../context/ToastContext'

export default function StudentPortal() {
  const [name] = useState('Sarah')
  const [sessions] = useState([{id:1,title:'Mentorship: College Essays',time:'Today, 5:00 PM'}])
  const [applications] = useState([{id:1,title:'Laptop Grant',status:'Under Review'},{id:2,title:'Travel Stipend',status:'Accepted'}])
  const [campaigns] = useState([{id:1,title:'Kappa League Fundraiser',raised:4200,goal:5000}])

  const { showToast } = useToast()

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold">Welcome back, {name}!</h2>
        <p className="text-sm text-slate-500">Quick actions to join sessions and apply for opportunities.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <ZoomWidget sessions={sessions} />

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-semibold mb-3">My Applications</h4>
            <div className="space-y-2">
              {applications.map(a => (
                <div key={a.id} className="p-3 rounded-lg border flex items-center justify-between">
                  <div>
                    <div className="font-medium">{a.title}</div>
                    <div className="text-xs text-slate-500">Status</div>
                  </div>
                  <Badge variant={a.status==='Accepted' ? 'success' : 'info'}>{a.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-semibold mb-3">Organization Campaigns</h4>
            <div className="space-y-3">
              {campaigns.map(c => (
                <div key={c.id} className="p-3 rounded-lg border">
                  <div className="font-medium">{c.title}</div>
                  <div className="text-xs text-slate-500 mb-2">Raised ${c.raised} of ${c.goal}</div>
                  <div className="w-full bg-slate-100 h-2 rounded-full mb-2">
                    <div className="h-2 rounded-full bg-emerald-600" style={{width:`${(c.raised/c.goal)*100}%`}} />
                  </div>
                  <button className="text-sm text-blue-600" onClick={() => showToast('Shared campaign', 'success')}>Share</button>
                </div>
              ))}
            </div>
          </div>

          <DonationWidget initial={[{id:1,donor:'Ally',amount:200,time:'10:01 AM'}]} />
        </div>
      </div>
    </div>
  )
}
