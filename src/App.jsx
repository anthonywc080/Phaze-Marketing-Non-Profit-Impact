import React, { useState } from 'react'
import { ToastProvider, useToast } from './context/ToastContext'
import { RoleProvider, useRole } from './context/RoleContext'
import { AppProvider } from './context/AppContext'
import { FirebaseProvider } from './context/FirebaseContext'
import Button from './components/ui/Button'

import NonprofitOps from './views/NonprofitOps'
import StudentPortal from './views/StudentPortal'
import MentorPortal from './views/MentorPortal'
import FinanceDirector from './views/FinanceDirector'
import SuperAdmin from './views/SuperAdmin'
import PlatformSidebar from './components/features/PlatformSidebar'
import HelpGuideModal from './components/features/HelpGuideModal'
import ScheduleCallModal from './components/features/ScheduleCallModal'
import SettingsModal from './components/features/SettingsModal'

const PERSONA_COMPONENTS = {
  NonprofitOps,
  Student: StudentPortal,
  Mentor: MentorPortal,
  Finance: FinanceDirector,
  Admin: SuperAdmin,
}

function TopNav() {
  const { persona, setPersona, personas } = useRole()
  const { user } = require('./context/FirebaseContext').useFirebase ? require('./context/FirebaseContext').useFirebase() : { user: null }
  const { showToast } = useToast()
  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="font-bold text-lg">TaskFlow Pro</div>
        <div className="hidden md:flex items-center gap-2">
          {personas.map(p => {
            const restricted = (p === 'Admin' || p === 'Finance') && !user
            return (
              <button
                key={p}
                onClick={() => {
                  if (restricted) return showToast('Sign in required for this view', 'warning')
                  setPersona(p)
                }}
                className={`px-3 py-1 rounded-lg text-sm ${persona===p? 'bg-blue-600 text-white':'text-slate-600 bg-slate-100'} ${restricted ? 'opacity-60 cursor-not-allowed' : ''}`}>
                {p}
              </button>
            )
          })}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost">Help</Button>
        <div>
          {/* Show sign in / user */}
          <AuthButtons />
        </div>
      </div>
    </div>
  )
}

function AuthButtons(){
  // direct hook usage (TopNav is inside FirebaseProvider)
  const { useFirebase } = require('./context/FirebaseContext')
  let auth = { user: null, signInWithGoogle: ()=>{}, signOut: ()=>{} }
  try{ auth = useFirebase() }catch(e){}
  const { user, signInWithGoogle, signOut } = auth
  if(user) return (
    <div className="flex items-center gap-3">
      <div className="text-sm text-slate-600">{user.displayName || user.email}</div>
      <Button variant="secondary" onClick={signOut}>Sign out</Button>
    </div>
  )
  return <Button variant="primary" onClick={signInWithGoogle}>Sign in</Button>
}

function PersonaShell(){
  const { persona } = useRole()
  const C = PERSONA_COMPONENTS[persona] || (()=> <div/> )
  return (
    <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-64px)]">
      <C />
    </main>
  )
}

export default function App(){
  const [guideOpen, setGuideOpen] = useState(false)
  const [callOpen, setCallOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const handleSidebarAction = (action) => {
    if (action === 'guide') setGuideOpen(true)
    if (action === 'call') setCallOpen(true)
    if (action === 'settings') setSettingsOpen(true)
  }

  return (
    <ToastProvider>
      <FirebaseProvider>
        <AppProvider>
          <RoleProvider>
            <div className="min-h-screen bg-slate-50 font-sans">
              <TopNav />
              <div className="flex">
                <PlatformSidebar onAction={handleSidebarAction} />
                <PersonaShell />
              </div>
              <HelpGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
              <ScheduleCallModal open={callOpen} onClose={() => setCallOpen(false)} />
              <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
            </div>
          </RoleProvider>
        </AppProvider>
      </FirebaseProvider>
    </ToastProvider>
  )
}
