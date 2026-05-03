import React, { useState, useEffect, useMemo } from 'react'
import ZoomWidget from '../components/widgets/ZoomWidget'
import { useToast } from '../context/ToastContext'
import { useApp } from '../context/AppContext'
import { useFirebase } from '../context/FirebaseContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function MentorPortal(){
  const { students, sessionLogs, addSessionLog } = useApp()
  const { user } = useFirebase()

  const assigned = useMemo(() => {
    const mentorId = user?.uid
    return students.filter(s => s.mentorId === mentorId)
  }, [students, user])

  const sessions = useMemo(() => {
    return assigned
      .filter((s) => s.zoomLink)
      .map((s) => ({ id: s.id, title: `Session with ${s.name}`, time: s.nextSession || 'Scheduled', url: s.zoomLink }))
  }, [assigned])

  const [hours, setHours] = useState(0)

  const { showToast } = useToast()
  const [inputHours, setInputHours] = useState('')
  const [selected, setSelected] = useState('')
  const [notes, setNotes] = useState('')
  const [loadingId, setLoadingId] = useState(null)

  useEffect(() => {
    if (assigned.length > 0) {
      setSelected((prev) => prev || assigned[0].id)
    }
  }, [assigned])

  useEffect(() => {
    const mentorId = user?.uid
    if (!mentorId) return
    const total = sessionLogs
      .filter((log) => log.mentorId === mentorId)
      .reduce((sum, log) => sum + Number(log.hours || 0), 0)
    setHours(total)
  }, [sessionLogs, user])

  async function logHours(n){
    const num = Number(n)
    if (!num || num <= 0) {
      showToast('Enter a valid number of hours', 'warning')
      return
    }
    if (!selected) {
      showToast('Select a student first', 'warning')
      return
    }
    const student = assigned.find((s) => s.id === selected)
    if (!student) {
      showToast('Selected student is not on your roster', 'danger')
      return
    }

    try {
      await addSessionLog({
        mentorId: user?.uid,
        studentId: student.id,
        notes: notes.trim(),
        hours: num,
        createdAt: new Date()
      })
      setInputHours('')
      setNotes('')
      showToast('Hours logged to student session', 'success')
    } catch (e) {
      showToast('Failed to log hours', 'danger')
    }
  }

  function startSession(sId){
    const student = assigned.find((s) => s.id === sId)
    if (!student) {
      showToast('Unable to start session for unassigned student', 'danger')
      return
    }
    setLoadingId(sId)

    setTimeout(()=>{
      setLoadingId(null)
      showToast('Session started', 'success')
      if (student.zoomLink) {
        window.open(student.zoomLink, '_blank')
      }
    }, 1200)
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-900">
      <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Mentor Dashboard</h2>
          <p className="text-sm text-slate-500">Track students and log impact hours.</p>
        </div>
        <div className="text-center">
          <div className="text-sm text-slate-500">Total Hours</div>
          <div className="text-2xl font-bold">{hours} hrs</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-semibold mb-3">My Assigned Students</h4>
            <div className="space-y-2">
              {assigned.map(s=> (
                <div key={s.id} className="p-3 rounded-lg border flex items-center justify-between">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-slate-500">Grade {s.grade}</div>
                  </div>
                  <Button variant="primary" loading={loadingId===s.id} onClick={() => startSession(s.id)}>Start Session</Button>
                </div>
              ))}
              {assigned.length === 0 && <div className="p-4 italic text-slate-500 border-2 border-dashed border-slate-200 rounded">No assigned students</div>}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-semibold mb-3">Log Hours</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Select Student</label>
                <select value={selected} onChange={(e)=> setSelected(e.target.value)} className="w-full p-2 border rounded-lg">
                  {assigned.length === 0 ? (
                    <option value="">No assigned students</option>
                  ) : (
                    assigned.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                  )}
                </select>
              </div>
              <div>
                <Input label="Notes" textarea value={notes} onChange={setNotes} placeholder="Session notes" />
              </div>
              <div className="flex gap-2">
                <Input label="Hours" type="number" value={inputHours} onChange={setInputHours} placeholder="e.g., 1" className="w-32" />
                <Button variant="success" onClick={() => logHours(inputHours)}>Log Hours</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ZoomWidget sessions={sessions} />
        </div>
      </div>
    </div>
  )
}
