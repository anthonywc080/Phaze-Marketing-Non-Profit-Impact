import React, { useState } from 'react'
import Badge from '../components/ui/Badge'

export default function SuperAdmin(){
  const [clients, setClients] = useState([{id:1,name:'Heights Philadelphia',plan:'Pro',users:12,status:'Active'}])
  const [kpis] = useState({orgs:12,students:184,mrr:4200,health:'Good'})

  function addOrg(){
    const name = prompt('Organization name')
    if(!name) return
    setClients(c=>[{id:Date.now(),name,plan:'Free',users:1,status:'Trial'},...c])
  }

  return (
    <div className="space-y-6">
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

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Client License Table</h4>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={addOrg}>Add Organization</button>
        </div>
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
              {clients.map(c=> (
                <tr key={c.id} className="border-b">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.plan}</td>
                  <td className="p-3">{c.users}</td>
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
