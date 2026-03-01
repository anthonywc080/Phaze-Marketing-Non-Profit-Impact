import React, { useState } from 'react'
import Badge from '../components/ui/Badge'
import { useApp } from '../context/AppContext'

export default function SuperAdmin(){
  const { students, donations } = useApp()
  const [clients, setClients] = useState([{id:1,name:'Heights Philadelphia',plan:'Pro',users:12,status:'Active'}])
  const kpis = { orgs: clients.length, students: students.length, mrr: 4200, health: 'Good' }

  function addOrg(){
    const name = prompt('Organization name')
    if(!name) return
    setClients(c=>[{id:Date.now(),name,plan:'Free',users:1,status:'Trial'},...c])
  }

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 border border-slate-700 text-slate-100 rounded-3xl p-6 shadow-lg">
          <div className="text-sm">Active Nonprofits</div>
          <div className="text-2xl font-bold">{kpis.orgs}</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 text-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="text-sm">Total Students</div>
          <div className="text-2xl font-bold">{kpis.students}</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 text-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="text-sm">Platform MRR</div>
          <div className="text-2xl font-bold">${kpis.mrr}</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 text-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="text-sm">API Health</div>
          <div className="text-2xl font-bold">{kpis.health}</div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-slate-100">Client License Table</h4>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg" onClick={addOrg}>Add Organization</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/40">
                <th className="p-3 text-sm font-semibold text-slate-100">Name</th>
                <th className="p-3 text-sm font-semibold text-slate-100">Plan</th>
                <th className="p-3 text-sm font-semibold text-slate-100">Users</th>
                <th className="p-3 text-sm font-semibold text-slate-100">Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(c=> (
                <tr key={c.id} className="border-b border-slate-700">
                  <td className="p-3 flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    <span className="text-slate-100">{c.name}</span>
                  </td>
                  <td className="p-3 text-slate-100">{c.plan}</td>
                  <td className="p-3 text-slate-100">{c.users}</td>
                  <td className="p-3"><Badge variant={c.status==='Active'?'success':'info'}>{c.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
