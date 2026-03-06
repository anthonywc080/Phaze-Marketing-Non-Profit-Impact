import React, { createContext, useContext, useState, useEffect } from 'react'
import { listenDonations } from '../firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

const AppContext = createContext(null)

const now = () => new Date().toISOString()

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState([
    { id: uuidv4(), title: 'Draft outreach email', channel: 'gmail', status: 'idea', date: now(), priority: 'high' },
    { id: uuidv4(), title: 'Plan kickoff meeting', channel: 'zoom', status: 'drafting', date: now(), priority: 'medium' },
    { id: uuidv4(), title: 'LinkedIn campaign concept', channel: 'linkedin', status: 'review', date: now(), priority: 'low' }
  ])

  const [students, setStudents] = useState([
    { id: uuidv4(), name: 'Ava Rodriguez', grade: '11', pipeline_status: 'applied', mentorId: '' },
    { id: uuidv4(), name: 'Jamal Carter', grade: '12', pipeline_status: 'interviewing', mentorId: '' }
  ])

  const [donations, setDonations] = useState([
    { id: uuidv4(), donorName: 'Heights Philanthropy', amount: 500, campaign: 'Tech Equity', timestamp: now() }
  ])

  useEffect(() => {
    const useFirestore = Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID)
    if (!useFirestore) return
    const unsub = listenDonations((items) => {
      // map docs into expected donation shape
      const mapped = items.map(i => ({ id: i.id, donorName: i.donorName || i.donor || 'Donor', amount: i.amount || 0, campaign: i.campaign || i.campaignName || '', timestamp: i.timestamp || i.time || now() }))
      setDonations(mapped)
    })
    return unsub
  }, [])

  function addTask(task) {
    setTasks((t) => [{ id: uuidv4(), date: now(), ...task }, ...t])
  }

  function updateTask(id, patch) {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  }

  return (
    <AppContext.Provider value={{ tasks, students, donations, addTask, updateTask, setStudents, setDonations }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
