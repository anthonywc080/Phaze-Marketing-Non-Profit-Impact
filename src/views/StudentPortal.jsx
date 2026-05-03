import React, { useState, useEffect } from 'react'
import DonationWidget from '../components/widgets/DonationWidget'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import StudentSurvey from '../components/features/StudentSurvey'
import CampaignSearch from '../components/features/CampaignSearch'
import StudentResumePortfolio from '../components/features/StudentResumePortfolio'
import CommunityHelpBoard from '../components/features/CommunityHelpBoard'
import CommunityGoalVoting from '../components/features/CommunityGoalVoting'
import SkillTagEditor from '../components/features/SkillTagEditor'
import ProjectTimeline from '../components/features/ProjectTimeline'
import KnowledgeLibrary from '../components/features/KnowledgeLibrary'
import ImpactNotesCapture from '../components/features/ImpactNotesCapture'
import ProjectProposalSystem from '../components/features/ProjectProposalSystem'
import { useToast } from '../context/ToastContext'
import { useApp } from '../context/AppContext'
import { useFirebase } from '../context/FirebaseContext'
import { submitTaskProof } from '../firebase/firestore'
import { addDoc, collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import FeatureAnimation from '../components/features/FeatureAnimation'
import successBurst from '../components/animations/success-burst.json'

const PROGRAM_REQUIREMENTS = [
  {
    id: '1',
    title: 'Minimum GPA of 3.0',
    description: 'Students must maintain a 3.0 GPA or higher',
    details: 'Official transcript may be requested during application process',
    isRequired: true
  },
  {
    id: '2',
    title: 'Basic Marketing Knowledge',
    description: 'Understanding of social media marketing fundamentals',
    details: 'Experience with platforms like Instagram, TikTok, or LinkedIn is a plus',
    isRequired: false
  }
]

export default function StudentPortal() {
  const { donations, campaignTasks, communityRequests, addCommunityRequest, organizationGoals, voteOrganizationGoal, memberProfiles, projectHistory, projectHorizon, knowledgeAssets, proposals, addKnowledgeAsset, submitProposal, voteProposal, saveImpactNote } = useApp()
  const { user } = useFirebase()
  const { showToast } = useToast()

  const [selectedSkills, setSelectedSkills] = useState(['coding', 'public speaking'])
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState([])
  const [appOpen, setAppOpen] = useState(false)
  const [appTitle, setAppTitle] = useState('')
  const [matchedCampaign, setMatchedCampaign] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [proofModal, setProofModal] = useState(null)
  const [proofUrl, setProofUrl] = useState('')
  const [clapCounts, setClapCounts] = useState({})
  const [showAnimation, setShowAnimation] = useState(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchStudent = async () => {
      try {
        const studentDoc = await getDoc(doc(db, 'students', user.uid))
        if (studentDoc.exists()) {
          setStudent({ id: studentDoc.id, ...studentDoc.data() })
        } else {
          setStudent({
            id: user.uid,
            name: user.displayName || 'Student',
            email: user.email,
            grade: '9',
            pipeline_status: 'applied',
            mentorId: null,
            createdAt: new Date()
          })
        }
      } catch (e) {
        console.warn('Failed to fetch student profile:', e)
        setStudent({
          id: user.uid,
          name: user.displayName || 'Student',
          pipeline_status: 'applied'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
  }, [user])

  useEffect(() => {
    if (!user) return
    try {
      const q = query(collection(db, 'applications'), where('studentId', '==', user.uid))
      const unsub = onSnapshot(q, (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        setApplications(items)
      })
      return unsub
    } catch (e) {
      console.warn('Firestore not configured for applications:', e)
    }
  }, [user])

  const myTasks = campaignTasks.filter((task) => task.studentId === user?.uid)

  const campaignTotals = (donations || []).reduce((acc, curr) => {
    const campaignName = curr.campaign || 'General Fund'
    if (!acc[campaignName]) {
      acc[campaignName] = {
        name: campaignName,
        totalAmount: 0,
        goal: 5000,
        donationCount: 0
      }
    }
    acc[campaignName].totalAmount += Number(curr.amount || 0)
    acc[campaignName].donationCount += 1
    return acc
  }, {})

  const campaigns = Object.values(campaignTotals)

  const profileSteps = [
    { label: 'Profile data', done: Boolean(student?.grade && student?.email) },
    { label: 'Survey completed', done: Boolean(matchedCampaign) },
    { label: 'Portfolio ready', done: false },
    { label: 'Campaign joined', done: myTasks.length > 0 },
    { label: 'Proof submitted', done: myTasks.some((task) => ['pending_verification', 'approved'].includes(task.status)) }
  ]

  const profileProgress = Math.round((profileSteps.filter((step) => step.done).length / profileSteps.length) * 100)

  const stipendTotal = myTasks.reduce((sum, task) => sum + (Number(task.rewardValue || 0)), 0)
  const hoursWorked = myTasks.reduce((sum, task) => sum + (Number(task.hoursWorked || 2)), 0)
  const impactScore = 12
  const skillsScore = 8
  const realTimePayoutValue = Math.round(stipendTotal + (hoursWorked / impactScore) * skillsScore)

  const addClap = (taskId) => {
    setClapCounts((prev) => ({
      ...prev,
      [taskId]: (prev[taskId] || 0) + 1
    }))
  }

  const handleShowSubmissionAnimation = () => {
    setShowAnimation('submission')
    setTimeout(() => setShowAnimation(null), 2800)
  }

  const handleShowPayoutAnimation = () => {
    setShowAnimation('payout')
    setTimeout(() => setShowAnimation(null), 2800)
  }

  const handleAllPayouts = () => {
    showToast('All payouts received! 🎉', 'success')
    handleShowPayoutAnimation()
  }

  const handleToggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((item) => item !== skill)
        : [...prev, skill]
    )
  }

  const handlePostHelp = (request) => {
    addCommunityRequest(request)
  }

  const handleAddApplication = async () => {
    if (!appTitle.trim()) {
      showToast('Please enter an application title', 'warning')
      return
    }
    setIsSubmitting(true)
    try {
      await addDoc(collection(db, 'applications'), {
        studentId: user.uid,
        title: appTitle,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      showToast('Application submitted successfully', 'success')
      handleShowSubmissionAnimation()
      setAppOpen(false)
      setAppTitle('')
    } catch (e) {
      console.error('Error submitting application:', e)
      showToast('Failed to submit application', 'danger')
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitProof = () => {
    if (!proofUrl.trim()) {
      showToast('Please enter a proof URL', 'warning')
      return
    }
    submitTaskProof(proofModal, proofUrl)
      .then(() => {
        showToast('Proof submitted successfully!', 'success')
        handleShowSubmissionAnimation()
        setProofModal(null)
        setProofUrl('')
      })
      .catch(() => {
        showToast('Failed to submit proof', 'danger')
      })
  }

  const shareCampaign = (campaign) => {
    const shareText = `Check out the "${campaign.name}" campaign on Phaze! They've raised $${campaign.totalAmount} so far.`
    const linkedinUrl = `https://www.linkedin.com/feed/?feedAction=compose&text=${encodeURIComponent(shareText)}`
    window.open(linkedinUrl, '_blank')
    showToast('Opening LinkedIn to share...', 'info')
  }

  if (loading) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Please sign in to access your student portal</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-900">
      <div className="bg-gradient-to-r from-true-blue to-indigo-600 text-white rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-bold">Welcome back, {student?.name}!</h2>
        <p className="text-sm text-slate-100">Quick actions to join sessions, review campaigns, and build your verified resume.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Profile completion</p>
            <h3 className="text-xl font-semibold text-slate-900">{profileProgress}% complete</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[20, 40, 60, 80, 100].map((value) => (
              <span
                key={value}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${profileProgress >= value ? 'bg-true-blue text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                {value}%
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4 h-3 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full rounded-full bg-action-orange transition-all" style={{ width: `${profileProgress}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <SkillTagEditor selectedSkills={selectedSkills} onToggleSkill={handleToggleSkill} />
          <StudentSurvey onMatchChoose={setMatchedCampaign} />
          <CampaignSearch />
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-semibold mb-3">Recommended Match</h4>
            {matchedCampaign ? (
              <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                <p className="font-semibold text-slate-900">{matchedCampaign.title}</p>
                <p className="text-sm text-slate-500">{matchedCampaign.category} • Region {matchedCampaign.region}</p>
                <p className="mt-3 text-sm text-slate-600">This campaign is a strong match for your profile and location.</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Complete the match survey above to see a recommended campaign.</p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-semibold mb-3">Upcoming Sessions</h4>
            <div className="space-y-3">
              <div className="p-3 rounded-lg border flex items-center justify-between">
                <div>
                  <div className="font-medium">Mentor: {student?.mentorId || 'Unassigned'}</div>
                  <div className="text-xs text-slate-500">Next session: Contact your mentor</div>
                </div>
                <Button variant="primary" onClick={() => showToast('Zoom integration coming soon', 'info')}>
                  Join Zoom
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">My Applications</h4>
              <Button variant="primary" size="sm" className="text-xs px-2 py-1" onClick={() => setAppOpen(true)}>
                Start Application
              </Button>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-sm">
                <p>No applications yet</p>
                <p className="text-xs">Click "Start Application" to begin</p>
              </div>
            ) : (
              <div className="space-y-2">
                {applications.map((app) => (
                  <div key={app.id} className="p-3 rounded-lg border flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <div className="font-medium">{app.title}</div>
                      <div className="text-xs text-slate-500">Submitted: {app.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</div>
                    </div>
                    <Badge variant={
                      app.status === 'accepted' ? 'success' :
                      app.status === 'rejected' ? 'danger' :
                      app.status === 'under_review' ? 'info' :
                      'warning'
                    }>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          <ProjectTimeline history={projectHistory} horizon={projectHorizon} />

          <KnowledgeLibrary assets={knowledgeAssets} onAddAsset={addKnowledgeAsset} />

          <ProjectProposalSystem proposals={proposals} onSubmitProposal={submitProposal} onVoteProposal={voteProposal} />

          <StudentResumePortfolio />

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-semibold mb-3">My Tasks</h4>
            <div className="space-y-2">
              {myTasks.map((task) => (
                <div key={task.id} className="p-3 rounded-lg border flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <div className="font-medium">{task.description}</div>
                    <div className="text-xs text-slate-500">
                      Status: {task.status === 'claimed' ? 'In Progress' : task.status === 'pending_verification' ? 'Under Review' : task.status === 'approved' ? 'Completed' : task.status}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                    <button
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                      onClick={() => addClap(task.id)}
                    >
                      👏 Clap {clapCounts[task.id] || 0}
                    </button>
                    {task.status === 'claimed' && (
                      <Button variant="secondary" size="sm" onClick={() => setProofModal(task.id)} haptic>
                        Submit Proof
                      </Button>
                    )}
                    {task.status === 'approved' && (
                      <>
                        <ImpactNotesCapture taskId={task.id} onSaveImpactNote={saveImpactNote} />
                        <Badge variant="success">Approved</Badge>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {myTasks.length === 0 && (
                <div className="text-center py-4 text-slate-500 text-sm">
                  No tasks claimed yet. Visit the marketplace to join campaigns!
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-semibold mb-3">Program Requirements</h4>
            <div className="space-y-3">
              {PROGRAM_REQUIREMENTS.map((requirement) => (
                <div key={requirement.id} className="border border-slate-200 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-sm">{requirement.title}</h5>
                        {requirement.isRequired && <Badge variant="priority-high" className="text-xs">Required</Badge>}
                      </div>
                      <p className="text-xs text-slate-600">{requirement.description}</p>
                      <p className="text-xs text-slate-500 mt-1">{requirement.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold">Active Contributors</h4>
                <p className="text-sm text-slate-500">Core members who have supported the community for 12+ months.</p>
              </div>
              <span className="text-3xl font-bold text-true-blue">{memberProfiles.filter((profile) => profile.activeMonths >= 12).length}</span>
            </div>
          </div>
          <CommunityHelpBoard requests={communityRequests} onPostHelp={handlePostHelp} />
          <CommunityGoalVoting goals={organizationGoals} onVote={voteOrganizationGoal} />
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-semibold mb-3">Organization Campaigns</h4>
            {campaigns.length === 0 ? (
              <div className="text-center py-4 text-slate-500 text-sm">No campaigns yet</div>
            ) : (
              <div className="space-y-3">
                {campaigns.map((c, idx) => (
                  <div key={idx} className="p-3 rounded-lg border hover:bg-slate-50">
                    <div className="font-medium text-sm">{c.name}</div>
                    <div className="text-xs text-slate-500 mb-2">Raised ${c.totalAmount} of ${c.goal}</div>
                    <div className="w-full bg-slate-100 h-2 rounded-full mb-2">
                      <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${Math.min(100, (c.totalAmount / c.goal) * 100)}%` }} />
                    </div>
                    <div className="text-xs text-slate-600 mb-2">{c.donationCount} donation{c.donationCount !== 1 ? 's' : ''}</div>
                    <button className="text-sm text-sky-600 hover:text-sky-700" onClick={() => shareCampaign(c)}>
                      Share to LinkedIn
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <h4 className="font-semibold mb-3">Real-Time Payout Value</h4>
            <p className="text-sm text-slate-500 mb-3">Student value = stipends + (hours worked / impact) × skills</p>
            <div className="rounded-2xl bg-slate-100 p-4 mb-4">
              <p className="text-sm text-slate-600">Stipends</p>
              <p className="text-xl font-semibold text-true-blue">${stipendTotal}</p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4 mb-4">
              <p className="text-sm text-slate-600">Calculated payout</p>
              <p className="text-xl font-semibold text-action-orange">${realTimePayoutValue}</p>
            </div>
            <Button variant="action" haptic onClick={handleAllPayouts}>All Payouts Received</Button>
          </div>

          <DonationWidget initial={donations} />
        </div>
      </div>

      {showAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 text-center">
              <p className="text-sm uppercase tracking-[0.24em] text-action-orange">Success</p>
              <h3 className="text-2xl font-bold text-slate-900">{showAnimation === 'submission' ? 'Campaign Submitted!' : 'Payout Received!'}</h3>
              <p className="text-sm text-slate-600 mt-2">{showAnimation === 'submission' ? 'Your work has been sent for review.' : 'Your payout has been confirmed.'}</p>
            </div>
            <FeatureAnimation animationData={successBurst} loop={false} />
            <div className="mt-6 flex justify-center">
              <Button variant="primary" onClick={() => setShowAnimation(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      <Modal open={appOpen} onClose={() => setAppOpen(false)} title="Start New Application">
        <form onSubmit={(e) => { e.preventDefault(); handleAddApplication() }} className="space-y-4">
          <Input label="Application Title" value={appTitle} onChange={setAppTitle} placeholder="e.g., Laptop Grant" maxLength={100} autoFocus />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setAppOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="disabled:opacity-50 disabled:cursor-not-allowed" haptic>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </Modal>

      {proofModal && (
        <Modal open={true} onClose={() => { setProofModal(null); setProofUrl('') }} title="Submit Proof of Work">
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Upload a photo, video, or link showing your completed work.</p>
            <Input label="Proof URL" value={proofUrl} onChange={setProofUrl} placeholder="https://example.com/proof.jpg" />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => { setProofModal(null); setProofUrl('') }}>Cancel</Button>
              <Button variant="primary" onClick={submitProof} haptic>Submit Proof</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
