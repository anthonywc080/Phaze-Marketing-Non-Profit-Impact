import React, { useState } from 'react'
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'

const IMPACT_CATEGORIES = [
  'Education',
  'Food Security',
  'Health',
  'Community Building',
  'Environment',
  'Animal Welfare',
  'Arts & Culture',
  'Youth Development',
  'Homelessness',
  'Other'
]

export default function NonprofitOnboarding() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Organization Form Data
  const [orgData, setOrgData] = useState({
    legal_name: '',
    display_name: '',
    ein_tax_id: '',
    mission_statement: '',
    website_url: '',
    logo_url: '',
    primary_impact_category: '',
    location_city: '',
    location_state: ''
  })

  // Organization User (Point of Contact) Data
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    work_email: '',
    phone_number: '',
    role: 'Admin'
  })

  // Reward Settings Data
  const [rewardData, setRewardData] = useState({
    can_offer_service_hours: true,
    can_offer_micro_grants: false,
    default_contact_email: ''
  })

  // Document upload
  const [documentFile, setDocumentFile] = useState(null)

  const handleOrgChange = (field, value) => {
    setOrgData(prev => ({ ...prev, [field]: value }))
  }

  const handleUserChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }))
  }

  const handleRewardChange = (field, value) => {
    setRewardData(prev => ({ ...prev, [field]: value }))
  }

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File must be less than 10MB')
        return
      }
      setDocumentFile(file)
      setError(null)
    }
  }

  const validateStep = () => {
    if (step === 1) {
      if (!orgData.legal_name.trim()) {
        setError('Legal name is required')
        return false
      }
      if (!orgData.display_name.trim()) {
        setError('Display name is required')
        return false
      }
      if (!orgData.ein_tax_id.trim()) {
        setError('EIN/Tax ID is required')
        return false
      }
      if (!orgData.website_url.trim()) {
        setError('Website URL is required')
        return false
      }
      if (!/^https?:\/\//.test(orgData.website_url)) {
        setError('Website URL must start with http:// or https://')
        return false
      }
      if (!orgData.primary_impact_category) {
        setError('Impact category is required')
        return false
      }
      if (orgData.mission_statement.length > 500) {
        setError('Mission statement must be 500 characters or less')
        return false
      }
    }

    if (step === 2) {
      if (!userData.first_name.trim()) {
        setError('First name is required')
        return false
      }
      if (!userData.last_name.trim()) {
        setError('Last name is required')
        return false
      }
      if (!userData.work_email.trim()) {
        setError('Work email is required')
        return false
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.work_email)) {
        setError('Please enter a valid email address')
        return false
      }
      if (userData.phone_number && !/^\d{10,}$/.test(userData.phone_number.replace(/\D/g, ''))) {
        setError('Phone number must be at least 10 digits')
        return false
      }
    }

    if (step === 3) {
      if (!rewardData.default_contact_email.trim()) {
        setError('Default contact email is required')
        return false
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rewardData.default_contact_email)) {
        setError('Please enter a valid contact email address')
        return false
      }
      if (!rewardData.can_offer_service_hours && !rewardData.can_offer_micro_grants) {
        setError('You must enable at least one reward type')
        return false
      }
    }

    setError(null)
    return true
  }

  const handleNextStep = () => {
    if (validateStep()) {
      setStep(step + 1)
    }
  }

  const handlePreviousStep = () => {
    setError(null)
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    setLoading(true)
    try {
      // Prepare complete payload
      const payload = {
        organization: {
          ...orgData,
          logo_url: orgData.logo_url || null
        },
        contact_person: userData,
        reward_settings: {
          ...rewardData,
          default_contact_email: rewardData.default_contact_email || userData.work_email
        },
        verification: {
          document_upload_url: null,
          status: 'Pending'
        }
      }

      // TODO: When document upload is ready, add to payload
      // payload.verification.document_upload_url = uploadedDocumentUrl

      // TODO: Send to backend API
      // const response = await fetch('/api/nonprofits/onboard', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // })

      console.log('Nonprofit Onboarding Data:', payload)
      setSuccess(true)
      setTimeout(() => {
        // TODO: Redirect to dashboard or success page
        // window.location.href = '/nonprofit-dashboard'
      }, 2000)
    } catch (err) {
      setError(err.message || 'An error occurred during submission')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-emerald-900 mb-2">Welcome to Phaze!</h2>
          <p className="text-emerald-700 mb-4">
            Your organization has been submitted for verification. We'll review your details and get back to you within 2-3 business days.
          </p>
          <Button onClick={() => setSuccess(false)}>Start Over</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Phaze Nonprofit Onboarding</h1>
          <p className="text-slate-400">Step {step} of 4: {step === 1 ? 'Organization Details' : step === 2 ? 'Point of Contact' : step === 3 ? 'Reward Settings' : 'Review & Submit'}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 flex gap-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`flex-1 h-2 rounded-full transition-all ${s <= step ? 'bg-indigo-500' : 'bg-slate-700'}`} />
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 md:p-8 shadow-2xl">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Organization Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Organization Details</h2>

              <Input
                label="Legal Organization Name *"
                placeholder="e.g., Mighty Writers Inc"
                value={orgData.legal_name}
                onChange={(v) => handleOrgChange('legal_name', v)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />

              <Input
                label="Display Name (How creators will see you) *"
                placeholder="e.g., Mighty Writers"
                value={orgData.display_name}
                onChange={(v) => handleOrgChange('display_name', v)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />

              <Input
                label="EIN / Tax ID (for 501(c)(3) verification) *"
                placeholder="e.g., 12-3456789"
                value={orgData.ein_tax_id}
                onChange={(v) => handleOrgChange('ein_tax_id', v)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />

              <Input
                label="Website URL *"
                placeholder="https://yourorganization.org"
                value={orgData.website_url}
                onChange={(v) => handleOrgChange('website_url', v)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />

              <div>
                <label className="block text-white text-sm font-medium mb-2">Primary Impact Category *</label>
                <select
                  value={orgData.primary_impact_category}
                  onChange={(e) => handleOrgChange('primary_impact_category', e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a category...</option>
                  {IMPACT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <Input
                label="City"
                placeholder="e.g., Los Angeles"
                value={orgData.location_city}
                onChange={(v) => handleOrgChange('location_city', v)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />

              <Input
                label="State"
                placeholder="e.g., CA"
                value={orgData.location_state}
                onChange={(v) => handleOrgChange('location_state', v)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />

              <Input
                label="Mission Statement (max 500 characters)"
                placeholder="What is your organization's mission?"
                value={orgData.mission_statement}
                onChange={(v) => handleOrgChange('mission_statement', v)}
                textarea
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
              <p className="text-xs text-slate-400">{orgData.mission_statement.length}/500</p>
            </div>
          )}

          {/* Step 2: Point of Contact */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Point of Contact</h2>
              <p className="text-slate-300 text-sm">This person will manage campaigns and receive creator submissions.</p>

              <Input
                label="First Name *"
                placeholder="John"
                value={userData.first_name}
                onChange={(v) => handleUserChange('first_name', v)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />

              <Input
                label="Last Name *"
                placeholder="Doe"
                value={userData.last_name}
                onChange={(v) => handleUserChange('last_name', v)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />

              <Input
                label="Work Email *"
                type="email"
                placeholder="john@organization.org"
                value={userData.work_email}
                onChange={(v) => handleUserChange('work_email', v)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />

              <Input
                label="Phone Number (optional)"
                type="tel"
                placeholder="(555) 123-4567"
                value={userData.phone_number}
                onChange={(v) => handleUserChange('phone_number', v)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />

              <div>
                <label className="block text-white text-sm font-medium mb-2">Role *</label>
                <select
                  value={userData.role}
                  onChange={(e) => handleUserChange('role', e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Admin">Admin</option>
                  <option value="Campaign Manager">Campaign Manager</option>
                  <option value="Communications">Communications</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Reward Settings */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Reward Settings</h2>
              <p className="text-slate-300 text-sm">Decide what incentives you'll offer creators for content.</p>

              <div className="space-y-4 bg-slate-700 p-4 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rewardData.can_offer_service_hours}
                    onChange={(e) => handleRewardChange('can_offer_service_hours', e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-600 border-slate-500 cursor-pointer"
                  />
                  <div>
                    <p className="text-white font-medium">Offer Community Service Hours</p>
                    <p className="text-slate-400 text-sm">Creators can earn verified volunteer hours for their involvement.</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer border-t border-slate-600 pt-4">
                  <input
                    type="checkbox"
                    checked={rewardData.can_offer_micro_grants}
                    onChange={(e) => handleRewardChange('can_offer_micro_grants', e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-600 border-slate-500 cursor-pointer"
                  />
                  <div>
                    <p className="text-white font-medium">Offer Micro-Grants</p>
                    <p className="text-slate-400 text-sm">You have budget to pay creators directly for content.</p>
                  </div>
                </label>
              </div>

              <Input
                label="Default Contact Email for Submissions *"
                type="email"
                placeholder="submissions@organization.org"
                value={rewardData.default_contact_email}
                onChange={(v) => handleRewardChange('default_contact_email', v)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
              <p className="text-xs text-slate-400">This is where creators will send their final content assets.</p>
            </div>
          )}

          {/* Step 4: Verification & Review */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Verification & Review</h2>
              <p className="text-slate-300 text-sm">Submit your information for verification. We'll confirm your 501(c)(3) status.</p>

              <div className="bg-slate-700 p-4 rounded-lg space-y-4">
                <div className="border-b border-slate-600 pb-4">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Organization</p>
                  <p className="text-white font-medium">{orgData.display_name}</p>
                  <p className="text-slate-400 text-sm">{orgData.legal_name}</p>
                </div>

                <div className="border-b border-slate-600 pb-4">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Contact</p>
                  <p className="text-white font-medium">{userData.first_name} {userData.last_name}</p>
                  <p className="text-slate-400 text-sm">{userData.work_email}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Rewards</p>
                  <div className="text-sm text-white mt-1 space-y-1">
                    {rewardData.can_offer_service_hours && <p>✓ Service Hours</p>}
                    {rewardData.can_offer_micro_grants && <p>✓ Micro-Grants</p>}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900 text-sm">
                  <strong>Next Step:</strong> After submission, we'll verify your organization's 501(c)(3) status. This typically takes 2-3 business days.
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 rounded bg-slate-600 border-slate-500 cursor-pointer mt-1"
                />
                <p className="text-slate-300 text-sm">
                  I confirm that all information provided is accurate and authorize Phaze to verify my organization's 501(c)(3) status.
                </p>
              </label>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex gap-3 justify-between">
            <Button
              variant="secondary"
              onClick={handlePreviousStep}
              disabled={step === 1}
              className={step === 1 ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Previous
            </Button>

            {step < 4 ? (
              <Button onClick={handleNextStep} variant="primary">
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} variant="success" loading={loading}>
                {loading ? 'Submitting...' : 'Submit for Verification'}
              </Button>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-slate-400 text-sm">
          <p>Questions? Email us at <strong>support@phaze.org</strong> or call <strong>(555) 123-4567</strong></p>
        </div>
      </div>
    </div>
  )
}
