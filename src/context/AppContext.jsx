import React, { createContext, useContext, useState, useEffect } from 'react'
import { listenDonations, listenCampaigns, listenTasks, addSessionLog as createSessionLog, listenSessionLogs, updateStudent } from '../firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

const AppContext = createContext(null)

const now = () => new Date().toISOString()

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState([
    { id: uuidv4(), title: 'Draft outreach email', channel: 'gmail', status: 'idea', date: now(), priority: 'high' },
    { id: uuidv4(), title: 'Plan kickoff meeting', channel: 'zoom', status: 'drafting', date: now(), priority: 'medium' },
    { id: uuidv4(), title: 'LinkedIn campaign concept', channel: 'linkedin', status: 'review', date: now(), priority: 'low' }
  ])

  const [campaigns, setCampaigns] = useState([])
  const [campaignTasks, setCampaignTasks] = useState([])

  const [students, setStudents] = useState([
    { id: uuidv4(), name: 'Ava Rodriguez', grade: '11', pipeline_status: 'applied', mentorId: '' },
    { id: uuidv4(), name: 'Jamal Carter', grade: '12', pipeline_status: 'interviewing', mentorId: '' }
  ])

  const [donations, setDonations] = useState([
    { id: uuidv4(), donorName: 'Heights Philanthropy', amount: 500, campaign: 'Tech Equity', timestamp: now() }
  ])

  const [memberProfiles, setMemberProfiles] = useState([
    { id: uuidv4(), name: 'Ava Rodriguez', skills: ['carpentry', 'public speaking'], activeMonths: 14, role: 'Core Contributor' },
    { id: uuidv4(), name: 'Jamal Carter', skills: ['coding', 'fundraising'], activeMonths: 18, role: 'Anchor Member' },
    { id: uuidv4(), name: 'Nina Patel', skills: ['design', 'community outreach'], activeMonths: 10, role: 'Rising Talent' }
  ])

  const [problemBriefs, setProblemBriefs] = useState([
    {
      id: uuidv4(),
      title: 'We need a new mural design for the community center',
      description: 'We want an energized visual concept that reflects local stories and welcomes families.',
      tags: ['design', 'community art'],
      votes: 12,
      ideaCount: 4,
      remixCount: 2
    },
    {
      id: uuidv4(),
      title: 'Create a volunteer onboarding toolkit',
      description: 'Help us build a simple toolkit with step-by-step tasks, training videos, and checklists.',
      tags: ['training', 'copywriting'],
      votes: 8,
      ideaCount: 3,
      remixCount: 1
    }
  ])

  const [communityRequests, setCommunityRequests] = useState([
    {
      id: uuidv4(),
      type: 'need',
      title: 'I need a ride to the food bank',
      details: 'Can someone help with pickup and drop-off tomorrow morning?',
      skills: ['transportation']
    },
    {
      id: uuidv4(),
      type: 'offer',
      title: 'I have extra supplies to donate',
      details: 'I can share school supplies and winter clothing with local families.',
      skills: ['donations']
    }
  ])

  const [organizationGoals, setOrganizationGoals] = useState([
    { id: uuidv4(), title: 'Launch a youth-led mentorship series', description: 'Create a monthly mentorship program driven by students and community partners.', votes: 28 },
    { id: uuidv4(), title: 'Open a pop-up resource hub', description: 'Develop a temporary hub for tech training, counseling, and community events.', votes: 19 },
    { id: uuidv4(), title: 'Build a storytelling podcast', description: 'Capture and amplify neighborhood stories with student-led audio episodes.', votes: 15 }
  ])

  const [communityTone, setCommunityTone] = useState({
    sentiment: 'Inspired',
    insight: 'The community shows high energy for creative collaborations and peer support.',
    recommendation: 'Share progress updates, highlight recent team wins, and invite remix sessions.'
  })

  const [projectHistory, setProjectHistory] = useState([
    {
      id: uuidv4(),
      title: 'Community Cleanup Initiative',
      description: 'Organized neighborhood cleanup event with 50+ volunteers',
      completedDate: 'March 15, 2026',
      impact: 'Collected 500 lbs of recyclables and strengthened neighborhood bonds.'
    },
    {
      id: uuidv4(),
      title: 'Tech Skills Workshop Series',
      description: 'Weekly coding and design workshops for high school students',
      completedDate: 'February 28, 2026',
      impact: 'Trained 120 students in Python and UI design; 8 landed internships.'
    }
  ])

  const [projectHorizon, setProjectHorizon] = useState([
    {
      id: uuidv4(),
      title: 'Youth Leadership Council',
      description: 'A quarterly forum where students co-design organizational priorities',
      timeline: 'Q2 2026',
      goals: ['Youth voice', 'Decision-making power', 'Mentorship']
    },
    {
      id: uuidv4(),
      title: 'Microlearning App for Skill Building',
      description: '5-minute daily lessons in professional soft skills',
      timeline: 'Q3 2026',
      goals: ['Accessibility', 'Retention', 'Mobile-first']
    }
  ])

  const [knowledgeAssets, setKnowledgeAssets] = useState([
    {
      id: uuidv4(),
      title: 'Event Planning Checklist',
      description: 'Step-by-step guide for organizing community events',
      type: 'template',
      url: 'https://docs.google.com/document/d/example'
    },
    {
      id: uuidv4(),
      title: 'Social Media Post Templates',
      description: 'Canva templates for consistent branding across platforms',
      type: 'asset',
      url: 'https://canva.com/templates/example'
    }
  ])

  const [impactNotes, setImpactNotes] = useState([
    {
      id: uuidv4(),
      taskId: 'task1',
      reflection: 'This campaign helped 15 first-time donors understand our mission and commit to monthly giving.',
      photoUrl: null
    }
  ])

  const [taskMetrics, setTaskMetrics] = useState([
    {
      id: uuidv4(),
      title: 'Design Community Newsletter',
      description: 'Created an engaging monthly newsletter to keep members updated',
      clapCount: 28,
      shareCount: 12,
      commentCount: 8
    },
    {
      id: uuidv4(),
      title: 'Lead Mentor Peer Circle',
      description: 'Facilitated a peer mentorship group for first-time volunteers',
      clapCount: 45,
      shareCount: 18,
      commentCount: 15
    }
  ])

  const [proposals, setProposals] = useState([
    {
      id: uuidv4(),
      title: 'Establish a Paid Internship Program',
      description: 'Create paid internships for 20 students with 10 community organizations',
      goals: ['Economic mobility', 'Work experience', 'Partnership building'],
      timeline: '6 weeks',
      votes: 42,
      status: 'pending'
    }
  ])

  const [sessionLogs, setSessionLogs] = useState([])

  useEffect(() => {
    const useFirestore = Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID)
    if (!useFirestore) return

    const unsubDonations = listenDonations((items) => {
      const mapped = items.map(i => ({ id: i.id, donorName: i.donorName || i.donor || 'Donor', amount: i.amount || 0, campaign: i.campaign || i.campaignName || '', timestamp: i.timestamp || i.time || now() }))
      setDonations(mapped)
    })

    const unsubCampaigns = listenCampaigns((items) => {
      setCampaigns(items)
    })

    const unsubTasks = listenTasks((items) => {
      setCampaignTasks(items)
    })

    const unsubSessionLogs = listenSessionLogs((items) => {
      setSessionLogs(items)
    })

    return () => {
      unsubDonations()
      unsubCampaigns()
      unsubTasks()
      unsubSessionLogs()
    }
  }, [])

  function addTask(task) {
    setTasks((t) => [{ id: uuidv4(), date: now(), ...task }, ...t])
  }

  async function addSessionLog(log) {
    const newLog = {
      ...log,
      createdAt: new Date()
    }
    setSessionLogs((prev) => [newLog, ...prev])
    try {
      await createSessionLog(newLog)
    } catch (e) {
      console.warn('Failed to persist session log', e)
    }
  }

  function addProblemBrief(brief) {
    setProblemBriefs((prev) => [
      {
        id: uuidv4(),
        votes: 0,
        ideaCount: 1,
        remixCount: 0,
        ...brief
      },
      ...prev
    ])
  }

  function voteProblemIdea(id) {
    setProblemBriefs((prev) => prev.map((brief) => brief.id === id ? { ...brief, votes: brief.votes + 1 } : brief))
  }

  function remixProblemIdea(id) {
    setProblemBriefs((prev) => prev.map((brief) => brief.id === id ? { ...brief, remixCount: brief.remixCount + 1, ideaCount: brief.ideaCount + 1 } : brief))
  }

  function addCommunityRequest(request) {
    setCommunityRequests((prev) => [{ id: uuidv4(), ...request }, ...prev])
  }

  function voteOrganizationGoal(id) {
    setOrganizationGoals((prev) => prev.map((goal) => goal.id === id ? { ...goal, votes: goal.votes + 1 } : goal))
  }

  function addKnowledgeAsset(asset) {
    setKnowledgeAssets((prev) => [{ id: uuidv4(), ...asset }, ...prev])
  }

  function saveImpactNote(taskId, note) {
    setImpactNotes((prev) => [{ id: uuidv4(), taskId, ...note }, ...prev])
  }

  function submitProposal(proposal) {
    setProposals((prev) => [{ id: uuidv4(), status: 'pending', ...proposal }, ...prev])
  }

  function voteProposal(id) {
    setProposals((prev) => prev.map((proposal) => {
      if (proposal.id === id) {
        const newVotes = proposal.votes + 1
        const newStatus = newVotes >= 5 ? 'approved' : 'pending'
        return { ...proposal, votes: newVotes, status: newStatus }
      }
      return proposal
    }))
  }

  function addProjectToHistory(project) {
    setProjectHistory((prev) => [{ id: uuidv4(), ...project }, ...prev])
  }

  function addProjectToHorizon(project) {
    setProjectHorizon((prev) => [{ id: uuidv4(), ...project }, ...prev])
  }

  useEffect(() => {
    const needCount = communityRequests.filter((item) => item.type === 'need').length
    const offerCount = communityRequests.filter((item) => item.type === 'offer').length
    const totalEngagement = problemBriefs.reduce((sum, brief) => sum + brief.votes + brief.ideaCount + brief.remixCount, 0)

    if (offerCount >= needCount && totalEngagement > 10) {
      setCommunityTone({
        sentiment: 'Inspired',
        insight: 'Community members are actively offering help and remixing ideas.',
        recommendation: 'Celebrate contributions and call out the most active collaborators.'
      })
    } else if (needCount > offerCount && totalEngagement < 14) {
      setCommunityTone({
        sentiment: 'Curious',
        insight: 'The community is seeking clear direction and more concrete ways to participate.',
        recommendation: 'Share a goal brief and invite members to vote on the next step.'
      })
    } else {
      setCommunityTone({
        sentiment: 'Frustrated',
        insight: 'The group is waiting for stronger signals on what to build next.',
        recommendation: 'Use a goal vote and a ping campaign to refocus energy quickly.'
      })
    }
  }, [communityRequests, problemBriefs])

  async function updateStudentPipelineStatus(id, newStatus) {
    const updated = {
      pipeline_status: newStatus
    }
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)))
    try {
      await updateStudent(id, updated)
    } catch (e) {
      console.warn('Failed to update student pipeline status', e)
    }
  }

  function updateTask(id, patch) {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  }

  return (
    <AppContext.Provider value={{
      tasks,
      campaigns,
      campaignTasks,
      students,
      donations,
      sessionLogs,
      memberProfiles,
      problemBriefs,
      communityRequests,
      organizationGoals,
      communityTone,
      projectHistory,
      projectHorizon,
      knowledgeAssets,
      impactNotes,
      taskMetrics,
      proposals,
      addTask,
      addSessionLog,
      updateTask,
      updateStudentPipelineStatus,
      setStudents,
      setDonations,
      setCampaigns,
      setCampaignTasks,
      setSessionLogs,
      addProblemBrief,
      voteProblemIdea,
      remixProblemIdea,
      addCommunityRequest,
      voteOrganizationGoal,
      addKnowledgeAsset,
      saveImpactNote,
      submitProposal,
      voteProposal,
      addProjectToHistory,
      addProjectToHorizon
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
