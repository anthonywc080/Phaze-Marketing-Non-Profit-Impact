import React, { createContext, useContext, useState, useEffect } from 'react'
import { useFirebase } from './FirebaseContext'

const RoleContext = createContext(null)

export function RoleProvider({ children }) {
  const { userProfile } = useFirebase()
  const personas = ['NonprofitOps','Student','Mentor','Finance','Admin']
  const [persona, setPersona] = useState('Student')

  useEffect(() => {
    if (userProfile) {
      // Map user role to persona
      const roleMap = {
        'nonprofit': 'NonprofitOps',
        'student': 'Student',
        'mentor': 'Mentor',
        'finance': 'Finance',
        'admin': 'Admin'
      }
      setPersona(roleMap[userProfile.role] || 'Student')
    }
  }, [userProfile])

  return (
    <RoleContext.Provider value={{ persona, setPersona, personas }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used within RoleProvider')
  return ctx
}
