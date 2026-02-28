import React, { createContext, useContext, useState } from 'react'

const RoleContext = createContext(null)

export function RoleProvider({ children }) {
  const personas = ['NonprofitOps','Student','Mentor','Finance','Admin']
  const [persona, setPersona] = useState('NonprofitOps')
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
