import React, { useState } from 'react'
import { CheckCircle, XCircle, Eye, ExternalLink } from 'lucide-react'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import { useApp } from '../../context/AppContext'
import { useFirebase } from '../../context/FirebaseContext'
import { approveTask } from '../../firebase/firestore'
import { useToast } from '../../context/ToastContext'

export default function VerificationDashboard({ open, onClose }) {
  const { campaignTasks, campaigns } = useApp()
  const { userProfile } = useFirebase()
  const { showToast } = useToast()
  const [selectedTask, setSelectedTask] = useState(null)

  // Get tasks pending verification for this nonprofit
  const pendingTasks = campaignTasks.filter(task =>
    task.status === 'pending_verification' &&
    campaigns.find(c => c.id === task.campaignId)?.nonprofitId === userProfile?.uid
  )

  const handleApprove = async (taskId) => {
    try {
      await approveTask(taskId)
      showToast('Task approved successfully!', 'success')
      setSelectedTask(null)
    } catch (error) {
      showToast('Failed to approve task', 'danger')
    }
  }

  const handleReject = async (taskId) => {
    // For now, just reset to claimed status. In a real app, you'd have a rejection reason.
    try {
      // await rejectTask(taskId) // Implement this function
      showToast('Task rejected', 'info')
      setSelectedTask(null)
    } catch (error) {
      showToast('Failed to reject task', 'danger')
    }
  }

  if (!open) return null

  return (
    <Modal open={open} onClose={onClose} title="Task Verification" size="large">
      <div className="space-y-6">
        <div className="text-sm text-gray-600">
          Review and approve student submissions for your campaigns.
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {pendingTasks.map((task) => {
            const campaign = campaigns.find(c => c.id === task.campaignId)
            return (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{task.description}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Campaign: {campaign?.title || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Submitted: {task.submittedAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedTask(task)}
                    >
                      <Eye size={16} className="mr-1" />
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
          {pendingTasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No tasks pending verification
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Proof Review Modal */}
      {selectedTask && (
        <Modal
          open={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          title="Review Submission"
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">{selectedTask.description}</h4>
              <p className="text-sm text-gray-600 mt-1">
                Campaign: {campaigns.find(c => c.id === selectedTask.campaignId)?.title || 'Unknown'}
              </p>
            </div>

            {selectedTask.proofUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Submitted Proof:
                </label>
                {selectedTask.proofUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={selectedTask.proofUrl}
                    alt="Proof"
                    className="max-w-full h-auto rounded-lg border"
                  />
                ) : (
                  <a
                    href={selectedTask.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    View Proof <ExternalLink size={16} />
                  </a>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="danger"
                onClick={() => handleReject(selectedTask.id)}
              >
                <XCircle size={16} className="mr-2" />
                Reject
              </Button>
              <Button
                variant="success"
                onClick={() => handleApprove(selectedTask.id)}
              >
                <CheckCircle size={16} className="mr-2" />
                Approve
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  )
}