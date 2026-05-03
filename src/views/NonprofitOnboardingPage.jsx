import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NonprofitOnboarding from '../components/forms/NonprofitOnboarding'
import { useFirebase } from '../context/FirebaseContext'

export default function NonprofitOnboardingPage() {
  const { user } = useFirebase()
  const navigate = useNavigate()

  useEffect(() => {
    if (user === null) {
      navigate('/login')
    }
    // Future: if user is fully onboarded, redirect to nonprofit dashboard
    // if (user?.isFullyOnboarded) navigate('/nonprofit/dashboard')
  }, [user, navigate])

  // While auth state resolves, we can optionally render a placeholder.
  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Welcome to Phaze!</h1>
          <p className="text-slate-500 mt-2">Let's get your organization set up.</p>
        </div>
        <NonprofitOnboarding />
      </div>
    </div>
  )
}
