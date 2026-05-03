import React, { useState } from 'react'
import { Plus, Trash2, Save, Eye } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import { useApp } from '../../context/AppContext'
import { addCampaign, addTask } from '../../firebase/firestore'
import { useFirebase } from '../../context/FirebaseContext'
import { useToast } from '../../context/ToastContext'

export default function CampaignBuilder({ open, onClose }) {
  const { userProfile } = useFirebase()
  const { showToast } = useToast()
  const [campaign, setCampaign] = useState({
    title: '',
    description: '',
    fundingGoal: 0,
    category: '',
    imageUrl: ''
  })
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({
    description: '',
    spots: 1,
    rewardType: 'service_hours',
    rewardValue: 5
  })
  const [loading, setLoading] = useState(false)

  const handleCampaignChange = (field, value) => {
    setCampaign(prev => ({ ...prev, [field]: value }))
  }

  const handleTaskChange = (field, value) => {
    setNewTask(prev => ({ ...prev, [field]: value }))
  }

  const addTaskToCampaign = () => {
    if (!newTask.description.trim()) {
      showToast('Task description is required', 'warning')
      return
    }
    setTasks(prev => [...prev, { ...newTask, id: Date.now() }])
    setNewTask({
      description: '',
      spots: 1,
      rewardType: 'service_hours',
      rewardValue: 5
    })
  }

  const removeTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  const saveCampaign = async () => {
    if (!campaign.title.trim() || !campaign.description.trim()) {
      showToast('Title and description are required', 'warning')
      return
    }
    if (tasks.length === 0) {
      showToast('Add at least one task', 'warning')
      return
    }
    if (!userProfile) {
      showToast('Please sign in first', 'warning')
      return
    }

    setLoading(true)
    try {
      // Create campaign
      const campaignData = {
        ...campaign,
        nonprofitId: userProfile.uid,
        nonprofitName: userProfile.displayName,
        status: 'draft'
      }
      const campaignId = await addCampaign(campaignData)

      // Create tasks
      for (const task of tasks) {
        await addTask({
          campaignId,
          ...task
        })
      }

      showToast('Campaign created successfully!', 'success')
      onClose()
    } catch (error) {
      showToast('Failed to create campaign', 'danger')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <Modal open={open} onClose={onClose} title="Create New Campaign">
      <div className="space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Campaign Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Campaign Details</h3>
          <Input
            label="Campaign Title"
            value={campaign.title}
            onChange={(e) => handleCampaignChange('title', e.target.value)}
            placeholder="e.g., Neighborhood Cleanup Drive"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={campaign.description}
              onChange={(e) => handleCampaignChange('description', e.target.value)}
              placeholder="Describe your campaign and its impact..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Funding Goal ($)"
              type="number"
              value={campaign.fundingGoal}
              onChange={(e) => handleCampaignChange('fundingGoal', parseFloat(e.target.value) || 0)}
            />
            <Input
              label="Category"
              value={campaign.category}
              onChange={(e) => handleCampaignChange('category', e.target.value)}
              placeholder="e.g., Environment"
            />
          </div>
          <Input
            label="Image URL"
            value={campaign.imageUrl}
            onChange={(e) => handleCampaignChange('imageUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>

        {/* Tasks */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Campaign Tasks</h3>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{task.description}</p>
                  <p className="text-sm text-gray-600">
                    {task.spots} spots • {task.rewardType === 'service_hours' ? `${task.rewardValue} hours` : `$${task.rewardValue} grant`}
                  </p>
                </div>
                <button
                  onClick={() => removeTask(task.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Task Form */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <h4 className="font-medium">Add Task</h4>
            <Input
              label="Task Description"
              value={newTask.description}
              onChange={(e) => handleTaskChange('description', e.target.value)}
              placeholder="e.g., Collect 5 bags of trash"
            />
            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Available Spots"
                type="number"
                value={newTask.spots}
                onChange={(e) => handleTaskChange('spots', parseInt(e.target.value) || 1)}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reward Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTask.rewardType}
                  onChange={(e) => handleTaskChange('rewardType', e.target.value)}
                >
                  <option value="service_hours">Service Hours</option>
                  <option value="micro_grant">Micro Grant</option>
                </select>
              </div>
              <Input
                label={newTask.rewardType === 'service_hours' ? 'Hours' : 'Amount ($)'}
                type="number"
                value={newTask.rewardValue}
                onChange={(e) => handleTaskChange('rewardValue', parseFloat(e.target.value) || 0)}
              />
            </div>
            <Button variant="secondary" onClick={addTaskToCampaign}>
              <Plus size={16} className="mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveCampaign} disabled={loading}>
            <Save size={16} className="mr-2" />
            {loading ? 'Creating...' : 'Create Campaign'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}