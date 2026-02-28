import React, { useState } from 'react'
import ZoomWidget from '../components/widgets/ZoomWidget'
import { useToast } from '../context/ToastContext'

export default function MentorPortal(){
  const [assigned] = useState([
    {id:1,name:'Jordan M.',topic:'Resume Review',time:'Tomorrow, 3pm'},
    {id:2,name:'Aisha K.',topic:'College Essay',time:'Today, 6pm'}
  ])
  const [hours, setHours] = useState(48)

  const { showToast } = useToast()
  const [inputHours, setInputHours] = useState('')

  function logHours(n){
    const num = Number(n)
    if (!num || num <= 0) {
      showToast('Enter a valid number of hours', 'warning')
      return
    }
    setHours(h=>h + num)
    setInputHours('')
    showToast('Hours logged', 'success')
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mentor Dashboard</h2>
          <p className="text-sm text-slate-500">Track students and log impact hours.</p>
        </div>
        <div className="text-center">
          <div className="text-sm text-slate-500">Total Hours</div>
          <div className="text-2xl font-bold">{hours}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-semibold mb-3">Assigned Students</h4>
            <div className="space-y-2">
              {assigned.map(s=> (
                <div key={s.id} className="p-3 rounded-lg border flex items-center justify-between">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.topic} — {s.time}</div>
                  </div>
                  <button className="text-blue-600" onClick={() => showToast('Opening Zoom...')}>Start Zoom</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-semibold mb-3">Log Hours</h4>
            <div className="flex gap-2">
              <input type="number" placeholder="Hours" className="w-24 p-2 border rounded-lg" value={inputHours} onChange={(e)=> setInputHours(e.target.value)} />
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg" onClick={() => { logHours(inputHours); }}>Log</button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ZoomWidget sessions={[]} />
        </div>
      </div>
    </div>
  )
}
