import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, CheckCircle, DollarSign } from 'lucide-react'
import Modal from '../ui/Modal'
import { useApp } from '../../context/AppContext'
import { useFirebase } from '../../context/FirebaseContext'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function ImpactDashboard({ open, onClose }) {
  const { campaigns, campaignTasks, donations } = useApp()
  const { userProfile } = useFirebase()

  // Filter data for this nonprofit
  const myCampaigns = campaigns.filter(c => c.nonprofitId === userProfile?.uid)
  const myTasks = campaignTasks.filter(t => myCampaigns.find(c => c.id === t.campaignId))
  const myDonations = donations.filter(d => myCampaigns.find(c => c.id === d.campaignId))

  // Calculate metrics
  const totalTasks = myTasks.length
  const completedTasks = myTasks.filter(t => t.status === 'approved').length
  const totalStudents = new Set(myTasks.map(t => t.studentId)).size
  const totalFunding = myDonations.reduce((sum, d) => sum + (d.amount || 0), 0)

  // Chart data
  const taskCompletionData = myCampaigns.map(campaign => ({
    name: campaign.title.substring(0, 20) + (campaign.title.length > 20 ? '...' : ''),
    completed: myTasks.filter(t => t.campaignId === campaign.id && t.status === 'approved').length,
    total: myTasks.filter(t => t.campaignId === campaign.id).length
  }))

  const fundingData = myCampaigns.map(campaign => ({
    name: campaign.title.substring(0, 20) + (campaign.title.length > 20 ? '...' : ''),
    funding: myDonations.filter(d => d.campaignId === campaign.id).reduce((sum, d) => sum + (d.amount || 0), 0),
    goal: campaign.fundingGoal || 0
  }))

  const taskStatusData = [
    { name: 'Approved', value: myTasks.filter(t => t.status === 'approved').length, color: '#00C49F' },
    { name: 'Pending', value: myTasks.filter(t => t.status === 'pending_verification').length, color: '#FFBB28' },
    { name: 'Claimed', value: myTasks.filter(t => t.status === 'claimed').length, color: '#0088FE' },
    { name: 'Open', value: myTasks.filter(t => t.status === 'open').length, color: '#8884D8' }
  ].filter(item => item.value > 0)

  if (!open) return null

  return (
    <Modal open={open} onClose={onClose} title="Impact Dashboard" size="large">
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Tasks Completed</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-2">{completedTasks}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Students Engaged</span>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-2">{totalStudents}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Completion Rate</span>
            </div>
            <p className="text-2xl font-bold text-purple-900 mt-2">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">Funds Raised</span>
            </div>
            <p className="text-2xl font-bold text-orange-900 mt-2">${totalFunding.toLocaleString()}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Completion by Campaign */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Task Completion by Campaign</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#00C49F" name="Completed" />
                <Bar dataKey="total" fill="#8884D8" name="Total Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Funding Progress */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Funding Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fundingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="funding" fill="#FFBB28" name="Raised" />
                <Bar dataKey="goal" fill="#FF8042" name="Goal" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Task Status Distribution */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Task Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {myTasks.slice(-5).reverse().map((task) => {
                const campaign = myCampaigns.find(c => c.id === task.campaignId)
                return (
                  <div key={task.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === 'approved' ? 'bg-green-500' :
                      task.status === 'pending_verification' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.description}</p>
                      <p className="text-xs text-gray-600">{campaign?.title || 'Unknown Campaign'}</p>
                    </div>
                    <span className="text-xs text-gray-500 capitalize">{task.status.replace('_', ' ')}</span>
                  </div>
                )
              })}
              {myTasks.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No activity yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </Modal>
  )
}