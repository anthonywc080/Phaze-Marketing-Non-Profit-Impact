import React, { useState, useMemo } from 'react'
import ZoomWidget from '../components/widgets/ZoomWidget'
import GmailWidget from '../components/widgets/GmailWidget'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Mail, Video, Linkedin, Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import NarrativeArcBuilder from '../components/features/NarrativeArcBuilder'
import StudentRequirementsManager from '../components/features/StudentRequirementsManager'
import CampaignBuilder from '../components/features/CampaignBuilder'
import VerificationDashboard from '../components/features/VerificationDashboard'
import ImpactDashboard from '../components/features/ImpactDashboard'
import NonprofitOpsExtras from '../components/features/NonprofitOpsExtras'
import ProblemBriefsBoard from '../components/features/ProblemBriefsBoard'
import ToneAnalysisWidget from '../components/features/ToneAnalysisWidget'
import CommunityGoalVoting from '../components/features/CommunityGoalVoting'
import ProjectTimeline from '../components/features/ProjectTimeline'
import KnowledgeLibrary from '../components/features/KnowledgeLibrary'
import P2PEngagementDashboard from '../components/features/P2PEngagementDashboard'
import ProjectProposalSystem from '../components/features/ProjectProposalSystem'

const statusOrder = ['idea', 'drafting', 'review', 'scheduled']
const statusLabels = { idea: 'Ideation', drafting: 'Drafting', review: 'In Review', scheduled: 'Scheduled' }

export default function NonprofitOps() {
  const { 
    tasks, updateTask, campaigns, campaignTasks, memberProfiles, problemBriefs, 
    communityRequests, organizationGoals, communityTone, projectHistory, projectHorizon,
    knowledgeAssets, taskMetrics, proposals,
    addProblemBrief, voteProblemIdea, remixProblemIdea, addCommunityRequest, 
    voteOrganizationGoal, addKnowledgeAsset, submitProposal, voteProposal 
  } = useApp()
  const { showToast } = useToast()
  const [builderOpen, setBuilderOpen] = useState(false)
  const [campaignBuilderOpen, setCampaignBuilderOpen] = useState(false)
  const [verificationOpen, setVerificationOpen] = useState(false)
  const [impactOpen, setImpactOpen] = useState(false)
  const [studentRequirements, setStudentRequirements] = useState([
    {
      id: '1',
      type: 'academic',
      title: 'Minimum GPA of 3.0',
      description: 'Students must maintain a 3.0 GPA or higher',
      isRequired: true,
      details: 'Official transcript may be requested during application process'
    },
    {
      id: '2',
      type: 'skills',
      title: 'Basic Marketing Knowledge',
      description: 'Understanding of social media marketing fundamentals',
      isRequired: false,
      details: 'Experience with platforms like Instagram, TikTok, or LinkedIn is a plus'
    }
  ])

  function move(id, dir) {
    const t = tasks.find((x) => x.id === id)
    if (!t) return
    const idx = statusOrder.indexOf(t.status)
    const next = statusOrder[idx + dir]
    if (!next) return
    updateTask(id, { status: next })
    showToast('Task moved', 'success')
  }

  const groupedTasks = useMemo(() => {
    const groups = { idea: [], drafting: [], review: [], scheduled: [] }
    tasks.forEach((t) => {
      if (groups[t.status]) groups[t.status].push(t)
    })
    return groups
  }, [tasks])

  const onDragEnd = (result) => {
    if (!result.destination || result.destination.droppableId === result.source.droppableId) return

    const taskId = result.draggableId
    const destStatus = result.destination.droppableId
    if (!statusOrder.includes(destStatus)) return

    updateTask(taskId, { status: destStatus })
    showToast('Task moved via drag-and-drop', 'success')
  }

  // Mock data placeholders; replace with real integration fetches when ready.
  const sessions = [
    { id: 's1', title: 'Mentor Check-in (mockup)', time: 'Mar 2 • 3:00 PM' }
  ]

  const emails = [
    { id: 'e1', from: 'Fundraiser Team (mockup)', subject: 'Urgent: Campaign update', time: '1h', body: 'Please review the new campaign copy.' }
  ]

  function renderIcon(channel) {
    if (channel === 'gmail') return <Mail className="h-4 w-4" />
    if (channel === 'zoom') return <Video className="h-4 w-4" />
    return <Linkedin className="h-4 w-4" />
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-900">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <ZoomWidget sessions={sessions} />
        <GmailWidget emails={emails} />
      </div>

      <StudentRequirementsManager
        requirements={studentRequirements}
        onUpdateRequirements={setStudentRequirements}
      />

      <NonprofitOpsExtras />

      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-xl font-semibold">Core Contributor Health</h3>
              <p className="text-sm text-slate-500">Track members who have been active for 12+ months.</p>
            </div>
            <span className="text-3xl font-bold text-true-blue">{memberProfiles.filter((profile) => profile.activeMonths >= 12).length}</span>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Active Contributors for 12+ months</p>
            <p className="text-xs text-slate-500 mt-2">These members anchor the community and are your strongest collaborators.</p>
          </div>
        </div>

        <ToneAnalysisWidget tone={communityTone} />

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">Skill Ping Engine</h3>
              <p className="text-sm text-slate-500">Send a targeted call to action to the right member segment.</p>
            </div>
            <Badge variant="info">Smart ping</Badge>
          </div>
          <div className="space-y-3">
            {['carpentry', 'coding', 'public speaking'].map((skill) => (
              <div key={skill} className="rounded-3xl border border-slate-200 p-4 bg-slate-50 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-600">{skill}</div>
                  <div className="text-xs text-slate-500">{memberProfiles.filter((profile) => profile.skills.includes(skill)).length} members tagged</div>
                </div>
                <Button
                  variant="action"
                  className="text-xs px-3 py-1"
                  onClick={() => {
                    showToast(`Ping sent to ${skill} members`, 'success')
                  }}
                >
                  Ping
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProblemBriefsBoard
        briefs={problemBriefs}
        onAddBrief={addProblemBrief}
        onVote={voteProblemIdea}
        onRemix={remixProblemIdea}
      />

      <div className="grid gap-4 lg:grid-cols-2 mt-6 mb-6">
        <CommunityGoalVoting goals={organizationGoals} onVote={voteOrganizationGoal} />
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">Community Request Feed</h3>
              <p className="text-sm text-slate-500">See peer-to-peer support requests and offers from active contributors.</p>
            </div>
            <Badge variant="success">Live</Badge>
          </div>
          <div className="space-y-4">
            {communityRequests.slice(0, 3).map((request) => (
              <div key={request.id} className="rounded-3xl border border-slate-200 p-4 bg-slate-50">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant={request.type === 'need' ? 'danger' : 'success'}>{request.type === 'need' ? 'Need' : 'Offer'}</Badge>
                  <div className="text-xs text-slate-500">{request.skills.join(', ') || 'General'}</div>
                </div>
                <h4 className="mt-3 font-semibold text-slate-900">{request.title}</h4>
                <p className="text-sm text-slate-600 mt-2">{request.details}</p>
              </div>
            ))}
            <div className="rounded-3xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 text-center">
              More request activity is available in the student community hub.
            </div>
          </div>
        </div>
      </div>

      <ProjectTimeline history={projectHistory} horizon={projectHorizon} />

      <div className="grid gap-4 lg:grid-cols-2 mt-6 mb-6">
        <KnowledgeLibrary assets={knowledgeAssets} onAddAsset={addKnowledgeAsset} />
        <P2PEngagementDashboard taskMetrics={taskMetrics} />
      </div>

      <ProjectProposalSystem proposals={proposals} onSubmitProposal={submitProposal} onVoteProposal={voteProposal} />

      {/* Campaign Management */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Campaign Management</h3>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setImpactOpen(true)}>
              View Impact
            </Button>
            <Button variant="secondary" onClick={() => setVerificationOpen(true)}>
              Review Submissions
            </Button>
            <Button variant="primary" onClick={() => setCampaignBuilderOpen(true)}>
              <Plus size={16} className="mr-2" />
              Create Campaign
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium">{campaign.title}</h4>
                <p className="text-sm text-gray-600">{campaign.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-500">Funding Goal: ${campaign.fundingGoal}</span>
                  <Badge variant={campaign.status === 'active' ? 'success' : 'info'}>{campaign.status}</Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {campaignTasks.filter(t => t.campaignId === campaign.id).length} tasks
                </p>
              </div>
            </div>
          ))}
          {campaigns.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No campaigns yet. Create your first campaign to get started!
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 mt-6">
        <h3 className="text-xl font-semibold">Marketing Kanban</h3>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setBuilderOpen(true)}>Open Narrative Builder</Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          {statusOrder.map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-white border border-slate-200 rounded-2xl p-4 shadow-sm min-h-[240px] ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{statusLabels[status]}</h4>
                    <div className="text-xs text-slate-500">{groupedTasks[status].length}</div>
                  </div>
                  <div className="space-y-3">
                    {groupedTasks[status].map((t, index) => (
                      <Draggable key={t.id} draggableId={t.id} index={index}>
                        {(draggableProvided, draggableSnapshot) => (
                          <div
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                            className={`p-3 rounded-lg border border-slate-100 bg-white flex items-start justify-between ${draggableSnapshot.isDragging ? 'shadow-lg bg-slate-100' : ''}`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-700">{renderIcon(t.channel)}</div>
                                <div className="font-medium">{t.title}</div>
                              </div>
                              <div className="text-xs text-slate-500 mt-1">{new Date(t.date).toLocaleDateString()}</div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant={t.priority === 'high' ? 'priority-high' : t.priority === 'medium' ? 'priority-medium' : 'priority-low'}>{t.priority}</Badge>
                              <div className="flex gap-1">
                                <button onClick={() => move(t.id, -1)} className="p-1 rounded hover:bg-slate-50"><ChevronLeft className="h-4 w-4 text-slate-500" /></button>
                                <button onClick={() => move(t.id, 1)} className="p-1 rounded hover:bg-slate-50"><ChevronRight className="h-4 w-4 text-slate-500" /></button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {groupedTasks[status].length === 0 && (
                      <div className="p-4 italic text-slate-500 border-2 border-dashed border-slate-200 rounded">Drop tasks here</div>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <NarrativeArcBuilder open={builderOpen} onClose={() => setBuilderOpen(false)} />
      <CampaignBuilder open={campaignBuilderOpen} onClose={() => setCampaignBuilderOpen(false)} />
      <VerificationDashboard open={verificationOpen} onClose={() => setVerificationOpen(false)} />
      <ImpactDashboard open={impactOpen} onClose={() => setImpactOpen(false)} />
    </div>
  )
}
